"use client";
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Text,
  Anchor,
  rem,
  useMantineTheme,
  Grid,
  useMantineColorScheme,
  LoadingOverlay,
  Space,
  AppShell,
  NumberInput,
  Center,
  PinInput,
  FocusTrap,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { nprogress } from "@mantine/nprogress";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getOTP,
  setCurrentUser,
  signOut,
} from "../store/slices/authenticate.slice";
import Lottie from "lottie-react";
import { IconAt, IconId, IconPassword, IconShield } from "@tabler/icons-react";
import { t } from "i18next";
import { errorAlert, successAlert } from "@/utils/alert.util";
import { useStaticOptions } from "@/utils/useStaticOptions";
import { useRouter } from "next/navigation";
import LoginMySkoolHeader from "@/components/generic/login-header.component";
import { AppLogo } from "@/components/generic/app-logo";
import LoginBgComponent from "@/components/generic/login-bg.component";
import Footer from "./generic/footer.component";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isSmallerThanSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const router = useRouter();
  const [otp, setOtp] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const goToPage = (url: string) => {
    router.push(url);
  };

  const form = useForm({
    initialValues: {
      email: "",
      terms: true,
    },

    validate: {
      email: (value) =>
        value === null || value.trim() === "" || value === undefined
          ? t("email")
          : null,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validate().hasErrors) {
      errorAlert(t("resolve-all-errors"));
      return;
    }
    if (!form.values.email) {
      errorAlert(t("email-pin-required"));

      return;
    }
    if (!form.values.terms) {
      errorAlert("Please accept Terms & Conditions");
      return;
    }
    nprogress.reset();
    nprogress.start();
    setIsLoggingIn(true);

    dispatch(getOTP({ email: form.values.email })).then((res: any) => {
      console.log(res);
      setIsLoggingIn(false);
      nprogress.complete();
      if (res.payload.status) {
        if (
          res.payload.data.currentUser !== null &&
          res.payload.data.currentUser !== undefined &&
          res.payload.data.otp !== null &&
          res.payload.data.otp !== undefined
        ) {
          setUserFound(res.payload.data.currentUser);
          setOtp(res.payload.data.otp);
          successAlert(t("please-verify-otp-sent"));
        } else {
          errorAlert(res.payload.message);
        }
      } else {
        errorAlert(res.payload.message);
      }
    });
  };

  useEffect(() => {
    if (
      currentUser !== null &&
      currentUser !== undefined &&
      currentUser.email !== null &&
      currentUser.email !== undefined
    ) {
      goToPage("/home");
    }
    setOtp(null);
    setOtpError(false);
    setIsPageLoading(false);
  }, [currentUser]);

  const largeScreen = useMediaQuery("(min-width: 40em)");

  return (
    <AppShell padding="0" header={{ height: 55 }}>
      <AppShell.Header>
        <LoginMySkoolHeader opened={false} toggle={() => {}} />
      </AppShell.Header>
      <AppShell.Main>
        <LoginBgComponent isReset={false}>
          <LoadingOverlay visible={isPageLoading} overlayProps={{ blur: 2 }} />

          <Grid gutter={0}>
            <Grid.Col span={largeScreen ? 4 : 12}>
              <Paper
                style={{
                  minHeight: "95vh",
                  maxWidth: rem(500),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  // 👇 frosted glass + transparency
                  background:
                    colorScheme === "dark"
                      ? "rgba(0, 0, 0, 0.05)" // translucent dark in dark mode
                      : "rgba(255, 255, 255, 0.05)", // translucent white in light mode

                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border:
                    colorScheme === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.1)",
                  boxShadow:
                    colorScheme === "dark"
                      ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                      : "0 8px 32px rgba(0, 0, 0, 0.1)",

                  // keep your existing responsive constraints
                  [`@media (maxWidth: ${theme.breakpoints.xs})`]: {
                    maxWidth: "100%",
                  },
                }}
                radius={0}
                px={30}
                py={20}
              >
                <div style={{ width: "100%" }}>
                  <Text
                    mt="sm"
                    ta="center"
                    c={theme.primaryColor}
                    style={{ fontFamily: "SandorTrial", letterSpacing: 1.3 }}
                    size="28px"
                    fw={600}
                    mb={20}
                  >
                    {t("view-memories")}
                    {"  "}
                    <Center>
                      <AppLogo
                        logoPath={"/assets/images/logo_text.png"}
                        alt={"Pixsabook"}
                        size={isSmallerThanSm ? "150px" : "180px"}
                      />
                    </Center>
                  </Text>

                  <form onSubmit={handleSubmit}>
                    <FocusTrap active={true}>
                      <TextInput
                        mt="md"
                        autoFocus={
                          otp != null && otp !== undefined ? false : true
                        }
                        leftSection={<IconAt size={"1rem"} />}
                        radius="md"
                        readOnly={
                          otp !== null && otp !== undefined ? true : false
                        }
                        label={
                          <Text size="sm" fw={500} c={ "white"}>
                            {t("please-enter-email-for-OTP")}
                          </Text>
                        }
                        placeholder="your-email@gmail.com"
                        size="md"
                        value={form.values.email}
                        onChange={(event) =>
                          form.setFieldValue("email", event.currentTarget.value)
                        }
                        error={
                          form.errors.pin &&
                          t("please-enter-field", { field: t("email") })
                        }
                      />

                      {otp !== null && otp !== undefined && (
                        <Center>
                          <PinInput
                            size="sm"
                            mt="sm"
                            length={6}
                            type="number"
                            disabled={
                              otp !== null && otp !== undefined ? false : true
                            }
                            autoFocus={
                              otp != null && otp !== undefined ? true : false
                            }
                            onComplete={(value) => {
                              if (value && value.length === 6) {
                                if (value === otp) {
                                  successAlert("OTP verified successfully");
                                  dispatch(
                                    setCurrentUser({
                                      user: userFound,
                                      isLoggedIn: true,
                                    }),
                                  );
                                  goToPage("/home");
                                  setOtpError(false);
                                } else {
                                  setOtpError(true);
                                  dispatch(
                                    setCurrentUser({
                                      user: null,
                                      isLoggedIn: false,
                                    }),
                                  );
                                  errorAlert("Invalid OTP");
                                }
                              } else {
                                setOtpError(true);
                                dispatch(
                                  setCurrentUser({
                                    user: null,
                                    isLoggedIn: false,
                                  }),
                                );
                                errorAlert("Invalid OTP");
                              }
                            }}
                          />
                        </Center>
                      )}
                    </FocusTrap>

                    <Checkbox
                      label={<Text fz="sm" c={ "white"} >{t("please-accept-terms")}</Text>}
                      style={{ marginTop: "10px" }}
                      checked={form.values.terms}
                      onChange={(event) =>
                        form.setFieldValue("terms", event.currentTarget.checked)
                      }
                    />

                    <Button
                      fullWidth
                      mt="md"
                      size="md"
                      radius="md"
                      type="submit"
                      disabled={otp !== null && otp !== undefined}
                      rightSection={<IconShield size="1rem" />}
                      loading={isLoggingIn}
                    >
                      {t("get-otp")}
                    </Button>
                  </form>
                </div>
              </Paper>
            </Grid.Col>
            <Grid.Col
              span={8}
              style={{ display: largeScreen ? "block" : "none" }}
            >
              <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                {/* <Lottie
                path="/assets/lottie/animation.json"
                loop={true}
                autoplay={true}
                style={{ height: '310px', width: '310px', }} />  */}
              </div>
            </Grid.Col>
          </Grid>
        </LoginBgComponent>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
