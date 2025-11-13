import {
  SimpleGrid,
  Button,
  Modal,
  Flex,
  NavLink,
  Space,
  Box,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAppWindow, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { errorAlert, successAlert } from "@/utils/alert.util";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { MultiEmailInput } from "./generic/MultiEmailInput.component";
import { updateAlbumByField } from "@/store/slices/album.slice";
import { CanShowConfirmModal, ConfirmDialogProps } from "./generic/confirmation.component";

const UpdateInviteesModalComponent = forwardRef<
  CanShowConfirmModal,
  ConfirmDialogProps & { opened?: boolean; onClose?: () => void }
>((props, ref) => {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const [internalOpened, { open, close }] = useDisclosure(false);
  const { header, onYesClick, onNoClick, formProps, opened, onClose } = props;
  const [visible, setVisible] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const modalOpened = opened ?? internalOpened;
  const modalClose = onClose ?? close;

  useImperativeHandle(ref, () => ({
    openConfirmPopup() {
      open();
    },
  }));

  const form = useForm({
    initialValues: {
      albumId: formProps.albumId ?? 0,
      inviteeList: formProps.inviteeList ?? [],
    },
    validate: {
      albumId: (value) => (!value ? "Album details not found" : null),
      inviteeList: (value) =>
        !value || value.length === 0
          ? t("please-add-at-least-one-invitee")
          : null,
    },
  });

  useEffect(() => {
    form.setValues({
      albumId: formProps.albumId ?? 0,
      inviteeList: formProps.inviteeList ?? [],
    });
  }, [formProps]);

  const clickNoHandler = () => {
    onNoClick?.();
    modalClose();
  };

  const clickYesHandler = () => {
    onYesClick?.();
    modalClose();
  };

  const update = (e: any) => {
    e.preventDefault();
    if (!form.values.albumId) {
      errorAlert(t("album-details-not-found"));
      return;
    }
    if (!form.values.inviteeList?.length) {
      errorAlert(t("please-add-at-least-one-invitee"));
      return;
    }
    nprogress.reset();
    nprogress.start();
    setVisible(true);
    dispatch(
      updateAlbumByField({
        albumId: form.values.albumId,
        fieldname: "viewers",
        fieldValue: form.values.inviteeList,
        currentUserId: currentUser!.id!,
      })
    ).then((res: any) => {
      nprogress.complete();
      setVisible(false);
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
      opened={modalOpened}
      onClose={modalClose}
      onClick={(e) => e.stopPropagation()}
      size="75%"
      centered
      closeOnClickOutside={false}
      closeOnEscape={true}
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
              AlertType.WARN
            )}
            <SimpleGrid cols={1} spacing="xs" mt={5}>
              <MultiEmailInput
                error={form.errors["inviteeList"]}
                emailList={form.values.inviteeList}
                onChange={(emails) => form.setFieldValue("inviteeList", emails)}
              />
            </SimpleGrid>
          </Box>

          <Space h={20} />
          <Flex gap={6} justify="flex-end" align="center" wrap="wrap" m="5px">
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
              onClick={update}
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
