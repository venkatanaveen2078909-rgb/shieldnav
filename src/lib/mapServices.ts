import { AccidentHotspot } from "@/hooks/useAccidentHotspots";

export interface PlaceResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    name: string;
}

export interface RouteResult {
    id: string;
    geometry: [number, number][]; // Leaflet uses [lat, lng]
    distance: number; // in meters
    duration: number; // in seconds
    weight_name: string;
    // Safety analysis added later
    risk_score?: number;
    hotspots_crossed?: number;
}

// Nominatim Search
export const searchPlaces = async (query: string): Promise<PlaceResult[]> => {
    if (!query.trim()) return [];
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`
        );
        const data = await response.json();
        return data.map((item: any) => ({
            place_id: item.place_id,
            lat: item.lat,
            lon: item.lon,
            display_name: item.display_name,
            name: item.display_name.split(",")[0],
        }));
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
};

// OSRM Routing
export const getRoute = async (
    origin: { lat: number; lng: number },
    dest: { lat: number; lng: number }
): Promise<RouteResult[]> => {
    try {
        // OSRM uses [lng, lat]
        // Request alternatives=3 to get multiple route options
        const url = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=3`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            return [];
        }

        return data.routes.map((route: any, index: number) => ({
            id: `osrm-route-${index}`,
            geometry: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]), // Convert [lng, lat] to [lat, lng]
            distance: route.distance,
            duration: route.duration,
            weight_name: route.weight_name,
        }));

    } catch (error) {
        console.error("Routing error:", error);
        return [];
    }
};

// Simplified Safety Analysis for OSRM Route
export const analyzeRouteSafety = (
    routeGeometry: [number, number][],
    hotspots: AccidentHotspot[]
) => {
    let score = 100;
    let hotspotsCrossed: AccidentHotspot[] = [];
    const PROXIMITY_THRESHOLD_KM = 0.5; // check intersection within 500m

    // Helper: Haversine distance
    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Sample points along the route (every 10th point to optimize)
    const sampledPoints = routeGeometry.filter((_, i) => i % 10 === 0);

    hotspots.forEach((hotspot) => {
        let isCrossed = false;
        for (const point of sampledPoints) {
            const dist = getDist(point[0], point[1], hotspot.lat, hotspot.lng);
            if (dist < PROXIMITY_THRESHOLD_KM) {
                isCrossed = true;
                break;
            }
        }

        if (isCrossed) {
            hotspotsCrossed.push(hotspot);
            // Deduct score based on risk
            if (hotspot.risk_level === "high") score -= 15;
            else if (hotspot.risk_level === "medium") score -= 10;
            else score -= 5;
        }
    });

    return {
        score: Math.max(0, score),
        hotspotsCrossed,
    };
};
