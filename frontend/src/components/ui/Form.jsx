import { motion, AnimatePresence } from 'framer-motion';

export function Field({ label, name, error, required, as = 'input', options = [], className = '', ...props }) {
  const base = `field ${error ? 'field-error' : ''}`;
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
        {label}{required && <span className="text-gold"> *</span>}
      </span>
      {as === 'textarea' && <textarea name={name} rows={5} className={base} required={required} {...props} />}
      {as === 'select' && (
        <select name={name} className={base} required={required} {...props}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
        </select>
      )}
      {as === 'input' && <input name={name} className={base} required={required} {...props} />}
      <AnimatePresence>
        {error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 block text-xs text-red-400">{error}</motion.span>}
      </AnimatePresence>
    </label>
  );
}

export function FormMessage({ status, message }) {
  if (!message || status === 'idle' || status === 'loading') return null;
  const ok = status === 'success';
  return (
    <motion.p role={ok ? 'status' : 'alert'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border px-4 py-3 text-sm ${ok ? 'border-gold/40 bg-gold/10 text-gold-100' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>{message}</motion.p>
  );
}

export const Spinner = () => <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" aria-hidden />;

/** Reads a <form> into a plain object. */
export const formToObject = (form) => Object.fromEntries(new FormData(form).entries());
