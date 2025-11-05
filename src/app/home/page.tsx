"use client"

import AlbumGallery from "@/components/generic/AlbumGallery";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { t } from "i18next";
export default function HomeLayout() {
  return (
    <>
      {buildAnAlert(
        t("home-page-title"),
        t("home-page-message"),
        AlertType.MESSAGE,
      )}
      <AlbumGallery  pageType={'all'}/>
    </>
  );
}
