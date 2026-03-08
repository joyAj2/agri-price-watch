import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { crops, markets, getLatestPrices, getBestPrice, getCrop } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const initialCrop = searchParams.get("crop") || "1";
  const [selectedCropId, setSelectedCropId] = useState(initialCrop);

  const crop = getCrop(selectedCropId);
  const latestPrices = getLatestPrices(selectedCropId);
  const best = getBestPrice(selectedCropId);

  const chartData = markets.map(m => {
    const price = latestPrices.find(p => p.marketId === m.id);
    return {
      market: m.location,
      price: price?.price ?? 0,
      isBest: price?.id === best?.id,
    };
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Crop Selector Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {crops.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all btn-hover ${
                selectedCropId === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <img src={c.imageUrl} alt={c.name} className="h-6 w-6 rounded-full object-cover" />
              {c.name}
            </button>
          ))}
        </div>

        {/* Hero Banner */}
        {crop && (
          <div className="relative mb-8 overflow-hidden rounded-2xl">
            <div className="h-48 md:h-64">
              <img src={crop.imageUrl} alt={crop.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/20" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="mb-1 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                {crop.emoji} {crop.name}
              </h1>
              <p className="text-sm text-primary-foreground/70">{crop.description}</p>
              {best && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-bold text-primary-foreground backdrop-blur-sm">
                  <Star className="h-4 w-4 text-harvest" /> Best: GHS {best.price}/{crop.unit} at {markets.find(m => m.id === best.marketId)?.location}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Price Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map(market => {
            const price = latestPrices.find(p => p.marketId === market.id);
            const isBest = price?.id === best?.id;
            return (
              <div
                key={market.id}
                className={`rounded-xl border p-5 shadow-card card-hover ${
                  isBest ? "gradient-lime text-primary-foreground border-0" : "bg-card"
                }`}
              >
                {isBest && (
                  <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold">
                    <Star className="h-3 w-3" /> BEST PRICE
                  </div>
                )}
                <h3 className={`font-display text-lg font-bold ${isBest ? "" : "text-foreground"}`}>{market.location}</h3>
                <p className={`text-xs ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{market.name}</p>
                <div className={`mt-3 font-display text-3xl font-bold ${isBest ? "" : "text-primary"}`}>
                  GHS {price?.price ?? "—"}
                </div>
                <div className={`text-xs ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  per {crop?.unit}
                </div>
                {price && (
                  <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                    isBest
                      ? "text-primary-foreground/80"
                      : price.trend === "up" ? "text-primary" : price.trend === "down" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {price.trend === "up" ? <TrendingUp className="h-3 w-3" /> : price.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                    {price.changePercent}% vs last month
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-xl font-bold">Price Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 82%)" />
                <XAxis dataKey="market" tick={{ fontFamily: "DM Sans", fontSize: 12 }} />
                <YAxis tick={{ fontFamily: "DM Sans", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid hsl(37 15% 82%)",
                    fontFamily: "DM Sans",
                  }}
                  formatter={(value: number) => [`GHS ${value}`, "Price"]}
                />
                <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.isBest ? "hsl(95 52% 53%)" : "hsl(110 58% 30%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
