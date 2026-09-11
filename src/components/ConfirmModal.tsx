interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-sm border border-copper/30 bg-coffee p-6">
        <h3 className="font-display text-lg text-parchment">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-sm border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted hover:text-parchment"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] ${
              danger ? "bg-red-800 text-red-50 hover:bg-red-700" : "bg-copper text-ink hover:bg-copper-light"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
