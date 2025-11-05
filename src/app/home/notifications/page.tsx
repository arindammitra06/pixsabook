"use client";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function SettingsLayout() {
  const [opened, { toggle }] = useDisclosure();


  
  return (
   <Button>Notification Button</Button>
  );
}
