import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dev server dari perangkat lain di jaringan lokal
  // (buka undangan langsung dari HP). IP PC ini + rentang LAN umum.
  allowedDevOrigins: [
    "192.168.100.8", // Wi-Fi (IP utama PC ini)
    "192.168.192.2", // Ethernet 3
    "192.168.56.1", // Ethernet 2 (VirtualBox)
    "100.72.2.73", // Tailscale
    "192.168.100.101", // perangkat lain di jaringan yang sama
    "192.168.100.*", // semua perangkat di subnet Wi-Fi
    "192.168.1.*",
    "192.168.196.38"
  ],
  // Batasi root Turbopack ke folder proyek ini saja, supaya package-lock.json
  // milik folder induk tidak ikut terbaca.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Next.js 16 membatasi quality ke [75] saja secara default; nilai lain
    // akan dibulatkan. Daftarkan di sini agar quality={85}/{90} benar-benar dipakai.
    qualities: [50, 75, 85, 90, 100],
  },
};

export default nextConfig;
