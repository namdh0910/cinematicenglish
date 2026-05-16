import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  container = true,
}: SectionProps) {
  return (
    <section id={id} className={`section-padding ${className}`}>
      {container ? (
        <div className="container-custom">
          {children}
        </div>
      ) : children}
    </section>
  );
}
