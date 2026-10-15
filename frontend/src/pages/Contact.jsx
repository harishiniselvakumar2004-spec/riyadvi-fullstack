import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageMeta } from '../hooks/usePageMeta';
import { Field, FormMessage, Spinner, formToObject } from '../components/ui/Form';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';

const REQUIREMENTS = ['Web Development', 'App Development', 'Digital Marketing', 'AR / VR', '3D Modeling', 'UI/UX Design', 'Other'];

export default function Contact() {
  usePageMeta('Contact', 'Contact Riyadvi — request a quote or book a free consultation.');
  const [params] = useSearchParams();
  const intent = params.get('intent');
  const [mode, setMode] = useState(intent === 'consultation' ? 'consultation' : 'enquiry');
  const { data: cfg } = useApi('/config');

  const contact = useFormSubmit((body) => api.post('/contact', body));
  const consult = useFormSubmit((body) => api.post('/consultation', body));
  const f = mode === 'enquiry' ? contact : consult;

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const res = await f.submit(formToObject(form));
    if (res) form.reset();
  };

  const presetService = params.get('service')?.replace(/-/g, ' ');

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's build something great together." text="Tell us about your project. We reply within one business day." />
      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-6 md:p-10">
          <div className="mb-8 inline-flex rounded-full border border-white/10 p-1 text-sm" role="tablist">
            {[['enquiry', intent === 'quote' ? 'Get a Quote' : 'Send enquiry'], ['consultation', 'Book consultation']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-full px-5 py-2 transition ${mode === k ? 'bg-gold font-semibold text-black' : 'text-zinc-300'}`}>{l}</button>
            ))}
          </div>
          <form key={mode} onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required error={f.fieldErrors.name} />
              <Field label="Email" name="email" type="email" required error={f.fieldErrors.email} />
              <Field label="Phone" name="phone" type="tel" error={f.fieldErrors.phone} />
              <Field label="Company" name="company" error={f.fieldErrors.company} />
            </div>
            {mode === 'enquiry' ? (
              <>
                <Field label="Requirement" name="requirement" as="select" options={REQUIREMENTS} defaultValue={REQUIREMENTS.find((r) => presetService && r.toLowerCase().replace(/[ /]/g, '').includes(presetService.replace(/ /g, '').slice(0, 5))) || ''} error={f.fieldErrors.requirement} />
                <Field label="Message" name="message" as="textarea" required error={f.fieldErrors.message} placeholder="Tell us about your goals, timeline and budget…" />
              </>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Preferred date" name="preferredDate" type="date" />
                  <Field label="Topic" name="topic" placeholder="e.g. New website" />
                </div>
                <Field label="Notes" name="notes" as="textarea" rows={4} />
              </>
            )}
            <button className="btn btn-primary" disabled={f.loading}>{f.loading ? <Spinner /> : mode === 'enquiry' ? 'Send message' : 'Request consultation'}</button>
            <FormMessage status={f.status} message={f.message} />
            {mode === 'consultation' && f.status === 'success' && f.result?.calendly && (
              <p className="text-sm text-zinc-300">Want to pick a slot right now? <a className="text-gold underline" href={f.result.calendly} target="_blank" rel="noreferrer">Open our Calendly →</a></p>
            )}
          </form>
        </div>

        <aside className="space-y-5">
          <div className="glass-gold rounded-3xl p-7">
            <h2 className="font-display text-xl text-white">Prefer to talk now?</h2>
            <div className="mt-5 flex flex-col gap-3">
              {cfg?.whatsapp && <Button href={`https://wa.me/${cfg.whatsapp}`} magnetic={false}>Chat on WhatsApp</Button>}
              {cfg?.calendly && <Button href={cfg.calendly} variant="ghost" magnetic={false}>Schedule on Calendly</Button>}
            </div>
          </div>
          <div className="glass rounded-3xl p-7 text-sm text-zinc-300">
            <h2 className="font-display text-xl text-white">Location</h2>
            <p className="mt-3">Riyadvi Software Technologies<br />Tiruppur, Tamil Nadu, India</p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <iframe title="Riyadvi location" loading="lazy" className="h-52 w-full grayscale invert-[.92]" src="https://www.openstreetmap.org/export/embed.html?bbox=77.28%2C11.07%2C77.42%2C11.15&layer=mapnik" />
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
