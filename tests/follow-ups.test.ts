import { describe, expect, it } from "vitest";
import { getFollowUpUrgency } from "@/lib/follow-ups";

const today = new Date("2026-05-06T12:00:00");

describe("getFollowUpUrgency", () => {
  it("marks past dates as overdue", () => {
    expect(getFollowUpUrgency(new Date("2026-05-05T23:59:00"), today)).toBe("overdue");
  });

  it("marks today and the next seven days as due soon", () => {
    expect(getFollowUpUrgency(new Date("2026-05-06T08:00:00"), today)).toBe("due-soon");
    expect(getFollowUpUrgency(new Date("2026-05-13T08:00:00"), today)).toBe("due-soon");
  });

  it("marks dates beyond a week as later", () => {
    expect(getFollowUpUrgency(new Date("2026-05-14T08:00:00"), today)).toBe("later");
  });

  it("marks missing follow-up dates as none", () => {
    expect(getFollowUpUrgency(null, today)).toBe("none");
  });
});
