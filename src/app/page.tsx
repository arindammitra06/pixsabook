"use client";
import LoginPage from "@/components/login.component";
import store, { persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <LoginPage />
  );
}
