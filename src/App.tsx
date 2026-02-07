import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import ChatButton from "@/components/ChatButton";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import PaymentPage from "./pages/PaymentPage";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/keranjang" element={<CartPage />} />
            <Route path="/pesan" element={<OrderPage />} />
            <Route path="/pembayaran/:orderCode" element={<PaymentPage />} />
            <Route path="/status-pesanan" element={<OrderStatusPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cara-kerja" element={<HowItWorksPage />} />
            <Route path="/tentang" element={<AboutPage />} />
            <Route path="/kontak" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatButton />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
