import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import QRCode from "qrcode";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { useRegistration } from "../../context/RegistrationContext";
import { submitFeedback } from "../../services/api/registrations";

export default function SuccessStep() {
  const { result, resetRegistration } = useRegistration();
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [feedbackError, setFeedbackError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    if (!result) return;
    let active = true;
    const qrPayload = {
      registrationId: result.registrationId,
      studentName: result.fullName,
      collegeName: result.collegeName,
      events: result.selectedEvents.map((event) => event.eventName),
      foodPreference: result.foodPreference || "Not specified",
      registrationType: result.registrationType,
    };

    QRCode.toDataURL(JSON.stringify(qrPayload), {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 560,
      color: { dark: "#241811", light: "#F3EAE0" },
    })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setQrError("Unable to generate the QR code. Please download the PDF instead.");
      });
    return () => {
      active = false;
    };
  }, [result?.registrationId]);

  if (!result) {
    return <Navigate to="/register" replace />;
  }

  const handlePrint = () => window.print();

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `${result.registrationId}-entry-qr.png`;
    anchor.click();
  };

  const handleDownloadPdf = () => {
    if (!qrDataUrl) return;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const brown = [36, 24, 17] as const;
    const copper = [191, 106, 46] as const;
    const gold = [212, 169, 74] as const;
    const parchment = [243, 234, 224] as const;
    const muted = [156, 138, 120] as const;

    pdf.setFillColor(...brown);
    pdf.rect(0, 0, pageWidth, 297, "F");
    pdf.setFillColor(...copper);
    pdf.rect(0, 0, pageWidth, 7, "F");
    pdf.setTextColor(...gold);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("ELVARIX'26", 18, 25);
    pdf.setFontSize(9);
    pdf.setTextColor(...muted);
    pdf.text("OFFICIAL PARTICIPANT ENTRY PASS", 18, 33);
    pdf.setDrawColor(...copper);
    pdf.line(18, 40, pageWidth - 18, 40);

    pdf.setFillColor(...parchment);
    pdf.roundedRect(57, 50, 96, 96, 3, 3, "F");
    pdf.addImage(qrDataUrl, "PNG", 65, 58, 80, 80);
    pdf.setTextColor(...gold);
    pdf.setFontSize(11);
    pdf.text(result.registrationId, pageWidth / 2, 155, { align: "center" });

    pdf.setTextColor(...parchment);
    pdf.setFontSize(15);
    pdf.text(result.fullName, 18, 174);
    pdf.setTextColor(...muted);
    pdf.setFontSize(10);
    pdf.text(result.collegeName, 18, 181);
    pdf.text(`Food preference: ${result.foodPreference || "Not specified"}`, 18, 189);
    pdf.text(`Registration type: ${result.registrationType}`, 18, 197);

    pdf.setTextColor(...gold);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("REGISTERED EVENTS", 18, 211);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...parchment);
    result.selectedEvents.forEach((event, index) => {
      pdf.text(`${index + 1}. ${event.eventName}`, 22, 220 + index * 7);
    });

    const instructionsY = 220 + result.selectedEvents.length * 7 + 10;
    pdf.setTextColor(...gold);
    pdf.setFont("helvetica", "bold");
    pdf.text("IMPORTANT INSTRUCTIONS", 18, instructionsY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...muted);
    [
      "Show this QR at the entrance for attendance verification.",
      "Keep this pass ready while collecting refreshments or food.",
      "Present the same QR before entering your registered events.",
      "This pass is valid only for the named participant.",
    ].forEach((instruction, index) => {
      pdf.text(`${index + 1}. ${instruction}`, 22, instructionsY + 9 + index * 6);
    });
    pdf.setTextColor(...copper);
    pdf.setFontSize(9);
    pdf.text("September 23, 2026  |  Grace College of Engineering", pageWidth / 2, 286, { align: "center" });
    pdf.save(`${result.registrationId}-entry-pass.pdf`);
  };

  const handleFeedbackSubmit = async () => {
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback || feedbackState === "submitting" || feedbackState === "submitted") return;

    setFeedbackState("submitting");
    setFeedbackError("");
    try {
      await submitFeedback(result, trimmedFeedback);
      setFeedbackState("submitted");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Couldn't submit feedback. Please try again.");
      setFeedbackState("error");
    }
  };

  const handleDownload = () => {
    const teamNames = [result.paperTeamName, result.esportsTeamName].filter(Boolean).join(", ");
    const content = `ELVARIX'26 — REGISTRATION CONFIRMATION
========================================
Registration ID     : ${result.registrationId}
${
  result.isTeamRegistration
    ? `Team Name            : ${teamNames || "—"}
Team Members         : ${result.teamMembers.map((m) => m.name).join(", ")}`
    : `Participant           : ${result.fullName}`
}
Selected Event(s)    : ${result.selectedEvents.map((e) => e.eventName).join(", ")}
${result.esportsGame ? `E-Sports Game        : ${result.esportsGame}\n` : ""}Registration Type    : ${result.registrationType}
Total Amount         : ₹${result.totalAmount}
Transaction ID       : ${result.transactionId}
Payment Status       : PAID
Registered On        : ${new Date(result.createdAt).toLocaleString("en-IN")}
========================================
See you on September 23, 2026!`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.registrationId}-confirmation.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
        <span className="font-display text-2xl text-gold">✓</span>
      </div>

      <h1 className="mt-6 font-display text-3xl text-parchment">Thank You for Registering!</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        Your registration has been successfully submitted. We're excited to see you at ELVARIX'26!
      </p>
      <p className="mt-1 font-display text-base text-gold">See you on September 23, 2026.</p>

      <div className="mt-8 w-full rounded-sm border border-copper/30 bg-coffee/40 p-8 text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Registration ID</p>
        <p className="mt-1 font-mono text-2xl text-gold">{result.registrationId}</p>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm">
          {result.isTeamRegistration ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted">Team Name</span>
                <span className="text-parchment">{[result.paperTeamName, result.esportsTeamName].filter(Boolean).join(", ") || "—"}</span>
              </div>
              <div>
                <span className="text-muted">Team Members</span>
                <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-parchment">
                  {result.teamMembers.map((m, i) => (
                    <li key={i}>{m.name}</li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted">Participant</span>
              <span className="text-parchment">{result.fullName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Selected Event{result.selectedEvents.length > 1 ? "s" : ""}</span>
            <span className="text-right text-parchment">
              {result.selectedEvents.map((e) => e.eventName).join(", ")}
            </span>
          </div>
          {result.esportsGame && (
            <div className="flex justify-between">
              <span className="text-muted">E-Sports Game</span>
              <span className="text-parchment">{result.esportsGame}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Registration Type</span>
            <span className="text-parchment">{result.registrationType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Total Amount</span>
            <span className="text-parchment">₹{result.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Transaction ID</span>
            <span className="text-parchment">{result.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Registration Date</span>
            <span className="text-parchment">{new Date(result.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        <div className="mt-6 rounded-sm border border-gold/30 bg-gold/5 p-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Payment Status</p>
          <p className="mt-1 font-mono text-sm text-parchment">PAID</p>
        </div>
      </div>

      <section className="mt-8 w-full rounded-sm border border-gold/40 bg-[#241811] p-6 text-left shadow-[0_0_36px_-18px_rgba(212,169,74,0.65)]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
            <FileText size={17} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Your Entry QR</p>
            <h2 className="mt-1 font-display text-xl text-parchment">Keep this pass ready</h2>
            <p className="mt-1 text-sm text-muted">
              Show this QR at the entrance, when receiving refreshments or food, and before entering your registered events.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 w-fit rounded-sm bg-parchment p-3">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Entry QR containing registration details" className="h-56 w-56" />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center text-center font-mono text-xs text-coffee">
              Generating QR...
            </div>
          )}
        </div>
        {qrError && <p className="mt-3 text-center text-xs text-red-400">{qrError}</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            className="flex items-center justify-center gap-2 rounded-sm border border-gold/50 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} /> Download QR
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!qrDataUrl}
            className="flex items-center justify-center gap-2 rounded-sm bg-copper px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileText size={15} /> Download PDF Pass
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted">The QR contains your name, college, registered events, food preference, registration type, and registration ID.</p>
      </section>

      <div className="mt-8 w-full rounded-sm border border-copper/20 bg-coffee/30 p-6 text-left">
        <label htmlFor="feedback" className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          Short Feedback <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value.slice(0, 500))}
          disabled={feedbackState === "submitting" || feedbackState === "submitted"}
          maxLength={500}
          rows={3}
          placeholder="How was your registration experience?"
          className="mt-3 w-full resize-none rounded-sm border border-white/10 bg-black/30 px-4 py-3 text-sm text-parchment placeholder:text-muted/50 focus:border-gold focus:outline-none disabled:opacity-60"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-muted">{feedback.length}/500</span>
          {feedbackState === "submitted" ? (
            <span className="text-xs text-gold">Thank you for your feedback.</span>
          ) : (
            <button
              type="button"
              onClick={handleFeedbackSubmit}
              disabled={!feedback.trim() || feedbackState === "submitting"}
              className="rounded-sm bg-copper px-5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              {feedbackState === "submitting" ? "Sending…" : "Send Feedback"}
            </button>
          )}
        </div>
        {feedbackError && <p className="mt-2 text-xs text-red-400">{feedbackError}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleDownload}
          className="rounded-sm bg-copper px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light"
        >
          Download Confirmation
        </button>
        <button
          onClick={handlePrint}
          className="rounded-sm border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-parchment hover:border-gold hover:text-gold"
        >
          Print
        </button>
        <Link
          to="/"
          onClick={resetRegistration}
          className="rounded-sm border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-parchment hover:border-gold hover:text-gold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
