import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCrops, useAllMarkets, usePriceTrend, useLatestPrices } from "@/hooks/useSupabaseData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";

const marketColors = ["hsl(110 58% 30%)", "hsl(95 52% 53%)", "hsl(42 85% 55%)", "hsl(0 72% 51%)"];

const DashboardPage = () => {
  const { data: crops = [] } = useAllCrops();
  const { data: markets = [] } = useAllMarkets();
  const [selectedCrop, setSelectedCrop] = useState<string>("");

  useEffect(() => {
    if (crops.length > 0 && !selectedCrop) {
      setSelectedCrop(crops[0].id);
    }
  }, [crops, selectedCrop]);

  const { data: trendData = [] } = usePriceTrend(selectedCrop || undefined);
  const { data: latestPrices = [] } = useLatestPrices();

  // Build line chart data keyed by date
  const dateMap = new Map<string, Record<string, number>>();
  for (const p of trendData) {
    const marketName = markets.find(m => m.id === p.market_id)?.name ?? p.market_id;
    if (!dateMap.has(p.date)) dateMap.set(p.date, {});
    dateMap.get(p.date)![marketName] = Number(p.price);
  }
  const lineData = Array.from(dateMap.entries()).map(([date, prices]) => ({
    date: date.slice(0, 7),
    ...prices,
  }));

  // Bar chart: average price per crop
  const cropAvgs = crops.map(c => {
    const cropPrices = latestPrices.filter(p => p.crop_id === c.id);
    const avg = cropPrices.length
      ? Math.round(cropPrices.reduce((s, p) => s + Number(p.price), 0) / cropPrices.length)
      : 0;
    return { crop: `${c.emoji} ${c.name}`, avg };
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold md:text-4xl">📊 Dashboard</h1>
          <p className="text-muted-foreground">Price trends and market analytics</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Price Trend</CardTitle>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {lineData.length === 0 ? (
                  <Skeleton className="h-full w-full rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 82%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      {markets.map((m, i) => (
                        <Line
                          key={m.id}
                          type="monotone"
                          dataKey={m.name}
                          stroke={marketColors[i % marketColors.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display">Average Prices by Crop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {cropAvgs.length === 0 ? (
                  <Skeleton className="h-full w-full rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cropAvgs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 82%)" />
                      <XAxis dataKey="crop" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [`GHS ${value}`, "Avg Price"]} />
                      <Bar dataKey="avg" fill="hsl(110 58% 30%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
