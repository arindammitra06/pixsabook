import { IconAt, IconChecks, IconInfoCircle, IconPhoneCall } from "@tabler/icons-react";
import {
  Stack,
  Box,
  Card,
  Text,
  Flex,
  useMantineTheme,
  Input,
  Grid,
  Button,
  Skeleton,
  Blockquote,
} from "@mantine/core";
import classes from "./user-info.module.css";
import { t } from "i18next";
import { useAppDispatch } from "@/store/hooks";
import { getSubscriptionPlans } from "@/store/slices/master.slice";
import { useState, useEffect, Fragment } from "react";
import { Dispatch } from "@reduxjs/toolkit";

interface PlanViewProps {
  selectedPlan: number | null;
  setSelectedPlan: any;
  isNew: boolean;
  isReadonly: boolean;
  currentPlanName?:string,
  count?: number,
  expiry?:any,
}

export function PlanView({
  selectedPlan,
  setSelectedPlan,
  isNew,
  isReadonly,
  currentPlanName,
  expiry,
  count
}: PlanViewProps) {
  const theme = useMantineTheme();

  const dispatch = useAppDispatch();
  const [plans, setPlans] = useState<any[]>([]);
  console.log(plans)
  useEffect(() => {
    dispatch(getSubscriptionPlans()).then((response: any) => {
      setPlans(response.payload);
    });
  }, [dispatch]);

  return (
    <>
      <Input.Wrapper
        description={t("subscription-plan-desc")}
        label={
          <Text fw={600} c={theme.primaryColor}>
            {isNew ? t("subscription-plan") : t("current_subscription")}
          </Text>
        }
      >
        {!isNew && (
          <Blockquote
             radius="xl"
            iconSize={30}
            icon={<IconInfoCircle/>}
            mt="xl"
          >
            <Text size="md" fw={500}>{t('current_subscription_readonly',
            {field:currentPlanName!==null && currentPlanName!==undefined? currentPlanName?.toUpperCase() : "No"})}</Text>
             
            <Text size="sm" fs="italic">{t('subscription_info', {
              count: Number(count ?? 0),
              date: expiry ?? '---',
            })}</Text>
          </Blockquote>
        )}

        <Grid mt="md">
          {plans !== null && plans !== undefined && plans.length > 0
            ? plans?.map((p) => (
                <Grid.Col key={p.id} span={{ base: 6, sm: 4, md: 3, lg: 3 }}>
                  <Card
                    mih={400}
                    radius="md"
                    p={0}
                    shadow="md"
                    style={{
                      border:
                        selectedPlan === p.id
                          ? `3px solid ${p.colorCode}`
                          : "1px solid #eee",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    <Stack style={{ height: "100%", flexGrow: 1 }}>
                      <Box h={15} w="100%" bg={p.colorCode} />

                      <Text fw={700} fz="xl" c={p.colorCode} px="xs">
                        {p.name}
                      </Text>

                      <Text fw={700} fz="1.2rem" px="xs">
                        ₹{p.price}
                        <Text component="span" fz="sm" fw={500}>
                          {" "}
                          {p.validityDays === 365 ? "/Year" : "/Month"}
                        </Text>
                      </Text>

                      {/* features */}
                      <Stack gap={6} mt="sm" px="5px">
                        {p.description?.split("|").map((b, idx) => (
                          <Flex
                            key={idx}
                            gap={4}
                            align="flex-start"
                            wrap="nowrap"
                          >
                            <IconChecks
                              size={14}
                              color="green"
                              style={{ flexShrink: 0 }}
                            />
                            <Text fz="xs">{b.trim()}</Text>
                          </Flex>
                        ))}
                      </Stack>

                      {/* THIS spacer pushes button to bottom equal for all */}
                      <Box style={{ flexGrow: 1 }} px="xs" />

                      <Box p="xs">
                        <Button
                          size="xs"
                          radius="sm"
                          fullWidth
                          disabled={isReadonly}
                          variant={selectedPlan === p.id ? "filled" : "outline"}
                          color={p.colorCode}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(p.id);
                          }}
                        >
                          {selectedPlan === p.id
                            ? t("selected")
                            : t("select_plan")}
                        </Button>
                      </Box>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))
            : Array.from({ length: 2 }).map((_, index) => (
                <Box key={index} mb={"xs"}>
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                  <Skeleton height={8} radius="xl" />
                </Box>
              ))}
        </Grid>
      </Input.Wrapper>
    </>
  );
}
