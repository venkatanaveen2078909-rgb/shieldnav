import { motion } from "framer-motion";
import { Shield, Clock, Route as RouteIcon, AlertTriangle, CheckCircle, Zap, Leaf, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getSafetyLevel, getSafetyColor } from "@/lib/safetyScore";
import { RISK_REASON_LABELS } from "@/lib/constants";
import { AccidentHotspot } from "@/hooks/useAccidentHotspots";

export interface RouteOption {
  id: string;
  type: "safest" | "balanced" | "fastest";
  label: string;
  duration: string;
  distance: string;
  safetyScore: number;
  nearbyHotspots: number;
  explanations: string[];
  geometry?: [number, number][];
}

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function RouteCard({ route, isSelected, onSelect }: RouteCardProps) {
  const safetyLevel = getSafetyLevel(route.safetyScore);
  const safetyColor = getSafetyColor(safetyLevel);

  const getTypeStyle = () => {
    switch (route.type) {
      case "safest":
        return { icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "balanced":
        return { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
      case "fastest":
        return { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    }
  };

  const style = getTypeStyle();
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden ${isSelected
        ? "bg-zinc-900 border-primary shadow-[0_0_20px_rgba(0,102,255,0.2)] scale-[1.02] z-10"
        : "bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:bg-zinc-900/60 hover:border-white/10 shadow-lg"
        }`}
      onClick={onSelect}
    >
      {/* Premium Gradient Overlay for Selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      )}

      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${style.bg} ${style.color} shadow-inner`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-none mb-1">{route.label}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                  {route.type}
                </span>
                {route.type === "safest" && (
                  <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Recommended
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xl font-black font-heading text-white">{route.duration}</span>
            <span className="text-xs text-zinc-400 font-medium">{route.distance}</span>
          </div>
        </div>

        {/* Safety Viz */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 mb-5 border border-white/5">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-zinc-400 uppercase tracking-tighter">Safety Reliability</span>
            <span className="font-black text-sm" style={{ color: safetyColor }}>{route.safetyScore}%</span>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${route.safetyScore}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              style={{
                backgroundColor: safetyColor,
                boxShadow: `0 0 12px ${safetyColor}44`
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          className={`w-full h-12 font-black rounded-xl transition-all ${isSelected
            ? "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary/90"
            : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
            }`}
        >
          {isSelected ? (
            <span className="flex items-center gap-2">
              <Navigation className="h-5 w-5 fill-current" />
              Start Safe Navigation
            </span>
          ) : "Preview Route"}
        </Button>
      </div>

      {/* Animated Glow for Selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-[1px] rounded-3xl border-2 border-primary/50 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px 0 ${style.color}22`
          }}
        />
      )}
    </motion.div>

  );
}
