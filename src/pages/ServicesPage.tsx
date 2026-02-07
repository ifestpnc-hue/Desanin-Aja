import { useState } from "react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { services, categoryLabels, categoryDescriptions, categoryColors } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info } from "lucide-react";

type Category = "semua" | "umkm" | "standar" | "profesional";

const ServicesPage = () => {
  const [active, setActive] = useState<Category>("semua");

  const filtered = active === "semua" ? services : services.filter((s) => s.category === active);

  const tabs: { key: Category; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "umkm", label: "Paket UMKM" },
    { key: "standar", label: "Paket Standar" },
    { key: "profesional", label: "Paket Profesional" },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-bold mb-3">Katalog Layanan</h1>
          <p className="text-muted-foreground">
            Pilih layanan desain yang Anda butuhkan. Setiap paket disesuaikan dengan kebutuhan dan budget yang berbeda.
          </p>
        </div>

        {/* Payment info */}
        <div className="glass-card rounded-lg p-4 mb-6 flex gap-3 items-start">
          <Info className="h-5 w-5 text-info mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Ketentuan Pembayaran:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Paket UMKM:</strong> Bayar penuh di muka. Tanpa revisi tambahan.</li>
              <li>• <strong>Paket Standar & Profesional:</strong> DP 50% atau bayar penuh. Revisi major dikenakan biaya tambahan.</li>
            </ul>
          </div>
        </div>

        {/* Consultation notice */}
        <div className="rounded-lg bg-accent border border-primary/20 p-4 mb-8 flex gap-3 items-center">
          <AlertCircle className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-medium text-accent-foreground">
            ⚠️ Wajib konsultasi dengan admin sebelum melakukan pembayaran.{" "}
            <a
              href="/chat"
              className="underline text-primary"
            >
              Chat Admin Sekarang
            </a>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category descriptions */}
        {active !== "semua" && (
          <div className="mb-6">
            <Badge variant="outline" className={`${categoryColors[active]} mb-2`}>
              {categoryLabels[active]}
            </Badge>
            <p className="text-sm text-muted-foreground">{categoryDescriptions[active]}</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;
