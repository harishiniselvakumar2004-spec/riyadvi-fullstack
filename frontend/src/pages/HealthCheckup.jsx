import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HEALTH_STEPS } from '../lib/content';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageMeta } from '../hooks/usePageMeta';
import { Field, FormMessage, Spinner } from '../components/ui/Form';
import PageHero from '../components/ui/PageHero';

const Choice = ({ options, value, onChange, multi }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {options.map(([v, label]) => {
      const on = multi ? value?.includes(v) : value === v;
      return (
        <button type="button" key={v} aria-pressed={on} onClick={() => onChange(multi ? (on ? value.filter((x) => x !== v) : [...(value || []), v]) : v)}
          className={`rounded-2xl border px-5 py-4 text-left text-sm transition ${on ? 'border-gold bg-gold/15 text-white' : 'border-white/10 bg-white/[.03] text-zinc-300 hover:border-gold/40'}`}>{label}</button>
      );
    })}
  </div>
);
const Q = ({ children }) => <p className="mb-3 mt-6 text-sm font-medium text-zinc-300 first:mt-0">{children}</p>;

export default function HealthCheckup() {
  usePageMeta('Business Health Checkup', 'Is your business ready for its next digital growth stage? Take the free Business Health Checkup.');
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({ name: '', email: '', phone: '', company: '' });
  const [a, setA] = useState({ channels: [], challenges: [] });
  const set = (k) => (v) => setA((s) => ({ ...s, [k]: v }));
  const { submit, status, message, fieldErrors, result, loading } = useFormSubmit((b) => api.post('/health-checkup', b));

  const last = HEALTH_STEPS.length - 1;
  const canNext = step === 0 ? info.name && info.email && info.company : true;
  const send = () => submit({ ...info, answers: a });

  if (status === 'success') {
    return (
      <section className="container-x grid min-h-[80vh] place-items-center pt-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl">
          <div className="relative mx-auto grid h-44 w-44 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90"><circle cx="50" cy="50" r="44" fill="none" stroke="#222" strokeWidth="6" />
              <motion.circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" strokeDasharray="276" initial={{ strokeDashoffset: 276 }} animate={{ strokeDashoffset: 276 - (276 * result.score) / 100 }} transition={{ duration: 1.6, ease: 'easeOut' }} /></svg>
            <div><p className="font-display text-5xl font-bold text-gold-gradient">{result.score}</p><p className="text-xs text-zinc-400">Digital readiness</p></div>
          </div>
          <h1 className="h-display mt-8 text-3xl">Thanks, {info.name.split(' ')[0]}!</h1>
          <p className="mt-3 text-zinc-300">{message} Our strategists will email a tailored growth plan to {info.email}.</p>
          <Link to="/contact?intent=consultation" className="btn btn-primary mt-8">Book a free strategy call</Link>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <PageHero eyebrow="Business Health Checkup" title="Is Your Business Ready for Its Next Digital Growth Stage?" text="Answer a few quick questions. We'll score your digital readiness and suggest the highest-impact next steps." />
      <section className="container-x max-w-3xl pb-24">
        <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
          {HEALTH_STEPS.map((s, i) => (
            <li key={s} className="flex-1"><div className="h-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gold" animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: 0.5 }} /></div>
              <span className={`mt-2 hidden text-[10px] uppercase tracking-wider sm:block ${i === step ? 'text-gold' : 'text-zinc-600'}`}>{s}</span></li>
          ))}
        </ol>
        <div className="glass rounded-3xl p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {[['name', 'Your name', 'text', true], ['email', 'Email', 'email', true], ['phone', 'Phone', 'tel'], ['company', 'Company', 'text', true]].map(([k, l, t, r]) => (
                    <Field key={k} label={l} name={k} type={t} required={r} value={info[k]} onChange={(e) => setInfo({ ...info, [k]: e.target.value })} error={fieldErrors[k]} />
                  ))}
                  <Field className="sm:col-span-2" label="Industry" name="industry" value={a.industry || ''} onChange={(e) => set('industry')(e.target.value)} />
                </div>
              )}
              {step === 1 && (<><Q>Do you have a website?</Q><Choice value={a.hasWebsite} onChange={set('hasWebsite')} options={[['no', 'Not yet'], ['yes-outdated', 'Yes, but outdated'], ['yes-modern', 'Yes, modern & fast'], ['unsure', 'Not sure']]} />
                <Q>Do you have a mobile app?</Q><Choice value={a.mobileApp} onChange={set('mobileApp')} options={[['yes', 'Yes'], ['no', 'No'], ['planned', 'Planning one']]} /></>)}
              {step === 2 && (<><Q>Which channels do you use? (select all)</Q><Choice multi value={a.channels} onChange={set('channels')} options={[['seo', 'SEO'], ['ads', 'Paid ads'], ['social', 'Social media'], ['email', 'Email / WhatsApp'], ['content', 'Content / blog']]} />
                <Q>Do you track analytics & conversions?</Q><Choice value={a.analytics} onChange={set('analytics')} options={[['yes', 'Yes'], ['partly', 'Partly'], ['no', 'No']]} /></>)}
              {step === 3 && (<><Q>How automated are your business processes?</Q><Choice value={a.automation} onChange={set('automation')} options={[['high', 'Mostly automated'], ['some', 'Some tools'], ['manual', 'Mostly manual']]} />
                <Q>Current tech stack (optional)</Q><Field label="Tools / platforms" name="stack" value={a.stack || ''} onChange={(e) => set('stack')(e.target.value)} /></>)}
              {step === 4 && (<><Q>What are your biggest challenges? (select all)</Q><Choice multi value={a.challenges} onChange={set('challenges')} options={[['leads', 'Not enough leads'], ['conversion', 'Low conversion'], ['speed', 'Slow / outdated tech'], ['brand', 'Weak brand presence'], ['scale', 'Scaling operations'], ['cost', 'High operating costs']]} />
                <Field className="mt-5" label="Anything else?" name="notes" as="textarea" rows={3} value={a.notes || ''} onChange={(e) => set('notes')(e.target.value)} /></>)}
              {step === 5 && (
                <div>
                  <h2 className="font-display text-2xl text-white">Ready to submit</h2>
                  <p className="mt-2 text-zinc-400">We'll calculate your digital-readiness score and send a tailored plan to <span className="text-gold">{info.email}</span>.</p>
                  <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/5 p-4"><dt className="text-zinc-500">Company</dt><dd className="text-white">{info.company}</dd></div>
                    <div className="rounded-xl bg-white/5 p-4"><dt className="text-zinc-500">Challenges</dt><dd className="text-white">{a.challenges.length || 'None selected'}</dd></div>
                  </dl>
                  <div className="mt-6"><FormMessage status={status} message={message} /></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex justify-between">
            <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</button>
            {step < last
              ? <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Continue</button>
              : <button className="btn btn-primary" onClick={send} disabled={loading}>{loading ? <Spinner /> : 'Get my results'}</button>}
          </div>
        </div>
      </section>
    </>
  );
}
