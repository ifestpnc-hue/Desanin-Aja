import { MessageCircle } from "lucide-react";

const WA_NUMBER = "6281234567890";
const WA_MESSAGE = "Halo KreasiVisual! Saya ingin konsultasi desain.";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-[hsl(142,71%,45%)] text-[hsl(0,0%,100%)] rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
    aria-label="Chat WhatsApp"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default WhatsAppButton;
