import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, MapPin, BarChart3, Phone } from "lucide-react";
import { crops, markets, getLatestPrices, getCropName, getMarketName } from "@/data/mockData";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Prices",
    desc: "Access up-to-date crop prices from major markets across all 16 regions of Ghana.",
  },
  {
    icon: MapPin,
    title: "Market Comparison",
    desc: "Compare prices across markets to find the best deals for buying or selling your produce.",
  },
  {
    icon: BarChart3,
    title: "Trend Analytics",
    desc: "Track price trends over time to make informed decisions about when to sell.",
  },
  {
    icon: Phone,
    title: "SMS & USSD Access",
    desc: "No internet? Send SMS like 'PRICE MAIZE ACCRA' or dial *123# for instant prices.",
  },
];

const HomePage = () => {
  const topPrices = getLatestPrices().slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <span className="animate-pulse">🟢</span> Live market data from {markets.length} markets
            </div>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-6xl">
              Know Your Crop's Worth{" "}
              <span className="text-gradient">Before You Sell</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Ghana's smartest agricultural price comparison platform. Real-time market prices, 
              trend analysis, and SMS access  empowering farmers to earn more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="lg" asChild>
                <Link to="/compare">
                  Compare Prices <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10">
        <div className="container">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: `${crops.length}`, label: "Crop Types" },
              { value: `${markets.length}`, label: "Markets" },
              { value: "16", label: "Regions" },
              { value: "24/7", label: "SMS Access" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-card p-4 text-center shadow-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="font-display text-2xl font-bold text-primary md:text-3xl">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Built for Ghanaian Farmers
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're in Accra or a rural farm, get the market intelligence you need.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-leaf-light text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Prices Preview */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Latest Market Prices</h2>
              <p className="text-muted-foreground">Most recent prices from across Ghana</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/compare">View All</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topPrices.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-card">
                <span className="text-2xl">{crops.find(c => c.id === p.cropId)?.image}</span>
                <div className="flex-1">
                  <div className="font-semibold">{getCropName(p.cropId)}</div>
                  <div className="text-xs text-muted-foreground">{getMarketName(p.marketId)}</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-primary">GHS {p.price}</div>
                  <div className="text-xs text-muted-foreground">per {p.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 AgriPrice GH. Empowering Ghanaian farmers with market intelligence.</p>
          <p className="mt-1">SMS: Send <span className="font-mono font-semibold text-primary">PRICE MAIZE ACCRA</span> to 1234</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
