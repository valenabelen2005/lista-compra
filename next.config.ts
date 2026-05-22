import type { NextConfig } from "next";
import os from "os";

// Detecta automáticamente las IPs locales para permitir acceso desde la red local
function getIPsLocales(): string[] {
  const ips = ["localhost"];
  if (process.env.NODE_ENV === "development") {
    const interfaces = os.networkInterfaces();
    for (const lista of Object.values(interfaces)) {
      for (const iface of lista ?? []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }
  }
  return ips;
}

const nextConfig: NextConfig = {
  // Permite acceso al dev server (HMR) desde dispositivos en la red local
  allowedDevOrigins: getIPsLocales(),

  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        {
          key: " Cache-Control",
          value: " no-cache, no-store, must-revalidate",
        },
        {
          key: " Service-Worker-Allowed",
          value: "/",
        },
      ],
    },
  ],
};

export default nextConfig;
