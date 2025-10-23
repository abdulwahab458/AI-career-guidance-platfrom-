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
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <div className="px-6 py-10 space-y-12 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen text-neutral-100">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl leading-tight tracking-tighter font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          {industry.replace(/-/g, " ").toUpperCase()} Insights
        </h1>
        {formattedDate && (
          <p className="text-neutral-400 mt-2 text-sm">
            Updated on {formattedDate}
          </p>
        )}
      </motion.div>

      {/* METRICS SUMMARY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {[
          { label: "Growth Rate", value: `${growthRate}%`, color: "text-green-400" },
          { label: "Demand Level", value: demandLevel, color: "text-blue-400" },
          { label: "Market Outlook", value: marketOutlook, color: "text-yellow-400" },
        ].map((metric, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800 hover:border-neutral-700 transition-all">
              <CardContent className="p-6 text-center">
                <p className="text-neutral-400 text-sm tracking-wide">
                  {metric.label}
                </p>
                <h3 className={`text-3xl font-bold mt-2 ${metric.color}`}>
                  {metric.value}
                </h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* SALARY CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-neutral-900/70 backdrop-blur-lg border border-neutral-800 hover:border-neutral-700 transition-all">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-5 text-neutral-200">
              Salary Overview
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={salaryRanges}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="role" tick={{ fill: "#aaa" }} />
                <YAxis tick={{ fill: "#aaa" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="median" fill="#60a5fa" name="Median Salary" />
                <Bar dataKey="max" fill="#10b981" name="Max Salary" />
                <Bar dataKey="min" fill="#ef4444" name="Min Salary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* SKILLS & TRENDS GRID */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[ 
          { title: "Top Skills", items: topSkills },
          { title: "Key Trends", items: keyTrends },
          { title: "Recommended Skills", items: recommendedSkills },
        ].map((section, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <Card className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800 hover:border-neutral-700 transition-all">
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold mb-3 text-neutral-200">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-neutral-400 list-disc list-inside text-sm">
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboardcomp;
