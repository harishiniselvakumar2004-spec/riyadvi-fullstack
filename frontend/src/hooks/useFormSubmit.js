import { useCallback, useState } from 'react';
import { ApiError } from '../lib/api';

/** Handles submit state, server messages and per-field errors for every form on the site. */
export function useFormSubmit(submitFn) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);

  const submit = useCallback(async (...args) => {
    setStatus('loading'); setMessage(''); setFieldErrors({});
    try {
      const res = await submitFn(...args);
      setResult(res.data); setMessage(res.message || 'Done'); setStatus('success');
      return res;
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof ApiError ? err.message : 'Unexpected error. Please try again.');
      if (err.fields) setFieldErrors(err.fields);
      return null;
    }
  }, [submitFn]);

  const reset = () => { setStatus('idle'); setMessage(''); setFieldErrors({}); setResult(null); };
  return { submit, status, message, fieldErrors, result, loading: status === 'loading', reset };
}
