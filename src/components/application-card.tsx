import type { Application } from "@prisma/client";
import Link from "next/link";
import { statusLabels } from "@/lib/status";

type ApplicationCardProps = {
  application: Application;
};

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(value) : "Not set";
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <article className="card">
      <div className="card-title-row">
        <h3>{application.role}</h3>
        <span className="status">{statusLabels[application.status]}</span>
      </div>
      <p className="muted">{application.company}</p>
      <p>
        <strong>Follow-up:</strong> {formatDate(application.followUpDate)}
      </p>
      <p>
        <strong>Applied:</strong> {formatDate(application.dateApplied)}
      </p>
      <div className="actions-row">
        <Link className="secondary-button" href={`/applications/${application.id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
