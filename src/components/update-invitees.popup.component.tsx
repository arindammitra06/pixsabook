import {
  SimpleGrid,
  Button,
  Modal,
  Flex,
  NavLink,
  Input,
  Space,
  Textarea,
  Table,
  ActionIcon,
  NumberInput,
  TextInput,
  useMantineTheme,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAppWindow,
  IconDeviceFloppy,
  IconPercentage,
  IconPlus,
  IconSchool,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { errorAlert, successAlert } from "@/utils/alert.util";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { removeItem } from "framer-motion";
import { MySelectItem } from "./generic/app-select.componnent";
import {
  CanShowConfirmModal,
  ConfirmDialogProps,
} from "./generic/confirmation.component";
import { MultiEmailInput } from "./generic/MultiEmailInput.component";
import { updateAlbumByField } from "@/store/slices/album.slice";

const UpdateInviteesModalComponent = forwardRef<
  CanShowConfirmModal,
  ConfirmDialogProps
>((props, ref) => {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { header, message, onYesClick, onNoClick, formProps } = props;
  const [visible, { toggle }] = useDisclosure(false);

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useImperativeHandle(ref, () => ({
    openConfirmPopup() {
      open();
    },
  }));

  const clickNoHandler = () => {
    onNoClick();
    close();
  };

  const clickYesHandler = () => {
    onYesClick();
    close();
  };

  const form = useForm({
    initialValues: {
      albumId:
        formProps.albumId !== null && formProps.albumId !== undefined
          ? formProps.albumId
          : 0,
      inviteeList:
        formProps.inviteeList !== null && formProps.inviteeList !== undefined
          ? formProps.inviteeList
          : [],
    },
    validate: {
      albumId: (value) =>
        value === null || value === undefined || value === 0
          ? "Album details not found"
          : null,
      inviteeList: (value) =>
        value === null || value === undefined || value.length === 0
          ? t("please-add-at-least-one-invitee")
          : null,
    },
  });

  const update = (event: any) => {
    event.preventDefault();

    if (!form.values.albumId || form.values.albumId === 0) {
      errorAlert(t("album-details-not-found"));
      return;
    }
    if (!form.values.inviteeList || form.values.inviteeList.length === 0) {
      errorAlert(t("please-add-at-least-one-invitee"));
      return;
    }
    nprogress.reset();
    nprogress.start();
    toggle();
    dispatch(
      updateAlbumByField({
        albumId: form.values.albumId,
        fieldname: "viewers",
        fieldValue: form.values.inviteeList,
        currentUserId: currentUser!.id!,
      }),
    ).then((res: any) => {
      nprogress.complete();
      toggle();
      if (res.payload.status) {
        successAlert(res.payload.message);
        clickYesHandler();
      } else {
        errorAlert(res.payload.message);
      }
    });
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={close}
      onClick={(e) => e.stopPropagation()}
      size="75%"
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header style={{ padding: "0px", minHeight: "0px" }}>
          <NavLink
            style={{ width: "100%" }}
            label={header}
            leftSection={<IconAppWindow size="1rem" stroke={1.5} />}
            rightSection={<Modal.CloseButton />}
            variant="filled"
            active
          />
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          <Box pos="relative">
            <LoadingOverlay
              visible={visible}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            {buildAnAlert(
              t("update-invitees-header"),
              t("update-invitees-desc"),
              AlertType.WARN,
            )}
            <SimpleGrid cols={1} spacing="xs" verticalSpacing="0" mt={5}>
              <MultiEmailInput
                error={form.errors["inviteeList"]}
                emailList={form.values.inviteeList}
                onChange={(emails) => form.setFieldValue("inviteeList", emails)}
              />
            </SimpleGrid>
          </Box>

          <Space h={20} />
          <Flex
            gap={6}
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ margin: "5px" }}
          >
            <Button
              variant="light"
              color="red"
              onClick={clickNoHandler}
              rightSection={<IconX size="1rem" />}
              size="xs"
            >
              {t("discard")}
            </Button>
            <Button
              variant="filled"
              color="green"
              disabled={visible}
              loading={visible}
              onClick={(event) => update(event)}
              rightSection={<IconDeviceFloppy size="1rem" />}
              size="xs"
            >
              {t("save")}
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
});
UpdateInviteesModalComponent.displayName = "UpdateInviteesModalComponent";
export default UpdateInviteesModalComponent;
