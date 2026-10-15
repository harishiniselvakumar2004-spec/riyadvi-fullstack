import { useNavigate } from 'react-router-dom';
import { api, auth } from '../../lib/api';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Field, FormMessage, Spinner, formToObject } from '../../components/ui/Form';
import Logo from '../../components/layout/Logo';

export default function AdminLogin() {
  usePageMeta('Admin sign in');
  const nav = useNavigate();
  const { submit, status, message, fieldErrors, loading } = useFormSubmit((b) => api.adminLogin(b));

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await submit(formToObject(e.currentTarget));
    if (res) { auth.set(res.data.token); nav('/admin/dashboard'); }
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="glass w-full max-w-md space-y-5 rounded-3xl p-8" noValidate>
        <Logo />
        <h1 className="font-display text-2xl text-white">Admin dashboard</h1>
        <Field label="Email" name="email" type="email" required autoComplete="username" error={fieldErrors.email} />
        <Field label="Password" name="password" type="password" required autoComplete="current-password" error={fieldErrors.password} />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? <Spinner /> : 'Sign in'}</button>
        <FormMessage status={status} message={message} />
      </form>
    </div>
  );
}
