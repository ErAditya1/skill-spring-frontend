'use client'
import React from "react";
import Box from "@mui/joy/Box";
import StudentHeader from "../components/StudentHeader";
import StudentSidebar from "../components/StudentSidebar";
import { useAppSelector } from "@/store/hooks";



function StudentLayout({ children }: { children: React.ReactNode }) {
    const { isSideBar } = useAppSelector((state) => state.setting);
  return (
    <Box sx={{ display: "flex" }}>
      <StudentHeader />
      <StudentSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          overflow: "auto",
          ml: isSideBar ? "240px" : "0px",
          mt: "52px",
          p: 3,
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default StudentLayout;
