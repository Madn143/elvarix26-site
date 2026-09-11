import { collection, doc, getDoc, getDocs, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FEE_BY_REGISTRATION_TYPE } from "../../utils/payment";
import type {
  CollegeDetails,
  FoodPreference,
  Participant,
  PersonalDetails,
  SelectedEvent,
} from "../../types";

interface CreateRegistrationPayload extends PersonalDetails, CollegeDetails {
  selectedEvents: SelectedEvent[];
  // Paper Presentation team (if selected)
  hasPaperPresentation?: boolean;
  paperTeamName?: string;
  paperTeamSize?: number;
  // E-Sports team (if selected)
  hasEsports?: boolean;
  esportsTeamName?: string;
  esportsTeamSize?: number;
  esportsGame?: string;
  // Food preference of the registering participant
  foodPreference?: FoodPreference;
  transactionId: string;
  paymentScreenshot: string;
  paymentAmountCheck: "MATCHED";
}

/**
 * Safely generates the next sequential ELVA id (e.g. ELVA1, ELVA2) using a Firestore transaction.
 */
async function generateNextRegistrationId(): Promise<string> {
  const counterRef = doc(db, "counters", "registrationId");
  try {
    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        transaction.set(counterRef, { current: 1 });
        return 1;
      }
      const newCurrent = counterDoc.data().current + 1;
      transaction.update(counterRef, { current: newCurrent });
      return newCurrent;
    });
    return `ELVA${newId}`;
  } catch (error) {
    console.error("Failed to generate sequential ID, falling back to timestamp", error);
    return `ELVA${Date.now()}`;
  }
}

export async function submitRegistration(payload: CreateRegistrationPayload): Promise<Participant> {
  const now = new Date().toISOString();
  const registrationId = await generateNextRegistrationId();

  const feePerPerson = FEE_BY_REGISTRATION_TYPE[payload.registrationType!];
  const isTeamRegistration = !!(payload.hasPaperPresentation || payload.hasEsports);

  const body: Participant = {
    _id: registrationId,
    registrationId,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    gender: payload.gender,
    registrationType: payload.registrationType!,
    collegeName: payload.collegeName,
    department: payload.department,
    year: payload.year,
    selectedEvents: payload.selectedEvents.map((e) => ({
      eventName: e.eventName,
      eventCategory: e.eventCategory,
      eventTime: e.eventTime,
      eventVenue: e.eventVenue,
    })),
    isTeamRegistration,
    // Firestore does not accept undefined values, so only persist optional
    // details when the corresponding registration data exists.
    ...(payload.paperTeamName !== undefined ? { paperTeamName: payload.paperTeamName } : {}),
    ...(payload.paperTeamSize !== undefined ? { paperTeamSize: payload.paperTeamSize } : {}),
    ...(payload.esportsTeamName !== undefined ? { esportsTeamName: payload.esportsTeamName } : {}),
    ...(payload.esportsTeamSize !== undefined ? { esportsTeamSize: payload.esportsTeamSize } : {}),
    ...(payload.esportsGame !== undefined ? { esportsGame: payload.esportsGame } : {}),
    ...(payload.foodPreference !== undefined ? { foodPreference: payload.foodPreference } : {}),
    teamMembers: [],
    transactionId: payload.transactionId,
    paymentScreenshot: payload.paymentScreenshot,
    paymentAmountCheck: payload.paymentAmountCheck,
    amountPerParticipant: feePerPerson,
    totalAmount: feePerPerson,
    paymentStatus: "PAID",
    registrationStatus: "CONFIRMED",
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  };

  // Save to Firestore
  await setDoc(doc(db, "registrations", registrationId), body);

  return body;
}

export async function submitFeedback(participant: Participant, feedback: string): Promise<void> {
  const now = new Date().toISOString();
  const feedbackId = `FB_${Date.now()}`;

  const feedbackData = {
    feedbackId,
    registrationId: participant.registrationId,
    fullName: participant.fullName,
    email: participant.email,
    collegeName: participant.collegeName,
    feedback,
    createdAt: now,
  };

  await setDoc(doc(db, "feedback", feedbackId), feedbackData);
}

export async function fetchRegistrationById(registrationId: string): Promise<Participant> {
  const docRef = doc(db, "registrations", registrationId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Participant;
  } else {
    throw new Error(`Registration lookup failed: Registration ${registrationId} not found`);
  }
}

export async function fetchAllRegistrations(): Promise<Participant[]> {
  const snapshot = await getDocs(collection(db, "registrations"));
  return snapshot.docs
    .map((registration) => registration.data() as Participant)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
