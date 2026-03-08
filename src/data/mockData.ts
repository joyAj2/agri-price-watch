export interface Crop {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface Market {
  id: string;
  name: string;
  region: string;
  location: string;
}

export interface PriceEntry {
  id: string;
  cropId: string;
  marketId: string;
  price: number;
  unit: string;
  date: string;
}

export const crops: Crop[] = [
  { id: "1", name: "Maize", category: "Grains", image: "🌽" },
  { id: "2", name: "Rice", category: "Grains", image: "🍚" },
  { id: "3", name: "Tomatoes", category: "Vegetables", image: "🍅" },
  { id: "4", name: "Cassava", category: "Tubers", image: "🥔" },
  { id: "5", name: "Plantain", category: "Fruits", image: "🍌" },
  { id: "6", name: "Yam", category: "Tubers", image: "🍠" },
  { id: "7", name: "Cocoa", category: "Cash Crops", image: "🫘" },
  { id: "8", name: "Groundnuts", category: "Legumes", image: "🥜" },
];

export const markets: Market[] = [
  { id: "1", name: "Makola Market", region: "Greater Accra", location: "Accra" },
  { id: "2", name: "Kejetia Market", region: "Ashanti", location: "Kumasi" },
  { id: "3", name: "Tamale Market", region: "Northern", location: "Tamale" },
  { id: "4", name: "Cape Coast Market", region: "Central", location: "Cape Coast" },
  { id: "5", name: "Techiman Market", region: "Bono East", location: "Techiman" },
  { id: "6", name: "Bolgatanga Market", region: "Upper East", location: "Bolgatanga" },
];

const generatePrices = (): PriceEntry[] => {
  const entries: PriceEntry[] = [];
  const basePrices: Record<string, number> = {
    "1": 380, "2": 520, "3": 150, "4": 200,
    "5": 280, "6": 450, "7": 1200, "8": 350,
  };

  let id = 1;
  const months = ["2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02"];

  for (const cropId of Object.keys(basePrices)) {
    for (const market of markets) {
      for (const month of months) {
        const variation = (Math.random() - 0.5) * 0.3;
        const marketVar = (parseInt(market.id) - 1) * 15;
        const price = Math.round(basePrices[cropId] * (1 + variation) + marketVar);
        entries.push({
          id: String(id++),
          cropId,
          marketId: market.id,
          price,
          unit: cropId === "3" ? "box" : "bag",
          date: `${month}-15`,
        });
      }
    }
  }
  return entries;
};

export const prices: PriceEntry[] = generatePrices();

export const getCropName = (id: string) => crops.find(c => c.id === id)?.name ?? "";
export const getMarketName = (id: string) => markets.find(m => m.id === id)?.name ?? "";

export const getLatestPrices = (cropId?: string, marketId?: string) => {
  let filtered = prices;
  if (cropId) filtered = filtered.filter(p => p.cropId === cropId);
  if (marketId) filtered = filtered.filter(p => p.marketId === marketId);
  
  const latest = new Map<string, PriceEntry>();
  for (const p of filtered.sort((a, b) => b.date.localeCompare(a.date))) {
    const key = `${p.cropId}-${p.marketId}`;
    if (!latest.has(key)) latest.set(key, p);
  }
  return Array.from(latest.values());
};

export const getPriceTrend = (cropId: string, marketId?: string) => {
  let filtered = prices.filter(p => p.cropId === cropId);
  if (marketId) filtered = filtered.filter(p => p.marketId === marketId);
  return filtered.sort((a, b) => a.date.localeCompare(b.date));
};
