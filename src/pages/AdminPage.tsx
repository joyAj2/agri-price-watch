import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Pencil, Trash2, Save } from "lucide-react";
import { crops, markets, getLatestPrices, getCropName, getMarketName } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [priceCrop, setPriceCrop] = useState("");
  const [priceMarket, setPriceMarket] = useState("");
  const [priceValue, setPriceValue] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      toast({ title: "Welcome back, Admin!", description: "You are now logged in." });
    } else {
      toast({ title: "Login failed", description: "Invalid credentials. Try admin / admin123", variant: "destructive" });
    }
  };

  const handleAddPrice = () => {
    if (!priceCrop || !priceMarket || !priceValue) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Price updated!", description: `${getCropName(priceCrop)} in ${getMarketName(priceMarket)}: GHS ${priceValue}` });
    setPriceCrop(""); setPriceMarket(""); setPriceValue("");
  };

  if (!isLoggedIn) {
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
              <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button type="submit" className="w-full btn-hover">Sign In</Button>
              <p className="text-center text-xs text-muted-foreground">Demo: admin / admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestPrices = getLatestPrices();

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage crops, markets, and prices</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
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
                <CardDescription>Add or update a crop price for a specific market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Select value={priceCrop} onValueChange={setPriceCrop}>
                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>
                      {crops.map(c => (<SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Select value={priceMarket} onValueChange={setPriceMarket}>
                    <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
                    <SelectContent>
                      {markets.map(m => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Price (GHS)" value={priceValue} onChange={e => setPriceValue(e.target.value)} />
                  <Button onClick={handleAddPrice} className="btn-hover gap-2"><Save className="h-4 w-4" /> Save Price</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="font-display">Crops</CardTitle><CardDescription>{crops.length} crops in system</CardDescription></div>
                <Button size="sm" className="gap-1 btn-hover"><Plus className="h-3 w-3" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {crops.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.imageUrl} alt={c.name} className="h-10 w-10 rounded-lg object-cover" />
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
                <div><CardTitle className="font-display">Markets</CardTitle><CardDescription>{markets.length} markets tracked</CardDescription></div>
                <Button size="sm" className="gap-1 btn-hover"><Plus className="h-3 w-3" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {markets.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-3">
                      <div><div className="font-semibold">{m.name}</div><div className="text-xs text-muted-foreground">{m.region} · {m.location}</div></div>
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
              <CardHeader><CardTitle className="font-display">Price History</CardTitle><CardDescription>Recent price entries</CardDescription></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b">
                      <th className="pb-3 text-left font-display font-bold">Crop</th>
                      <th className="pb-3 text-left font-display font-bold">Market</th>
                      <th className="pb-3 text-left font-display font-bold">Price</th>
                      <th className="pb-3 text-left font-display font-bold">Date</th>
                      <th className="pb-3 text-right font-display font-bold">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {latestPrices.slice(0, 20).map(p => (
                        <tr key={p.id}>
                          <td className="py-3">{getCropName(p.cropId)}</td>
                          <td className="py-3">{getMarketName(p.marketId)}</td>
                          <td className="py-3 font-display font-bold text-primary">GHS {p.price}</td>
                          <td className="py-3 text-muted-foreground">{p.date}</td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
