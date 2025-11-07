import { Group, Button } from "@mantine/core";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  uploadImagesSequentially,
  uploadImageToImageKit,
} from "@/store/slices/master.slice";
import { errorAlert, successAlert } from "@/utils/alert.util";
import LoadingDialog, { CanShowLoadingModal } from "./loading-pop.component";
import { createOrUpdateAlbum } from "@/store/slices/album.slice";

export default function StepperBottom(form: any) {
  const dispatch = useAppDispatch();
  const { uploads, fileUploading } = useAppSelector((state) => state.master);
  const laodingRef = useRef<CanShowLoadingModal>(null);

  const validateAndGoToNextStep = () => {
    

    if (form.active === 0) {
      if (
        form.data.values.albumName === null ||
        form.data.values.albumName === "" ||
        form.data.values.albumName.trim() === ""
      ) {
        form.data.setFieldError(
          "albumName",
          t("field-is-required", { field: t("album-name") }),
        );
        return;
      } else if (
        form.data.values.greetingMessage === null ||
        form.data.values.greetingMessage === "" ||
        form.data.values.greetingMessage.trim() === ""
      ) {
        form.data.setFieldError(
          "greetingMessage",
          t("field-is-required", { field: t("greeting-message") }),
        );
        return;
      }
    } else if (form.active === 1) {
      if (
        form.data.values.creatorEmail === null ||
        form.data.values.creatorEmail === "" ||
        form.data.values.creatorEmail.trim() === ""
      ) {
        form.data.setFieldError(
          "creatorEmail",
          t("field-is-required", { field: t("creater-email") }),
        );
        return;
      } else if (
        form.data.values.clientEmail === null ||
        form.data.values.clientEmail === "" ||
        form.data.values.clientEmail.trim() === ""
      ) {
        form.data.setFieldError(
          "clientEmail",
          t("field-is-required", { field: t("client-email") }),
        );
        return;
      } else if (
        form.data.values.creatorEmail &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          form.data.values.creatorEmail,
        )
      ) {
        form.data.setFieldError(
          "creatorEmail",
          t("please-enter-valid-creator-email"),
        );
        return;
      } else if (
        form.data.values.clientEmail &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          form.data.values.clientEmail,
        )
      ) {
        form.data.setFieldError(
          "clientEmail",
          t("please-enter-valid-client-email"),
        );
        return;
      } else if (form.data.values.inviteeList.length === 0) {
        form.data.setFieldError(
          "inviteeList",
          t("please-add-at-least-one-invitee"),
        );
        return;
      } else if (
        form.data.values.inviteeList.some(
          (email: string) =>
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email),
        )
      ) {
        form.data.setFieldError(
          "inviteeList",
          t("please-check-invalid-email-invitee"),
        );
        return;
      } else if (
        form.data.values.creatorEmail &&
        form.data.values.inviteeList.includes(
          form.data.values.creatorEmail.toString(),
        )
      ) {
        form.data.setFieldError(
          "inviteeList",
          t("creator-email-should-not-be-in-invitee-list"),
        );
        return;
      } else if (
        form.data.values.clientEmail &&
        form.data.values.inviteeList.includes(
          form.data.values.clientEmail.toString(),
        )
      ) {
        form.data.setFieldError(
          "inviteeList",
          t("client-email-should-not-be-in-invitee-list"),
        );
        return;
      }
    } else if (form.active === 2) {
      if (!form.cover || !form.back) {
        alert(t("please-add-front-and-back-image"));
        return;
      }
    }

    //go to next page
    form.nextStep();
  };

  function createAlbumStart(form: any): void {
    if (form.active === 3) {
      if (!form.photos || form.photos.length === 0) {
        alert(t("please-add-at-least-two-photo"));
        return;
      } else if (form.photos.length % 2 !== 0) {
        alert(t("please-add-even-number-of-photos"));
        return;
      }

      //Now save
      //First upload images and then create album
      if (laodingRef.current !== null && laodingRef.current !== undefined) {
        laodingRef.current.openPopup();
      }
      dispatch(uploadImageToImageKit({ file: form.cover }))
        .then((response: any) => {
          const imagekitResponse = response.payload;
          if (imagekitResponse?.status && imagekitResponse?.url) {
            form.data.setFieldValue("coverImageUrl", imagekitResponse.url);
            const cover = imagekitResponse.url;

            //Upload Back Image
            dispatch(uploadImageToImageKit({ file: form.back }))
              .then((response: any) => {
                const imagekitResponse = response.payload;
                if (imagekitResponse?.status && imagekitResponse?.url) {
                  form.data.setFieldValue("backImageUrl", imagekitResponse.url);
                  const back = imagekitResponse.url;
                  
                  //Upload Photos
                  dispatch(uploadImagesSequentially(form.photos))
                    .then((response: any) => {
                      if (
                        response.payload !== null &&
                        response.payload !== undefined &&
                        response.payload.length === form.photos.length
                      ) {
                        const photoUrls = response.payload.map(
                          (upload: any) => upload.url,
                        );
                        form.data.setFieldValue("photos", photoUrls);
                        //Create album now
                        dispatch(
                          createOrUpdateAlbum({
                            form: form.data.values,
                            photoUrls: photoUrls,
                            coverUrl : cover,
                            backUrl : back
                          }),
                        )
                          .then((res: any) => {
                            
                            if (res.payload.status) {
                              successAlert(t("album-created-successfully"));
                            } else {
                              errorAlert(t('album-creation-failed'));
                              console.error(
                                "Album creation failed:",
                                res.payload.message,
                              );
                            }

                            if (
                              laodingRef.current !== null &&
                              laodingRef.current !== undefined
                            ) {
                              laodingRef.current.closePopup();
                            }
                          })
                          .catch((err: any) => {
                              console.error("Unexpected error:", err);
                              errorAlert(t("error-uploading-image"));
                            if (
                              laodingRef.current !== null &&
                              laodingRef.current !== undefined
                            ) {
                              laodingRef.current.closePopup();
                            }
                          });
                      } else {
                        errorAlert(t("error-uploading-image"));
                        if (
                          laodingRef.current !== null &&
                          laodingRef.current !== undefined
                        ) {
                          laodingRef.current.closePopup();
                        }
                      }
                    })
                    .catch((error: any) => {
                      console.log(error);
                      errorAlert(t("error-uploading-image"));
                      if (
                        laodingRef.current !== null &&
                        laodingRef.current !== undefined
                      ) {
                        laodingRef.current.closePopup();
                      }
                    });
                } else {
                  errorAlert(t("error-uploading-image"));
                  if (
                    laodingRef.current !== null &&
                    laodingRef.current !== undefined
                  ) {
                    laodingRef.current.closePopup();
                  }
                }
              })
              .catch((error: any) => {
                console.log(error);
                errorAlert(t("error-uploading-image"));
                if (
                  laodingRef.current !== null &&
                  laodingRef.current !== undefined
                ) {
                  laodingRef.current.closePopup();
                }
              });
          } else {
            errorAlert(t("error-uploading-image"));
            if (
              laodingRef.current !== null &&
              laodingRef.current !== undefined
            ) {
              laodingRef.current.closePopup();
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          errorAlert(t("error-uploading-image"));
          if (laodingRef.current !== null && laodingRef.current !== undefined) {
            laodingRef.current.closePopup();
          }
        });
    }
  }

  return (
    <Group
      justify="space-between"
      gap="xs"
      mt={10}
      style={{
        bottom: 0,
        width: "100%",
      }}
    >
      <LoadingDialog
        ref={laodingRef}
        header={t("please_wait")}
        message={t("dialog_message")}
      />

      <Group>
        <Button
          variant="light"
          size="xs"
          radius="xl"
          onClick={form.prevStep}
          disabled={form.active === 0}
        >
          {t("previous")}
        </Button>
      </Group>

      <Group>
        {form.active < 3 ? (
          <Button
            onClick={validateAndGoToNextStep}
            variant="filled"
            size="xs"
            radius="xl"
          >
            {" "}
            {t("next")}
          </Button>
        ) : (
          <Button
            color="green"
            size="xs"
            radius="xl"
            onClick={() => createAlbumStart(form)}
          >
            {t("create")}
          </Button>
        )}
      </Group>
    </Group>
  );
}
