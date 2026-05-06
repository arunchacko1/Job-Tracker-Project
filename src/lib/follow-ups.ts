export type FollowUpUrgency = "overdue" | "due-soon" | "later" | "none";

const millisecondsInDay = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getFollowUpUrgency(followUpDate: Date | null, today = new Date()): FollowUpUrgency {
  if (!followUpDate) {
    return "none";
  }

  const dueDate = startOfDay(followUpDate);
  const currentDate = startOfDay(today);
  const daysUntilDue = Math.floor((dueDate.getTime() - currentDate.getTime()) / millisecondsInDay);

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= 7) {
    return "due-soon";
  }

  return "later";
}

export function followUpUrgencyLabel(urgency: FollowUpUrgency) {
  const labels: Record<FollowUpUrgency, string> = {
    overdue: "Overdue",
    "due-soon": "Due soon",
    later: "Later",
    none: "No follow-up"
  };

  return labels[urgency];
}
