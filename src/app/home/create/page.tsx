"use client";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Stepper, Button, Group, Box, LoadingOverlay } from "@mantine/core";
import CreateName from "@/components/create-name.component";
import CreateEmails from "@/components/create-email.component";
import CreateAllImages from "@/components/create-all-images.component copy";
import CreateFrontBack from "@/components/create-front-back.component";
import { useForm } from "@mantine/form";
import { t } from "i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { getAlbumById } from "@/store/slices/album.slice";

export default function CreateLayout() {
  const [active, setActive] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [cover, setCover] = useState<File>();
  const [back, setBack] = useState<File>();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const [isLoading, setIsLoading] = useState(false);
  const urlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const ext = blob.type.split("/")[1] || "jpg";
    return new File([blob], `${fileName}.${ext}`, { type: blob.type });
  };

  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      id: 0,
      albumName: "",
      greetingMessage: "",
      creatorEmail: currentUser?.email || "",
      clientEmail: "",
      inviteeList: [],
      coverImageUrl: "",
      backImageUrl: "",
      photos: [] as string[],
    },
    validate: {
      albumName: (value) =>
        !value?.trim()
          ? t("field-is-required", { field: t("album-name") })
          : null,
      greetingMessage: (value) =>
        !value?.trim()
          ? t("field-is-required", { field: t("greeting-message") })
          : null,
    },
  });

  // ⬇️ Fetch album and prepopulate form if editing
  useEffect(() => {
    if (albumId) {
      setIsLoading(true);
      dispatch(getAlbumById({ id: Number(albumId) })).then(async (res: any) => {
        console.log("res", res);
        if (res.payload) {
          const album = res.payload;
          form.setValues({
            id: album.id,
            albumName: album.albumName || "",
            greetingMessage: album.albumDesc || "",
            creatorEmail: album.creatorEmail || currentUser?.email || "",
            clientEmail: album.client.email || "",
            inviteeList: album.viewers ? album.viewers.map((v) => v.email) : [],
            coverImageUrl: album.coverImage || "",
            backImageUrl: album.backImage || "",
            photos: album.imageUrls || [],
          });

          //SET IMAGES MANUALLY
          try {
            if (album.coverImage) {
              const file = await urlToFile(album.coverImage, "cover");
              setCover(file);
            }
            if (album.backImage) {
              const file = await urlToFile(album.backImage, "back");
              setBack(file);
            }
            if (album.imageUrls && album.imageUrls.length > 0) {
              const fileList = await Promise.all(
                album.imageUrls.map((url, i) =>
                  urlToFile(url, `photo-${i + 1}`),
                ),
              );
              setPhotos(fileList);
            }
            setIsLoading(false);
          } catch (err) {
            setIsLoading(false);
            console.error("Error converting images to files:", err);
          }
        }
      });
    }
  }, [albumId, dispatch]);

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stepper
        size="xs"
        active={active}
        iconSize={22}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label={t("step-1-4")} description={t("name")}>
          <CreateName
            {...{
              nextStep,
              prevStep,
              active,
              photos,
              setPhotos,
              cover,
              setCover,
              back,
              setBack,
              data: form,
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t("step-2-4")} description={t("invitees")}>
          <CreateEmails
            {...{
              nextStep,
              prevStep,
              active,
              photos,
              setPhotos,
              cover,
              setCover,
              back,
              setBack,
              data: form,
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t("step-3-4")} description={t("cover")}>
          <CreateFrontBack
            {...{
              nextStep,
              prevStep,
              active,
              photos,
              setPhotos,
              cover,
              setCover,
              back,
              setBack,
              data: form,
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t("step-4-4")} description={t("pages")}>
          <CreateAllImages
            {...{
              nextStep,
              prevStep,
              active,
              photos,
              setPhotos,
              cover,
              setCover,
              back,
              setBack,
              data: form,
            }}
          />
        </Stepper.Step>

        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </>
  );
}
