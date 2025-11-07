import { FC, useMemo } from "react";
import { IconPower } from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/slices/authenticate.slice";
import { successAlert } from "@/utils/alert.util";
import { useStaticOptions } from "@/utils/useStaticOptions";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { t } from "i18next";

export interface NavbarSimpleProps {
  opened: boolean;
  toggle: () => void;
}

export const NavbarSimple: FC<NavbarSimpleProps> = ({ opened, toggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { menus } = useStaticOptions();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const goToPage = (url: string) => router.push(url);

  const handleSignout = async () => {
    goToPage("/");
    dispatch(signOut());
    successAlert("Logged out");
  };

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: "Exit?",
      centered: true,
      children: <Text size="sm">{t("are-you-sure-logout")}</Text>,
      labels: { confirm: t("confirm"), cancel: t("cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: handleSignout,
    });

  // ✅ Filter menus based on current user role
  const filteredMenus = useMemo(() => {
    if (!currentUser?.userType) return [];
    return menus.filter(
      (item) => item.roles?.includes(currentUser.userType.toString()) === true,
    );
  }, [menus, currentUser?.userType]);

  const links = filteredMenus.map((item) => {
    const isActive =
      pathname === item.value ||
      (pathname.startsWith(item.value + "/") && item.value !== "/home");

    return (
      <a
        className={classes.link}
        data-active={isActive || undefined}
        href={item.value}
        key={item.label}
        onClick={(event) => {
          event.preventDefault();
          goToPage(item.value);
        }}
      >
        <item.icon
          className={classes.linkIcon}
          stroke={2}
          style={{ color: item.color }}
        />
        <span>{item.label}</span>
      </a>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={openLogoutModal}>
          <IconPower color='red' className={classes.linkIcon} stroke={2.5} />
          <span>{t("logout")}</span>
        </a>
      </div>
    </nav>
  );
};
