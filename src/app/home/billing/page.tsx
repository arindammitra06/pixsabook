"use client";

import AlbumGallery from "@/components/generic/AlbumGallery";
import { FeaturesTitle } from "@/components/generic/feature-title.component";
import { PlanView } from "@/components/generic/plan-view";
import { UserInfo } from "@/components/generic/user-info";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { buildAnAlert, AlertType } from "@/utils/message.util";
import { Space } from "@mantine/core";
import { t } from "i18next";
import { useState } from "react";
export default function BillingLayout() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(currentUser?.UserSubscription?.[0] ?? null);
 
  return (
    <>
      {buildAnAlert(
        t("billing-page-title"),
        t("billing-page-message"),
        AlertType.MESSAGE,
      )}
      <FeaturesTitle />
      <Space h={'lg'} />
      {currentUser !== null && currentUser !== undefined && (
        <>
          <UserInfo user={currentUser} />
          <Space h={'lg'}/>
          <PlanView
            isNew={false}
            isReadonly={true}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            currentPlanName={currentUser?.UserSubscription?.[0].Plan.name.toUpperCase()}
            expiry={currentUser?.UserSubscription?.[0].expiresOn}
            count={currentUser?.UserSubscription?.[0].creditsLeft}
          />
        </>
      )}
    </>
  );
}
