export interface FlowStep {
  n: string;
  label: string;
  path: string;
}

/**
 * The registration flow is fixed: Personal → College → Events → Team → Payment.
 * The Team step is always shown (as a static "One Participant" confirmation) —
 * it's no longer conditional on event type, which also removes a source of the
 * "sometimes blank page" bug (a step that redirected away from itself mid-render).
 */
export function getFlowSteps(): FlowStep[] {
  return [
    { n: "01", label: "Personal", path: "/register/personal" },
    { n: "02", label: "College", path: "/register/college" },
    { n: "03", label: "Events", path: "/register/events" },
    { n: "04", label: "Team", path: "/register/team" },
    { n: "05", label: "Payment", path: "/register/payment" },
  ];
}
