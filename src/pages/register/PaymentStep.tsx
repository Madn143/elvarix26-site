import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Loader2, Download } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { submitRegistration } from "../../services/api/registrations";
import { useToast } from "../../components/ToastProvider";
import { UPI_ID, QR_CODE_BY_REGISTRATION_TYPE, FEE_BY_REGISTRATION_TYPE } from "../../utils/payment";
import { verifyPaymentScreenshotAmount, type ScreenshotCheckResult } from "../../utils/verifyPaymentScreenshot";
import { TextField } from "../../components/FormField";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_MB = 5;

const INSTRUCTIONS = [
  "Copy the UPI ID or scan the QR code.",
  "Open Google Pay, PhonePe, Paytm, or another UPI app.",
  "Make the required payment.",
  "Make sure the amount paid is exactly the TOTAL AMOUNT shown on this page.",
  "Take a screenshot of the successful payment.",
  "Upload the payment screenshot below.",
  "After successfully uploading the screenshot, confirm that you have completed the payment.",
  "Then continue to the registration confirmation page.",
];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function compressImageDataUrl(dataUrl: string, maxWidth = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / image.width);
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Unable to prepare the image for upload."));
        return;
      }

      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Unable to read the selected payment image."));
    image.src = dataUrl;
  });
}

export default function PaymentStep() {
  const {
    personal,
    college,
    selectedEvents,
    registrationType,
    foodPreference,
    paperTeamName,
    paperTeamSize,
    esportsTeamName,
    esportsTeamSize,
    esportsGame,
    setResult,
    resetTeam,
  } = useRegistration();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [qrFailed, setQrFailed] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<ScreenshotCheckResult | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hasPaper = selectedEvents.some((e) => e.eventName === "Paper Presentation");
  const hasEsports = selectedEvents.some((e) => e.eventName === "E-Sports");
  const isTeam = hasPaper || hasEsports;
  const feePerPerson = registrationType ? FEE_BY_REGISTRATION_TYPE[registrationType] : 0;
  const totalAmount = feePerPerson;
  const qrCodeImage = registrationType ? QR_CODE_BY_REGISTRATION_TYPE[registrationType] : "";

  const canSubmit = checkResult?.status === "MATCHED" && transactionId.trim().length > 0;

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setScreenshotError("");
    setSubmitError("");
    setCheckResult(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setScreenshotError("Please upload a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setScreenshotError(`Image must be smaller than ${MAX_FILE_MB}MB.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setScreenshotPreview(dataUrl);
    } catch {
      setScreenshotError("Couldn't read that file. Please try again.");
      return;
    }

    setChecking(true);
    try {
      const result = await verifyPaymentScreenshotAmount(file, totalAmount);
      setCheckResult(result);
    } catch {
      setCheckResult({ status: "UNDETECTED" });
    } finally {
      setChecking(false);
    }
  };

  const removeScreenshot = () => {
    setScreenshotPreview(null);
    setCheckResult(null);
    setScreenshotError("");
    setSubmitError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Downloads the exact existing QR image file — fetched as a blob so the
  // browser saves it directly instead of navigating to it in a new tab.
  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrCodeImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ELVARIX26-UPI-QR-${registrationType || "payment"}.jpeg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Couldn't download the QR code. Please try again.", "error");
    }
  };

  const handleCompletePayment = async () => {
    // Defensive, user-visible feedback for every guard condition — a click
    // that silently does nothing is exactly what this fix is for, so even
    // an edge-case click during a brief re-verification window explains
    // itself instead of looking broken.
    if (submitting) return;
    if (checking) {
      showToast("Please wait — still verifying your screenshot.", "error");
      return;
    }
    if (!screenshotPreview) {
      showToast("Please upload your payment screenshot first.", "error");
      return;
    }
    if (!canSubmit) {
      if (checkResult?.status !== "MATCHED") {
        showToast("The uploaded screenshot hasn't been verified as matching the required amount yet.", "error");
      } else {
        showToast("Please enter your UPI Transaction ID.", "error");
      }
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const compressedScreenshot = await compressImageDataUrl(screenshotPreview, 1200, 0.72);
      const participant = await submitRegistration({
        ...personal,
        ...college,
        registrationType: registrationType!,
        selectedEvents,
        hasPaperPresentation: hasPaper,
        paperTeamName: hasPaper ? paperTeamName : undefined,
        paperTeamSize: hasPaper ? paperTeamSize : undefined,
        hasEsports: hasEsports,
        esportsTeamName: hasEsports ? esportsTeamName : undefined,
        esportsTeamSize: hasEsports ? esportsTeamSize : undefined,
        foodPreference: foodPreference || undefined,
        esportsGame: esportsGame || undefined,
        transactionId: transactionId.trim(),
        paymentScreenshot: compressedScreenshot,
        paymentAmountCheck: "MATCHED",
      });
      setResult(participant);
      navigate("/register/success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl text-parchment">Payment</h2>
      </div>

      {/* SUMMARY / TEAM PAYMENT */}
      {isTeam ? (
        <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Team Summary</p>
          <div className="mt-4 space-y-2 text-sm">
            {hasPaper && (
              <div className="flex justify-between">
                <span className="text-muted">Paper Presentation Team</span>
                <span className="text-parchment">{paperTeamName || "—"} ({paperTeamSize} member{paperTeamSize > 1 ? "s" : ""})</span>
              </div>
            )}
            {hasEsports && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted">E-Sports Team</span>
                  <span className="text-parchment">{esportsTeamName || "—"} ({esportsTeamSize} member{esportsTeamSize > 1 ? "s" : ""})</span>
                </div>
                {esportsGame && (
                  <div className="flex justify-between">
                    <span className="text-muted">Game</span>
                    <span className="text-parchment">{esportsGame}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between border-t border-white/10 pt-3 font-mono">
              <span className="uppercase tracking-[0.15em] text-copper-light">Total Amount</span>
              <span className="text-gold">₹{totalAmount}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">Only one payment is required.</p>
        </div>
      ) : (
        <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Selected Event{selectedEvents.length > 1 ? "s" : ""}</span>
              <span className="text-right text-parchment">
                {selectedEvents.length > 0 ? selectedEvents.map((e) => e.eventName).join(", ") : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Registration Type</span>
              <span className="text-parchment">{registrationType}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 font-mono">
              <span className="uppercase tracking-[0.15em] text-copper-light">Total</span>
              <span className="text-gold">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE */}
      <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Scan to Pay</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted">
          Scan the QR code using Google Pay, PhonePe, Paytm, or any UPI app.
        </p>

        <div className="relative mx-auto mt-4 flex h-80 w-80 max-w-full items-center justify-center overflow-hidden rounded-sm border border-copper/30 bg-black/20 p-2">
          {qrFailed ? (
            <div className="px-4 text-xs leading-relaxed text-muted">
              QR code image not found. Please contact the event administrator.
            </div>
          ) : (
            <>
              <img
                src={qrCodeImage}
                alt="UPI payment QR code"
                className="h-full w-full object-contain"
                onError={() => setQrFailed(true)}
              />
              <button
                type="button"
                  onClick={handleDownloadQr}
                title="Download QR code"
                aria-label="Download QR code"
                className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-sm border border-copper/40 bg-ink/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-copper-light backdrop-blur transition-colors hover:border-gold hover:text-gold"
              >
                <Download size={11} /> Download
              </button>
            </>
          )}
        </div>

        <UpiIdRow />
      </div>

      {/* INSTRUCTIONS */}
      <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          How to Complete Payment
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          {INSTRUCTIONS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* SCREENSHOT UPLOAD */}
      <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          Upload Payment Screenshot
        </p>
        <p className="mt-1 text-xs text-muted">
          After completing the payment, take a screenshot of the successful payment and upload it here.
        </p>

        {screenshotPreview ? (
          <div className="mt-3 flex items-center gap-4 rounded-sm border border-white/10 bg-black/20 p-3">
            <img src={screenshotPreview} alt="Payment screenshot preview" className="h-20 w-20 rounded-sm object-cover" />
            <div className="flex-1 text-xs text-muted">
              {checking ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin" /> Verifying screenshot…
                </span>
              ) : checkResult?.status === "MATCHED" ? (
                <span className="text-gold">Screenshot verified — amount matches ₹{totalAmount}.</span>
              ) : checkResult?.status === "MISMATCH" ? (
                <span className="text-red-400">
                  The payment amount does not match the required total amount. Please upload the correct
                  payment screenshot.
                </span>
              ) : checkResult?.status === "UNDETECTED" ? (
                <span className="text-red-400">Please upload a clear payment screenshot showing the paid amount.</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={removeScreenshot}
              className="flex items-center gap-1 rounded-sm border border-red-900/50 px-3 py-1.5 font-mono text-[10px] uppercase text-red-400 hover:bg-red-900/20"
            >
              <X size={12} /> Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-white/15 bg-black/20 py-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:border-copper/50 hover:text-parchment"
          >
            <Upload size={16} /> Upload Screenshot
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
        {screenshotError && <span className="mt-1 block text-xs text-red-400">{screenshotError}</span>}

        <p className="mt-3 text-[11px] leading-relaxed text-muted/70">
          Note: this is only a basic check of the amount visible in your screenshot — it does not verify
          the actual bank/UPI transaction. Payments are confirmed manually by the organizers.
        </p>
      </div>

      {/* TRANSACTION ID */}
      <div className="rounded-sm border border-copper/20 bg-coffee/30 p-6">
        <TextField
          label="UPI Transaction ID"
          required
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. 123456789012"
        />
        <p className="mt-2 text-[11px] leading-relaxed text-muted/70">
          Enter the Transaction/UTR ID shown in your UPI app or payment screenshot.
        </p>
      </div>

      {submitError && (
        <p className="rounded-sm border border-red-900/40 bg-red-900/10 px-4 py-3 text-center text-sm text-red-400">
          {submitError} Your screenshot and details are still here — please try again.
        </p>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            resetTeam();
            navigate("/register/team");
          }}
          disabled={submitting}
          className="rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleCompletePayment}
          disabled={submitting || checking || !canSubmit}
          aria-busy={submitting}
          className="relative inline-flex min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting && <span className="absolute inset-y-0 left-0 w-1/3 animate-[paymentProgress_1.4s_ease-in-out_infinite] bg-copper-light/30" />}
          <span className="relative inline-flex items-center gap-2">
            {submitting && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {submitting ? "Submitting..." : "I Have Completed Payment"}
          </span>
        </button>
      </div>
    </div>
  );
}

function UpiIdRow() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail without HTTPS/permissions — the ID is still visible to copy manually.
    }
  };

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-black/20 px-4 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">UPI ID:</span>
      <span className="font-mono text-sm text-gold">{UPI_ID}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-2 rounded-sm border border-white/10 px-2 py-1 font-mono text-[10px] uppercase text-muted hover:border-gold hover:text-gold"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
