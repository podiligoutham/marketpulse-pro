import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,

        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            if (!req.url?.includes("/stream")) {
              return;
            }

            console.log("[SSE Proxy] Stream connected:", req.url);

            let upstreamFinished = false;

            proxyRes.on("end", () => {
              upstreamFinished = true;
              console.log("[SSE Proxy] Upstream ended");

              if (!res.writableEnded) {
                res.end();
              }
            });

            proxyRes.on("close", () => {
              console.log("[SSE Proxy] Upstream closed");

              if (!upstreamFinished && !res.destroyed) {
                res.destroy();
              }
            });

            proxyRes.on("error", (error) => {
              console.error("[SSE Proxy] Upstream error:", error.message);

              if (!res.destroyed) {
                res.destroy(error);
              }
            });
          });

          proxy.on("error", (error, req) => {
            console.error("[Vite Proxy] Error:", req.url, error.message);
          });
        },
      },
    },
  },
});
