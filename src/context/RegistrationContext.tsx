import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  CollegeDetails,
  FoodPreference,
  Participant,
  PersonalDetails,
  RegistrationType,
  SelectedEvent,
} from "../types";

interface RegistrationState {
  registrationType: RegistrationType | null;
  personal: PersonalDetails;
  college: CollegeDetails;
  selectedEvents: SelectedEvent[];
  foodPreference: FoodPreference | null;
  // Paper Presentation team (Technical)
  paperTeamName: string;
  paperTeamSize: number;
  // E-Sports team (Non-Technical)
  esportsTeamName: string;
  esportsTeamSize: number;
  esportsGame: string | null;
  result: Participant | null;
  preselectEventId: string | null;
}

const emptyPersonal: PersonalDetails = { fullName: "", email: "", phone: "", gender: "" };
const emptyCollege: CollegeDetails = {
  registrationType: null,
  collegeName: "",
  department: "",
  year: "",
};

const initialState: RegistrationState = {
  registrationType: null,
  personal: emptyPersonal,
  college: emptyCollege,
  selectedEvents: [],
  foodPreference: null,
  paperTeamName: "",
  paperTeamSize: 1,
  esportsTeamName: "",
  esportsTeamSize: 1,
  esportsGame: null,
  result: null,
  preselectEventId: null,
};

interface RegistrationContextValue extends RegistrationState {
  setRegistrationType: (type: RegistrationType) => void;
  setPersonal: (details: PersonalDetails) => void;
  setCollege: (details: CollegeDetails) => void;
  toggleEvent: (event: SelectedEvent) => void;
  selectSingleEvent: (event: SelectedEvent) => void;
  setFoodPreference: (pref: FoodPreference | null) => void;
  setPaperTeamName: (name: string) => void;
  setPaperTeamSize: (size: number) => void;
  setEsportsTeamName: (name: string) => void;
  setEsportsTeamSize: (size: number) => void;
  setEsportsGame: (game: string) => void;
  setResult: (participant: Participant) => void;
  setPreselectEventId: (eventId: string | null) => void;
  resetPersonal: () => void;
  resetCollege: () => void;
  resetEvents: () => void;
  resetTeam: () => void;
  resetRegistration: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  // Pure in-memory state — no sessionStorage. Each fresh page load starts clean.
  // RegisterLayout redirects to "/" if registrationType is null, ensuring the
  // user always starts from the beginning on a fresh load or refresh.
  const [state, setState] = useState<RegistrationState>(initialState);

  const setRegistrationType = (type: RegistrationType) => {
    setState((s) => ({
      ...s,
      registrationType: type,
      college: {
        ...s.college,
        registrationType: type,
        collegeName: type === "Internal" ? "Grace College of Engineering" : "",
      },
    }));
  };

  const setPersonal = (details: PersonalDetails) =>
    setState((s) => ({ ...s, personal: details }));

  const setCollege = (details: CollegeDetails) =>
    setState((s) => ({ ...s, college: details }));

  // At most one Technical and one Non-Technical event per registration.
  // Selecting an already-chosen event deselects it; selecting a new event
  // in a category replaces the existing one in that category.
  const toggleEvent = (event: SelectedEvent) => {
    setState((s) => {
      const exists = s.selectedEvents.find((e) => e.eventId === event.eventId);
      if (exists) {
        return { ...s, selectedEvents: s.selectedEvents.filter((e) => e.eventId !== event.eventId) };
      }
      const withoutSameCategory = s.selectedEvents.filter(
        (e) => e.eventCategory !== event.eventCategory
      );
      return { ...s, selectedEvents: [...withoutSameCategory, { ...event }] };
    });
  };

  const selectSingleEvent = (event: SelectedEvent) =>
    setState((s) => ({ ...s, selectedEvents: [{ ...event }] }));

  const setFoodPreference = (pref: FoodPreference | null) =>
    setState((s) => ({ ...s, foodPreference: pref }));

  const setPaperTeamName = (name: string) =>
    setState((s) => ({ ...s, paperTeamName: name }));

  const setPaperTeamSize = (size: number) =>
    setState((s) => ({ ...s, paperTeamSize: size }));

  const setEsportsTeamName = (name: string) =>
    setState((s) => ({ ...s, esportsTeamName: name }));

  const setEsportsTeamSize = (size: number) =>
    setState((s) => ({ ...s, esportsTeamSize: size }));

  const setEsportsGame = (game: string) =>
    setState((s) => ({ ...s, esportsGame: game }));

  const setResult = (participant: Participant) =>
    setState((s) => ({ ...s, result: participant }));

  const setPreselectEventId = (eventId: string | null) =>
    setState((s) => ({ ...s, preselectEventId: eventId }));

  const resetPersonal = () =>
    setState((s) => ({ ...s, personal: emptyPersonal, foodPreference: null }));

  const resetCollege = () =>
    setState((s) => ({
      ...s,
      college: {
        ...emptyCollege,
        registrationType: s.registrationType,
        collegeName: s.registrationType === "Internal" ? "Grace College of Engineering" : "",
      },
    }));

  const resetEvents = () =>
    setState((s) => ({ ...s, selectedEvents: [], preselectEventId: null }));

  const resetTeam = () =>
    setState((s) => ({
      ...s,
      paperTeamName: "",
      paperTeamSize: 1,
      esportsTeamName: "",
      esportsTeamSize: 1,
      esportsGame: null,
    }));

  const resetRegistration = () => setState(initialState);

  return (
    <RegistrationContext.Provider
      value={{
        ...state,
        setRegistrationType,
        setPersonal,
        setCollege,
        toggleEvent,
        selectSingleEvent,
        setFoodPreference,
        setPaperTeamName,
        setPaperTeamSize,
        setEsportsTeamName,
        setEsportsTeamSize,
        setEsportsGame,
        setResult,
        setPreselectEventId,
        resetPersonal,
        resetCollege,
        resetEvents,
        resetTeam,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}
