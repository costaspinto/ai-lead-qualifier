import { useId, useState } from "react";

export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="disclosure">
      <h3 className="disclosure-heading">
        <button
          type="button"
          className="disclosure-trigger"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{title}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={`${id}-panel`} hidden={!open} className="disclosure-panel">{children}</div>
    </section>
  );
}