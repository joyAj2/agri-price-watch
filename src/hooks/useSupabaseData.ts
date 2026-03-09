import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Crop = Tables<"crops">;
export type Market = Tables<"markets">;
export type PriceEntry = Tables<"prices">;

export const useAllCrops = () =>
  useQuery({
    queryKey: ["crops"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crops").select("*").order("name");
      if (error) throw error;
      return data as Crop[];
    },
  });

export const useAllMarkets = () =>
  useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("markets").select("*").order("name");
      if (error) throw error;
      return data as Market[];
    },
  });

export const useLatestPrices = (cropId?: string, marketId?: string) =>
  useQuery({
    queryKey: ["prices", "latest", cropId ?? "all", marketId ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("prices")
        .select("*")
        .order("date", { ascending: false });
      if (cropId) query = query.eq("crop_id", cropId);
      if (marketId) query = query.eq("market_id", marketId);
      const { data, error } = await query;
      if (error) throw error;

      // Deduplicate: keep only the latest entry per crop+market combo
      const latestMap = new Map<string, PriceEntry>();
      for (const p of (data ?? []) as PriceEntry[]) {
        const key = `${p.crop_id}-${p.market_id}`;
        if (!latestMap.has(key)) latestMap.set(key, p);
      }
      return Array.from(latestMap.values());
    },
  });

export const usePriceTrend = (cropId: string | undefined, marketId?: string) =>
  useQuery({
    queryKey: ["prices", "trend", cropId, marketId ?? "all"],
    enabled: !!cropId,
    queryFn: async () => {
      if (!cropId) return [];
      let query = supabase
        .from("prices")
        .select("*")
        .eq("crop_id", cropId)
        .order("date", { ascending: true });
      if (marketId) query = query.eq("market_id", marketId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as PriceEntry[];
    },
  });

export const useAddPrice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (price: TablesInsert<"prices">) => {
      const { error } = await supabase.from("prices").insert(price);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prices"] });
    },
  });
};

