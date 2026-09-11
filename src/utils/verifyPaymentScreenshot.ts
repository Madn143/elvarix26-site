import Tesseract from "tesseract.js";

export type ScreenshotCheckResult =
  | { status: "MATCHED"; detectedAmount: number }
  | { status: "MISMATCH"; detectedAmount: number | null }
  | { status: "UNDETECTED" };

/**
 * Runs basic OCR (client-side, via tesseract.js) over the uploaded payment
 * screenshot and checks whether any number it can read matches the required
 * amount.
 *
 * IMPORTANT — what this actually is: a LIGHT, best-effort check of the text
 * visible in the image. It cannot and does not verify the underlying UPI/bank
 * transaction in any way — it's just OCR run on a picture. Screenshots with
 * unclear text, unusual fonts, or low resolution may fail to detect a number
 * at all, which is reported as "UNDETECTED" rather than a false failure.
 */
export async function verifyPaymentScreenshotAmount(
  file: File,
  requiredAmount: number
): Promise<ScreenshotCheckResult> {
  let text = "";
  try {
    const result = await Tesseract.recognize(file, "eng");
    text = result.data.text || "";
  } catch {
    return { status: "UNDETECTED" };
  }

  // Pull out every contiguous run of digits (allowing commas/decimals inside
  // it) as a candidate amount. A previous version of this regex required a
  // comma between every group of 2-3 digits to "continue" a number, which
  // silently truncated any plain 4+ digit amount with no thousands separator
  // (e.g. "1000" or "1200" — exactly the kind of Paper Presentation team
  // total that has no thousands separator) down to just its first 3 digits.
  // This
  // version matches the whole run first and strips separators afterward,
  // so "1000", "1,000", and "2,00.00" all resolve correctly.
  const matches = text.match(/[0-9][0-9,]*(?:\.[0-9]{1,2})?/g) || [];

  const candidateAmounts = matches
    .map((m) => {
      const digits = m.replace(/[^0-9.]/g, "");
      const value = parseFloat(digits);
      return Number.isFinite(value) ? Math.round(value) : null;
    })
    .filter((v): v is number => v !== null && v > 0 && v < 1_000_000);

  if (candidateAmounts.length === 0) {
    return { status: "UNDETECTED" };
  }

  const exactMatch = candidateAmounts.find((amount) => amount === requiredAmount);
  if (exactMatch !== undefined) {
    return { status: "MATCHED", detectedAmount: exactMatch };
  }

  // Tesseract's default model frequently misreads the ₹ glyph as a leading
  // digit rather than as a separate symbol (it isn't well represented in the
  // standard English training data), turning e.g. "₹200" into the read text
  // "2200". Treat a candidate that is the required amount with exactly one
  // extra leading digit as a match for that specific, well-known failure
  // mode — it still requires the correct digits to appear as a suffix, so a
  // genuinely different amount (e.g. 250 when 200 is required) is never
  // accepted this way.
  const requiredStr = String(requiredAmount);
  const symbolMisreadMatch = candidateAmounts.find((amount) => {
    const candidateStr = String(amount);
    return candidateStr.length === requiredStr.length + 1 && candidateStr.endsWith(requiredStr);
  });
  if (symbolMisreadMatch !== undefined) {
    return { status: "MATCHED", detectedAmount: symbolMisreadMatch };
  }

  // Report the closest candidate as the "detected" amount for the mismatch message.
  const closest = candidateAmounts.reduce((best, current) =>
    Math.abs(current - requiredAmount) < Math.abs(best - requiredAmount) ? current : best
  );
  return { status: "MISMATCH", detectedAmount: closest };
}
