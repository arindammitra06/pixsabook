import { forwardRef, useImperativeHandle } from "react";
import { ButtonProps, Flex, Modal, NavLink, Space, useMantineTheme } from "@mantine/core";
import { Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAppWindow, IconX, IconCheck } from "@tabler/icons-react";
import { errorAlert, successAlert } from "../../utils/alert.util";
import { t } from "i18next";
import { modals } from '@mantine/modals';
import { useAppDispatch, useAppSelector } from "@/store/hooks";


export interface ConfirmDialogProps extends ButtonProps {
  header: string;
  message: string;
  onNoClick: () => void;
  onYesClick: () => void;
  postYesClick?: () => void;
  formProps?: any;
  dialogtype?: string;
};
export interface CanShowConfirmModal {
  openConfirmPopup(): void;
}
const ConfirmDialog = forwardRef<CanShowConfirmModal, ConfirmDialogProps>((props, ref) => {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser);


  const [opened, { open, close }] = useDisclosure(false);
  const { header, message, onYesClick, onNoClick, postYesClick, dialogtype, formProps } = props;

  useImperativeHandle(ref, () => ({
    openConfirmPopup() {
      openModalForConfirmation();
    },
  }));

  const openModalForConfirmation = () => modals.openConfirmModal({
      title: message,
      centered: true,
      labels: { confirm: t('confirm'), cancel: t('discard') },
      confirmProps: { color: 'red' },
      onCancel: () => clickNoHandler(),
      onConfirm: () => clickYesHandler(),
    });
  

  const clickNoHandler = () => {
    onNoClick();
    close();
  }
  const clickYesHandler = () => {
    if (dialogtype === 'DELETE_ALBUM') {
      // dispatch(deleteClass({ id: formProps.id, campusId: formProps.campusId, userId: currentUser !== null && currentUser !== undefined ? currentUser.id : 1 }))
      //   .then((res: any) => {
      //     if (res.payload.status) {
      //       successAlert(t('alert_title'), res.payload.message);
      //       onYesClick();
      //       close();
      //     } else {
      //       if (res.payload.message.includes('Foreign key constraint')) {
      //         errorAlert(t('alert_title'), 'Remove available Student or Sections before deleting Class');
      //       } else {
      //         errorAlert(t('alert_title'), res.payload.message);
      //       }

      //     }
      //     close();
      //   })
      //   .catch((e) =>
      //     errorAlert(e.message, 'Some error occured!')
      //   );
    }

  }

  return (
    <></>
  );
});


ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;

