import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Volume2, VolumeX, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "./MapView";
import { AccidentHotspot } from "@/hooks/useAccidentHotspots";
import { SOSButton } from "./SOSButton";
import { haversineDistance } from "@/lib/safetyScore";
import { ALERT_PROXIMITY_KM, RISK_REASON_LABELS } from "@/lib/constants";

interface NavigationModeProps {
  hotspots: AccidentHotspot[];
  originName: string;
  destName: string;
  routeGeometry?: [number, number][];
  onExit: () => void;
}

export function NavigationMode({
  hotspots,
  originName,
  destName,
  routeGeometry,
  onExit,
}: NavigationModeProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [alertedHotspots, setAlertedHotspots] = useState<Set<string>>(new Set());
  const [currentAlert, setCurrentAlert] = useState<AccidentHotspot | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHeading(position.coords.heading || 0);
          setSpeed(Math.round((position.coords.speed || 0) * 3.6)); // m/s to km/h
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Check proximity to hotspots
  useEffect(() => {
    if (!userLocation || isMuted) return;

    for (const hotspot of hotspots) {
      if (alertedHotspots.has(hotspot.id)) continue;

      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        hotspot.lat,
        hotspot.lng
      );

      if (distance <= ALERT_PROXIMITY_KM && hotspot.risk_level === "high") {
        setCurrentAlert(hotspot);
        setAlertedHotspots((prev) => new Set([...prev, hotspot.id]));

        if (synthRef.current && !isMuted) {
          const reasonText = RISK_REASON_LABELS[hotspot.primary_reason] || hotspot.primary_reason;
          const message = `Caution. Approaching high risk zone. ${reasonText}.`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 1.1;
          synthRef.current.speak(utterance);
        }

        setTimeout(() => setCurrentAlert(null), 8000);
        break;
      }
    }
  }, [userLocation, hotspots, alertedHotspots, isMuted]);

  // Calculate distance and time based on user location and route
  const calculateRemainingDistance = () => {
    if (!userLocation || !routeGeometry || routeGeometry.length === 0) return "0 km";

    // Simple calculation: distance from user to destination
    const dest = routeGeometry[routeGeometry.length - 1]; // [lat, lng]
    // dest is now [number, number]
    const distance = haversineDistance(userLocation.lat, userLocation.lng, dest[0], dest[1]);

    return `${distance.toFixed(1)} km`;
  };

  const calculateETA = () => {
    if (!userLocation || speed === 0 || !routeGeometry) return "--:--";

    const dest = routeGeometry[routeGeometry.length - 1];
    const distance = haversineDistance(userLocation.lat, userLocation.lng, dest[0], dest[1]);

    const remainingMinutes = (distance / speed) * 60;
    const eta = new Date(Date.now() + remainingMinutes * 60000);

    return eta.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-hidden font-heading">
      {/* Map Layer */}
      <div className="absolute inset-0">
        <MapView
          routeGeometry={routeGeometry || null}
          hotspots={hotspots}
          userLocation={userLocation}
          isNavigating={true}
        />
      </div>

      {/* Top Bar: Next Turn */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/60 to-transparent pt-safe"
      >
        <div className="glass-card rounded-[2rem] p-4 flex items-center justify-between shadow-2xl bg-zinc-900/90 border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/30">
              <Navigation className="h-8 w-8 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-none mb-1">
                {destName}
              </h2>
              <p className="text-zinc-400 font-medium max-w-[200px] truncate">
                Follow the highlighted route
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      {/* Bottom Information Panel */}
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent pb-safe"
      >
        <div className="flex items-end justify-between gap-4">

          {/* Speed & Stats */}
          <div className="glass-card rounded-[2.5rem] p-6 w-full flex items-center justify-between bg-zinc-900/90 text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] border-white/10">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block text-4xl font-black">{Math.min(speed, 120)}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">km/h</span>
              </div>
              <div className="h-10 w-[1px] bg-border" />
              <div>
                <div className="text-xl font-bold">
                  {speed > 0 ? Math.round((parseFloat(calculateRemainingDistance()) / speed) * 60) : '--'}
                  <span className="text-xs font-normal text-muted-foreground"> min</span>
                </div>
                <div className="text-xs font-medium text-emerald-500">{calculateETA()} ETA</div>
              </div>
              <div className="h-10 w-[1px] bg-border" />
              <div>
                <div className="text-xl font-bold">{calculateRemainingDistance()}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-12 w-12 rounded-2xl border-2"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Alerts Layer */}
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-32 left-4 right-4 z-20"
          >
            <div className="bg-destructive text-white rounded-3xl p-5 shadow-2xl shadow-red-500/30 flex items-center gap-4 border-4 border-white/10 relative overflow-hidden">
              {/* Pulse Animation */}
              <div className="absolute -left-10 top-0 bottom-0 w-20 bg-white/20 skew-x-12 animate-[shimmer_1s_infinite]" />

              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="h-8 w-8 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg uppercase tracking-tight">High Risk Zone</h3>
                <p className="text-white/90 font-medium text-sm leading-tight">
                  {RISK_REASON_LABELS[currentAlert.primary_reason]} detected ahead.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                onClick={() => setCurrentAlert(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* SOS Button for Navigation Mode - Positioned above the information bar */}
      <SOSButton className="bottom-40 right-10" />

    </div>
  );
}
