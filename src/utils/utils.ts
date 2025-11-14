import { t } from "i18next";

import * as crypto from 'crypto';
const ENC = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv(ALGO, ENC, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const baseUrl = "/api/";

export function formatToDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}


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
