import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
    site: "http://localhost:4321", // Cambiar a la URL de producción cuando se despliegue
    integrations: [react()],
    server: {
        port: 4321,
    },
});
