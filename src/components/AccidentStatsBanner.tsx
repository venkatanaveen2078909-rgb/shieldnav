import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { ACCIDENT_STATS } from "@/lib/constants";

export function AccidentStatsBanner() {
  return (
    <div className="w-full">
      <div className="bg-zinc-900/90 backdrop-blur-md border-l-4 border-destructive p-4 rounded-r-2xl flex items-center justify-between border-y border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-destructive/20 rounded-xl shadow-lg animate-pulse border border-destructive/30">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-0.5">Live Safety Report</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-black text-white">{ACCIDENT_STATS.totalCases}</h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Active Incidents</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase">Risk Trend</p>
            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-sm">
              <TrendingDown className="h-4 w-4" />
              12% ↓
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Safety Score</p>
            <div className="flex items-center gap-1.5 text-primary font-black text-sm">
              <ShieldCheck className="h-4 w-4" />
              94%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
