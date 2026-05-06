import type { Application, ApplicationStatus } from "@prisma/client";
import { statusLabels, statusOptions } from "@/lib/status";

type ApplicationFormProps = {
  action: (formData: FormData) => void;
  application?: Application;
  submitLabel: string;
};

function dateInputValue(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export function ApplicationForm({ action, application, submitLabel }: ApplicationFormProps) {
  const defaultStatus: ApplicationStatus = application?.status ?? "WISHLIST";

  return (
    <form className="form" action={action}>
      <div className="field-grid">
        <label>
          Company
          <input name="company" defaultValue={application?.company} required />
        </label>
        <label>
          Role
          <input name="role" defaultValue={application?.role} required />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Status
          <select name="status" defaultValue={defaultStatus}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Source
          <input name="source" defaultValue={application?.source ?? ""} placeholder="LinkedIn, referral, company site" />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Job URL
          <input name="jobUrl" type="url" defaultValue={application?.jobUrl ?? ""} />
        </label>
        <label>
          Location
          <input name="location" defaultValue={application?.location ?? ""} />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Salary range
          <input name="salaryRange" defaultValue={application?.salaryRange ?? ""} placeholder="$80k - $100k" />
        </label>
        <label>
          Date applied
          <input name="dateApplied" type="date" defaultValue={dateInputValue(application?.dateApplied)} />
        </label>
        <label>
          Follow-up date
          <input name="followUpDate" type="date" defaultValue={dateInputValue(application?.followUpDate)} />
        </label>
      </div>

      <label>
        Notes
        <textarea name="notes" defaultValue={application?.notes ?? ""} />
      </label>

      <div className="actions-row">
        <button className="button" type="submit">
          {submitLabel}
        </button>
        <a className="secondary-button" href="/applications">
          Cancel
        </a>
      </div>
    </form>
  );
}
