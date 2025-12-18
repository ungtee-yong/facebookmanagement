import { clsx } from 'clsx';

export function Card({
  title,
  children,
  actions
}: {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div>{actions}</div>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const styles: Record<string, string> = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600 disabled:bg-brand-300',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400 disabled:text-slate-400',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 disabled:bg-rose-300'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(base, styles[variant])}
    >
      {children}
    </button>
  );
}

export function Input({
  name,
  label,
  type = 'text',
  placeholder,
  defaultValue,
  required
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600">{label}</div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}

export function Badge({
  children,
  tone = 'gray'
}: {
  children: React.ReactNode;
  tone?: 'gray' | 'green' | 'blue' | 'amber' | 'red';
}) {
  const tones: Record<string, string> = {
    gray: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700'
  };
  return (
    <span className={clsx('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}
