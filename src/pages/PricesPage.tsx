import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { crops, markets, getLatestPrices } from "@/data/mockData";

const PricesPage = () => {
  const [searchParams] = useSearchParams();
  const initialMarket = searchParams.get("market") || "";
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);

  const latestPrices = getLatestPrices(undefined, selectedMarket || undefined);

  // Group by crop
  const cropGroups = crops.map(crop => {
    const cropPrices = latestPrices.filter(p => p.cropId === crop.id);
    const prices = markets
      .filter(m => !selectedMarket || m.id === selectedMarket)
      .map(market => {
        const price = cropPrices.find(p => p.marketId === market.id);
        return { market, price };
      });
    const allPriceValues = prices.map(p => p.price?.price ?? 0).filter(Boolean);
    const highest = Math.max(...allPriceValues);
    const lowest = Math.min(...allPriceValues);
    return { crop, prices, highest, lowest };
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">Market Prices</h1>
          <p className="text-muted-foreground">Current crop prices across Ghana's major markets</p>
        </div>

        {/* Market Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedMarket === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMarket("")}
            className="btn-hover"
          >
            All Markets
          </Button>
          {markets.map(m => (
            <Button
              key={m.id}
              variant={selectedMarket === m.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarket(m.id)}
              className="btn-hover"
            >
              {m.location}
            </Button>
          ))}
        </div>

        {/* Crop Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cropGroups.map(({ crop, prices, highest, lowest }) => (
            <Link
              key={crop.id}
              to={`/compare?crop=${crop.id}`}
              className="group overflow-hidden rounded-xl border bg-card shadow-card card-hover"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <h3 className="font-display text-lg font-bold text-primary-foreground">{crop.emoji} {crop.name}</h3>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {prices.map(({ market, price }) => {
                  if (!price) return null;
                  const isHighest = price.price === highest;
                  const isLowest = price.price === lowest && prices.length > 1;
                  return (
                    <div
                      key={market.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                        isHighest ? "bg-primary/10 text-primary" : isLowest ? "bg-destructive/10 text-destructive" : "bg-muted/50"
                      }`}
                    >
                      <span className="font-medium">{market.location}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold">GHS {price.price}</span>
                        {price.trend === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : price.trend === "down" ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricesPage;
