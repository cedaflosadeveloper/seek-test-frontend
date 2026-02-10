'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/authStore';
import { useI18n } from '@/i18n/I18nProvider';

export const LoginForm = () => {
  const router = useRouter();
  const { login, status, error } = useAuthStore();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = Boolean(username.trim() && password.trim());

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
    if (!useAuthStore.getState().error) {
      router.push('/tasks');
    }
  };

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-row">
        <label htmlFor="username">{t('login.usernameLabel')}</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={t('login.usernamePlaceholder')}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="password">{t('login.passwordLabel')}</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
          required
        />
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="form-actions">
        <button className="primary" type="submit" disabled={status === 'loading' || isSubmitting || !isValid}>
          {status === 'loading' || isSubmitting ? t('login.submitting') : t('login.submit')}
        </button>
      </div>
    </form>
  );
};
