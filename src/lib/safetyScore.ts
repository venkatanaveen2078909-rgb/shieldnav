/// <reference types="@types/google.maps" />

import { AccidentHotspot } from "@/hooks/useAccidentHotspots";
import {
  RISK_PENALTIES,
  WEATHER_MULTIPLIERS,
  NIGHT_START_HOUR,
  NIGHT_END_HOUR,
  HOTSPOT_PROXIMITY_KM,
} from "./constants";

// Haversine distance calculation
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if current time is night
export function isNightTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= NIGHT_START_HOUR || hours < NIGHT_END_HOUR;
}

export interface LatLngPoint {
  lat: number;
  lng: number;
}

// Sample points along a route polyline
export function sampleRoutePoints(
  path: LatLngPoint[],
  intervalKm: number = 2
): LatLngPoint[] {
  const points: LatLngPoint[] = [];
  let accumulatedDistance = 0;

  if (path.length === 0) return points;

  points.push(path[0]);

  for (let i = 1; i < path.length; i++) {
    const prevPoint = path[i - 1];
    const currentPoint = path[i];
    const segmentDistance = haversineDistance(
      prevPoint.lat,
      prevPoint.lng,
      currentPoint.lat,
      currentPoint.lng
    );

    accumulatedDistance += segmentDistance;

    if (accumulatedDistance >= intervalKm) {
      points.push(currentPoint);
      accumulatedDistance = 0;
    }
  }

  // Always include the last point
  const lastPoint = path[path.length - 1];
  if (points.length === 0 || points[points.length - 1] !== lastPoint) {
    points.push(lastPoint);
  }

  return points;
}

// Find nearby hotspots for a route
export function findNearbyHotspots(
  routePoints: LatLngPoint[],
  hotspots: AccidentHotspot[],
  proximityKm: number = HOTSPOT_PROXIMITY_KM
): AccidentHotspot[] {
  const nearbyHotspots: Set<string> = new Set();
  const result: AccidentHotspot[] = [];

  for (const point of routePoints) {
    for (const hotspot of hotspots) {
      if (nearbyHotspots.has(hotspot.id)) continue;

      const distance = haversineDistance(
        point.lat,
        point.lng,
        hotspot.lat,
        hotspot.lng
      );

      if (distance <= proximityKm) {
        nearbyHotspots.add(hotspot.id);
        result.push(hotspot);
      }
    }
  }

  return result;
}

export interface WeatherData {
  main: string;
  description: string;
}

// Calculate safety score for a route
export function calculateSafetyScore(
  nearbyHotspots: AccidentHotspot[],
  weather?: WeatherData | null,
  isNight: boolean = false
): {
  score: number;
  explanations: string[];
  riskFactors: { reason: string; impact: number }[];
} {
  let totalPenalty = 0;
  const explanations: string[] = [];
  const riskFactors: { reason: string; impact: number }[] = [];

  // Calculate base penalties from hotspots
  for (const hotspot of nearbyHotspots) {
    const penalty = RISK_PENALTIES[hotspot.risk_level as keyof typeof RISK_PENALTIES];
    let adjustedPenalty = penalty;

    // Weather adjustment
    if (weather && (hotspot.weather_sensitive || WEATHER_MULTIPLIERS[weather.main]?.[hotspot.primary_reason])) {
      const multiplier = (weather.main && WEATHER_MULTIPLIERS[weather.main]?.[hotspot.primary_reason]) || 1.5;
      adjustedPenalty *= multiplier;
      explanations.push(
        `${weather.main} increases risk near ${hotspot.city || 'this location'}: ${hotspot.description}`
      );
    }

    // Night adjustment for time-sensitive zones
    if (isNight && (hotspot.time_sensitive || ["night_patterns", "fog", "sharp_curves"].includes(hotspot.primary_reason))) {
      adjustedPenalty *= 1.3;
      explanations.push(
        `Night conditions increase risk near ${hotspot.city || 'this location'}`
      );
    }

    totalPenalty += adjustedPenalty;
    riskFactors.push({
      reason: hotspot.primary_reason,
      impact: adjustedPenalty,
    });
  }

  // Cap penalty at 100
  const score = Math.max(0, Math.min(100, 100 - totalPenalty));

  return { score, explanations, riskFactors };
}

// Get safety level from score
export function getSafetyLevel(score: number): "safe" | "caution" | "danger" {
  if (score >= 75) return "safe";
  if (score >= 50) return "caution";
  return "danger";
}

// Get color for safety level
export function getSafetyColor(level: "safe" | "caution" | "danger"): string {
  switch (level) {
    case "safe":
      return "#10B981";
    case "caution":
      return "#F59E0B";
    case "danger":
      return "#EF4444";
  }
}
