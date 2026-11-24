import { useId, useRef, useState } from "react";

export interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  items: TabItem[];
  label: string;
}

export function Tabs({ items, label }: TabsProps) {
  const id = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const enabled = items.map((item, index) => item.disabled ? -1 : index).filter((index) => index >= 0);
  const move = (current: number, key: string) => {
    const position = enabled.indexOf(current);
    const nextPosition = key === "Home" ? 0
      : key === "End" ? enabled.length - 1
      : (position + (key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length;
    const next = enabled[nextPosition];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="tabs-root">
      <div className="tab-list" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={`${id}-${index}`}
            ref={(node) => { tabRefs.current[index] = node; }}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            disabled={item.disabled}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                event.preventDefault(); move(index, event.key);
              }
            }}
          >{item.label}</button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={`${id}-panel-${index}`}
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
          className="tab-panel"
        >{item.content}</div>
      ))}
    </div>
  );
}