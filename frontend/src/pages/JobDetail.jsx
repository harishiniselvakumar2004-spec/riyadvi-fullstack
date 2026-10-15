import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../lib/api';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageMeta } from '../hooks/usePageMeta';
import { ApiState } from '../components/ui/Cards';
import { Field, FormMessage, Spinner } from '../components/ui/Form';
import NotFound from './NotFound';

const List = ({ title, items }) => (
  <div className="mt-10">
    <h2 className="font-display text-2xl text-white">{title}</h2>
    <ul className="mt-4 space-y-3">{items.map((i) => <li key={i} className="flex gap-3 text-zinc-300"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{i}</li>)}</ul>
  </div>
);

export default function JobDetail() {
  const { slug } = useParams();
  const { data: job, loading, error } = useApi(`/jobs/${slug}`);
  const formRef = useRef(null);
  const { submit, status, message, fieldErrors, loading: sending } = useFormSubmit((fd) => api.postForm('/applications', fd));
  usePageMeta(job?.title, job?.summary);
  if (error?.status === 404) return <NotFound />;

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('jobSlug', slug); fd.set('position', job.title);
    const res = await submit(fd);
    if (res) formRef.current.reset();
  };

  return (
    <ApiState loading={loading} error={error} skeleton={<div className="min-h-screen" />}>
      {job && (
        <div className="container-x grid gap-14 pb-24 pt-40 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to="/careers" className="text-sm text-zinc-400 hover:text-gold">← All openings</Link>
            <p className="eyebrow mt-8">{job.department} · {job.type}</p>
            <h1 className="h-display mt-4 text-4xl md:text-5xl">{job.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">{[job.experience, job.location, job.designation].map((t) => <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-zinc-300">{t}</span>)}</div>
            <p className="mt-8 text-lg text-zinc-300">{job.summary}</p>
            <List title="Responsibilities" items={job.responsibilities} />
            <List title="Requirements" items={job.requirements} />
            <List title="Benefits" items={job.benefits} />
          </div>
          <aside id="apply" className="lg:sticky lg:top-28 lg:self-start">
            <form ref={formRef} onSubmit={onSubmit} className="glass-gold space-y-4 rounded-3xl p-7" noValidate>
              <h2 className="font-display text-2xl text-white">Apply now</h2>
              <Field label="Name" name="name" required error={fieldErrors.name} />
              <Field label="Email" name="email" type="email" required error={fieldErrors.email} />
              <Field label="Phone" name="phone" type="tel" required error={fieldErrors.phone} />
              <Field label="Position" name="position_display" value={job.title} readOnly />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Resume (PDF/DOC, max 5 MB) <span className="text-gold">*</span></span>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" required className="field file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-black" />
                {fieldErrors.resume && <span className="mt-1 block text-xs text-red-400">{fieldErrors.resume}</span>}
              </label>
              <Field label="Message" name="message" as="textarea" rows={3} error={fieldErrors.message} />
              <button className="btn btn-primary w-full" disabled={sending}>{sending ? <Spinner /> : 'Submit application'}</button>
              <FormMessage status={status} message={message} />
            </form>
          </aside>
        </div>
      )}
    </ApiState>
  );
}
