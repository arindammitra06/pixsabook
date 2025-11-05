"use client";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Stepper, Button, Group ,Box} from "@mantine/core";
import CreateName from "@/components/create-name.component";
import CreateEmails from "@/components/create-email.component";
import CreateAllImages from "@/components/create-all-images.component copy";
import CreateFrontBack from "@/components/create-front-back.component";
import { useForm } from "@mantine/form";
import { t } from 'i18next';
import { useAppSelector } from "@/store/hooks";

export default function CreateLayout() {
  const [active, setActive] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [cover, setCover] = useState<File>();
  const [back, setBack] = useState<File>();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    
    initialValues: {
      id: 0,
      albumName: '',
      greetingMessage: '',
      creatorEmail: currentUser?.email || '',
      clientEmail: '',
      inviteeList: [],
      coverImageUrl: '',
      backImageUrl: '',
      photos: [] as string[],
    },
    validate: {
      albumName: (value) => (value === null || value === ''|| value.trim() === '' ? t('field-is-required', {field: t('album-name')}) : null),
      greetingMessage: (value) => (value === null || value === ''|| value.trim() === ''? t('field-is-required', {field: t('greeting-message')}) : null),
      
    },
  });
  
  
  return (
    <>
      <Stepper size="xs" active={active} iconSize={22} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step label={t('step-1-4')} description={t('name')}>
          <CreateName
            {...{
              nextStep: nextStep,
              prevStep: prevStep,
              active: active,
              photos: photos,
              setPhotos: setPhotos,
              cover: cover,
              setCover: setCover,
              back: back,
              setBack: setBack,
              data: form
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t('step-2-4')}  description={t('invitees')}>
          <CreateEmails
            {...{
              nextStep: nextStep,
              prevStep: prevStep,
              active: active,
              photos: photos,
              setPhotos: setPhotos,
              cover: cover,
              setCover: setCover,
              back: back,
              setBack: setBack,
              data: form
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t('step-3-4')}  description={t('cover')}>
           <CreateFrontBack
            {...{
              nextStep: nextStep,
              prevStep: prevStep,
              active: active,
              photos: photos,
              setPhotos: setPhotos,
              cover: cover,
              setCover: setCover,
              back: back,
              setBack: setBack,
              data: form
            }}
          />
        </Stepper.Step>

        <Stepper.Step label={t('step-4-4')}  description={t('pages')}>
           <CreateAllImages
            {...{
              nextStep: nextStep,
              prevStep: prevStep,
              active: active,
              photos: photos,
              setPhotos: setPhotos,
              cover: cover,
              setCover: setCover,
              back: back,
              setBack: setBack,
              data: form
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
