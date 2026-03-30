"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemData {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#1a2340] last:border-b-0">
      <button
        className="flex w-full items-center justify-between py-5 px-1 text-left transition-colors duration-200 hover:text-[#00c2ff] group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-[#e4e9f4] group-hover:text-[#00c2ff] transition-colors duration-200 pr-4">
          {item.question}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#8091b3] group-hover:text-[#00c2ff] transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-1 text-sm text-[#8091b3] leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`divide-y-0 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
