"use client";
import type { Metadata } from "next";
import {
  AppShell,
  Box,
  Container,
  useMantineTheme,
} from "@mantine/core";
import LoginMySkoolHeader from "@/components/generic/login-header.component";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { NavbarSimple } from "@/components/generic/navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();
  
  
  return (
    <AppShell 
      padding={'lg'}
      header={{ height: 55 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened },  }}
      aside={{ width: 250, breakpoint: 'lg', collapsed: { desktop: false, mobile: true } }}
      >
      <AppShell.Header>
        <LoginMySkoolHeader opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar ><NavbarSimple opened={opened} toggle={toggle}/></AppShell.Navbar>
      <AppShell.Main style={{
          overflow: 'hidden', // ensures content doesn't scroll out of layout
          boxSizing: 'border-box',
        }}>
          {children}
      </AppShell.Main>
      <AppShell.Aside withBorder={false}>
            <></>
      </AppShell.Aside>
    </AppShell>
  );
}
