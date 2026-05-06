import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/application-form";
import { updateApplication } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

type EditApplicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const application = await prisma.application.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!application) {
    notFound();
  }

  const action = updateApplication.bind(null, application.id);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Edit application</p>
          <h1>{application.company}</h1>
          <p className="muted">Changing the status creates a history entry automatically.</p>
        </div>
      </div>
      <ApplicationForm action={action} application={application} submitLabel="Save changes" />
    </main>
  );
}
