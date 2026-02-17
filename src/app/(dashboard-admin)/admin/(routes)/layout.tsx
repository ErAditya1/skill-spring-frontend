'use client';

import React from "react";
import Box from "@mui/joy/Box";
import { useAppSelector } from "@/store/hooks";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSideBar } = useAppSelector((state) => state.setting);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminHeader />
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          overflow: "auto",
          ml: { md: "240px" },
          mt: "52px",
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
