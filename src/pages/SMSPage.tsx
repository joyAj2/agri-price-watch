import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Terminal } from "lucide-react";
import { crops, markets, getLatestPrices, getBestPrice } from "@/data/mockData";

const quickExamples = [
  "PRICE MAIZE ACCRA",
  "PRICE TOMATO KUMASI",
  "COMPARE RICE",
  "BEST YAM",
  "HELP",
];

const commandReference = [
  { command: "PRICE [CROP] [MARKET]", desc: "Get price of a crop in a specific market", example: "PRICE MAIZE ACCRA" },
  { command: "COMPARE [CROP]", desc: "Compare a crop's price across all markets", example: "COMPARE RICE" },
  { command: "BEST [CROP]", desc: "Find the best market price for a crop", example: "BEST PLANTAIN" },
  { command: "HELP", desc: "Show list of available commands", example: "HELP" },
];

const parseSMSQuery = (query: string): string => {
  const parts = query.trim().toUpperCase().split(/\s+/);
  const cmd = parts[0];

  if (cmd === "HELP") {
    return "AgriPrice GH Commands:\n• PRICE [CROP] [MARKET] — Get price\n• COMPARE [CROP] — Compare across markets\n• BEST [CROP] — Find best price\n• HELP — This message\n\nPowered by AgriPrice GH 🌾";
  }

  if (cmd === "PRICE" && parts.length >= 3) {
    const cropName = parts[1];
    const marketName = parts[2];
    const crop = crops.find(c => c.name.toUpperCase() === cropName);
    const market = markets.find(m => m.location.toUpperCase() === marketName);
    if (!crop) return `❌ Crop "${cropName}" not found. Available: ${crops.map(c => c.name).join(", ")}`;
    if (!market) return `❌ Market "${marketName}" not found. Available: ${markets.map(m => m.location).join(", ")}`;
    const prices = getLatestPrices(crop.id, market.id);
    const best = getBestPrice(crop.id);
    if (prices.length === 0) return `No price data found for ${crop.name} in ${market.location}.`;
    return `${crop.name} in ${market.location}: GHS ${prices[0].price}/${crop.unit}.\nBest market today: ${markets.find(m => m.id === best?.marketId)?.location} GHS ${best?.price}.\n\nPowered by AgriPrice GH 🌾`;
  }

  if (cmd === "COMPARE" && parts.length >= 2) {
    const cropName = parts[1];
    const crop = crops.find(c => c.name.toUpperCase() === cropName);
    if (!crop) return `❌ Crop "${cropName}" not found. Available: ${crops.map(c => c.name).join(", ")}`;
    const prices = getLatestPrices(crop.id);
    const lines = markets.map(m => {
      const p = prices.find(pr => pr.marketId === m.id);
      return `• ${m.location}: GHS ${p?.price ?? "N/A"}`;
    });
    return `${crop.name} prices:\n${lines.join("\n")}\n\nPowered by AgriPrice GH 🌾`;
  }

  if (cmd === "BEST" && parts.length >= 2) {
    const cropName = parts[1];
    const crop = crops.find(c => c.name.toUpperCase() === cropName);
    if (!crop) return `❌ Crop "${cropName}" not found.`;
    const best = getBestPrice(crop.id);
    if (!best) return `No price data for ${crop.name}.`;
    return `Best price for ${crop.name}: GHS ${best.price}/${crop.unit} at ${markets.find(m => m.id === best.marketId)?.location}.\n\nPowered by AgriPrice GH 🌾`;
  }

  return `❌ Invalid command. Send HELP for a list of commands.`;
};

const SMSPage = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = () => {
    if (!query.trim()) return;
    setResponse(parseSMSQuery(query));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">📱 SMS Price Query</h1>
          <p className="text-muted-foreground">
            No internet? Send an SMS to <span className="font-mono font-bold text-primary">1234</span> to get instant crop prices.
          </p>
        </div>

        {/* Quick Examples */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Quick examples — click to try:</p>
          <div className="flex flex-wrap gap-2">
            {quickExamples.map(ex => (
              <button
                key={ex}
                onClick={() => { setQuery(ex); setResponse(parseSMSQuery(ex)); }}
                className="rounded-full border bg-card px-3 py-1.5 text-sm font-mono font-medium transition-all hover:border-primary hover:bg-primary/5 btn-hover"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mb-6 flex gap-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="PRICE MAIZE ACCRA"
            className="font-mono text-base"
          />
          <Button onClick={handleSend} className="btn-hover gap-2">
            <Send className="h-4 w-4" /> Send
          </Button>
        </div>

        {/* Response Terminal */}
        <div className="mb-8 overflow-hidden rounded-xl border bg-foreground text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-2 border-b border-primary-foreground/10 px-4 py-2">
            <Terminal className="h-4 w-4 text-lime" />
            <span className="text-xs font-medium text-primary-foreground/60">SMS Response</span>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed">
            {response ? (
              <pre className="whitespace-pre-wrap">{response}</pre>
            ) : (
              <span className="text-primary-foreground/40">Send a query above to see the response here...</span>
            )}
          </div>
        </div>

        {/* Command Reference Table */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-xl font-bold">Command Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-display font-bold">Command</th>
                  <th className="pb-3 text-left font-display font-bold">Description</th>
                  <th className="pb-3 text-left font-display font-bold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {commandReference.map(cmd => (
                  <tr key={cmd.command}>
                    <td className="py-3 font-mono font-medium text-primary">{cmd.command}</td>
                    <td className="py-3 text-muted-foreground">{cmd.desc}</td>
                    <td className="py-3 font-mono text-xs">{cmd.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSPage;
