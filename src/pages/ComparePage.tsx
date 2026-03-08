import { useState, useMemo } from "react";
import { crops, markets, getLatestPrices, getCropName, getMarketName } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter } from "lucide-react";

const ComparePage = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredPrices = useMemo(() => {
    const data = getLatestPrices(
      selectedCrop !== "all" ? selectedCrop : undefined,
      selectedMarket !== "all" ? selectedMarket : undefined
    );
    return data.sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);
  }, [selectedCrop, selectedMarket, sortAsc]);

  // Compute min/max for highlighting
  const priceValues = filteredPrices.map(p => p.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Compare Prices</h1>
        <p className="text-muted-foreground">Find the best market prices for your crops</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {crops.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.image} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Markets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Markets</SelectItem>
            {markets.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredPrices.length} price entries
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Crop</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Region</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="flex items-center gap-1">
                  Price (GHS)
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrices.map((p) => {
              const crop = crops.find(c => c.id === p.cropId);
              const market = markets.find(m => m.id === p.marketId);
              const isMin = p.price === minPrice && priceValues.length > 1;
              const isMax = p.price === maxPrice && priceValues.length > 1;

              return (
                <TableRow key={p.id} className="transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <span className="mr-2">{crop?.image}</span>
                    {crop?.name}
                  </TableCell>
                  <TableCell>{market?.name}</TableCell>
                  <TableCell className="text-muted-foreground">{market?.region}</TableCell>
                  <TableCell>
                    <span className="font-display font-bold">
                      {p.price}
                    </span>
                    {isMin && <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">Lowest</Badge>}
                    {isMax && <Badge variant="secondary" className="ml-2 text-xs bg-destructive/10 text-destructive">Highest</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">per {p.unit}</TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComparePage;
