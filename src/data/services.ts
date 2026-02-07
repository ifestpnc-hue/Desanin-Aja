export interface Service {
  id: string;
  name: string;
  description: string;
  category: "umkm" | "standar" | "profesional";
  price: number;
  priceLabel: string;
}

export const services: Service[] = [
  // Paket UMKM
  { id: "umkm-pamflet", name: "Pamflet", description: "Desain pamflet simpel untuk promosi UMKM Anda", category: "umkm", price: 75000, priceLabel: "Rp 75.000" },
  { id: "umkm-poster", name: "Poster", description: "Poster eye-catching dengan layout bersih", category: "umkm", price: 100000, priceLabel: "Rp 100.000" },
  { id: "umkm-logo", name: "Logo", description: "Logo sederhana dan mudah diingat", category: "umkm", price: 150000, priceLabel: "Rp 150.000" },
  { id: "umkm-banner", name: "Banner", description: "Banner digital untuk media sosial", category: "umkm", price: 85000, priceLabel: "Rp 85.000" },
  { id: "umkm-merch", name: "Merchandise", description: "Desain kaos, mug, atau stiker dasar", category: "umkm", price: 120000, priceLabel: "Rp 120.000" },
  { id: "umkm-socmed", name: "Konten Sosmed", description: "1 desain feed/story Instagram", category: "umkm", price: 50000, priceLabel: "Rp 50.000" },

  // Paket Standar
  { id: "std-pamflet", name: "Pamflet", description: "Pamflet profesional dengan copywriting menarik", category: "standar", price: 200000, priceLabel: "Rp 200.000" },
  { id: "std-poster", name: "Poster", description: "Poster berkualitas tinggi dengan visual kuat", category: "standar", price: 250000, priceLabel: "Rp 250.000" },
  { id: "std-logo", name: "Logo", description: "Logo modern + 2 alternatif konsep", category: "standar", price: 500000, priceLabel: "Rp 500.000" },
  { id: "std-banner", name: "Banner", description: "Banner multi-platform (IG, FB, Web)", category: "standar", price: 200000, priceLabel: "Rp 200.000" },
  { id: "std-merch", name: "Merchandise", description: "Desain merchandise lengkap dengan mockup", category: "standar", price: 350000, priceLabel: "Rp 350.000" },
  { id: "std-socmed", name: "Konten Sosmed", description: "Paket 5 desain feed + 3 story", category: "standar", price: 400000, priceLabel: "Rp 400.000" },

  // Paket Profesional
  { id: "pro-pamflet", name: "Pamflet", description: "Pamflet premium dengan konsep kreatif eksklusif", category: "profesional", price: 500000, priceLabel: "Rp 500.000" },
  { id: "pro-poster", name: "Poster", description: "Poster high-end dengan ilustrasi kustom", category: "profesional", price: 750000, priceLabel: "Rp 750.000" },
  { id: "pro-logo", name: "Logo", description: "Branding lengkap: logo + guideline + variasi", category: "profesional", price: 1500000, priceLabel: "Rp 1.500.000" },
  { id: "pro-banner", name: "Banner", description: "Banner campaign lengkap semua platform", category: "profesional", price: 600000, priceLabel: "Rp 600.000" },
  { id: "pro-merch", name: "Merchandise", description: "Full merchandise kit + packaging design", category: "profesional", price: 1000000, priceLabel: "Rp 1.000.000" },
  { id: "pro-socmed", name: "Konten Sosmed", description: "Paket 15 desain + content calendar", category: "profesional", price: 1200000, priceLabel: "Rp 1.200.000" },
];

export const categoryLabels: Record<string, string> = {
  umkm: "Paket UMKM",
  standar: "Paket Standar",
  profesional: "Paket Profesional",
};

export const categoryDescriptions: Record<string, string> = {
  umkm: "Terjangkau untuk usaha kecil. Desain simpel, harga bersahabat.",
  standar: "Kualitas dan harga seimbang untuk bisnis yang sedang berkembang.",
  profesional: "Visual premium untuk brand yang serius soal identitas.",
};

export const categoryColors: Record<string, string> = {
  umkm: "bg-success/10 text-success border-success/20",
  standar: "bg-info/10 text-info border-info/20",
  profesional: "bg-primary/10 text-primary border-primary/20",
};
