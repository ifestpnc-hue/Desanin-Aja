export const ORDER_STATUSES = [
  "Menunggu Pembayaran",
  "Menunggu Pembayaran DP",
  "Sedang Diverifikasi",
  "Diverifikasi",
  "Diproses",
  "Menunggu Pembayaran Akhir",
  "Selesai",
  "Dibatalkan",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const statusColors: Record<string, string> = {
  "Menunggu Pembayaran": "bg-warning/10 text-warning border-warning/20",
  "Menunggu Pembayaran DP": "bg-warning/10 text-warning border-warning/20",
  "Sedang Diverifikasi": "bg-info/10 text-info border-info/20",
  "Diverifikasi": "bg-success/10 text-success border-success/20",
  "Diproses": "bg-primary/10 text-primary border-primary/20",
  "Menunggu Pembayaran Akhir": "bg-warning/10 text-warning border-warning/20",
  "Selesai": "bg-success/10 text-success border-success/20",
  "Dibatalkan": "bg-destructive/10 text-destructive border-destructive/20",
};

export const statusDescriptions: Record<string, string> = {
  "Menunggu Pembayaran": "Silakan selesaikan pembayaran untuk memulai proses desain.",
  "Menunggu Pembayaran DP": "Silakan bayar DP 50% untuk memulai proses desain.",
  "Sedang Diverifikasi": "Pembayaran sedang diverifikasi oleh admin.",
  "Diverifikasi": "Pembayaran telah diverifikasi. Pesanan segera diproses.",
  "Diproses": "Desain sedang dikerjakan oleh tim kami.",
  "Menunggu Pembayaran Akhir": "Desain hampir selesai. Silakan lunasi sisa pembayaran.",
  "Selesai": "Pesanan selesai! File desain telah dikirim.",
  "Dibatalkan": "Pesanan telah dibatalkan.",
};
