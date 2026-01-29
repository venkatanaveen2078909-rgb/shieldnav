import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AccidentHotspot } from "@/hooks/useAccidentHotspots";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  routeGeometry?: [number, number][] | null; // Leaflet lat/lng array
  hotspots: AccidentHotspot[];
  userLocation?: { lat: number; lng: number } | null;
  isNavigating?: boolean;
  routeType?: "safest" | "balanced" | "fastest";
}

export function MapView({
  routeGeometry,
  hotspots,
  userLocation,
  isNavigating = false,
  routeType
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapInstance.current || !mapContainer.current) return;

    // Default center (India/Vijayawada)
    const initialCenter: [number, number] = [16.5062, 80.6480];

    mapInstance.current = L.map(mapContainer.current).setView(initialCenter, 13);

    // CartoDB Dark Matter Tiles (from tidkoyclo)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CartoDB',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Hotspots
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear old markers
    markersRef.current.forEach(layer => mapInstance.current?.removeLayer(layer));
    markersRef.current = [];

    // Add new hotspots
    hotspots.forEach(hotspot => {
      const color = hotspot.risk_level === 'high' ? '#EF4444' : hotspot.risk_level === 'medium' ? '#F59E0B' : '#10B981';

      const circle = L.circle([hotspot.lat, hotspot.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: hotspot.risk_level === 'high' ? 800 : 500,
        weight: 1
      }).bindPopup(`
        <div class="p-2">
          <strong class="text-sm font-bold text-gray-800">Risk Zone</strong><br/>
          <span class="text-xs text-gray-600">Level: ${hotspot.risk_level}</span><br/>
          <span class="text-xs text-gray-600">${hotspot.description}</span>
        </div>
      `);

      circle.addTo(mapInstance.current!);
      markersRef.current.push(circle);
    });
  }, [hotspots]);

  // Update Route
  useEffect(() => {
    if (!mapInstance.current) return;

    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    if (routeGeometry && routeGeometry.length > 0) {
      const color = routeType === 'safest' ? '#10B981' : routeType === 'fastest' ? '#F59E0B' : '#3B82F6';

      routeLayer.current = L.polyline(routeGeometry, {
        color: color,
        weight: 6,
        opacity: 0.8,
        lineCap: 'round'
      }).addTo(mapInstance.current);

      mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [50, 50] });
    }
  }, [routeGeometry, routeType]);

  // Update User Location
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: '#4285F4',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(mapInstance.current);
    }

    if (isNavigating) {
      mapInstance.current.setView([userLocation.lat, userLocation.lng], 18);
    }
  }, [userLocation, isNavigating]);

  return <div ref={mapContainer} className="w-full h-full bg-zinc-900" />;
}
