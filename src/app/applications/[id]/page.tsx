import { notFound } from "next/navigation";
import { archiveApplication, deleteApplication } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { statusLabels } from "@/lib/status";

type ApplicationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value) : "Not set";
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const application = await prisma.application.findFirst({
    where: {
      id,
      userId
    },
    include: {
      statusHistory: {
        orderBy: { changedAt: "desc" }
      }
    }
  });

  if (!application) {
    notFound();
  }

  const archiveAction = archiveApplication.bind(null, application.id);
  const deleteAction = deleteApplication.bind(null, application.id);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{application.company}</p>
          <h1>{application.role}</h1>
          <p className="muted">{application.location ?? "Location not set"}</p>
        </div>
        <div className="actions-row">
          <a className="secondary-button" href={`/applications/${application.id}/edit`}>
            Edit
          </a>
          <form action={archiveAction}>
            <button className="secondary-button" type="submit">
              Archive
            </button>
          </form>
          <form action={deleteAction}>
            <button className="danger-button" type="submit">
              Delete
            </button>
          </form>
        </div>
      </div>

      <section className="grid" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)" }}>
        <article className="card">
          <div className="card-title-row">
            <h2>Application details</h2>
            <span className="status">{statusLabels[application.status]}</span>
          </div>
          <p>
            <strong>Source:</strong> {application.source ?? "Not set"}
          </p>
          <p>
            <strong>Salary:</strong> {application.salaryRange ?? "Not set"}
          </p>
          <p>
            <strong>Date applied:</strong> {formatDate(application.dateApplied)}
          </p>
          <p>
            <strong>Follow-up date:</strong> {formatDate(application.followUpDate)}
          </p>
          {application.jobUrl ? (
            <p>
              <strong>Job post:</strong>{" "}
              <a href={application.jobUrl} target="_blank" rel="noreferrer">
                Open posting
              </a>
            </p>
          ) : null}
          <h3>Notes</h3>
          <p>{application.notes || "No notes yet."}</p>
        </article>

        <aside className="card">
          <h2>Status history</h2>
          <ol className="history">
            {application.statusHistory.map((item) => (
              <li className="history-item" key={item.id}>
                <strong>{statusLabels[item.toStatus]}</strong>
                <p className="muted">{formatDate(item.changedAt)}</p>
                <p>{item.note}</p>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  );
}
