export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

export const portfolioItems: PortfolioItem[] = [
  { id: "p1", title: "Branding Kopi Nusantara", category: "Logo", description: "Identitas visual lengkap untuk kedai kopi lokal", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop" },
  { id: "p2", title: "Poster Festival Kuliner", category: "Poster", description: "Poster event kuliner tahunan kota Bandung", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop" },
  { id: "p3", title: "Feed IG Toko Baju", category: "Sosmed", description: "Konten Instagram untuk brand fashion lokal", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop" },
  { id: "p4", title: "Banner Promo Ramadan", category: "Banner", description: "Campaign digital untuk promo Ramadan", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop" },
  { id: "p5", title: "Pamflet Kursus Online", category: "Pamflet", description: "Pamflet promosi platform edukasi online", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop" },
  { id: "p6", title: "Merchandise Band Indie", category: "Merchandise", description: "Desain kaos dan tote bag untuk band indie Jakarta", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop" },
  { id: "p7", title: "Logo Startup Fintech", category: "Logo", description: "Logo modern untuk startup teknologi keuangan", image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&h=400&fit=crop" },
  { id: "p8", title: "Social Media Resto Jepang", category: "Sosmed", description: "Paket konten bulanan restoran Jepang", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop" },
];
