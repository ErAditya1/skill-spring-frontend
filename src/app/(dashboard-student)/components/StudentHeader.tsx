"use client";

import * as React from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { MdMenuOpen } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleSidebar } from "@/store/setting/settingSlice";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import { cn } from "@/lib/utils";

export default function StudentHeader() {
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
        borderColor: "divider",
        zIndex: 1300,
        // backgroundColor: "background.body",
      }}
      className={cn(
              " border-background/80 bg-background/40 backdrop-blur-md",
              
          )}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() => dispatch(handleSidebar(!isSideBar))}
          variant="soft"
          color="primary"
          size="sm"
        >
          {isSideBar ? <MdMenuOpen size={20} /> : <MenuRoundedIcon />}
        </IconButton>

        <Typography level="title-lg">Student Panel</Typography>
      </Box>

      <ColorSchemeToggle />
    </Box>
  );
}
