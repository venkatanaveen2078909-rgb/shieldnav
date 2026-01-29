import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AccidentHotspot {
  id: string;
  lat: number;
  lng: number;
  risk_level: "high" | "medium" | "low";
  primary_reason: string;
  description: string | null;
  city: string | null;
  state: string | null;
  weather_sensitive?: boolean;
  time_sensitive?: boolean;
}

export function useAccidentHotspots() {
  return useQuery({
    queryKey: ["accident-hotspots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accident_hotspots")
        .select("*");

      if (error) throw error;
      return data as AccidentHotspot[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
