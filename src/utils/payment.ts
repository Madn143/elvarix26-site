import type { RegistrationType } from "../types";
import paymentQrInternal from "../assets/payment-200.jpeg";
import paymentQrExternal from "../assets/payment-250.jpeg";

/**
 * ELVARIX'26 payment configuration.
 *
 * — To change the UPI ID shown on the Payment page, edit UPI_ID below.
 * — Payment QR codes are selected by registration type.
 * — FEE_BY_REGISTRATION_TYPE is the per-person fee, keyed by registration
 *   type. For team events the total is this fee × number of people (leader +
 *   members) — see PaymentStep.tsx.
 */

export const UPI_ID = "feminajacob09@oksbi";

export const QR_CODE_BY_REGISTRATION_TYPE: Record<RegistrationType, string> = {
  Internal: paymentQrInternal,
  External: paymentQrExternal,
};

export const FEE_BY_REGISTRATION_TYPE: Record<RegistrationType, number> = {
  Internal: 200,
  External: 250,
};
