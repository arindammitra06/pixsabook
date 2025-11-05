"use client";
import {
  rem,
  Group,
  Box,
  Image,
  AppShell,
  useMantineTheme,
  Burger,
  Button,
  useMantineColorScheme,
} from "@mantine/core";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { AppLogo } from "./app-logo";
import { NavbarSimpleProps } from "./navbar";
import HeaderMenu from "./header-menu.component";
import LanguageDropdown from "./language-dropdown.component";
import { ThemeButton } from "./themebutton";

const LoginMySkoolHeader: FC<NavbarSimpleProps> = ({
  opened,
  toggle,
}: NavbarSimpleProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const isSmallerThanSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  return (
    <Box h={{ base: 55, md: 55 }}>
      <div
        style={{
          height: rem(55),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Group justify="space-between" style={{ width: "100%" }}>
          <Group justify="space-between" gap={0} style={{ marginLeft: "10px" }}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            
            <AppLogo
              logoPath={"/assets/images/logo.png"}
              alt={"Studify"}
              size={isSmallerThanSm ? "50px" : "50px"}
            />
            <AppLogo
              logoPath={"/assets/images/logo_text.png"}
              alt={"Studify"}
              show={isSmallerThanSm ? false : true}
              size={isSmallerThanSm ? "120px" : "120px"}
            />
          </Group>

          <Group gap={5}>
            {!isSmallerThanSm && (
              <Image
                radius="md"
                h={50}
                w={115}
                mx={"xs"}
                fit="contain"
                alt="Pixsabook Play Store App Download"
                src="/assets/images/play_store.png"
              />
            )}
            {/* <LanguageDropdown /> */}
            <ThemeButton/>
            {currentUser && <HeaderMenu />}
          </Group>
        </Group>
      </div>
    </Box>
  );
};

export default LoginMySkoolHeader;
