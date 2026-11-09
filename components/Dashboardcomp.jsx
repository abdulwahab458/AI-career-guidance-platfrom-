"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Compass, Sparkles } from "lucide-react";

const SalaryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-44 rounded-xl border border-white/30 bg-slate-950/85 p-3 text-white shadow-2xl shadow-slate-950/25 backdrop-blur-xl dark:border-white/15 dark:bg-slate-900/90">
      <p className="mb-2 border-b border-white/15 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map(({ name, value, color }) => (
          <div key={name} className="flex items-center justify-between gap-5 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </span>
            <span className="font-semibold tabular-nums text-white">
              ${Number(value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboardcomp = ({ insights }) => {
  const {
    industry,
    salaryRanges,
    growthRate,
    demandLevel,
    topSkills,
    marketOutlook,
    keyTrends,
    recommendedSkills,
  } = insights;

  // --- FIX HYDRATION: only render formatted date on client ---
  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
    setFormattedDate(new Date(insights.lastUpdated).toLocaleDateString());
  }, [insights.lastUpdated]);

  const displayIndustry = industry.replace(/-/g, " ");
  const metrics = [
    { label: "Growth rate", value: `${growthRate}%`, note: "Year over year", icon: ArrowUpRight, tone: "text-emerald-500" },
    { label: "Demand level", value: demandLevel, note: "Hiring activity", icon: BriefcaseBusiness, tone: "text-sky-500" },
    { label: "Market outlook", value: marketOutlook, note: "Near-term signal", icon: Compass, tone: "text-amber-500" },
  ];
  const insightSections = [
    { title: "Top skills", items: topSkills, icon: CheckCircle2, tone: "text-emerald-500" },
    { title: "Key trends", items: keyTrends, icon: Compass, tone: "text-sky-500" },
    { title: "Recommended next", items: recommendedSkills, icon: Sparkles, tone: "text-amber-500" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_35%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400"><Sparkles className="h-3.5 w-3.5" /> Market intelligence</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayIndustry} insights</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">A focused view of the signals shaping your next career move.</p>
          </div>
          {formattedDate && <p className="shrink-0 text-xs text-muted-foreground">Updated {formattedDate}</p>}
        </motion.header>

        <motion.section
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-3 md:grid-cols-3"
        >
          {metrics.map(({ label, value, note, icon: Icon, tone }) => (
            <motion.div key={label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
              <Card className="h-full border-border/70 bg-card/80 shadow-sm backdrop-blur transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>
                  <span className={`rounded-lg bg-muted p-2.5 ${tone}`}><Icon className="h-5 w-5" /></span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }}>
          <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-3 flex items-end justify-between gap-4"><div><h2 className="text-lg font-semibold">Salary landscape</h2><p className="text-xs text-muted-foreground">Typical compensation range by role</p></div><span className="hidden text-xs text-muted-foreground sm:block">USD / year</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salaryRanges} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                  <XAxis dataKey="role" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={<SalaryTooltip />}
                    cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                    wrapperStyle={{ outline: "none", zIndex: 20 }}
                  />
                  <Bar dataKey="min" fill="#94a3b8" name="Minimum" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median" fill="#0ea5e9" name="Median" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" fill="#10b981" name="Maximum" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }} className="grid gap-3 md:grid-cols-3">
          {insightSections.map(({ title, items, icon: Icon, tone }) => (
            <Card key={title} className="border-border/70 bg-card/80 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><Icon className={`h-4 w-4 ${tone}`} />{title}</h3>
                <ul className="mt-4 space-y-2.5">{items.map((item) => <li key={item} className="text-sm leading-5 text-muted-foreground">{item}</li>)}</ul>
              </CardContent>
            </Card>
          ))}
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboardcomp;
