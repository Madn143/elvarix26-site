import { Navigate, Outlet, useLocation } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { useRegistration } from "../../context/RegistrationContext";
import { getFlowSteps } from "../../utils/registrationSteps";

export default function RegisterLayout() {
  const { registrationType } = useRegistration();
  const location = useLocation();

  // Force people to start from Home if they land here without having picked
  // a registration type first — including a fresh page load/reload directly
  // on one of these steps, since loadDraft() (RegistrationContext.tsx) only
  // resumes a saved draft when the fresh load lands on /register/payment.
  if (!registrationType) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto min-h-[80vh] max-w-3xl px-5 py-16">
      <ProgressSteps currentPath={location.pathname} steps={getFlowSteps()} />
      <Outlet />
    </div>
  );
}
