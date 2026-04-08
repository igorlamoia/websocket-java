import { ReactNode } from "react";

type TypographyProps = {
  as?: "p" | "h1" | "h2" | "span" | "strong";
  variant:
    | "sectionKicker"
    | "sectionTitle"
    | "heroTitle"
    | "heroBody"
    | "metricLabel"
    | "metricValue";
  children: ReactNode;
};

export function Typography(props: TypographyProps) {
  const { as = "p", variant, children } = props;
  const Tag = as;
  const variantClass = {
    sectionKicker:
      "m-0 text-[0.72rem] uppercase tracking-[0.2em] text-[#41534d]",
    sectionTitle:
      "mt-2 mb-0 font-['Avenir_Next_Condensed','Franklin_Gothic_Medium','Arial_Narrow',sans-serif] text-[clamp(2rem,3vw,3rem)] leading-[0.92] uppercase",
    heroTitle:
      "mt-3.5 max-w-[11ch] m-0 font-['Avenir_Next_Condensed','Franklin_Gothic_Medium','Arial_Narrow',sans-serif] text-[clamp(3rem,6vw,5.8rem)] leading-[0.92] uppercase",
    heroBody:
      "mt-6 mb-0 max-w-[52ch] text-[1.08rem] leading-[1.7] text-[#41534d]",
    metricLabel: "m-0 text-[0.72rem] uppercase tracking-[0.2em] text-[#d9e4d8]",
    metricValue:
      "m-0 font-['Avenir_Next_Condensed','Franklin_Gothic_Medium','Arial_Narrow',sans-serif] text-[clamp(4rem,8vw,7rem)] leading-[0.92] uppercase",
  }[variant];

  return <Tag className={variantClass}>{children}</Tag>;
}
