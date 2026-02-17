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
import AssignmentIcon from "@mui/icons-material/Assignment";
import FaceIcon from "@mui/icons-material/Face";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import { BiCategoryAlt } from "react-icons/bi";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleSidebar } from "@/store/setting/settingSlice";
import User from "@/components/User";

export default function AdminSidebar() {
  const { isSideBar } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const handleClickOutside = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      if (window.innerWidth <= 900) dispatch(handleSidebar(false));
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: <DashboardRoundedIcon /> },
    { label: "Courses", href: "/admin/courses", icon: <CastForEducationIcon /> },
    { label: "Users", href: "/admin/users", icon: <AssignmentIcon /> },
    { label: "Categories", href: "/admin/categories", icon: <BiCategoryAlt /> },
    { label: "Profile", href: "/admin/profile", icon: <FaceIcon /> },
  ];

  return (
    <Sheet
      ref={sidebarRef}
      sx={{
        position: "fixed",
        left: 0,
        top: "52px",
        height: "calc(100vh - 52px)",
        width: "240px",
        transform: {
          xs: isSideBar ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        },
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        zIndex: 1200,
      }}
      className="bg-card"
    >
      <List size="sm" sx={{ gap: 1, p: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index}>
            <Link href={item.href} className="w-full">
              <ListItemButton>
                {item.icon}
                <ListItemContent>
                  <Typography level="title-sm">
                    {item.label}
                  </Typography>
                </ListItemContent>
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
              Support
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Divider />

      <Box sx={{ display: "flex", p: 1 }}>
        {user && <User user={user} />}
      </Box>
    </Sheet>
  );
}
