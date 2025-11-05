import {
  Paper,
  Text,
  ScrollArea,
  Input,
  SimpleGrid,
  TextInput,
  Space,
  useMantineTheme,
} from "@mantine/core";
import StepperBottom from "./generic/stepper-bottom";
import { StepperBase } from "./generic/stepper-base.component";
import { IconLabel, IconSparkles, IconUser } from "@tabler/icons-react";
import { t } from "i18next";
import { buildAnAlert, AlertType } from "@/utils/message.util";
export default function CreateName(form: any) {
   const theme = useMantineTheme();
  
  
  return (
    <StepperBase form={form}>
      <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
        {buildAnAlert(t('action-info', {action:t('create-pixsabook')}), 
                      t('create-album-name-help'), AlertType.MESSAGE)}
        <Space h="md" />
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
          <Input.Wrapper
            label={<Text fw={600} c={theme.primaryColor}>{t("album-name")}</Text>}
            description={t("album-name-desc")}
          >
            <TextInput
              withAsterisk
              size="sm"
              radius="md"
              error={form.data.errors["albumName"]}
              leftSection={<IconLabel size="1.0rem" />}
              placeholder={t("please-enter-field", { field: t("album-name") })}
              {...form.data.getInputProps("albumName")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={<Text fw={600} c={theme.primaryColor}>{t("greeting-message")}</Text>}
            description={t("greeting-message-desc")}
          >
            <TextInput
              withAsterisk
              size="sm"
              radius="md"
              error={form.data.errors["greetingMessage"]}
              leftSection={<IconSparkles size="1.0rem" />}
              placeholder={t("please-enter-field", {
                field: t("greeting-message"),
              })}
              {...form.data.getInputProps("greetingMessage")}
            />
          </Input.Wrapper>
        </SimpleGrid>
      </Paper>
    </StepperBase>
  );
}
