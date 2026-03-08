import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { crops, markets, getPriceTrend, getLatestPrices, getMarketName } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const DashboardPage = () => {
  const [selectedCrop, setSelectedCrop] = useState("1");
  const trendData = getPriceTrend(selectedCrop);

  const dateMap = new Map<string, Record<string, number>>();
  for (const p of trendData) {
    const marketName = getMarketName(p.marketId);
    if (!dateMap.has(p.date)) dateMap.set(p.date, {});
    dateMap.get(p.date)![marketName] = p.price;
  }
  const lineData = Array.from(dateMap.entries()).map(([date, prices]) => ({
    date: date.slice(0, 7),
    ...prices,
  }));

  const latestPrices = getLatestPrices();
  const cropAvgs = crops.map(c => {
    const cropPrices = latestPrices.filter(p => p.cropId === c.id);
    const avg = cropPrices.length ? Math.round(cropPrices.reduce((s, p) => s + p.price, 0) / cropPrices.length) : 0;
    return { crop: `${c.emoji} ${c.name}`, avg };
  });

  const marketColors = ["hsl(110 58% 30%)", "hsl(95 52% 53%)", "hsl(42 85% 55%)", "hsl(0 72% 51%)"];

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
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {crops.map(c => (<SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 82%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    {markets.map((m, i) => (
                      <Line key={m.id} type="monotone" dataKey={m.name} stroke={marketColors[i]} strokeWidth={2} dot={{ r: 3 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Average Prices by Crop</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropAvgs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 82%)" />
                    <XAxis dataKey="crop" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => [`GHS ${value}`, "Avg Price"]} />
                    <Bar dataKey="avg" fill="hsl(110 58% 30%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
