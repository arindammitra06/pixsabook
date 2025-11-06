"use client";
import PhoneInput from "react-phone-number-input";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Checkbox,
  TextInput,
  Button,
  Group,
  Card,
  Text,
  Stack,
  Grid,
  Paper,
  Input,
  useMantineTheme,
  Select,
  Divider,
  Tabs,
  OptionsFilter,
  Space,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getSubscriptionPlans } from "@/store/slices/master.slice";
import { useForm } from "@mantine/form";
import { t } from "i18next";
import {
  addUpdateEditor,
  fetchUserDropdownForSearch,
} from "@/store/slices/user.slice";
import { errorAlert, successAlert } from "@/utils/alert.util";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { FeaturesTitle } from "@/components/generic/feature-title.component";
import "react-phone-number-input/style.css";
import CornerRibbon from "@/components/generic/CornerRibbon";
import {
  IconChecks,
  IconPaywall,
  IconSettings,
  IconUserPlus,
} from "@tabler/icons-react";
import LoadingDialog, {
  CanShowLoadingModal,
} from "@/components/generic/loading-pop.component";
import { UserInfo } from "@/components/generic/user-info";
import { PlanView } from "@/components/generic/plan-view";
export default function CreateEditorPage() {
  const dispatch = useAppDispatch();
  const [plans, setPlans] = useState<any[]>([]);
  const { isLoading } = useAppSelector((state) => state.user);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const theme = useMantineTheme();
  const [phone, setPhone] = useState<any>("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const laodingRef = useRef<CanShowLoadingModal>(null);
  const dropdownUsers = useAppSelector((state) => state.user.searchUser);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },

    validate: {
      name: (value) =>
        value === null || value === "" || value.trim() === ""
          ? t("field-is-required", { field: t("full_name") })
          : null,
      email: (value) =>
        value === null || value === "" || value.trim() === ""
          ? t("field-is-required", { field: t("email-address") })
          : null,
    },
  });

  const searchByPartial = (value: string) => {
    // local state update always
    setSearchValue(value);

    // only trigger API if length > 5
    if (value.length > 3 && value !== searchValue) {
      dispatch(
        fetchUserDropdownForSearch({
          partialString: value,
        }),
      );
    }
  };

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const splittedSearch = search.toLowerCase().trim().split(" ");
    return (options as any[]).filter((option) => {
      const words = option.label.toLowerCase().trim().split(" ");
      return splittedSearch.every((searchWord) =>
        words.some((word) => word.includes(searchWord)),
      );
    });
  };

  const updateSubscription = async () => {
    if (selectedPlan === null) {
      errorAlert(t("please-select-subscription-plan"));
      return;
    }
    if (selectedCreator === null || selectedCreator === undefined) {
      errorAlert(t("please_select_creator"));
      return;
    }

    // API call example
    if (laodingRef.current !== null && laodingRef.current !== undefined) {
      laodingRef.current.openPopup();
    }
    dispatch(
      addUpdateEditor({
        id: selectedCreator.id,
        selectedPlan: selectedPlan!,
        currentUserId: currentUser!.id!,
      }),
    )
      .then((res: any) => {
        if (res.payload.status) {
          console.log("User Updated:", res.payload.message);
          successAlert(t("user-updated-successfully"));
          if (laodingRef.current !== null && laodingRef.current !== undefined) {
            laodingRef.current.closePopup();
          }
        } else {
          errorAlert(t("user-updation-failed"));
          console.error("User Update failed:", res.payload.message);
          if (laodingRef.current !== null && laodingRef.current !== undefined) {
            laodingRef.current.closePopup();
          }
        }
      })
      .catch((err: any) => {
        console.error("Unexpected error:", err);
        errorAlert(t("user-updation-failed"));
        if (laodingRef.current !== null && laodingRef.current !== undefined) {
          laodingRef.current.closePopup();
        }
      });
  };

  const handleSave = async () => {
    if (form.validate().hasErrors) {
      errorAlert(t("resolve-all-errors"));
      return;
    }

    if (selectedPlan === null) {
      errorAlert(t("please-select-subscription-plan"));
      return;
    }
    if (phone === null || phone === undefined || phone === "") {
      errorAlert(t("field-is-required", { field: t("phone-number") }));
      return;
    }

    // API call example
    if (laodingRef.current !== null && laodingRef.current !== undefined) {
      laodingRef.current.openPopup();
    }
    dispatch(
      addUpdateEditor({
        form: form.values,
        phone: phone,
        selectedPlan: selectedPlan!,
        currentUserId: currentUser!.id!,
      }),
    )
      .then((res: any) => {
        if (res.payload.status) {
          console.log("User Updated:", res.payload.message);
          successAlert(t("user-updated-successfully"));
          if (laodingRef.current !== null && laodingRef.current !== undefined) {
            laodingRef.current.closePopup();
          }
        } else {
          errorAlert(t("user-updation-failed"));
          console.error("User Update failed:", res.payload.message);
          if (laodingRef.current !== null && laodingRef.current !== undefined) {
            laodingRef.current.closePopup();
          }
        }
      })
      .catch((err: any) => {
        console.error("Unexpected error:", err);
        errorAlert(t("user-updation-failed"));
        if (laodingRef.current !== null && laodingRef.current !== undefined) {
          laodingRef.current.closePopup();
        }
      });
  };

  return (
    <Box mx="auto">
      {buildAnAlert(
        t("creater-studio"),
        t("creater-studio-message"),
        AlertType.MESSAGE,
      )}

      <Tabs variant="outline" defaultValue="new">
        <Tabs.List>
          <Tabs.Tab value="new" leftSection={<IconUserPlus size={12} />}>
            {t("add_creator")}
          </Tabs.Tab>
          <Tabs.Tab value="update" leftSection={<IconPaywall size={12} />}>
            {t("update_subscription")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="new">
          <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
            <Stack gap="md">
              <LoadingDialog
                ref={laodingRef}
                header={t("please_wait")}
                message={t("dialog_message_common")}
              />

              <Input.Wrapper
                label={
                  <Text fw={600} c={theme.primaryColor}>
                    {t("full_name")}
                  </Text>
                }
                description={t("full-name-desc")}
              >
                <TextInput {...form.getInputProps("name")} required />
              </Input.Wrapper>

              <Input.Wrapper
                label={
                  <Text fw={600} c={theme.primaryColor}>
                    {t("email-address")}
                  </Text>
                }
                description={t("email-desc")}
              >
                <TextInput {...form.getInputProps("email")} required />
              </Input.Wrapper>

              <Input.Wrapper
                label={
                  <Text fw={600} c={theme.primaryColor}>
                    {t("phone-number")}
                  </Text>
                }
                description={t("phone-desc")}
              >
                <PhoneInput
                  defaultCountry="IN"
                  placeholder={t("enter-field", { field: t("mobile") })}
                  value={phone}
                  onChange={setPhone}
                  style={{
                    width: "100%",
                    border: "1px solid var(--mantine-color-gray-2)",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
              </Input.Wrapper>

              <PlanView
                isNew={true}
                isReadonly={false}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
              <Flex
                gap={6}
                justify="flex-end"
                align="center"
                direction="row"
                wrap="wrap"
                style={{ margin: "5px" }}
              >
                <Button
                  w={150}
                  variant="filled"
                  size="xs"
                  radius="xl"
                  loading={isLoading}
                  onClick={handleSave}
                >
                  {t("create_editor")}
                </Button>
              </Flex>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="update">
          <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
            <Stack gap="md">
              <Input.Wrapper
                label={
                  <Text fw={600} c={theme.primaryColor}>
                    {t("search_creator")}
                  </Text>
                }
                description={t("search_creator_msg")}
              >
                <Select
                  placeholder={t("search_creator_msg_placeholder")}
                  data={(dropdownUsers || []).map((u: any) => ({
                    value: String(u.id),
                    label: u.email ?? u.name ?? "",
                  }))}
                  withAsterisk
                  maxDropdownHeight={200}
                  nothingFoundMessage={t("search-empty-state")}
                  filter={optionsFilter}
                  onSearchChange={(e: any) => searchByPartial(e)}
                  searchValue={searchValue}
                  searchable
                  clearable
                  onChange={(value) => {
                    if (value) {
                      const selectedUser = dropdownUsers.find(
                        (u) => u.id === Number(value),
                      );
                      console.log("selectedUser", selectedUser);
                      setSelectedCreator(selectedUser);
                      setSelectedPlan(selectedUser!.UserSubscription?.[0]?.planId);
                    }
                  }}
                />
              </Input.Wrapper>
              <Divider
                my="xs"
                label="Creator Details"
                labelPosition="center"
              />
              {selectedCreator !== null && selectedCreator !== undefined && (
                <>
                  <UserInfo user={selectedCreator} />
                  <PlanView
                    isReadonly={false}
                    isNew={false}
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    currentPlanName={selectedCreator?.UserSubscription?.[0]?.Plan?.name.toUpperCase()}
                    expiry={selectedCreator?.UserSubscription?.[0]?.expiresOn}
                    count={selectedCreator?.UserSubscription?.[0]?.creditsLeft}
                  />
                </>
              )}

              <Flex
                gap={6}
                justify="flex-end"
                align="center"
                direction="row"
                wrap="wrap"
                style={{ margin: "5px" }}
              >
                <Button
                  w={150}
                  variant="filled"
                  size="xs"
                  radius="xl"
                  loading={isLoading}
                  onClick={updateSubscription}
                >
                  {t("update_subscription")}
                </Button>
              </Flex>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
