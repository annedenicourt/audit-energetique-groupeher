import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { startOfWeek, startOfMonth, startOfDay, format, eachWeekOfInterval, eachMonthOfInterval, eachDayOfInterval, subMonths, subWeeks, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

type Period = "day" | "week" | "month";

interface Props {
  studies: { created_at: string }[];
}

const AdminActivityChart: React.FC<Props> = ({ studies }) => {
  const [period, setPeriod] = useState<Period>("week");

  const data = useMemo(() => {
    const now = new Date();

    if (period === "day") {
      const start = subWeeks(now, 4);
      const days = eachDayOfInterval({ start, end: now });
      return days.map((day) => {
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);
        const count = studies.filter((s) => {
          const d = new Date(s.created_at);
          return isWithinInterval(d, { start: startOfDay(day), end: dayEnd });
        }).length;
        return { label: format(day, "dd/MM", { locale: fr }), count };
      });
    }

    if (period === "week") {
      const start = subMonths(now, 3);
      const weeks = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });
      return weeks.map((week) => {
        const weekEnd = new Date(week);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        const count = studies.filter((s) => {
          const d = new Date(s.created_at);
          return isWithinInterval(d, { start: startOfWeek(week, { weekStartsOn: 1 }), end: weekEnd });
        }).length;
        return { label: `S${format(week, "ww", { locale: fr })}`, count };
      });
    }

    // month
    const start = subMonths(now, 11);
    const months = eachMonthOfInterval({ start, end: now });
    return months.map((month) => {
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
      const count = studies.filter((s) => {
        const d = new Date(s.created_at);
        return isWithinInterval(d, { start: startOfMonth(month), end: monthEnd });
      }).length;
      return { label: format(month, "MMM yy", { locale: fr }), count };
    });
  }, [studies, period]);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Activité</h2>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs px-2.5 h-6">Jour</TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2.5 h-6">Semaine</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2.5 h-6">Mois</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} étude${value > 1 ? "s" : ""}`, "Études"]}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminActivityChart;
