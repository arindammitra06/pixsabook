import { ScrollArea, Paper, Text } from "@mantine/core";
import { FC } from "react";
import StepperBottom from "./stepper-bottom";

export interface StepperBaseProps {
  children: any;
  form: any;
}

export const StepperBase: FC<StepperBaseProps> = ({
  children,
  form,
}: StepperBaseProps) => {
  return (
    <>
      {children}
      <StepperBottom {...form} />
    </>
  );
};
