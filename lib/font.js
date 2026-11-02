import { Montserrat, Poppins, Roboto, Lora, Sora, Manrope, Saira } from "next/font/google";

// Title font: Montserrat
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Subtitle font: Poppins
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
  display: "swap",
});

// Body font: Roboto
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto",
  display: "swap",
});

// Quote font: Lora italic
export const playfair = Lora({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600"],
  variable: "--font-playfair",
  display: "swap",
});

// Display font for the redesigned pages
export const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

// UI / body font for the redesigned pages
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

// Brand wordmark font: Saira (from the IDEAL Developments logo files)
export const saira = Saira({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-saira",
  display: "swap",
});

export const fontVariables = [
  montserrat.variable,
  poppins.variable,
  roboto.variable,
  playfair.variable,
  sora.variable,
  manrope.variable,
  saira.variable,
].join(" ");
