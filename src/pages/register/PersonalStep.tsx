import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import { TextField, OptionGroupField } from "../../components/FormField";
import type { FoodPreference } from "../../types";

const FOOD_OPTIONS: FoodPreference[] = ["Veg", "Non-Veg"];

export default function PersonalStep() {
  const { personal, setPersonal, foodPreference, setFoodPreference } = useRegistration();
  const navigate = useNavigate();
  // Initialize from the current registration context.
  const [form, setForm] = useState(personal);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync a field update both to local state and to context immediately.
  const update = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    setPersonal(next);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      next.phone = "Enter a valid 10-digit mobile number starting with 6-9.";
    if (!foodPreference)
      next.foodPreference = "Please select your food preference.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    navigate("/register/college");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <h2 className="font-display text-2xl text-parchment">Personal Details</h2>

      <TextField
        label="Full Name"
        required
        value={form.fullName}
        onChange={(e) => update({ fullName: e.target.value })}
        error={errors.fullName}
        placeholder="As per college ID"
      />
      <TextField
        label="Email Address"
        type="email"
        required
        autoComplete="email"
        value={form.email}
        onChange={(e) => update({ email: e.target.value })}
        error={errors.email}
        placeholder="you@example.com"
      />
      <TextField
        label="Mobile Number"
        required
        inputMode="numeric"
        type="tel"
        autoComplete="tel"
        pattern="[6-9][0-9]{9}"
        maxLength={10}
        value={form.phone}
        onChange={(e) => update({ phone: e.target.value.replace(/\D/g, "") })}
        error={errors.phone}
        placeholder="10-digit number"
      />
      <OptionGroupField
        label="Gender (optional)"
        name="gender"
        value={form.gender}
        onChange={(value) => update({ gender: value })}
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Other", value: "Other" },
          { label: "Prefer not to say", value: "Prefer not to say" },
        ]}
      />
      <OptionGroupField
        label="Food Preference"
        required
        name="food-preference"
        value={foodPreference || ""}
        onChange={(value) => setFoodPreference(value as FoodPreference)}
        options={FOOD_OPTIONS.map((o) => ({ label: o, value: o }))}
        error={errors.foodPreference}
      />

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => {
            const empty = { fullName: "", email: "", phone: "", gender: "" };
            setForm(empty);
            setPersonal(empty);
            setFoodPreference(null as any);
            setErrors({});
          }}
          className="rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Clear
        </button>
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
