import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import { portfolioItems } from "@/data/portfolio";
import { categoryLabels, categoryDescriptions } from "@/data/services";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Index = () => {
  const steps = [
    { icon: <Users className="h-6 w-6" />, title: "Pilih Layanan", desc: "Jelajahi katalog dan tambahkan ke keranjang" },
    { icon: <Clock className="h-6 w-6" />, title: "Konsultasi", desc: "Chat dengan tim kami sebelum pembayaran" },
    { icon: <Sparkles className="h-6 w-6" />, title: "Proses Desain", desc: "Tim kami mulai mengerjakan desain Anda" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Selesai!", desc: "Terima file desain final berkualitas tinggi" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <motion.div className="max-w-2xl" {...fadeUp}>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              ✨ Studio Desain untuk UMKM Indonesia
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Desain <span className="text-gradient">Profesional</span> dengan Harga Terjangkau
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Dari logo hingga konten sosial media — kami bantu UMKM dan brand berkembang tampil menarik tanpa biaya mahal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/layanan">
                <Button size="lg" className="gap-2">
                  Lihat Layanan <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" variant="outline">
                  Lihat Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages overview */}
      <section className="container py-16">
        <motion.div className="text-center mb-12" {...fadeUp}>
          <h2 className="text-3xl font-bold mb-3">Pilih Paket yang Sesuai</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tiga pilihan paket untuk setiap kebutuhan dan budget bisnis Anda.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["umkm", "standar", "profesional"] as const).map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card rounded-xl p-6 text-center hover-lift ${
                cat === "standar" ? "ring-2 ring-primary" : ""
              }`}
            >
              {cat === "standar" && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-2">
                  Populer
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{categoryLabels[cat]}</h3>
              <p className="text-sm text-muted-foreground mb-4">{categoryDescriptions[cat]}</p>
              <Link to="/layanan">
                <Button variant={cat === "standar" ? "default" : "outline"} className="w-full">
                  Lihat Detail
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/30 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-primary mb-1">Langkah {i + 1}</div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Portfolio Terbaru</h2>
          <Link to="/portfolio">
            <Button variant="ghost" className="gap-1">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioItems.slice(0, 4).map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden hover-lift">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <span className="text-xs text-primary-foreground/80">{item.category}</span>
                  <h4 className="text-sm font-semibold text-primary-foreground">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-3">Siap Tingkatkan Visual Brand Anda?</h2>
          <p className="mb-6 opacity-90 max-w-md mx-auto">
            Konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan desain Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/layanan">
              <Button size="lg" variant="secondary">
                Mulai Pesan Sekarang
              </Button>
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo%20KreasiVisual!"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Chat WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
