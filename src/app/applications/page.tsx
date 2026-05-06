import { ApplicationStatus } from "@prisma/client";
import { ApplicationCard } from "@/components/application-card";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { statusLabels, statusOptions } from "@/lib/status";

type ApplicationsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = statusOptions.includes(params.status as ApplicationStatus) ? (params.status as ApplicationStatus) : undefined;

  const applications = await prisma.application.findMany({
    where: {
      userId,
      status,
      OR: query
        ? [
            { company: { contains: query, mode: "insensitive" } },
            { role: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } }
          ]
        : undefined
    },
    orderBy: [{ updatedAt: "desc" }]
  });

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Applications</p>
          <h1>All opportunities</h1>
          <p className="muted">Search and filter without losing the simple data model underneath.</p>
        </div>
        <a className="button" href="/applications/new">
          Add application
        </a>
      </div>

      <form className="form" action="/applications">
        <div className="filter-row">
          <label>
            Search
            <input name="q" defaultValue={query} placeholder="Company, role, or location" />
          </label>
          <label>
            Status
            <select name="status" defaultValue={status ?? ""}>
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {statusLabels[option]}
                </option>
              ))}
            </select>
          </label>
          <button className="button" type="submit">
            Filter
          </button>
        </div>
      </form>

      <div className="grid application-grid" style={{ marginTop: 18 }}>
        {applications.map((application) => (
          <ApplicationCard application={application} key={application.id} />
        ))}
      </div>
    </main>
  );
}
