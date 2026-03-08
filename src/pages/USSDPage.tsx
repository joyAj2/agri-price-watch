import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { crops, markets, getLatestPrices, getBestPrice } from "@/data/mockData";

type USSDStep = "main" | "select-crop" | "view-prices";

const USSDPage = () => {
  const [step, setStep] = useState<USSDStep>("main");
  const [selectedCropId, setSelectedCropId] = useState("");
  const [inputValue, setInputValue] = useState("");

  const getScreenContent = () => {
    if (step === "main") {
      return {
        title: "AgriPrice GH",
        body: "Welcome to AgriPrice GH\n\n1. Check Crop Price\n2. Compare Markets\n3. Price Alerts\n0. Exit",
      };
    }
    if (step === "select-crop") {
      const list = crops.map((c, i) => `${i + 1}. ${c.emoji} ${c.name}`).join("\n");
      return {
        title: "Select Crop",
        body: `Choose a crop:\n\n${list}`,
      };
    }
    if (step === "view-prices") {
      const crop = crops.find(c => c.id === selectedCropId);
      if (!crop) return { title: "Error", body: "Crop not found." };
      const prices = getLatestPrices(crop.id);
      const best = getBestPrice(crop.id);
      const lines = markets.map(m => {
        const p = prices.find(pr => pr.marketId === m.id);
        const isBest = p?.id === best?.id;
        return `${isBest ? "✓" : " "} ${m.location}: GHS ${p?.price ?? "N/A"}`;
      }).join("\n");
      return {
        title: `${crop.emoji} ${crop.name} Prices`,
        body: `${lines}\n\n✓ = Best Price\n\n0. Back  00. Main Menu`,
      };
    }
    return { title: "", body: "" };
  };

  const handleInput = (val: string) => {
    if (step === "main") {
      if (val === "1") { setStep("select-crop"); }
      if (val === "2") { setStep("select-crop"); }
    } else if (step === "select-crop") {
      const idx = parseInt(val) - 1;
      if (idx >= 0 && idx < crops.length) {
        setSelectedCropId(crops[idx].id);
        setStep("view-prices");
      }
    } else if (step === "view-prices") {
      if (val === "0") setStep("select-crop");
      if (val === "00") setStep("main");
    }
    setInputValue("");
  };

  const screen = getScreenContent();

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Phone Mockup */}
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-4 text-center">
              <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">📞 USSD Menu</h1>
              <p className="text-muted-foreground">Interactive simulation of the *384# experience</p>
            </div>

            {/* iPhone-style frame */}
            <div className="mx-auto w-72 overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-foreground p-2 shadow-elevated">
              {/* Notch */}
              <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-foreground" />
              {/* Screen */}
              <div className="overflow-hidden rounded-[2rem] bg-card">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 text-[10px] text-muted-foreground">
                  <span>MTN GH</span>
                  <span>*384#</span>
                  <span>●●● 4G</span>
                </div>
                {/* USSD content */}
                <div className="min-h-[360px] p-4">
                  <div className="mb-3 font-display text-sm font-bold text-primary">{screen.title}</div>
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">{screen.body}</pre>
                </div>
                {/* Input area */}
                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleInput(inputValue)}
                      className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter number..."
                    />
                    <button
                      onClick={() => handleInput(inputValue)}
                      className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step navigation */}
            <div className="mt-4 flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={step === "main"}
                onClick={() => {
                  if (step === "view-prices") setStep("select-crop");
                  else setStep("main");
                }}
                className="gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStep("main")}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h2 className="mb-2 font-display text-2xl font-bold">
                <Phone className="mb-1 mr-2 inline h-6 w-6 text-primary" />
                Dial *384#
              </h2>
              <p className="mb-4 text-muted-foreground">
                Access crop prices from any phone — no internet or smartphone required.
              </p>

              <div className="space-y-3">
                {[
                  "Works on any phone (feature phones included)",
                  "No data or internet connection needed",
                  "Available in English, Twi, and Hausa",
                  "Free — no charges for using the service",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow Diagram */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-bold">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Dial *384#", desc: "Open the USSD menu from any phone" },
                  { step: "2", title: "Select Option", desc: "Choose 'Check Prices' from the menu" },
                  { step: "3", title: "Pick a Crop", desc: "Select from the list of available crops" },
                  { step: "4", title: "View Prices", desc: "See prices across all markets instantly" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    {i < 3 && <ArrowRight className="ml-auto mt-1 h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USSDPage;
