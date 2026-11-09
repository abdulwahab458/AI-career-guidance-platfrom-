"use client";

import { motion } from "motion/react";

const nav = ["Insights", "Roadmap", "Resume", "Interview", "Job match"];

const skills = [
  { label: "System design", width: "78%" },
  { label: "Product sense", width: "64%" },
  { label: "SQL", width: "86%" },
];

const ease = [0.22, 1, 0.36, 1];

export default function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease }}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[1.4rem] bg-gradient-to-b from-white/18 to-white/5 p-px shadow-[0_40px_90px_-36px_rgba(0,0,0,0.85)]"
      >
        <div className="overflow-hidden rounded-[1.35rem] bg-[#0d1016]">
          <div className="flex h-11 items-center gap-3 border-b border-white/8 px-4">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </span>
            <p className="text-[11px] tracking-wide text-zinc-500">Workspace preview</p>
          </div>

          <div className="grid sm:grid-cols-[148px_1fr]">
            <div className="hidden border-r border-white/8 p-3 sm:block">
              <p className="px-2 pb-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Workspace</p>
              <ul className="space-y-1">
                {nav.map((item, index) => (
                  <li
                    key={item}
                    className={`rounded-md px-2 py-1.5 text-xs ${index === 0 ? "bg-white/10 text-white" : "text-zinc-500"}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Market intelligence</p>
              <p className="mt-1 text-sm font-medium text-white">Software development</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">Sample signals for this industry. Yours follow your profile.</p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["Growth", "Steady"],
                  ["Demand", "High"],
                  ["Outlook", "Positive"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2">
                    <p className="text-[10px] text-zinc-500">{label}</p>
                    <p className="mt-1 text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {skills.map((skill, index) => (
                  <div key={skill.label}>
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{skill.label}</span>
                      <span className="text-zinc-600">Sample</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        initial={{ width: 0 }}
                        whileInView={{ width: skill.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-3 text-center text-[11px] text-zinc-600 sm:text-left">
        Illustrative preview. Your industry and skills replace this sample.
      </p>
    </motion.div>
  );
}
