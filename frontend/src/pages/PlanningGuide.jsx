import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageMeta } from '../hooks/usePageMeta';
import { Field, FormMessage, Spinner, formToObject } from '../components/ui/Form';
import PageHero from '../components/ui/PageHero';

const INSIDE = ['Goal & success-metric worksheet', 'Scope prioritisation (MoSCoW) template', 'Budget, team & timeline planner', 'Launch & post-launch checklist'];

export default function PlanningGuide() {
  usePageMeta('Software Project Planning Guide', 'Download the free Software Project Planning Guide from Riyadvi.');
  const { submit, status, message, fieldErrors, result, loading } = useFormSubmit((b) => api.post('/lead-magnet', b));
  const onSubmit = (e) => { e.preventDefault(); submit(formToObject(e.currentTarget)); };

  return (
    <>
      <PageHero eyebrow="Free resource" title="Download Software Project Planning Guide" text="A practical framework to scope, budget and launch your next software project with confidence." />
      <section className="container-x grid items-start gap-10 pb-24 lg:grid-cols-2">
        <div>
          <motion.div initial={{ rotateY: -25, opacity: 0 }} whileInView={{ rotateY: -12, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ transformPerspective: 1200 }}
            className="relative mx-auto aspect-[3/4] w-64 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/30 via-ink-700 to-black p-6 shadow-glow">
            <p className="text-[10px] uppercase tracking-[.3em] text-gold">Riyadvi</p>
            <p className="mt-16 font-display text-2xl font-semibold leading-tight text-white">Software Project Planning Guide</p>
            <div className="absolute bottom-6 left-6 h-px w-16 bg-gold" />
          </motion.div>
          <ul className="mt-12 space-y-3">
            {INSIDE.map((i) => <li key={i} className="flex items-center gap-3 text-zinc-200"><span className="grid h-6 w-6 place-items-center rounded-full bg-gold/15 text-xs text-gold">✓</span>{i}</li>)}
          </ul>
        </div>
        <div className="glass-gold rounded-3xl p-7 md:p-10">
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-3xl text-black">✓</div>
              <h2 className="mt-6 font-display text-3xl text-white">You're all set!</h2>
              <p className="mt-2 text-zinc-300">{message}</p>
              <a href={result.downloadUrl} download className="btn btn-primary mt-8">Download the guide (PDF)</a>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <h2 className="font-display text-2xl text-white">Get your free copy</h2>
              <Field label="Name" name="name" required error={fieldErrors.name} />
              <Field label="Company" name="company" required error={fieldErrors.company} />
              <Field label="Email" name="email" type="email" required error={fieldErrors.email} />
              <Field label="Phone" name="phone" type="tel" required error={fieldErrors.phone} />
              <button className="btn btn-primary w-full" disabled={loading}>{loading ? <Spinner /> : 'Send me the guide'}</button>
              <FormMessage status={status} message={message} />
              <p className="text-xs text-zinc-500">We respect your privacy. No spam, unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
