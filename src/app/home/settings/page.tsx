"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut, updateUserByField } from "@/store/slices/authenticate.slice";
import { changeLanguage } from "@/store/slices/language.slice";
import {
  setColorSchemeLocal,
  setImageQuality,
} from "@/store/slices/theme.slice";
import { errorAlert, successAlert } from "@/utils/alert.util";
import { useStaticOptions } from "@/utils/useStaticOptions";
import {
  Box,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  UnstyledButton,
  ActionIcon,
  useMantineTheme,
  Button,
  Modal,
  Radio,
  TextInput,
  Avatar,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {
  IconWorld,
  IconMapPin,
  IconPhoto,
  IconPhone,
  IconUserCircle,
  IconMoodHappy,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { uploadImageToImageKit } from "@/store/slices/master.slice";
import { modals } from "@mantine/modals";
import { CitySelect } from "@/components/generic/CitySelect";
import { nprogress } from "@mantine/nprogress";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingItem({ icon, label, value, onClick }: SettingItemProps) {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: "100%",
        padding: "6px 8px",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs">
          <ActionIcon variant="light" color="gray" radius="xl" size="lg">
            {icon}
          </ActionIcon>
          <Text size="sm" fw={500}>
            {label}
          </Text>
        </Group>

        <Group gap={4}>
          {value && (
            <Text size="sm" c="dimmed">
              {value}
            </Text>
          )}
          <IconChevronRight size={16} stroke={1.8} />
        </Group>
      </Group>
    </UnstyledButton>
  );
}

export default function SettingsPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const colorSchemeSlice = useAppSelector((state) => state.theme.colorScheme);
  const [tempSelection, setTempSelection] = useState("");
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [phone, setPhone] = useState<any>(currentUser?.mobile || "");
  const [location, setLocation] = useState<any>(currentUser?.location || "");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();

  const goToPage = (url: string) => router.push(url);

  useEffect(() => {
    async function loadProfilePic() {
      if (currentUser?.thumbnailUrl) {
        try {
          const response = await fetch(currentUser.thumbnailUrl);
          const blob = await response.blob();

          // Extract filename from URL or give a default name
          const fileName =
            currentUser.thumbnailUrl.split("/").pop() || "profile.jpg";

          // Create a File from the blob
          const file = new File([blob], fileName, { type: blob.type });
          setProfilePic(file);
        } catch (error) {
          console.error("Error loading profile picture:", error);
        }
      }
    }
    setPhone(currentUser?.mobile || "");
    setLocation(currentUser?.location || "");
    loadProfilePic();
  }, [currentUser?.mobile, currentUser?.thumbnailUrl]);

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: "Exit?",
      centered: true,
      children: <Text size="sm">{t("are-you-sure-logout")}</Text>,
      labels: { confirm: t("confirm"), cancel: t("cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleSignout(),
    });

  const handleSignout = async () => {
    goToPage("/");
    dispatch(signOut());
    successAlert("Logged out");
  };

  const { languages, quality } = useStaticOptions();
  const imageQuality = useAppSelector((state) => state.theme.imageQuality);

  // ---------- Modal States ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "language" | "theme" | "imageQuality" | "phone" | "profilePic" | "location" | null
  >(null);

  // ---------- Handlers ----------
  const changeThemeChangeOnClick = (scheme: string | undefined) => {
    if (!scheme) return;
    // ensure the value passed to Mantine is of the MantineColorScheme type
    setColorScheme(scheme === "light" ? "dark" : "light");
    dispatch(setColorSchemeLocal({ colorScheme: scheme }));
  };

  const changeLanguageOnClick = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
    handleLanguageChange(lng);
  };
  const handleLanguageChange = (newLanguage: string | undefined) => {
    dispatch(changeLanguage(newLanguage));
  };

  const openSetting = (
    type: "language" | "theme" | "imageQuality" | "phone" | "profilePic" | "location",
  ) => {
    setModalType(type);
    if (type === "language") setTempSelection(i18n.language);
    if (type === "theme") setTempSelection(colorSchemeSlice);
    if (type === "imageQuality") setTempSelection(imageQuality!);
    setModalOpen(true);
  };

  function savePhoneNumber() {
    nprogress.reset();
    nprogress.start();
    dispatch(
      updateUserByField({
        id: currentUser!.id!,
        fieldname: "mobile",
        fieldValue: phone,
        currentUserId: currentUser!.id!,
      }),
    )
      .then((res: any) => {

        if (res.payload.status) {
          
          successAlert(t("user-updated-successfully"));
        } else {
          errorAlert(t("user-updation-failed"));
          console.error("User Update failed:", res.payload.message);
        }
        nprogress.complete();
      })
      .catch((err: any) => {
        console.error("Unexpected error:", err);
        errorAlert(t("user-updation-failed"));
        nprogress.complete();
      });
  }

  function saveLocation() {
    nprogress.reset();
    nprogress.start();
    
    dispatch(
      updateUserByField({
        id: currentUser!.id!,
        fieldname: "location",
        fieldValue: location,
        currentUserId: currentUser!.id!,
      }),
    )
      .then((res: any) => {
        if (res.payload.status) {
          
          successAlert(t("user-updated-successfully"));
        } else {
          errorAlert(t("user-updation-failed"));
          console.error("User Update failed:", res.payload.message);
        }
        nprogress.complete();
      })
      .catch((err: any) => {
        console.error("Unexpected error:", err);
        errorAlert(t("user-updation-failed"));
        nprogress.complete();
      });
  }

  function saveProfilePic() {
    nprogress.reset();
    nprogress.start();
    
    dispatch(uploadImageToImageKit({ file: profilePic! }))
      .then((response: any) => {
        
        const imagekitResponse = response.payload;

        if (imagekitResponse?.status && imagekitResponse?.url) {
          
          const profilePicUrl = imagekitResponse.url;

          dispatch(
            updateUserByField({
              id: currentUser!.id!,
              fieldname: "thumbnailUrl",
              fieldValue: profilePicUrl,
              currentUserId: currentUser!.id!,
            }),
          )
            .then((res: any) => {
              if (res.payload.status) {
                
                successAlert(t("user-updated-successfully"));
              } else {
                errorAlert(t("user-updation-failed"));
                console.error("User Update failed:", res.payload.message);
              }
              nprogress.complete();
            })
            .catch((err: any) => {
              console.error("Unexpected error:", err);
              errorAlert(t("error-uploading-image"));
              nprogress.complete();
            });
        } else {
          errorAlert(t("error-uploading-image"));
        }
      })
      .catch((error: any) => {
        console.error(error);
        errorAlert(t("error-uploading-image"));
      });
  }

  const applyChange = () => {
    if (modalType === "language") changeLanguageOnClick(tempSelection);
    if (modalType === "theme") changeThemeChangeOnClick(tempSelection);
    if (modalType === "imageQuality")
      dispatch(setImageQuality({ quality: tempSelection }));

    if (modalType === "phone") {
      savePhoneNumber();
    }
    if (modalType === "profilePic") {
      saveProfilePic();
    }
    if (modalType === "location") {
      saveLocation();
    }
    setModalOpen(false);
  };

  const getOptions = () => {
    switch (modalType) {
      case "language":
        return languages;
      case "theme":
        return [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ];
      case "imageQuality":
        return quality;
      default:
        return [];
    }
  };

  // ---------- UI ----------
  return (
    <Box mx="auto" p="0">
      <Stack gap="xs">
        {/* Common */}
        <Box>
          <Title order={6} c="dimmed" mb={4}>
            {t("common")}
          </Title>
          <Paper radius="md" withBorder shadow="xs">
            <SettingItem
              icon={<IconWorld size={18} />}
              label={t("language")}
              value={
                i18n.language === "en"
                  ? "English"
                  : i18n.language === "hi"
                    ? "Hindi"
                    : i18n.language
              }
              onClick={() => openSetting("language")}
            />
            {/* <SettingItem
              icon={<IconPalette size={18} />}
              label={t("select-theme")}
              value={colorSchemeSlice}
              onClick={() => openSetting("theme")}
            /> */}
          </Paper>
        </Box>

        {/* Pixsabook Albums */}
        <Box>
          <Title order={6} c="dimmed" mb={4}>
            {t("pixsabook-albums")}
          </Title>
          <Paper radius="md" withBorder shadow="xs">
            <SettingItem
              icon={<IconPhoto size={18} />}
              label={t("image-quality")}
              value={imageQuality}
              onClick={() => openSetting("imageQuality")}
            />
          </Paper>
        </Box>

        {/* Profile */}
        <Box>
          <Title order={6} c="dimmed" mb={4}>
            {t("profile-settings")}
          </Title>
          <Paper radius="md" withBorder shadow="xs">
            <SettingItem
              icon={<IconPhone size={18} />}
              label={t("mobile")}
              onClick={() => openSetting("phone")}
            />
            <SettingItem
              icon={<IconMapPin size={18} />}
              label={t("location")}
              onClick={() => openSetting("location")}
            />
            <SettingItem
              icon={<IconMoodHappy size={18} />}
              label={t("photo")}
              onClick={() => openSetting("profilePic")}
            />
          </Paper>
        </Box>

        {/* Privacy */}
        <Box>
          <Title order={6} c="dimmed" mb={4}>
            {t("privacy-security")}
          </Title>
          <Paper radius="md" withBorder shadow="xs">
            {/* <SettingItem
              icon={<IconTrash size={18} />}
              label={t("clear-cache")}
            /> */}
            <SettingItem
              icon={<IconLogout size={18} />}
              label={t("logout")}
              onClick={openLogoutModal}
            />
          </Paper>
        </Box>
      </Stack>

      {/* ---------- Shared Modal ---------- */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === "language"
            ? t("select-field", { field: t("language") })
            : modalType === "theme"
              ? t("select-field", { field: t("theme") })
              : modalType === "imageQuality"
                ? t("select-field", { field: t("image-quality") })
                : modalType === "phone"
                  ? t("add-phone")
                  : modalType === "location"
                  ? t("select-location")
                  : t("add-profile-pic")
        }
        centered
      >
        <Stack gap="md">
          {modalType === "language" ||
          modalType === "theme" ||
          modalType === "imageQuality" ? (
            <Radio.Group value={tempSelection} onChange={setTempSelection}>
              <Stack gap="xs">
                {getOptions().map((opt) => (
                  <Radio key={opt.value} value={opt.value} label={opt.label} />
                ))}
              </Stack>
            </Radio.Group>
          ) : null}

          {modalType === "phone" && (
            <PhoneInput
              defaultCountry="IN"
              placeholder={t("enter-field", { field: t("mobile") })}
              value={phone}
              onChange={setPhone}
              style={{
                width: "100%",
                border: "0.5px solid var(--mantine-color-gray-2)",
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

           {modalType === "location" && (
            <CitySelect location={location} setLocation={setLocation}/>
          )}

          {modalType === "profilePic" && (
            <Stack align="center" gap="sm">
              {profilePic ? (
                <Avatar
                  src={URL.createObjectURL(profilePic)}
                  size={100}
                  radius="xl"
                />
              ) : (
                <Avatar size={100} radius="xl" />
              )}
              <Dropzone
                onDrop={(files) => setProfilePic(files[0])}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                maxFiles={1}
              >
                <Text ta="center" c="dimmed">
                  {t("drag_photo_msg")}
                </Text>
              </Dropzone>
            </Stack>
          )}

          <Group justify="flex-end" mt="sm">
            <Button
              variant="default"
              size="xs"
              radius="xl"
              onClick={() => setModalOpen(false)}
            >
              {t("discard")}
            </Button>
            <Button
              variant="filled"
              size="xs"
              radius="xl"
              onClick={applyChange}
            >
              {t("save")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
