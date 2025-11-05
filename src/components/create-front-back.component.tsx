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

export default function CreateFrontBack(form: any) {
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
          t("add-front-back"),
          t("add-front-back-desc"),
          AlertType.MESSAGE,
        )}
        <Space h="md" />

        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
          <Input.Wrapper
            label={
              <Text fw={600} c={theme.primaryColor}>
                {t("front-cover")}
              </Text>
            }
            description={t("front-cover-desc")}
          >
            <Dropzone
              onDrop={(files) => form.setCover(files[0])}
              onReject={(files) => setRejectMessage(files)}
              maxSize={3 * 1024 ** 2}
              maxFiles={1}
              accept={["image/png", "image/jpeg", "image/jpg"]}
            >
              <Group
                justify="center"
                gap="xl"
                style={{ minHeight: rem(140), pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconCloudUpload size="2rem" stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size="2rem" stroke={1.5} color="red" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  {form.cover !== null && form.cover !== undefined ? (
                    <SimpleGrid cols={1} mt={0}>
                      {getImagePreview(form.cover)}
                    </SimpleGrid>
                  ) : (
                    <>
                      <Center><IconPhoto size="2rem" stroke={1.5} /></Center>
                      <div>
                        <Center>
                          <Text size="md" inline>
                            {t("drag_photo_msg")}
                          </Text>
                        </Center>
                        <Center>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            {t("drag_photo_msg_subtitle")}
                          </Text>
                        </Center>
                      </div>
                    </>
                  )}
                </Dropzone.Idle>
              </Group>
            </Dropzone>
          </Input.Wrapper>
          <Divider
            label={
              <Text fz="xs" c={"dimmed"}>
                {t("cover-back-image-divider")}
              </Text>
            }
          />

          <Input.Wrapper
            label={
              <Text fw={600} c={theme.primaryColor}>
                {t("back-cover")}
              </Text>
            }
            description={t("back-cover-desc")}
          >
            <Dropzone
              onDrop={(files) => form.setBack(files[0])}
              onReject={(files) => setRejectMessage(files)}
              maxSize={3 * 1024 ** 2}
              maxFiles={1}
              accept={["image/png", "image/jpeg", "image/jpg"]}
            >
              <Group
                justify="center"
                gap="xl"
                style={{ minHeight: rem(140), pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconCloudUpload size="2rem" stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size="2rem" stroke={1.5} color="red" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  {form.back !== null && form.back !== undefined ? (
                    <SimpleGrid cols={1} mt={0}>
                      {getImagePreview(form.back)}
                    </SimpleGrid>
                  ) : (
                    <>
                      <Center><IconPhoto size="2rem" stroke={1.5} /></Center>
                      <div>
                        <Center>
                          <Text size="md" inline>
                            {t("drag_photo_msg")}
                          </Text>
                        </Center>
                        <Center>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            {t("drag_photo_msg_subtitle")}
                          </Text>
                        </Center>
                      </div>
                    </>
                  )}
                </Dropzone.Idle>

                
              </Group>
            </Dropzone>
          </Input.Wrapper>
        </SimpleGrid>
      </Paper>
    </StepperBase>
  );
}
