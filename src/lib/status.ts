import { ApplicationStatus } from "@prisma/client";

export const statusLabels: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ARCHIVED: "Archived"
};

export const statusOptions = Object.values(ApplicationStatus);
