'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/lib/types';

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-canvas">
      <div className="apple-container max-w-[800px]">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-accent block mb-2">
            Tanya Jawab
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight leading-tight">
            Pertanyaan yang sering diajukan.
          </h2>
          <p className="text-[15px] text-muted mt-3">
            Punya pertanyaan seputar proses, biaya, atau layanan? Temukan jawabannya di sini.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={faq.id} className="py-4 sm:py-5 transition-colors">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[16px] sm:text-[18px] font-medium text-primary group-hover:text-accent transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-2/50' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pr-8 pb-1 text-[14px] sm:text-[15px] text-muted leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
