import { Link, useLocation } from "react-router-dom";
import { Sprout, Search, Bell, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/prices", label: "Prices" },
  { to: "/compare", label: "Compare" },
  { to: "/sms", label: "SMS" },
  { to: "/ussd", label: "USSD" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="gradient-hero py-2 text-center text-sm font-medium text-primary-foreground">
        📱 Dial <span className="font-display font-bold">*384#</span> or SMS{" "}
        <span className="font-mono font-bold">PRICE MAIZE ACCRA</span> to 1234 for instant prices
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="container flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Agri<span className="text-gradient">Price</span> GH
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 md:block">
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search crops, markets..."
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                asChild
                className="btn-hover"
              >
                <Link to={to}>{label}</Link>
              </Button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                3
              </span>
            </Button>
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex btn-hover">
              <Link to="/admin" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t bg-card p-4 md:hidden">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search crops, markets..." className="pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {[...navItems, { to: "/admin", label: "Admin" }].map(({ to, label }) => (
                <Button
                  key={to}
                  variant={location.pathname === to ? "default" : "ghost"}
                  asChild
                  onClick={() => setOpen(false)}
                  className="justify-start"
                >
                  <Link to={to}>{label}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
