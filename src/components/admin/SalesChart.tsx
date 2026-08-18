"use client";

import { motion } from "framer-motion";

interface ChartData {
  dateStr: string;
  total: number;
}

export default function SalesChart({ data }: { data: ChartData[] }) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1); // Avoid division by zero

  return (
    <div className="w-full h-64 flex items-end justify-between gap-2 pt-8">
      {data.map((item, i) => {
        const heightPercent = (item.total / maxTotal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-foreground text-background text-xs font-bold py-1 px-2 rounded whitespace-nowrap pointer-events-none">
              {item.total.toLocaleString()} ج.م
            </div>
            
            {/* Bar */}
            <div className="w-full max-w-[40px] bg-muted rounded-t-sm relative flex items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full bg-primary rounded-t-sm"
              />
            </div>
            
            {/* Label */}
            <span className="text-xs text-muted-foreground mt-3 rotate-[-45deg] origin-top-right whitespace-nowrap sm:rotate-0 sm:origin-center">
              {item.dateStr}
            </span>
          </div>
        );
      })}
    </div>
  );
}
