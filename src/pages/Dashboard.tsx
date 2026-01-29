import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAccidentHotspots } from "@/hooks/useAccidentHotspots";
import { WelcomeModal } from "@/components/WelcomeModal";
import { SOSButton } from "@/components/SOSButton";
import { RouteSearch } from "@/components/RouteSearch";
import { RouteCard, RouteOption } from "@/components/RouteCard";
import { MapView } from "@/components/MapView";
import { NavigationMode } from "@/components/NavigationMode";
import { getRoute, analyzeRouteSafety } from "@/lib/mapServices";
import { AccidentHotspot } from "@/hooks/useAccidentHotspots";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: hotspots = [] } = useAccidentHotspots();

  const [showWelcome, setShowWelcome] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Navigation State
  const [origin, setOrigin] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("shieldnav-welcome-seen");
    if (!hasSeenWelcome && user) setShowWelcome(true);
  }, [user]);

  const handleSearch = async (
    originPlace: { lat: number; lng: number; name: string },
    destPlace: { lat: number; lng: number; name: string }
  ) => {
    setOrigin(originPlace);
    setDestination(destPlace);
    setIsSearching(true);
    setRoutes([]);

    try {
      const fetchedRoutes = await getRoute(originPlace, destPlace);

      if (fetchedRoutes.length > 0) {
        // Analyze all routes
        const analyzedRoutes = fetchedRoutes.map((route) => {
          const analysis = analyzeRouteSafety(route.geometry, hotspots);
          return { ...route, analysis };
        });

        // 1. SAFEST: Highest Safety Score
        const safestRoute = [...analyzedRoutes].sort((a, b) => b.analysis.score - a.analysis.score)[0];

        // 2. FASTEST: Lowest Duration
        const fastestRoute = [...analyzedRoutes].sort((a, b) => a.duration - b.duration)[0];

        // 3. BALANCED: Best compromise
        // Try to find a route that is distinct from Safest and Fastest
        let balancedRoute = analyzedRoutes.find(r => r.id !== safestRoute.id && r.id !== fastestRoute.id);

        if (!balancedRoute) {
          // If no unique 3rd route, prioritize:
          // If Safest is very slow, maybe Balanced is Fastest?
          // For now, standard fallback: Balanced = Safest (Safety priority)
          balancedRoute = safestRoute;
        }

        const options: RouteOption[] = [];

        // Helper to format duration/distance
        const fmtDur = (sec: number) => `${Math.round(sec / 60)} min`;
        const fmtDist = (meters: number) => `${(meters / 1000).toFixed(1)} km`;

        // Push SAFEST
        options.push({
          id: `${safestRoute.id}-safe`, // Unique ID derived from route ID
          type: "safest",
          label: "Safest Route",
          duration: fmtDur(safestRoute.duration),
          distance: fmtDist(safestRoute.distance),
          safetyScore: safestRoute.analysis.score,
          nearbyHotspots: safestRoute.analysis.hotspotsCrossed.length,
          explanations: safestRoute.analysis.hotspotsCrossed.length > 0
            ? [`Avoids ${hotspots.length - safestRoute.analysis.hotspotsCrossed.length} hotspots`]
            : ["Maximum safety rating"],
          geometry: safestRoute.geometry as any
        });

        // Push BALANCED
        options.push({
          id: `${balancedRoute.id}-balanced`,
          type: "balanced",
          label: "Balanced Route",
          duration: fmtDur(balancedRoute.duration),
          distance: fmtDist(balancedRoute.distance),
          safetyScore: balancedRoute.analysis.score,
          nearbyHotspots: balancedRoute.analysis.hotspotsCrossed.length,
          explanations: ["Optimal mix of safety & speed"],
          geometry: balancedRoute.geometry as any
        });

        // Push FASTEST
        options.push({
          id: `${fastestRoute.id}-fast`,
          type: "fastest",
          label: "Fastest Route",
          duration: fmtDur(fastestRoute.duration),
          distance: fmtDist(fastestRoute.distance),
          safetyScore: fastestRoute.analysis.score,
          nearbyHotspots: fastestRoute.analysis.hotspotsCrossed.length,
          explanations: ["Shortest travel time"],
          geometry: fastestRoute.geometry as any
        });

        setRoutes(options);
        setRouteGeometry(safestRoute.geometry as any); // Default to Safest geometry
        setSelectedRouteIndex(0);
      }
    } catch (e) {
      console.error("Routing failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const currentRoute = routes[selectedRouteIndex];

  if (isNavigating && currentRoute && origin && destination) {
    return (
      <NavigationMode
        hotspots={hotspots}
        originName={origin.name}
        destName={destination.name}
        routeGeometry={routeGeometry as any} // Cast for now, fixing props next
        onExit={() => setIsNavigating(false)}
      />
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-zinc-950">

      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView
          routeGeometry={routeGeometry}
          hotspots={hotspots}
          routeType={currentRoute?.type}
        />
      </div>

      {/* Top UI */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col items-center gap-4 pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto">
          <RouteSearch onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 z-20 flex gap-3 pointer-events-auto">
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-xl bg-black/60 text-white backdrop-blur-xl border border-white/10" onClick={() => navigate("/profile")}>
          <Settings className="h-6 w-6" />
        </Button>
        <Button variant="destructive" size="icon" className="h-12 w-12 rounded-xl" onClick={handleLogout}>
          <LogOut className="h-6 w-6" />
        </Button>
      </div>

      {/* Route Cards Panel */}
      <AnimatePresence>
        {routes.length > 0 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg">Route Optimized</h3>
                <span className="text-emerald-400 bg-emerald-500/20 text-xs px-2 py-1 rounded-full font-bold">Safe Choice</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto no-scrollbar">
                {routes.map((route, idx) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    isSelected={idx === selectedRouteIndex}
                    onSelect={() => {
                      setSelectedRouteIndex(idx);
                      // Cast to unknown first if strict config, but usually this is fine if we update RouteOption
                      setRouteGeometry(route.geometry as any);
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={handleStartNavigation}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
              >
                <Navigation className="mr-2 h-5 w-5" /> Start Navigation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SOSButton />
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
}
