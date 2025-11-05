import { AppUser } from "./user.model";

export enum BooleanFlag {
    Yes,
    No
  }

export interface Album {
  id: number;
  albumName?: string;
  albumDesc?: string;
  active: BooleanFlag; // matches BooleanFlag enum
  isPublished: BooleanFlag;
  coverImage?: string;
  backImage?: string;
  imageUrls?: string[]; // stored as JSON array of strings
  likesByEmail?: string[]; // stored as JSON array of emails
  rating: number;
  pin: number;

  // Relations
  createdById: number;
  createdBy: AppUser; // User interface should be defined
  clientId: number;
  client: AppUser;
  viewers: AppUser[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number; // user id
}
