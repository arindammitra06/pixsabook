import {
  Paper,
  Text,
  Divider,
  SimpleGrid,
  Space,
  useMantineTheme,
  Center,
  Group,
  Image,
  Input,
  rem,
} from "@mantine/core";
import { StepperBase } from "./generic/stepper-base.component";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { IconCloudUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { Dropzone, FileRejection } from "@mantine/dropzone";
import { errorAlert } from "@/utils/alert.util";
import MultiPageDropzone from "./generic/MultiPageDropzone.component";

export default function CreateAllImages(form: any) {
  const theme = useMantineTheme();
  function setRejectMessage(files: FileRejection[]): void {
    if (files.length > 1) {
      errorAlert("Please add only one image");
    } else {
      errorAlert("Format not supported");
    }
  }
  function getImagePreview(
    cover: any,
  ): import("react").ReactNode | Iterable<import("react").ReactNode> {
    const imageUrl = URL.createObjectURL(cover);
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0px",
        }}
      >
        <div style={{ maxWidth: 200, maxHeight: "100%", overflow: "hidden" }}>
          <Image
            src={imageUrl}
            alt={imageUrl}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: rem(140),
              objectFit: "contain",
            }}
            fallbackSrc={`https://placehold.co/600x400?text=${t("loading_image")}`}
          />
        </div>
      </div>
    );
  }

  return (
    <StepperBase form={form}>
      <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
        {buildAnAlert(
          t("add-inner-pages"),
          t("add-inner-pages-desc"),
          AlertType.MESSAGE,
        )}
        <Space h="md" />

        <SimpleGrid cols={1} spacing="xl" verticalSpacing="xs">
          <MultiPageDropzone photos={form.photos} setPhotos={form.setPhotos} />
        </SimpleGrid>
      </Paper>
    </StepperBase>
  );
}
