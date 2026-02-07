import { ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'warning' | 'info';

interface StatusToastProps {
  visible: boolean;
  kind?: ToastKind;
  title?: string;
  message: ReactNode;
  onClose: () => void;
}

const tone: Record<ToastKind, string> = {
  success: 'border-emerald-300 bg-emerald-100 text-emerald-950',
  error: 'border-red-300 bg-red-100 text-red-950',
  warning: 'border-amber-300 bg-amber-100 text-amber-950',
  info: 'border-sky-300 bg-sky-100 text-sky-950',
};

export default function StatusToast({
  visible,
  kind = 'info',
  title,
  message,
  onClose,
}: StatusToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md px-3 sm:px-0">
      <div className={`rounded-lg border px-4 py-3 shadow-lg ${tone[kind]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? <p className="text-sm font-semibold">{title}</p> : null}
            <div className="text-sm">{message}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-xs font-semibold hover:bg-white/60"
            aria-label="Dismiss notification"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
