import { ApplicationStatus } from "@prisma/client";
import Link from "next/link";
import { ApplicationCard } from "@/components/application-card";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { statusLabels, statusOptions } from "@/lib/status";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [applications, counts] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      orderBy: [{ followUpDate: "asc" }, { updatedAt: "desc" }],
      take: 6
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: true
    })
  ]);

  const countByStatus = new Map<ApplicationStatus, number>();
  counts.forEach((count) => countByStatus.set(count.status, count._count));

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Your job search cockpit</h1>
          <p className="muted">Track each application, keep follow-ups visible, and stay organized throughout your search.</p>
        </div>
        <Link className="button" href="/applications/new">
          Add application
        </Link>
      </div>

      <section className="grid stats-grid" aria-label="Application counts by status">
        {statusOptions.map((status) => (
          <div className="stat" key={status}>
            <span>{statusLabels[status]}</span>
            <strong>{countByStatus.get(status) ?? 0}</strong>
          </div>
        ))}
      </section>

      <section>
        <div className="page-header">
          <div>
            <h2>Recent applications</h2>
            <p className="muted">Sorted by follow-up date first, then most recently updated.</p>
          </div>
          <Link className="secondary-button" href="/applications">
            View all
          </Link>
        </div>
        <div className="grid application-grid">
          {applications.map((application) => (
            <ApplicationCard application={application} key={application.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
