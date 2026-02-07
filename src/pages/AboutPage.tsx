import Layout from "@/components/Layout";
import { Heart, Target, Eye } from "lucide-react";

const AboutPage = () => (
  <Layout>
    <div className="container py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Tentang KreasiVisual</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Kami adalah studio desain grafis yang berdedikasi membantu UMKM dan brand Indonesia tampil profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Target className="h-6 w-6" />, title: "Misi", desc: "Membuat desain berkualitas terjangkau untuk semua skala bisnis di Indonesia." },
          { icon: <Eye className="h-6 w-6" />, title: "Visi", desc: "Menjadi partner desain pilihan utama bagi UMKM dan brand yang berkembang." },
          { icon: <Heart className="h-6 w-6" />, title: "Nilai", desc: "Transparansi, kualitas, dan kolaborasi dalam setiap proyek desain." },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-xl p-6 text-center hover-lift">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Kenapa Pilih Kami?</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Pengalaman:</strong> Tim kami terdiri dari desainer berpengalaman yang memahami kebutuhan visual bisnis lokal Indonesia.
          </p>
          <p>
            <strong className="text-foreground">Harga Transparan:</strong> Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk scope pekerjaan yang jelas.
          </p>
          <p>
            <strong className="text-foreground">Proses Jelas:</strong> Dari konsultasi hingga pengiriman file, setiap tahap dikomunikasikan dengan jelas.
          </p>
          <p>
            <strong className="text-foreground">Support UMKM:</strong> Kami menyediakan paket khusus UMKM dengan harga terjangkau tanpa mengurangi kualitas.
          </p>
        </div>
      </div>
    </div>
  </Layout>
);

export default AboutPage;
