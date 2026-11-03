import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "~/components/ui/icons";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
      {items.map((item, index) => (
        <Accordion.Item
          key={item.question}
          value={`item-${index}`}
          className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-canvas-raised)]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-ink-subtle)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden px-5 text-sm text-[var(--color-ink-muted)] data-[state=closed]:animate-none data-[state=open]:pb-4">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
