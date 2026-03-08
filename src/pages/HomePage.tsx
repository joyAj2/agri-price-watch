import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Phone, BarChart3, ShieldCheck, Users, MapPin } from "lucide-react";
import { crops, markets, getLatestPrices, getCropName, getMarketName, getBestPrice } from "@/data/mockData";

const HomePage = () => {
  const topPrices = getLatestPrices().slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="container relative py-20 md:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground">
                <span className="animate-pulse text-lime">●</span> Live prices from {markets.length} markets
              </div>
              <h1 className="mb-6 font-display text-4xl font-black leading-tight text-primary-foreground md:text-6xl">
                Know Your Crop's Worth{" "}
                <span className="text-lime">Before You Sell</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-primary-foreground/70">
                Ghana's smartest agricultural price comparison platform. Real-time market prices,
                trend analysis, and SMS access — empowering farmers to earn more.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="btn-hover gradient-lime text-primary-foreground border-0 font-bold">
                  <Link to="/prices">
                    Check Prices Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="btn-hover border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/ussd">
                    <Phone className="h-4 w-4" /> Dial *384#
                  </Link>
                </Button>
              </div>
            </div>

            {/* Floating live price card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border bg-card/95 p-6 shadow-elevated backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">🔴 Live Prices</h3>
                  <span className="text-xs text-muted-foreground">Updated just now</span>
                </div>
                <div className="space-y-3">
                  {topPrices.map(p => {
                    const crop = crops.find(c => c.id === p.cropId);
                    return (
                      <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{crop?.emoji}</span>
                          <div>
                            <div className="font-semibold text-sm">{crop?.name}</div>
                            <div className="text-xs text-muted-foreground">{getMarketName(p.marketId)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-primary">GHS {p.price}</div>
                          <div className={`flex items-center gap-0.5 text-xs ${p.trend === "up" ? "text-primary" : p.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                            {p.trend === "up" ? <TrendingUp className="h-3 w-3" /> : p.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                            {p.changePercent}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="-mt-6 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: MapPin, value: String(markets.length), label: "Markets Tracked", color: "text-primary" },
              { icon: BarChart3, value: String(crops.length), label: "Crops Monitored", color: "text-primary" },
              { icon: Phone, value: "Free", label: "SMS & USSD", color: "text-lime" },
              { icon: ShieldCheck, value: "65%", label: "Middlemen Cut", color: "text-destructive" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-card p-4 text-center shadow-card animate-fade-in card-hover" style={{ animationDelay: `${i * 100}ms` }}>
                <s.icon className={`mx-auto mb-2 h-6 w-6 ${s.color}`} />
                <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S TOP PRICES */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">Today's Top Prices</h2>
            <p className="text-muted-foreground">Real-time crop prices across Ghana's biggest markets</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {crops.slice(0, 8).map(crop => {
              const best = getBestPrice(crop.id);
              const latestPrices = getLatestPrices(crop.id);
              const avgTrend = latestPrices[0]?.trend ?? "stable";
              return (
                <div key={crop.id} className="group overflow-hidden rounded-xl border bg-card shadow-card card-hover">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      avgTrend === "up" ? "bg-primary text-primary-foreground" : avgTrend === "down" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {avgTrend === "up" ? <TrendingUp className="h-3 w-3" /> : avgTrend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                      {latestPrices[0]?.changePercent ?? 0}%
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 text-xs text-muted-foreground">{crop.category}</div>
                    <h3 className="mb-1 font-display text-lg font-bold">{crop.name}</h3>
                    <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{crop.description}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Best Price</div>
                        <div className="font-display text-xl font-bold text-primary">GHS {best?.price ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">per {crop.unit}</div>
                      </div>
                      <Button size="sm" variant="outline" asChild className="btn-hover">
                        <Link to={`/compare?crop=${crop.id}`}>Compare</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="gradient-hero py-16 text-primary-foreground">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 font-display text-3xl font-bold md:text-4xl">
                3 Ways to Get Prices
              </h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "🌐 Web Platform", desc: "Browse prices, compare markets, and track trends online from any device." },
                  { step: "2", title: "📱 SMS Query", desc: "Text PRICE MAIZE ACCRA to 1234 — get instant reply with latest prices." },
                  { step: "3", title: "📞 USSD Menu", desc: "Dial *384# — navigate the menu to check any crop price. No internet needed." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 font-display text-lg font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-lg font-bold">{item.title}</h3>
                      <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=500&fit=crop"
                alt="Ghanaian farmer"
                className="rounded-2xl shadow-elevated"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-elevated">
                <div className="mb-1 font-mono text-xs text-muted-foreground">SMS Response</div>
                <div className="font-mono text-sm text-foreground">
                  Maize in Accra: <span className="font-bold text-primary">GHS 400/bag</span>
                  <br />Best market: Techiman GHS 420
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE BY REGION */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">Browse by Region</h2>
            <p className="text-muted-foreground">Explore prices from Ghana's major market regions</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {markets.map(market => (
              <Link
                key={market.id}
                to={`/prices?market=${market.id}`}
                className="group relative overflow-hidden rounded-xl card-hover"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={market.imageUrl}
                    alt={market.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-display text-xl font-bold text-primary-foreground">{market.location}</h3>
                  <p className="text-sm text-primary-foreground/70">{market.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
