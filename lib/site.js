export const PHONE_DISPLAY = "0339 9911333";
export const PHONE_INTL = "+92 339 9911333";
export const PHONE_E164 = "+923399911333";
export const PHONE_TEL = `tel:${PHONE_E164}`;
export const WHATSAPP_CHAT = "https://wa.me/923399911333";
export const EMAIL = "Idealconstructionsic@gmail.com";
export const ADDRESS = "House 723, E Block, Multigardens B-17, Islamabad";
export const HOURS = "Mon–Fri: 9AM–6PM";
export const WHATSAPP_LINK =
  `${WHATSAPP_CHAT}?text=Hello%2C%20I%20want%20a%20quote%20for%20construction%20work`;

export const whatsappFor = (title) =>
  `${WHATSAPP_CHAT}?text=${encodeURIComponent(`Assalam o Alaikum, I'd like to know more about your ${title} service.`)}`;

export const whatsappForProject = (title) =>
  `${WHATSAPP_CHAT}?text=${encodeURIComponent(`Assalam o Alaikum, I'd like to build a home like "${title}". Please share details.`)}`;

// Google cannot find House 723 by its address, so the map centres on E Block, Multigardens B-17.
// Swap in the exact coordinates once the office has a pin of its own.
const MAP_CENTER = "33.682741,72.793101";
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_CENTER}`;
export const MAP_EMBED = `https://maps.google.com/maps?ll=${MAP_CENTER}&z=16&output=embed`;
export const HOURS_ROWS = [
  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];
