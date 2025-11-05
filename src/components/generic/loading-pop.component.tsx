import { FC, forwardRef, useImperativeHandle } from "react";
import { ButtonProps, Flex, Loader, Modal, SimpleGrid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface LoadingDialogProps extends ButtonProps {
  header: string;
  message: string;
}

export interface CanShowLoadingModal {
  openPopup(): void;
  closePopup(): void;
}

const LoadingDialog = forwardRef<CanShowLoadingModal, LoadingDialogProps>((props, ref) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { header, message } = props;

  useImperativeHandle(ref, () => ({
    openPopup() {
      open();
    },
    closePopup() {
      close();
    },
  }));

  return (
    <Modal.Root
      opened={opened}
      onClose={close}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Flex gap="xs" align="center" direction="row" wrap="nowrap">
            <Loader size={40} />
            <SimpleGrid cols={1} spacing="xs" verticalSpacing={0}>
              <Text fw={700} size="md" lineClamp={2}>
                {header}
              </Text>
              <Text fw={500} size="xs" c="dimmed" lineClamp={2}>
                {message}
              </Text>
            </SimpleGrid>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
});

// ✅ Fix ESLint warning: Add display name
LoadingDialog.displayName = "LoadingDialog";

export default LoadingDialog;
