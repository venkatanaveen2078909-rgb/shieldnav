// ShieldNav Constants

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

// Map default center (Vijayawada, AP)
export const DEFAULT_MAP_CENTER = {
  lat: 16.5062,
  lng: 80.6480,
};

// Mapbox Configuration
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoiYW50aWdyYXZpdHkiLCJhIjoiY2s5eW15bnhwMDJ3ZTNtcDhydnJ1Z2p4eSJ9.example_token";
export const MAPBOX_SEARCH_API = "https://api.mapbox.com/search/searchbox/v1";

export const DEFAULT_MAP_ZOOM = 12;

// Safety score thresholds
export const SAFETY_THRESHOLDS = {
  SAFE: 75,
  CAUTION: 50,
  DANGER: 0,
};

// Risk penalties for scoring
export const RISK_PENALTIES = {
  high: 30,
  medium: 15,
  low: 5,
};

// Weather risk multipliers
export const WEATHER_MULTIPLIERS: Record<string, Record<string, number>> = {
  Rain: {
    heavy_rain: 1.5,
    poor_road: 1.3,
    sharp_curves: 1.2,
  },
  Thunderstorm: {
    heavy_rain: 1.6,
    poor_road: 1.4,
    sharp_curves: 1.3,
  },
  Fog: {
    fog: 1.5,
    night_patterns: 1.4,
    sharp_curves: 1.3,
  },
  Mist: {
    fog: 1.3,
    night_patterns: 1.2,
  },
};

// Night hours (IST: 20:00 - 06:00)
export const NIGHT_START_HOUR = 20;
export const NIGHT_END_HOUR = 6;

// Proximity thresholds (in km)
export const HOTSPOT_PROXIMITY_KM = 1;
export const ALERT_PROXIMITY_KM = 2;

// India accident statistics
export const ACCIDENT_STATS = {
  totalCases: "480,583",
  description: "India Road Accidents",
};

// Risk reason display names
export const RISK_REASON_LABELS: Record<string, string> = {
  sharp_curves: "Sharp Curves",
  heavy_traffic: "Heavy Traffic",
  high_speed: "High Speed Zone",
  poor_road: "Poor Road Conditions",
  heavy_rain: "Heavy Rain Area",
  fog: "Fog Prone Zone",
  night_patterns: "Night Risk Area",
};

// Map styles for premium dark theme
export const MAP_STYLES = [
  // Hide POI labels
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  // Hide transit labels
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  // Dark background
  {
    elementType: "geometry",
    stylers: [{ color: "#1a1a2e" }],
  },
  // Dark water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f1419" }],
  },
  // Styled roads
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2a3e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a3a5e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  // Landscape
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#16213e" }],
  },
  // Admin areas
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f3a5f" }],
  },
];

