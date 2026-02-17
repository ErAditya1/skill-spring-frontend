"use client";

import {
  Search,
  Ban,
  Trash2,
  Mail,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "blocked";
  createdAt: string;
  enrolledCoursesCount?: number;
  createdCoursesCount?: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ---------------- Fetch Users ---------------- */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/v1/admin/users");
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ---------------- Filtering ---------------- */

  useEffect(() => {
    let updated = [...users];

    if (search) {
      updated = updated.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      updated = updated.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      updated = updated.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(updated);
  }, [search, roleFilter, statusFilter, users]);

  /* ---------------- Block User ---------------- */

  const handleBlock = async (id: string) => {
    try {
      const res = await api.patch(`/v1/admin/users/block/${id}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: res.data.data.status } : u
        )
      );

      toast({
        title: "Success",
        description: "User status updated",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  /* ---------------- Delete User ---------------- */

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/v1/admin/users/${id}`);

      setUsers((prev) => prev.filter((u) => u._id !== id));

      toast({
        title: "Deleted",
        description: "User removed successfully",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          User Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage platform users and permissions
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select onValueChange={setRoleFilter} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Instructors</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  Activity
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-muted/40 transition"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <Badge
                      className={
                        user.role === "teacher"
                          ? "bg-primary/10 text-primary"
                          : user.role === "admin"
                          ? "bg-destructive/10 text-destructive"
                          : ""
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {user.enrolledCoursesCount
                      ? `${user.enrolledCoursesCount} enrolled`
                      : `${user.createdCoursesCount || 0} created`}
                  </td>

                  <td className="py-4 px-6">
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">

                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlock(user._id)}
                      >
                        <Ban className="w-4 h-4 text-yellow-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>

                    </div>
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
