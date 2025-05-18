import React from "react";
import { Caveat, Poppins } from "next/font/google";

// Font configurations
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Metadata configuration
export const metadata = {
  title: "Explore Destinations | Modern Tourism",
  description: "Discover breathtaking destinations around the world",
  generator: "v0.dev",
};

// Root Layout Component
function RootLayout({ children }) {
  return (
    <html lang="en" className={`${caveat.variable} ${poppins.variable}`}>
      <body className="font-poppins">{children}</body>
    </html>
  );
}

export default RootLayout;
