import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import { TextField, OptionGroupField } from "../../components/FormField";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function CollegeStep() {
  const { college, setCollege, registrationType, resetPersonal, resetCollege } = useRegistration();
  const navigate = useNavigate();
  // Initialize from the current registration context.
  const [form, setForm] = useState(college);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isInternal = registrationType === "Internal";

  // Sync a field update both to local state and to context immediately.
  const update = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    setCollege(next);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.collegeName.trim()) next.collegeName = "College name is required.";
    if (!form.department.trim()) next.department = "Department is required.";
    if (!form.year) next.year = "Year of study is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    navigate("/register/events");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <h2 className="font-display text-2xl text-parchment">College Details</h2>

      <TextField
        label="College Name"
        required
        disabled={isInternal}
        value={form.collegeName}
        onChange={(e) => update({ collegeName: e.target.value })}
        error={errors.collegeName}
        placeholder={isInternal ? undefined : "Your college name"}
      />
      <TextField
        label="Department"
        required
        value={form.department}
        onChange={(e) => update({ department: e.target.value })}
        error={errors.department}
        placeholder="e.g. Computer Science Engineering"
      />
      <OptionGroupField
        label="Year of Study"
        required
        name="year"
        value={form.year}
        onChange={(value) => update({ year: value })}
        options={YEARS.map((y) => ({ label: y, value: y }))}
        error={errors.year}
      />

      <div className="flex items-center pt-4">
        <button
          type="button"
          onClick={() => {
            resetPersonal();
            resetCollege();
            navigate("/register/personal");
          }}
          className="rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            const empty = {
              collegeName: isInternal ? "Grace College of Engineering" : "",
              department: "",
              year: "",
              registrationType: registrationType,
            };
            setForm(empty);
            setCollege(empty);
            setErrors({});
          }}
          className="ml-4 rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Clear
        </button>
        <div className="flex-1" />
        <button
          type="submit"
          className="rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
