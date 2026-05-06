"use server";

import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { parseApplicationForm, toNullableDate } from "@/lib/validation";

function valuesForDatabase(parsed: ReturnType<typeof parseApplicationForm> & { success: true }) {
  return {
    company: parsed.data.company,
    role: parsed.data.role,
    jobUrl: parsed.data.jobUrl,
    location: parsed.data.location,
    salaryRange: parsed.data.salaryRange,
    status: parsed.data.status,
    source: parsed.data.source,
    notes: parsed.data.notes,
    dateApplied: toNullableDate(parsed.data.dateApplied),
    followUpDate: toNullableDate(parsed.data.followUpDate)
  };
}

export async function createApplication(formData: FormData) {
  const userId = await requireUserId();
  const parsed = parseApplicationForm(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid application form.");
  }

  const application = await prisma.application.create({
    data: {
      userId,
      ...valuesForDatabase(parsed),
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: parsed.data.status,
          note: "Application created."
        }
      }
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect(`/applications/${application.id}`);
}

export async function updateApplication(applicationId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = parseApplicationForm(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid application form.");
  }

  const existing = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId
    }
  });

  if (!existing) {
    throw new Error("Application not found.");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: valuesForDatabase(parsed)
  });

  if (existing.status !== parsed.data.status) {
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: existing.status,
        toStatus: parsed.data.status,
        note: `Status changed from ${existing.status} to ${parsed.data.status}.`
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
  redirect(`/applications/${applicationId}`);
}

export async function deleteApplication(applicationId: string) {
  const userId = await requireUserId();

  await prisma.application.deleteMany({
    where: {
      id: applicationId,
      userId
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect("/applications");
}

export async function archiveApplication(applicationId: string) {
  const userId = await requireUserId();

  const existing = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId
    }
  });

  if (!existing || existing.status === ApplicationStatus.ARCHIVED) {
    return;
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.ARCHIVED }
  });

  await prisma.applicationStatusHistory.create({
    data: {
      applicationId,
      fromStatus: existing.status,
      toStatus: ApplicationStatus.ARCHIVED,
      note: "Application archived."
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
}
