import Layout from "@/components/Layout";
import { Users, Clock, CheckCircle, MessageCircle, CreditCard, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "1. Pilih Layanan",
    description: "Jelajahi katalog layanan kami dan pilih paket yang sesuai dengan kebutuhan dan budget bisnis Anda. Tambahkan ke keranjang.",
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: "2. Konsultasi",
    description: "Hubungi admin melalui WhatsApp atau chat untuk mendiskusikan kebutuhan desain Anda. Langkah ini wajib sebelum pembayaran.",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "3. Pembayaran",
    description: "Setelah konsultasi disetujui, lakukan pembayaran sesuai paket. Paket UMKM bayar penuh, Standar & Profesional bisa DP 50%.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "4. Proses Desain",
    description: "Tim desainer kami mulai mengerjakan pesanan. Anda bisa memantau progres melalui halaman Status Pesanan.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "5. Review & Revisi",
    description: "Anda akan menerima draft desain untuk direview. Revisi minor termasuk dalam paket. Revisi major dikenakan biaya tambahan.",
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "6. Selesai!",
    description: "Terima file desain final dalam format yang Anda butuhkan (PNG, JPG, PDF, AI, dll). Siap digunakan!",
  },
];

const HowItWorksPage = () => (
  <Layout>
    <div className="container py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Cara Kerja</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Proses pemesanan desain yang simpel dan transparan. Dari konsultasi hingga desain final.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="glass-card rounded-xl p-6 flex gap-5 items-start hover-lift">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Pertanyaan Umum</h2>
        <div className="space-y-4">
          {[
            {
              q: "Berapa lama proses desain?",
              a: "Tergantung jenis layanan. Logo biasanya 3-7 hari, konten sosmed 1-3 hari, branding lengkap 7-14 hari.",
            },
            {
              q: "Berapa kali revisi yang bisa dilakukan?",
              a: "Paket UMKM sudah termasuk scope tetap tanpa revisi. Paket Standar & Profesional mendapat revisi minor gratis. Revisi major dikenakan biaya tambahan.",
            },
            {
              q: "Format file apa yang dikirim?",
              a: "Kami mengirim file dalam format PNG, JPG, PDF, dan file mentah (AI/PSD) untuk paket Standar & Profesional.",
            },
            {
              q: "Bisa request desain custom?",
              a: "Tentu! Hubungi admin kami melalui WhatsApp untuk mendiskusikan kebutuhan khusus Anda.",
            },
            {
              q: "Apakah harus konsultasi dulu?",
              a: "Ya, konsultasi wajib dilakukan sebelum pembayaran agar kami bisa memahami kebutuhan desain Anda dengan baik.",
            },
          ].map((faq, i) => (
            <div key={i} className="glass-card rounded-lg p-5">
              <h4 className="font-semibold mb-2">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);

export default HowItWorksPage;
