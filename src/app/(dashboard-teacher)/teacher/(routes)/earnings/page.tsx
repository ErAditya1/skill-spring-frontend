"use client";

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherEarnings() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/v1/admin/teacher-earnings?range=${range}`
        );

        setEarnings(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [range]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No earnings data available.
      </div>
    );
  }

  const growthColor =
    Number(earnings.growthRate) >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Earnings</h1>
          <p className="text-muted-foreground text-sm">
            Track your revenue and payouts
          </p>
        </div>

        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          label="Total Earnings"
          value={`₹${earnings.totalEarnings.toLocaleString()}`}
          icon={<DollarSign size={18} />}
        />

        <StatCard
          label="This Period"
          value={`₹${earnings.monthlyEarnings.toLocaleString()}`}
          icon={<Calendar size={18} />}
        />

        <StatCard
          label="Pending Balance"
          value={`₹${earnings.pendingBalance.toLocaleString()}`}
          icon={<CreditCard size={18} />}
        />

        <StatCard
          label="Growth Rate"
          value={`${earnings.growthRate}%`}
          icon={<TrendingUp size={18} />}
          className={growthColor}
        />
      </div>

      {/* Transactions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">
          Recent Transactions
        </h2>

        {earnings.transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No transactions yet.
          </p>
        ) : (
          <div className="space-y-4">
            {earnings.transactions.map((t: any) => (
              <div
                key={t._id}
                className="flex justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">
                    {t.courseTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.students} enrollments
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +₹{t.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

const StatCard = ({ label, value, icon, className = "" }: any) => (
  <Card className="p-6 rounded-xl">
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      {icon}
    </div>
    <h3 className={`text-2xl font-semibold mt-2 ${className}`}>
      {value}
    </h3>
  </Card>
);
