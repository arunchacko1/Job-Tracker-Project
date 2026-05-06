import { ApplicationStatus } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { getFollowUpUrgency, followUpUrgencyLabel, type FollowUpUrgency } from "@/lib/follow-ups";
import { statusLabels } from "@/lib/status";

const activeStatuses: ApplicationStatus[] = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER"];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

export default async function RemindersPage() {
  const userId = await requireUserId();
  const today = new Date();
  const applications = await prisma.application.findMany({
    where: {
      userId,
      followUpDate: { not: null },
      status: { in: activeStatuses }
    },
    orderBy: [{ followUpDate: "asc" }, { updatedAt: "desc" }]
  });

  const grouped = applications.reduce<Record<Exclude<FollowUpUrgency, "none">, typeof applications>>(
    (groups, application) => {
      const urgency = getFollowUpUrgency(application.followUpDate, today);

      if (urgency !== "none") {
        groups[urgency].push(application);
      }

      return groups;
    },
    {
      overdue: [],
      "due-soon": [],
      later: []
    }
  );

  const sections: Array<{ title: string; urgency: Exclude<FollowUpUrgency, "none">; description: string }> = [
    {
      title: "Overdue",
      urgency: "overdue",
      description: "Follow-ups with dates before today."
    },
    {
      title: "Due soon",
      urgency: "due-soon",
      description: "Follow-ups due today or within the next seven days."
    },
    {
      title: "Later",
      urgency: "later",
      description: "Follow-ups scheduled beyond the next week."
    }
  ];

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reminders</p>
          <h1>Follow-up queue</h1>
          <p className="muted">Prioritize open opportunities by the next action date.</p>
        </div>
        <Link className="button" href="/applications/new">
          Add application
        </Link>
      </div>

      <section className="grid stats-grid" aria-label="Follow-up summary">
        {sections.map((section) => (
          <div className="stat" key={section.urgency}>
            <span>{section.title}</span>
            <strong>{grouped[section.urgency].length}</strong>
          </div>
        ))}
      </section>

      <div className="grid reminders-grid">
        {sections.map((section) => (
          <section className="card" key={section.urgency}>
            <div className="card-title-row">
              <div>
                <h2>{section.title}</h2>
                <p className="muted">{section.description}</p>
              </div>
              <span className={`status urgency-${section.urgency}`}>{followUpUrgencyLabel(section.urgency)}</span>
            </div>

            {grouped[section.urgency].length ? (
              <div className="reminder-list">
                {grouped[section.urgency].map((application) => (
                  <article className="reminder-item" key={application.id}>
                    <div>
                      <h3>{application.role}</h3>
                      <p className="muted">
                        {application.company} · {statusLabels[application.status]}
                      </p>
                    </div>
                    <div className="reminder-actions">
                      <strong>{formatDate(application.followUpDate as Date)}</strong>
                      <Link className="secondary-button" href={`/applications/${application.id}`}>
                        View
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">No applications in this group.</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
