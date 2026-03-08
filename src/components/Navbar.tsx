import { Link, useLocation } from "react-router-dom";
import { Sprout, BarChart3, GitCompare, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Sprout },
  { to: "/compare", label: "Compare Prices", icon: GitCompare },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/admin", label: "Admin", icon: Shield },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Agri<span className="text-gradient">Price</span> GH
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              variant={location.pathname === to ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to={to} className="gap-1.5">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "default" : "ghost"}
                asChild
                onClick={() => setOpen(false)}
                className="justify-start"
              >
                <Link to={to} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
