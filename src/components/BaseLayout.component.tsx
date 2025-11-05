"use client";
import "../app/globals.css";
import store, { persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ProviderLayout from "./provider.component";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ProviderLayout>{children}</ProviderLayout>
      </PersistGate>
    </Provider>
  );
}
