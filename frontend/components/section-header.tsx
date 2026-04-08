import { ReactNode } from "react";
import { Typography } from "./typography";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  aside?: ReactNode;
};

export function SectionHeader(props: SectionHeaderProps) {
  const { kicker, title, aside } = props;
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Typography variant="sectionKicker">{kicker}</Typography>
        <Typography as="h2" variant="sectionTitle">
          {title}
        </Typography>
      </div>
      {aside}
    </div>
  );
}
