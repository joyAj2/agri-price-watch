export interface Crop {
  id: string;
  name: string;
  category: string;
  emoji: string;
  imageUrl: string;
  unit: string;
  description: string;
}

export interface Market {
  id: string;
  name: string;
  region: string;
  location: string;
  imageUrl: string;
}

export interface PriceEntry {
  id: string;
  cropId: string;
  marketId: string;
  price: number;
  unit: string;
  date: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
}

export const crops: Crop[] = [
  {
    id: "1", name: "Maize", category: "Grains", emoji: "🌽",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
    unit: "bag", description: "Premium yellow maize, sun-dried and ready for market."
  },
  {
    id: "2", name: "Tomato", category: "Vegetables", emoji: "🍅",
    imageUrl: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop",
    unit: "box", description: "Fresh ripe tomatoes, locally grown across Ghana."
  },
  {
    id: "3", name: "Rice", category: "Grains", emoji: "🍚",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    unit: "bag", description: "Locally milled Ghana rice, aromatic and premium quality."
  },
  {
    id: "4", name: "Onion", category: "Vegetables", emoji: "🧅",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop",
    unit: "bag", description: "Fresh onions from Bawku and the Upper East region."
  },
  {
    id: "5", name: "Yam", category: "Tubers", emoji: "🍠",
    imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop",
    unit: "tuber", description: "Puna yam from the Volta and Brong-Ahafo regions."
  },
  {
    id: "6", name: "Cassava", category: "Tubers", emoji: "🥔",
    imageUrl: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=400&h=300&fit=crop",
    unit: "bag", description: "Fresh cassava roots, ideal for gari and fufu processing."
  },
  {
    id: "7", name: "Plantain", category: "Fruits", emoji: "🍌",
    imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop",
    unit: "bunch", description: "Ripe and unripe plantain, a Ghanaian staple food."
  },
  {
    id: "8", name: "Pepper", category: "Vegetables", emoji: "🌶️",
    imageUrl: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop",
    unit: "bag", description: "Fresh scotch bonnet and shito peppers from local farms."
  },
];

export const markets: Market[] = [
  {
    id: "1", name: "Makola Market", region: "Greater Accra", location: "Accra",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop"
  },
  {
    id: "2", name: "Kejetia Market", region: "Ashanti", location: "Kumasi",
    imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=400&fit=crop"
  },
  {
    id: "3", name: "Tamale Market", region: "Northern", location: "Tamale",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"
  },
  {
    id: "4", name: "Techiman Market", region: "Bono East", location: "Techiman",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop"
  },
];

// Generate seed price data for all 32 crop-market combinations
const basePrices: Record<string, number> = {
  "1": 380, "2": 150, "3": 520, "4": 280,
  "5": 450, "6": 200, "7": 120, "8": 320,
};

const generatePrices = (): PriceEntry[] => {
  const entries: PriceEntry[] = [];
  const months = ["2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02"];
  let id = 1;

  for (const crop of crops) {
    for (const market of markets) {
      for (const month of months) {
        const base = basePrices[crop.id];
        const marketVar = (parseInt(market.id) - 1) * 12;
        const monthIdx = months.indexOf(month);
        const trendMult = 1 + (monthIdx * 0.02) + (Math.random() - 0.5) * 0.15;
        const price = Math.round(base * trendMult + marketVar);
        const prevPrice = monthIdx > 0 ? entries[entries.length - 4]?.price ?? price : price;
        const change = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0;

        entries.push({
          id: String(id++),
          cropId: crop.id,
          marketId: market.id,
          price,
          unit: crop.unit,
          date: `${month}-15`,
          trend: change > 1 ? "up" : change < -1 ? "down" : "stable",
          changePercent: Math.round(Math.abs(change) * 10) / 10,
        });
      }
    }
  }
  return entries;
};

export const prices: PriceEntry[] = generatePrices();

export const getCropName = (id: string) => crops.find(c => c.id === id)?.name ?? "";
export const getMarketName = (id: string) => markets.find(m => m.id === id)?.name ?? "";
export const getCrop = (id: string) => crops.find(c => c.id === id);
export const getMarket = (id: string) => markets.find(m => m.id === id);

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

export const getBestPrice = (cropId: string) => {
  const latest = getLatestPrices(cropId);
  return latest.reduce((best, p) => (p.price > best.price ? p : best), latest[0]);
};

export const getWorstPrice = (cropId: string) => {
  const latest = getLatestPrices(cropId);
  return latest.reduce((worst, p) => (p.price < worst.price ? p : worst), latest[0]);
};
