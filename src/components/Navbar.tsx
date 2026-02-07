import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Palette } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Palette className="h-6 w-6 text-primary" />
          <span className="text-gradient">KreasiVisual</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary bg-accent"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/keranjang" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/status-pesanan" className="hidden md:block">
            <Button variant="outline" size="sm">
              Cek Pesanan
            </Button>
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/status-pesanan" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Cek Pesanan
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
