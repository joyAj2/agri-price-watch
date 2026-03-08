import { useState, useMemo } from "react";
import { crops, markets, getPriceTrend, getLatestPrices, getCropName, getMarketName } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = ["#2d6a4f", "#d4a017", "#8b4513", "#1e90ff", "#e74c3c", "#9b59b6"];

const DashboardPage = () => {
  const [selectedCrop, setSelectedCrop] = useState("1");

  // Line chart: price trend across markets for selected crop
  const trendData = useMemo(() => {
    const trend = getPriceTrend(selectedCrop);
    const dateMap = new Map<string, Record<string, number>>();

    for (const t of trend) {
      const existing = dateMap.get(t.date) ?? {};
      existing[getMarketName(t.marketId)] = t.price;
      dateMap.set(t.date, existing);
    }

    return Array.from(dateMap.entries()).map(([date, prices]) => ({
      date: date.slice(0, 7),
      ...prices,
    }));
  }, [selectedCrop]);

  // Bar chart: latest average price per crop
  const avgData = useMemo(() => {
    return crops.map(c => {
      const latest = getLatestPrices(c.id);
      const avg = latest.length ? Math.round(latest.reduce((s, p) => s + p.price, 0) / latest.length) : 0;
      return { name: c.name, image: c.image, price: avg };
    });
  }, []);

  // Price change indicator
  const latestPrices = getLatestPrices(selectedCrop);
  const crop = crops.find(c => c.id === selectedCrop);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Market Dashboard</h1>
        <p className="text-muted-foreground">Visualize crop price trends and market insights</p>
      </div>

      {/* Overview cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Avg Maize Price", value: "GHS 395", change: "+2.3%", up: true },
          { label: "Avg Rice Price", value: "GHS 535", change: "-1.1%", up: false },
          { label: "Markets Tracked", value: String(markets.length), change: null, up: true },
          { label: "Crops Monitored", value: String(crops.length), change: null, up: true },
        ].map((card, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-card">
            <div className="text-sm text-muted-foreground">{card.label}</div>
            <div className="font-display text-2xl font-bold">{card.value}</div>
            {card.change && (
              <div className={`flex items-center gap-1 text-sm ${card.up ? "text-primary" : "text-destructive"}`}>
                {card.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {card.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Trend Chart */}
      <div className="mb-8 rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Price Trends</h2>
            <p className="text-sm text-muted-foreground">
              {crop?.image} {crop?.name} prices across markets over time
            </p>
          </div>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.image} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(150 10% 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150 10% 45%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(40 15% 85%)",
                  boxShadow: "0 4px 24px -4px hsl(150 30% 10% / 0.08)",
                }}
              />
              <Legend />
              {markets.map((m, i) => (
                <Line
                  key={m.id}
                  type="monotone"
                  dataKey={m.name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Price Bar Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h2 className="mb-1 font-display text-xl font-bold">Average Prices by Crop</h2>
        <p className="mb-4 text-sm text-muted-foreground">Latest average across all markets (GHS)</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 85%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(150 10% 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150 10% 45%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(40 15% 85%)",
                }}
              />
              <Bar dataKey="price" fill="hsl(145 45% 28%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
