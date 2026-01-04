import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

export default defineConfig({
    site: "https://POS-yoezequiel.vercel.app", // Cambiar a la URL de producción cuando se despliegue
    integrations: [react(), tailwind()],
    server: {
        port: 4321,
    },
});
