import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimoni" className="py-16 md:py-24 bg-surface/50 border-y border-black/[0.04]">
      <div className="apple-container">
        {/* Header */}
        <div className="text-center max-w-[650px] mx-auto mb-14">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-accent block mb-2">
            Bukti Kualitas & Kepuasan Klien
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight leading-tight">
            Dipercaya oleh berbagai pemilik bisnis di Indonesia.
          </h2>
          <p className="text-[15px] text-muted mt-3">
            Inilah pengalaman nyata para klien yang mempercayakan pembuatan website mereka kepada KyDev.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between bg-white rounded-[14px] p-6 border border-black/[0.04] hover:border-black/[0.1] transition-all"
            >
              <div>
                {/* Rating Stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-neutral-2" />
                </div>

                {/* Content */}
                <p className="text-[14px] text-body leading-relaxed mb-6 italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04]">
                {item.image_url ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.customer_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-bold shrink-0 font-sans">
                    {item.customer_name.charAt(0)}
                  </div>
                )}

                <div className="overflow-hidden">
                  <h4 className="font-display text-[14px] font-semibold text-primary truncate">
                    {item.customer_name}
                  </h4>
                  <p className="text-[12px] text-muted truncate">
                    {item.company || item.source || 'Klien KyDev'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
