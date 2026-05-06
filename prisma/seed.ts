import bcrypt from "bcryptjs";
import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: { passwordHash },
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash
    }
  });

  const existingCount = await prisma.application.count({
    where: { userId: user.id }
  });

  if (existingCount > 0) {
    return;
  }

  await prisma.application.create({
    data: {
      userId: user.id,
      company: "Northstar Labs",
      role: "Frontend Engineer",
      jobUrl: "https://example.com/jobs/frontend-engineer",
      location: "Remote",
      salaryRange: "$90k - $115k",
      status: ApplicationStatus.INTERVIEWING,
      source: "LinkedIn",
      notes: "Recruiter screen went well. Prepare React and accessibility examples.",
      dateApplied: new Date("2026-04-12"),
      followUpDate: new Date("2026-05-10"),
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.APPLIED,
            note: "Submitted application."
          },
          {
            fromStatus: ApplicationStatus.APPLIED,
            toStatus: ApplicationStatus.INTERVIEWING,
            note: "Recruiter screen scheduled."
          }
        ]
      }
    }
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      company: "Harbor Health",
      role: "Junior Full-Stack Developer",
      location: "San Diego, CA",
      status: ApplicationStatus.APPLIED,
      source: "Company website",
      notes: "Tailored cover letter around patient scheduling tools.",
      dateApplied: new Date("2026-04-24"),
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: ApplicationStatus.APPLIED,
          note: "Application submitted."
        }
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
