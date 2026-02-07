import { useState } from "react";
import Layout from "@/components/Layout";
import { portfolioItems } from "@/data/portfolio";

const categories = ["Semua", "Logo", "Poster", "Banner", "Pamflet", "Sosmed", "Merchandise"];

const PortfolioPage = () => {
  const [active, setActive] = useState("Semua");
  const filtered = active === "Semua" ? portfolioItems : portfolioItems.filter((p) => p.category === active);

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-bold mb-3">Portfolio</h1>
          <p className="text-muted-foreground">Lihat hasil karya kami untuk berbagai brand dan bisnis.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="group glass-card rounded-xl overflow-hidden hover-lift">
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{item.category}</span>
                <h3 className="font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioPage;
