import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { crops, markets } from "@/data/mockData";

const Footer = () => (
  <footer className="border-t bg-card py-12">
    <div className="container">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">AgriPrice GH</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Empowering Ghanaian farmers with real-time market intelligence. Know your crop's worth before you sell.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            SMS: <span className="font-mono font-semibold text-primary">PRICE MAIZE ACCRA</span> → 1234
          </p>
        </div>

        {/* Crops */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Crops</h4>
          <ul className="space-y-1.5">
            {crops.map(c => (
              <li key={c.id}>
                <Link to={`/compare?crop=${c.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {c.emoji} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Markets */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Markets</h4>
          <ul className="space-y-1.5">
            {markets.map(m => (
              <li key={m.id}>
                <Link to={`/prices?market=${m.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-foreground">Platform</h4>
          <ul className="space-y-1.5">
            <li><Link to="/prices" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Prices</Link></li>
            <li><Link to="/compare" className="text-sm text-muted-foreground hover:text-primary transition-colors">Compare Markets</Link></li>
            <li><Link to="/sms" className="text-sm text-muted-foreground hover:text-primary transition-colors">SMS Queries</Link></li>
            <li><Link to="/ussd" className="text-sm text-muted-foreground hover:text-primary transition-colors">USSD Access</Link></li>
            <li><Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Panel</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © 2025 AgriPrice GH. All rights reserved. Built for Ghanaian farmers.
      </div>
    </div>
  </footer>
);

export default Footer;
