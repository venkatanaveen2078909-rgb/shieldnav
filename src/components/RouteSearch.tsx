import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchPlaces, PlaceResult } from "@/lib/mapServices";

interface RouteSearchProps {
  onSearch: (origin: { lat: number; lng: number; name: string }, dest: { lat: number; lng: number; name: string }) => void;
  isLoading: boolean;
}

export function RouteSearch({ onSearch, isLoading }: RouteSearchProps) {
  const [originInput, setOriginInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const [originResult, setOriginResult] = useState<PlaceResult | null>(null);
  const [destResult, setDestResult] = useState<PlaceResult | null>(null);

  const [originSuggestions, setOriginSuggestions] = useState<PlaceResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<PlaceResult[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (originInput && originInput !== originResult?.display_name) {
        const results = await searchPlaces(originInput);
        setOriginSuggestions(results);
        setShowOriginSuggestions(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [originInput, originResult]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destInput && destInput !== destResult?.display_name) {
        const results = await searchPlaces(destInput);
        setDestSuggestions(results);
        setShowDestSuggestions(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [destInput, destResult]);

  const handleSelectOrigin = (place: PlaceResult) => {
    setOriginInput(place.display_name);
    setOriginResult(place);
    setShowOriginSuggestions(false);
  };

  const handleSelectDest = (place: PlaceResult) => {
    setDestInput(place.display_name);
    setDestResult(place);
    setShowDestSuggestions(false);
  };

  const handleSearch = () => {
    if (originResult && destResult) {
      onSearch(
        { lat: parseFloat(originResult.lat), lng: parseFloat(originResult.lon), name: originResult.name },
        { lat: parseFloat(destResult.lat), lng: parseFloat(destResult.lon), name: destResult.name }
      );
    }
  };

  return (
    <div className="relative w-full glass-card p-4 rounded-2xl shadow-2xl border-white/20">
      <div className="flex flex-col md:flex-row gap-4">

        {/* Origin Input */}
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center pointer-events-none z-10">
            <MapPin className="h-4 w-4 text-blue-500" />
          </div>
          <input
            type="text"
            placeholder="Start Location"
            className="w-full pl-12 pr-10 h-12 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all font-medium"
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            onFocus={() => setShowOriginSuggestions(true)}
          />
          {originInput && (
            <button onClick={() => { setOriginInput(""); setOriginResult(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions */}
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
              {originSuggestions.map((place) => (
                <div
                  key={place.place_id}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-zinc-300 border-b border-white/5 last:border-0"
                  onClick={() => handleSelectOrigin(place)}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center pointer-events-none z-10">
            <Navigation className="h-4 w-4 text-emerald-500" />
          </div>
          <input
            type="text"
            placeholder="Destination"
            className="w-full pl-12 pr-10 h-12 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-zinc-500 transition-all font-medium"
            value={destInput}
            onChange={(e) => setDestInput(e.target.value)}
            onFocus={() => setShowDestSuggestions(true)}
          />
          {destInput && (
            <button onClick={() => { setDestInput(""); setDestResult(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions */}
          {showDestSuggestions && destSuggestions.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
              {destSuggestions.map((place) => (
                <div
                  key={place.place_id}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-zinc-300 border-b border-white/5 last:border-0"
                  onClick={() => handleSelectDest(place)}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!originResult || !destResult || isLoading}
          className="h-12 px-8 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all text-base min-w-[140px]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Search className="h-5 w-5 mr-2" />
          )}
          Find Route
        </Button>
      </div>
    </div>
  );
}
