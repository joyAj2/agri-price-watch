import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Pencil, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAllCrops, useAllMarkets, useLatestPrices, useAddPrice } from "@/hooks/useSupabaseData";
import type { User } from "@supabase/supabase-js";

const AdminPage = () => {
  const { toast } = useToast();

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Price form
  const [priceCrop, setPriceCrop] = useState("");
  const [priceMarket, setPriceMarket] = useState("");
  const [priceValue, setPriceValue] = useState("");

  // Data
  const { data: crops = [] } = useAllCrops();
  const { data: markets = [] } = useAllMarkets();
  const { data: latestPrices = [] } = useLatestPrices();
  const addPrice = useAddPrice();

  // Set up auth listener BEFORE getSession
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { data } = await supabase.rpc("has_role", { _user_id: u.id, _role: "admin" });
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
      setAuthChecked(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSignInLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
  };

  const handleAddPrice = async () => {
    if (!priceCrop || !priceMarket || !priceValue) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    const crop = crops.find(c => c.id === priceCrop);
    const market = markets.find(m => m.id === priceMarket);
    try {
      await addPrice.mutateAsync({
        crop_id: priceCrop,
        market_id: priceMarket,
        price: parseFloat(priceValue),
        unit: crop?.unit ?? "",
        date: new Date().toISOString().split("T")[0],
        trend: "stable",
        change_percent: 0,
      });

      toast({
        title: "✅ Price saved!",
        description: `${crop?.name} in ${market?.name}: GHS ${priceValue} — Homepage updated live.`,
      });

      // Trigger Africa's Talking SMS alert (non-blocking)
      supabase.functions.invoke("send-sms-alert", {
        body: {
          cropName: crop?.name ?? "",
          marketName: market?.name ?? "",
          price: parseFloat(priceValue),
          unit: crop?.unit ?? "",
          // No `to` field = preview/sandbox mode until AT_API_KEY is configured
        },
      }).then(({ data, error }) => {
        if (error) {
          console.warn("SMS alert skipped:", error.message);
        } else if (data?.mode === "preview") {
          console.info("SMS preview:", data.message);
        } else {
          toast({ title: "📱 SMS alert sent!", description: "Farmers subscribed to this crop have been notified." });
        }
      });

      setPriceCrop(""); setPriceMarket(""); setPriceValue("");
    } catch (err: unknown) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (!authChecked) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Login form
  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center py-8">
        <Card className="w-full max-w-sm shadow-elevated">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to manage AgriPrice GH</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full btn-hover" disabled={signInLoading}>
                {signInLoading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 py-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Shield className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Your account does not have admin privileges.</p>
        <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Manage crops, markets, and prices · <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="prices">
          <TabsList className="mb-6">
            <TabsTrigger value="prices">Update Prices</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>

          <TabsContent value="prices">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">Update Price</CardTitle>
                <CardDescription>Add a new crop price entry for a specific market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Select value={priceCrop} onValueChange={setPriceCrop}>
                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>
                      {crops.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={priceMarket} onValueChange={setPriceMarket}>
                    <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
                    <SelectContent>
                      {markets.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Price (GHS)"
                    value={priceValue}
                    onChange={e => setPriceValue(e.target.value)}
                  />
                  <Button
                    onClick={handleAddPrice}
                    className="btn-hover gap-2"
                    disabled={addPrice.isPending}
                  >
                    <Save className="h-4 w-4" />
                    {addPrice.isPending ? "Saving…" : "Save Price"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Crops</CardTitle>
                  <CardDescription>{crops.length} crops in system</CardDescription>
                </div>
                <Button size="sm" className="gap-1 btn-hover"><Plus className="h-3 w-3" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {crops.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.image_url} alt={c.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold">{c.emoji} {c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.category} · per {c.unit}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Markets</CardTitle>
                  <CardDescription>{markets.length} markets tracked</CardDescription>
                </div>
                <Button size="sm" className="gap-1 btn-hover"><Plus className="h-3 w-3" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {markets.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.region} · {m.location}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">Price History</CardTitle>
                <CardDescription>Latest price entry per crop and market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left font-display font-bold">Crop</th>
                        <th className="pb-3 text-left font-display font-bold">Market</th>
                        <th className="pb-3 text-left font-display font-bold">Price</th>
                        <th className="pb-3 text-left font-display font-bold">Date</th>
                        <th className="pb-3 text-right font-display font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {latestPrices.slice(0, 32).map(p => {
                        const crop = crops.find(c => c.id === p.crop_id);
                        const market = markets.find(m => m.id === p.market_id);
                        return (
                          <tr key={p.id}>
                            <td className="py-3">{crop?.emoji} {crop?.name}</td>
                            <td className="py-3">{market?.name}</td>
                            <td className="py-3 font-display font-bold text-primary">GHS {p.price}</td>
                            <td className="py-3 text-muted-foreground">{p.date}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
