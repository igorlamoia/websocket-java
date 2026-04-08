import { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  extraClassName?: string;
};

export function Panel(props: PanelProps) {
  const { children, extraClassName } = props;
  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border border-[rgba(22,33,29,0.12)] bg-[rgba(248,244,234,0.82)] p-6 shadow-[0_24px_60px_rgba(31,36,27,0.12)] backdrop-blur-sm max-sm:rounded-[22px] max-sm:p-5${
        extraClassName ? ` ${extraClassName}` : ""
      }`}
    >
      {children}
    </article>
  );
}
