import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import VitePWA from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   manifest: {
    //     name: "HyvePay",
    //     short_name: "HyvePay",
    //     description:
    //       "Payments platform for automotive industry, sponsored by HyveTech",
    //     icons: [
    //       {
    //         src: "/hyvePay.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //     ],
    //   },
    // }),
  ],
});
