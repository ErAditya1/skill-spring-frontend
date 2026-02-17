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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  _id: string;
  date: string;
  courseTitle: string;
  amount: number;
  students: number;
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingBalance: number;
  growthRate: number;
  nextPayoutAmount: number;
  nextPayoutDate: string;
  transactions: Transaction[];
}

export default function TeacherEarnings() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [earnings, setEarnings] = useState<EarningsData | null>(null);

  /* ---------------- Fetch Earnings ---------------- */

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(false);

        const res = await api.get(
          `/v1/payments/teacher-earnings?range=${range}`
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

  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Earnings
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your revenue and payouts
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Earnings
            </span>
            <DollarSign size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            ₹{earnings?.totalEarnings?.toLocaleString()}
          </h3>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              This Period
            </span>
            <Calendar size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            ₹{earnings?.monthlyEarnings?.toLocaleString()}
          </h3>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Pending Balance
            </span>
            <CreditCard size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            ₹{earnings?.pendingBalance?.toLocaleString()}
          </h3>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Growth Rate
            </span>
            <TrendingUp size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2 text-green-600">
            +{earnings?.growthRate}%
          </h3>
        </Card>

      </div>

      {/* NEXT PAYOUT */}
      <Card className="p-6 mb-8 border-l-4 border-l-primary rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">
              Next Payout
            </h3>
            <p className="text-sm text-muted-foreground">
              ₹{earnings?.nextPayoutAmount?.toLocaleString()} scheduled for{" "}
              {earnings?.nextPayoutDate && (new Date(earnings?.nextPayoutDate)?.toLocaleDateString())}
            </p>
          </div>

          <Button>
            Request Early Payout
          </Button>
        </div>
      </Card>

      {/* REVENUE CHART PLACEHOLDER */}
      <Card className="p-6 mb-8 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">
          Revenue Overview
        </h2>

        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            Revenue chart will appear here
          </p>
        </div>
      </Card>

      {/* TRANSACTIONS */}
      <Card className="p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">
          Recent Transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Students</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>

            <tbody>
              {earnings?.transactions?.map((t) => (
                <tr
                  key={t?._id}
                  className="border-b hover:bg-muted/40 transition"
                >
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(t?.date)?.toLocaleDateString()}
                  </td>

                  <td className="py-4 px-4 text-sm">
                    {t?.courseTitle}
                  </td>

                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {t?.students} enrollments
                  </td>

                  <td className="py-4 px-4 text-sm font-semibold text-green-600 text-right">
                    +₹{t?.amount?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
