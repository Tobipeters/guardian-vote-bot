import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const title = "Guardian Vote Bot";
const description = "Guard your vote with this bot";

export const metadata = {
  title,
  description,
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title,
    description,
    images: ["/bot.png"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
