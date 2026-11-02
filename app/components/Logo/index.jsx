import BrandMark from "@components/BrandMark";

// The IDEAL Developments lockup, built to the spec in the logo files:
// mark | teal rule | IDEAL (Saira 800, +10%) over DEVELOPMENTS (Saira 600, +40%).
// Size it with a font-size class on `className`; everything scales in em.
export default function Logo({ className = "", tone = "brand", divider = true, animate = false, delay = 0 }) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-[0.45em] leading-none ${className}`}>
      <BrandMark animate={animate} delay={delay} tone={tone} className="h-[1.55em] w-auto shrink-0" />
      {divider && <span className={`h-[1.55em] w-[0.06em] min-w-px shrink-0 ${light ? "bg-[#6fd3c3]" : "bg-teal"}`} />}
      <span className="flex flex-col">
        <span className={`font-brand text-[1em] font-extrabold tracking-[0.1em] ${light ? "text-white" : "text-ink"}`}>
          IDEAL
        </span>
        <span
          className={`-mr-[0.4em] mt-[0.32em] font-brand text-[0.26em] font-semibold tracking-[0.4em] ${
            light ? "text-[#6fd3c3]" : "text-teal"
          }`}
        >
          DEVELOPMENTS
        </span>
      </span>
    </span>
  );
}
