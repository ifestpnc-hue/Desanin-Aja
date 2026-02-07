import { Link } from "react-router-dom";
import { Palette, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/30">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
            <Palette className="h-5 w-5 text-primary" />
            <span className="text-gradient">KreasiVisual</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Studio desain grafis yang membantu UMKM dan brand berkembang dengan visual yang menarik dan profesional.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Navigasi</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/layanan" className="hover:text-primary transition-colors">Layanan</Link>
            <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/cara-kerja" className="hover:text-primary transition-colors">Cara Kerja</Link>
            <Link to="/tentang" className="hover:text-primary transition-colors">Tentang Kami</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Layanan</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Desain Logo</span>
            <span>Poster & Pamflet</span>
            <span>Konten Sosial Media</span>
            <span>Merchandise</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Kontak</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> halo@kreasivisual.id</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +62 812-3456-7890</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Jakarta, Indonesia</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2026 KreasiVisual. Semua hak dilindungi.
      </div>
    </div>
  </footer>
);

export default Footer;
