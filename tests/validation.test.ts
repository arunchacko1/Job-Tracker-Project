import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@prisma/client";
import { applicationSchema } from "@/lib/validation";

describe("applicationSchema", () => {
  it("accepts a valid application", () => {
    const result = applicationSchema.safeParse({
      company: "Northstar Labs",
      role: "Frontend Engineer",
      jobUrl: "https://example.com/job",
      location: "Remote",
      salaryRange: "$90k - $115k",
      status: ApplicationStatus.APPLIED,
      source: "LinkedIn",
      notes: "Follow up next week.",
      dateApplied: "2026-04-12",
      followUpDate: "2026-05-10"
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = applicationSchema.safeParse({
      company: "",
      role: "",
      jobUrl: "",
      location: "",
      salaryRange: "",
      status: ApplicationStatus.APPLIED,
      source: "",
      notes: "",
      dateApplied: "",
      followUpDate: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects job urls without http or https", () => {
    const result = applicationSchema.safeParse({
      company: "Harbor Health",
      role: "Full-Stack Developer",
      jobUrl: "example.com/job",
      location: "",
      salaryRange: "",
      status: ApplicationStatus.WISHLIST,
      source: "",
      notes: "",
      dateApplied: "",
      followUpDate: ""
    });

    expect(result.success).toBe(false);
  });
});
