import "./globals.css";
import { BRAND } from "@/brand.config.js";
import Shell from "@/components/Shell.jsx";

export const metadata = {
  title: `${BRAND.product} — he watches the chain`,
  description:
    "A live2d scout watching every Robinhood Chain launch so you don't have to. Parody / community project. Not affiliated with Robinhood or Vlad Tenev. DYOR.",
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0F0D" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
