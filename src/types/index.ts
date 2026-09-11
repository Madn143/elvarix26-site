export type EventCategory = "Technical" | "Non-Technical";
export type ParticipationType = "Individual" | "Team" | "TBA";
export type EventStatus = "open" | "closed" | "full";

export interface SymposiumEvent {
  _id: string;
  eventName: string;
  slug: string;
  category: EventCategory;
  description: string;
  participationType: ParticipationType;
  maxTeamSize: number | null;
  date: string | null;
  time: string | null;
  venue: string | null;
  registrationFee: number | null;
  maxParticipants: number | null;
  registeredCount: number;
  status: EventStatus;
  rules?: string[];
  prizes?: string[];
  isFull?: boolean;
  // Selectable game options — only used by E-Sports.
  gameOptions?: string[];
}

export interface SelectedEvent {
  eventId: string;
  eventName: string;
  eventCategory?: string;
  eventTime?: string | null;
  eventVenue?: string | null;
  participationType: ParticipationType;
  maxTeamSize: number | null;
  registrationFee: number | null;
}

export type RegistrationType = "Internal" | "External";

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
}

export interface CollegeDetails {
  registrationType: RegistrationType | null;
  collegeName: string;
  department: string;
  year: string;
}

export type MemberPaymentStatus = "PAID" | "PENDING";

export type FoodPreference = "Veg" | "Non-Veg";

// A team member (currently only Paper Presentation collects these):
// name/phone/email, plus each member's own food preference.
export interface TeamMemberLite {
  name: string;
  phone: string;
  email: string;
  foodPreference?: FoodPreference;
}

export type PaymentStatus = "PAID" | "PENDING";
export type RegistrationStatus = "CONFIRMED" | "PENDING";
export type PaymentAmountCheck = "UNVERIFIED" | "MATCHED" | "MISMATCH";

export interface Participant {
  _id: string;
  registrationId: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  registrationType: RegistrationType;
  collegeName: string;
  department: string;
  year: string;
  selectedEvents: {
    eventName: string;
    eventCategory?: string;
    eventDate?: string | null;
    eventTime?: string | null;
    eventVenue?: string | null;
  }[];
  isTeamRegistration: boolean;
  // Paper Presentation team details
  paperTeamName?: string;
  paperTeamSize?: number;
  // E-Sports team details
  esportsTeamName?: string;
  esportsTeamSize?: number;
  esportsGame?: string;
  // Food preference of the registering participant
  foodPreference?: FoodPreference;
  // Legacy field kept for backward compat
  teamMembers: TeamMemberLite[];
  transactionId: string;
  amountPerParticipant: number;
  totalAmount: number;
  paymentScreenshot: string;
  paymentAmountCheck: PaymentAmountCheck;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  status: "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  internalCount: number;
  externalCount: number;
  totalColleges: number;
  totalEvents: number;
  todaysRegistrations: number;
}

export interface AnalyticsPoint {
  label: string;
  count: number;
}

export interface AnalyticsData {
  growthByDay: AnalyticsPoint[];
  internalVsExternal: AnalyticsPoint[];
  eventWise: AnalyticsPoint[];
  collegeWise: AnalyticsPoint[];
  departmentWise: AnalyticsPoint[];
  yearWise: AnalyticsPoint[];
}

export interface CollegeSummary {
  collegeName: string;
  totalParticipants: number;
  totalTeams: number;
  eventsSelected: string[];
}

