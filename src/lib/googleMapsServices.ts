import { OPENWEATHER_API_KEY } from "./constants";
import { AccidentHotspot } from "@/hooks/useAccidentHotspots";

// Types
export interface RouteDetails {
    id: string;
    summary: string;
    distance: { text: string; value: number }; // value in meters
    duration: { text: string; value: number }; // value in seconds
    geometry: google.maps.LatLng[];
    safetyScore: number;
    type: "safest" | "balanced" | "fastest";
    risks: string[];
    weatherAlerts: string[];
    hotspotsCrossed: AccidentHotspot[];
}

/**
 * 1. Fetch Weather for a location
 */
async function fetchWeather(lat: number, lng: number): Promise<any> {
    if (!OPENWEATHER_API_KEY) return null;
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error("Weather fetch failed", e);
        return null;
    }
}

/**
 * 2. Calculate Advanced Safety Score
 * - Base Score: 100
 * - Hotspot Penalty: High=30, Medium=15
 * - Weather Penalty: If rain/fog matches hotspot reason, +50% penalty
 */
export async function analyzeRouteSafety(
    route: google.maps.DirectionsRoute,
    hotspots: AccidentHotspot[]
): Promise<{
    score: number;
    risks: string[];
    weatherAlerts: string[];
    hotspotsCrossed: AccidentHotspot[];
}> {
    let score = 100;
    let totalPenalty = 0;
    const risks: Set<string> = new Set();
    const weatherAlerts: Set<string> = new Set();
    const hotspotsCrossed: AccidentHotspot[] = [];

    // Sample points along route (every ~20th point to optimize)
    const path = route.overview_path;
    const samplePoints = path.filter((_, i) => i % 20 === 0);

    // Get weather for route midpoint (simplified)
    const midpoint = path[Math.floor(path.length / 2)];
    const weather = await fetchWeather(midpoint.lat(), midpoint.lng());

    const isRaining = weather?.weather[0]?.main.toLowerCase().includes("rain");
    const isFoggy = weather?.weather[0]?.main.toLowerCase().includes("fog") || weather?.weather[0]?.main.toLowerCase().includes("mist");
    const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;

    if (isRaining) weatherAlerts.add("Rain detected along route (Slippery roads)");
    if (isFoggy) weatherAlerts.add("Low visibility (Fog/Mist)");
    if (isNight) weatherAlerts.add("Night driving conditions");

    // Check hotspots
    for (const hotspot of hotspots) {
        const hotspotLoc = new google.maps.LatLng(hotspot.lat, hotspot.lng);

        // Check if any route point is close (<1km)
        const isClose = samplePoints.some(p =>
            google.maps.geometry.spherical.computeDistanceBetween(p, hotspotLoc) < 1000
        );

        if (isClose) {
            hotspotsCrossed.push(hotspot);

            let penalty = hotspot.risk_level === 'high' ? 30 : 15;
            let reason = hotspot.primary_reason?.toLowerCase() || "";

            // Contextual Multipliers
            if (isRaining && (reason.includes("slip") || reason.includes("rain") || reason.includes("curv"))) {
                penalty *= 1.5; // +50% penalty for rain on dangerous roads
                risks.add(`High slip risk at ${hotspot.description}`);
            }
            if (isFoggy && (reason.includes("visib") || reason.includes("ghat"))) {
                penalty *= 1.5;
                risks.add(`Low visibility risk at ${hotspot.description}`);
            }
            if (isNight && (reason.includes("lighting") || reason.includes("night"))) {
                penalty *= 1.3;
                risks.add(`Poor lighting risk at ${hotspot.description}`);
            }

            totalPenalty += penalty;
            risks.add(hotspot.description || "Accident zone");
        }
    }

    score = Math.max(10, 100 - totalPenalty); // Minimum score 10

    return {
        score: Math.round(score),
        risks: Array.from(risks),
        weatherAlerts: Array.from(weatherAlerts),
        hotspotsCrossed
    };
}
