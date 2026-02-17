"use client";

import * as React from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { MdMenuOpen } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/setting/settingSlice";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";

export default function TeacherHeader() {
  const { isSideBar } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        borderBottom: "1px solid",
        zIndex: 1300,
      }}
      className="bg-background backdrop-blur-md"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() => dispatch(toggleSidebar())}
          variant="soft"
          color="primary"
          size="sm"
        >
          {isSideBar ? <MdMenuOpen size={20} /> : <MenuRoundedIcon />}
        </IconButton>

        <Typography level="title-lg">Teacher Panel</Typography>
      </Box>

      <ColorSchemeToggle />
    </Box>
  );
}
