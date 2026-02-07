import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Service, categoryColors, categoryLabels } from "@/data/services";
import { useState } from "react";

const ServiceCard = ({ service }: { service: Service }) => {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const isInCart = items.some((i) => i.id === service.id);

  const handleAdd = () => {
    if (isInCart) return;
    addItem({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="glass-card rounded-lg p-5 hover-lift flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <Badge variant="outline" className={categoryColors[service.category]}>
            {categoryLabels[service.category]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-primary text-lg">{service.priceLabel}</span>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isInCart}
          className={isInCart ? "bg-success hover:bg-success" : ""}
        >
          {isInCart || added ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Ditambahkan
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1" /> Tambah
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
