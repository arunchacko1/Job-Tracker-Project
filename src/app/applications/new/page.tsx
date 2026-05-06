import { ApplicationForm } from "@/components/application-form";
import { createApplication } from "@/lib/actions";
import { requireUserId } from "@/lib/session";

export default async function NewApplicationPage() {
  await requireUserId();

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">New application</p>
          <h1>Add an opportunity</h1>
          <p className="muted">Start with the company and role, then fill in details as your search progresses.</p>
        </div>
      </div>
      <ApplicationForm action={createApplication} submitLabel="Create application" />
    </main>
  );
}
