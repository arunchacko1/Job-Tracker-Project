import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .refine((value) => value === undefined || !Number.isNaN(Date.parse(value)), {
    message: "Use a valid date."
  });

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value));

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  jobUrl: optionalText.refine(
    (value) => value === undefined || value.startsWith("http://") || value.startsWith("https://"),
    "Job URL must start with http:// or https://."
  ),
  location: optionalText,
  salaryRange: optionalText,
  status: z.nativeEnum(ApplicationStatus),
  source: optionalText,
  notes: optionalText,
  dateApplied: optionalDate,
  followUpDate: optionalDate
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function parseApplicationForm(formData: FormData) {
  return applicationSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    jobUrl: formData.get("jobUrl"),
    location: formData.get("location"),
    salaryRange: formData.get("salaryRange"),
    status: formData.get("status"),
    source: formData.get("source"),
    notes: formData.get("notes"),
    dateApplied: formData.get("dateApplied"),
    followUpDate: formData.get("followUpDate")
  });
}

export function toNullableDate(value: string | undefined) {
  return value ? new Date(value) : null;
}
