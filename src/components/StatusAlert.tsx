import { ReactNode } from 'react';

type StatusKind = 'success' | 'error' | 'warning' | 'info';

interface StatusAlertProps {
  kind: StatusKind;
  title?: string;
  message: ReactNode;
  onClose?: () => void;
  className?: string;
}

const styles: Record<StatusKind, { container: string; icon: string }> = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'text-emerald-700',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-900',
    icon: 'text-red-700',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'text-amber-700',
  },
  info: {
    container: 'border-sky-200 bg-sky-50 text-sky-900',
    icon: 'text-sky-700',
  },
};

export default function StatusAlert({
  kind,
  title,
  message,
  onClose,
  className = '',
}: StatusAlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 shadow-sm ${styles[kind].container} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 text-sm font-bold ${styles[kind].icon}`} aria-hidden="true">
          ●
        </div>
        <div className="flex-1">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <div className="text-sm">{message}</div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-xs font-semibold hover:bg-white/70"
            aria-label="Dismiss notice"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
