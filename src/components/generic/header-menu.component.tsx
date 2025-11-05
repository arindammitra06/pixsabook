import {
  Menu,
  UnstyledButton,
  Group,
  Avatar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dispatch, SetStateAction, FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { signOut } from "../../store/slices/authenticate.slice";
import { successAlert } from "../../utils/alert.util";
import {
  IconBrush,
  IconHelp,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconLogin,
  IconLogout,
  IconMessageCircle,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import WormAvatar from "worm-avatar-react";
import { modals } from "@mantine/modals";

const HeaderMenu: FC = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const isSmall = useMediaQuery("(maxWidth: 350px)");

  const newAlbum = () => {
    if (currentUser !== null && currentUser.id !== null) {
      router.push("/create");
    } else {
      router.push("/");
    }
  };
  const goToLogin = () => {
    router.push("/");
  };

  const openLogoutModal = () =>
      modals.openConfirmModal({
        title: 'Exit?',
        centered: true,
        children: (
          <Text size="sm">
             {t('are-you-sure-logout')}
          </Text>
        ),
        labels: { confirm:t('confirm'), cancel: t('cancel') },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => handleSignout(),
      });
  const handleSignout = async () => {
    goToLogin();
    dispatch(signOut());
    successAlert("Logged out");
  };

  const gotoPage = (
    event: React.MouseEvent<HTMLButtonElement>,
    isNewtab: boolean,
    url: string,
  ) => {
    event.preventDefault();
    if (isNewtab) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  const gotoProfile = () => {
    //navigate('/user/'+currentUser?.username);
  };

  return (
    <Menu
      width={200}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      withinPortal
      offset={2}
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <UnstyledButton style={{ paddingRight: "12px" }}>
          <Group gap={7}>
            {currentUser!==null && currentUser!==undefined &&
            currentUser.thumbnailUrl!==null && currentUser.thumbnailUrl !==undefined
            ? <Avatar key={currentUser!.email} 
            src={currentUser!.thumbnailUrl} />
            :<Avatar key={currentUser!.email} 
            name={currentUser!.email} 
            color="initials" />}
            
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown style={{ padding: 4 }}>
        <Menu.Item
          leftSection={<IconHelp size={"1rem"} />}
          p={6}
          onClick={(event) => gotoPage(event, false, "/help")}
        >
          <Text size={"sm"} fw={500}>
            {t("help")}{" "}
          </Text>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconMessageCircle size={"1rem"} />}
          p={6}
          onClick={(event) => gotoPage(event, false, "/contactus")}
        >
          <Text size={"sm"} fw={500}>
            {t("contact-us")}
          </Text>
        </Menu.Item>


        {currentUser != null && currentUser.id != null ? (
          <Menu.Item
            leftSection={<IconLogout size={"1rem"} />}
            p={6}
            onClick={() => openLogoutModal()}
          >
            <Text size={"sm"} fw={500}>
              {t("logout")}
            </Text>
          </Menu.Item>
        ) : (
          <Menu.Item
            p={6}
            onClick={() => goToLogin()}
            leftSection={<IconLogin size={"1rem"} />}
          >
            <Text size={"sm"} fw={500}>
              {t("login")}
            </Text>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default HeaderMenu;
