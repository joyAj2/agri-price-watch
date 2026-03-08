import { useState } from "react";
import { crops, markets, prices, getCropName, getMarketName } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Package, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const { toast } = useToast();
  const [newCrop, setNewCrop] = useState({ name: "", category: "" });
  const [newPrice, setNewPrice] = useState({ cropId: "", marketId: "", price: "", unit: "bag" });

  const handleAddCrop = () => {
    if (!newCrop.name || !newCrop.category) return;
    toast({ title: "Crop Added", description: `${newCrop.name} has been added to the system.` });
    setNewCrop({ name: "", category: "" });
  };

  const handleAddPrice = () => {
    if (!newPrice.cropId || !newPrice.marketId || !newPrice.price) return;
    toast({ title: "Price Updated", description: `Price entry has been recorded.` });
    setNewPrice({ cropId: "", marketId: "", price: "", unit: "bag" });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Admin Panel</h1>
        <p className="text-muted-foreground">Manage crops, markets, and price data</p>
      </div>

      <Tabs defaultValue="prices" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="prices" className="gap-1.5">
            <DollarSign className="h-4 w-4" /> Prices
          </TabsTrigger>
          <TabsTrigger value="crops" className="gap-1.5">
            <Package className="h-4 w-4" /> Crops
          </TabsTrigger>
          <TabsTrigger value="markets" className="gap-1.5">
            <MapPin className="h-4 w-4" /> Markets
          </TabsTrigger>
        </TabsList>

        {/* Prices Tab */}
        <TabsContent value="prices" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold">Add Price Entry</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Crop</Label>
                <Select value={newPrice.cropId} onValueChange={v => setNewPrice(p => ({ ...p, cropId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                  <SelectContent>
                    {crops.map(c => <SelectItem key={c.id} value={c.id}>{c.image} {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Market</Label>
                <Select value={newPrice.marketId} onValueChange={v => setNewPrice(p => ({ ...p, marketId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
                  <SelectContent>
                    {markets.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (GHS)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 400"
                  value={newPrice.price}
                  onChange={e => setNewPrice(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddPrice} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Price
                </Button>
              </div>
            </div>
          </div>

          {/* Recent prices table */}
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Crop</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Price (GHS)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.slice(0, 20).map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{getCropName(p.cropId)}</TableCell>
                    <TableCell>{getMarketName(p.marketId)}</TableCell>
                    <TableCell className="font-display font-bold">{p.price}</TableCell>
                    <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Crops Tab */}
        <TabsContent value="crops" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold">Add New Crop</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Crop Name</Label>
                <Input
                  placeholder="e.g. Millet"
                  value={newCrop.name}
                  onChange={e => setNewCrop(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="e.g. Grains"
                  value={newCrop.category}
                  onChange={e => setNewCrop(p => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddCrop} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Crop
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Crop</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crops.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.image} {c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Market</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markets.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.region}</TableCell>
                    <TableCell className="text-muted-foreground">{m.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
