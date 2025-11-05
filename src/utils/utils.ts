import { IconBellRinging, IconReceipt2, IconFingerprint, IconKey, IconDatabaseImport, Icon2fa, IconSettings, IconHome2, IconPhotoPlus, IconBriefcase2, IconSearch, IconArtboard } from "@tabler/icons-react";
import { t } from "i18next";


export const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL+'/api/v1/';

export const getImagePath = (path: string): string => {
  const basePath = process.env.NODE_ENV === "production" ? "/pixsabook" : "";
  return `${basePath}${path}`;
};

export function isWithinLast7Days(createdDate: string | Date): boolean {
  const created = new Date(createdDate);
  const now = new Date();

  // Calculate difference in milliseconds
  const diffInMs = now.getTime() - created.getTime();

  // 7 days in milliseconds
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  return diffInMs <= sevenDaysInMs && diffInMs >= 0;
}
