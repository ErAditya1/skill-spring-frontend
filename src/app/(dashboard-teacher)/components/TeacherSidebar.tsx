"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import FaceIcon from "@mui/icons-material/Face";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import User from "@/components/User";

export default function TeacherSidebar() {
  const { isSideBar } = useAppSelector((state) => state.setting);
  const { user } = useAppSelector((state) => state.auth);

  const isCollapsed = !isSideBar;

  const menuItems = [
    { label: "Dashboard", href: "/teacher", icon: <DashboardRoundedIcon /> },
    {
      label: "My Courses",
      href: "/teacher/courses",
      icon: <CastForEducationIcon />,
    },
   
    {
      label: "Earnings",
      href: "/teacher/earnings",
      icon: <DollarSign size={18} />,
    },
    { label: "Profile", href: "/teacher/profile", icon: <FaceIcon /> },
    { label: "Edit Profile", href: "/teacher/edit-profile", icon: <FaceIcon /> },
  ];

  return (
    <Sheet
      sx={{
        position: "fixed",
        left: 0,
        top: "52px",
        height: "calc(100vh - 52px)",
        width: isCollapsed ? "70px" : "240px",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        zIndex: 1200,
      }}
      className="dark:bg-card"
    >
      <List size="sm" sx={{ gap: 1, p: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index}>
            <Link href={item.href} className="w-full">
              <ListItemButton>
                {item.icon}
                {!isCollapsed && (
                  <ListItemContent>
                    <Typography level="title-sm">{item.label}</Typography>
                  </ListItemContent>
                )}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List size="sm" sx={{ p: 1 }}>
        <ListItem>
          <Link href="/support" className="w-full">
            <ListItemButton>
              <SupportRoundedIcon />
              {!isCollapsed && "Support"}
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {user && <User user={user} />}
      </Box>
    </Sheet>
  );
}
