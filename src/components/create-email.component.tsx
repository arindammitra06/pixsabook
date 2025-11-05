import {
  Paper,
  Text,
  useMantineTheme,
  Input,
  SimpleGrid,
  Space,
  TextInput,
  Divider,
} from "@mantine/core";
import StepperBottom from "./generic/stepper-bottom";
import { StepperBase } from "./generic/stepper-base.component";
import { t } from "i18next";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { IconLabel, IconShield, IconSparkles, IconUserShield } from "@tabler/icons-react";
import { MultiEmailInput } from "./generic/MultiEmailInput.component";

export default function CreateEmails(form: any) {
   const theme = useMantineTheme();
    
  return (
    <StepperBase form={form}>
      <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
        {buildAnAlert(
          t("build-your-invitation-list"),
          t("add-emails-with-whom-you-share"),
          AlertType.MESSAGE,
        )}
        <Space h="md" />
        
        
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
          <Input.Wrapper
            label={<Text  fw={600} c={theme.primaryColor}>{t("creater-email")}</Text>}
            description={t("creater-email-desc")}
          >
            <TextInput
              withAsterisk
              size="sm"
              radius="md"
              error={form.data.errors["creatorEmail"]}
              leftSection={<IconShield size="1.0rem" />}
              placeholder={t("please-enter-field", { field: t("creater-email") })}
              {...form.data.getInputProps("creatorEmail")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={<Text  fw={600} c={theme.primaryColor}>{t("client-email")}</Text>}
            description={t("client-email-desc")}
          >
            <TextInput
              withAsterisk
              size="sm"
              radius="md"
              error={form.data.errors["clientEmail"]}
              leftSection={<IconUserShield size="1.0rem" />}
              placeholder={t("please-enter-field", {
                field: t("client-email"),
              })}
              {...form.data.getInputProps("clientEmail")}
            />
          </Input.Wrapper>

      <Divider
        label={
          <Text fz="xs" c={'dimmed'}>
            {t('invite-list')}
          </Text>
        }
      />
          <MultiEmailInput
            error={form.data.errors["inviteeList"]}
            emailList={form.data.values.inviteeList}
            onChange={(emails) => form.data.setFieldValue("inviteeList", emails)}
          />
        </SimpleGrid>
      </Paper>
    </StepperBase>
  );
}
