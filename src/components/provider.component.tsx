"use client";
import type { Metadata } from "next";
import {
  ColorSchemeScript,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import "../i18n/config";
import "../app/globals.css";
import i18next from "i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { defaultLight } from "@/utils/customThemes";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "react-hot-toast";
import { NavigationProgress } from "@mantine/nprogress";
import { ModalsProvider } from "@mantine/modals";
import { useRouter } from "next/navigation";
import { signOut } from "@/store/slices/authenticate.slice";
import { successAlert } from "@/utils/alert.util";

export default function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentTheme = useAppSelector((state) => state.theme.theme);
  const currentColorScheme = useAppSelector((state) => state.theme.colorScheme);
  const language = useAppSelector((state) => state.language.language);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language, currentUser, router, dispatch]);

  return (
    <>
      <ColorSchemeScript 
        defaultColorScheme={currentColorScheme ?? defaultLight.colorScheme}
        forceColorScheme={currentColorScheme ?? defaultLight.colorScheme}
        />
      <MantineProvider
        theme={{
          ...(currentTheme ?? defaultLight.theme),
        }}
      >
        <NavigationProgress color="red" />
        <Toaster />
        <ModalsProvider>
          <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
