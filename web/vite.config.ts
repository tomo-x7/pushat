import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.ts",
			injectManifest: { injectionPoint: undefined },
			manifest: {},
			injectRegister: false,
		}),
	],
	build: { minify: false },
});
