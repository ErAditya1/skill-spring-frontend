'use client'
import React from "react";
import Box from "@mui/joy/Box";
import TeacherHeader from "../components/TeacherHeader";
import TeacherSidebar from "../components/TeacherSidebar";
import { useAppSelector } from "@/store/hooks";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSideBar } = useAppSelector((state) => state.setting);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TeacherHeader />
      <TeacherSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          overflow: "auto",
          ml: isSideBar ? "240px" : "70px",
          transition: "margin-left 0.3s ease",
        }}
        className="mt-[52px] p-6"
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
