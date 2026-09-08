import React from 'react';
import { Palette, Zap, MessageSquare, Sliders } from 'lucide-react';

interface AdvantagesProps {
  advantages?: string[];
}

const defaultAdvantageDetails = [
  {
    icon: Palette,
    title: 'Desain Mewah & Presisi',
    desc: 'Tampilan elegan yang langsung meningkatkan kepercayaan calon klien.',
  },
  {
    icon: Zap,
    title: 'Loading Cepat & Muncul di Google',
    desc: 'Pengunjung gak kabur karena loading lama, dan bisnis Anda lebih mudah ditemukan di Google.',
  },
  {
    icon: MessageSquare,
    title: 'Langsung Closing via WhatsApp',
    desc: 'Tombol konsultasi di setiap titik strategis untuk closing lebih cepat.',
  },
  {
    icon: Sliders,
    title: 'Kelola Website Sendiri',
    desc: 'Edit harga, foto, dan kontak kapan saja tanpa bantuan programmer.',
  },
];

export default function Advantages({ advantages }: AdvantagesProps) {
  return (
    <section id="keunggulan" className="bg-white border-y border-black/[0.04]">
      {/* Section Header */}
      <div className="text-center max-w-[500px] mx-auto pt-16 md:pt-24 pb-10 px-5">
        <p className="text-[13px] font-semibold text-[#2563EB] mb-3">
          Kenapa KyDev
        </p>
        <h2 className="font-display text-[26px] sm:text-[32px] font-bold text-[#0B0F19] tracking-tight leading-tight">
          Yang membedakan kami.
        </h2>
      </div>

      {/* Sticky Scroll Stack */}
      <div className="max-w-[520px] md:max-w-[560px] mx-auto px-5 pb-16 md:pb-24">
        {defaultAdvantageDetails.map((item, idx) => {
          const Icon = item.icon;
          const raw = (advantages && advantages[idx]) || '';
          let title = item.title;
          let desc = item.desc;

          if (raw) {
            if (raw.includes('—')) {
              const parts = raw.split('—');
              title = parts[0].trim();
              if (parts[1]?.trim()) desc = parts[1].trim();
            } else if (raw.includes(' - ')) {
              const parts = raw.split(' - ');
              title = parts[0].trim();
              if (parts[1]?.trim()) desc = parts[1].trim();
            } else {
              title = raw;
            }
          }

          return (
            <div
              key={idx}
              className="sticky mb-6 bg-white rounded-xl p-5 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              style={{
                top: `${72 + idx * 18}px`,
                zIndex: idx + 1,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0B0F19] mb-1">
                    {title}
                  </h3>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
