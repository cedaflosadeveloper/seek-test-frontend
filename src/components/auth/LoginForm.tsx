'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
  const router = useRouter();
  const { login, status, error } = useAuthStore();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = Boolean(username.trim() && password.trim());
  const showInvalidUsers = error?.toLowerCase() === 'invalid credentials';

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
        <div className="input-with-icon">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required
          />
          <button
            className="input-icon-button"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {showInvalidUsers ? (
        <div className="hint">
          <p className="muted">{t('login.invalidUsersHint')}</p>
          <div className="hint-list">
            <span>user1</span>
            <span>user2</span>
            <span>user3</span>
          </div>
          <p className="muted">{t('login.invalidPasswordHint')}</p>
        </div>
      ) : null}
      <div className="form-actions">
        <button className="primary" type="submit" disabled={status === 'loading' || isSubmitting || !isValid}>
          {status === 'loading' || isSubmitting ? t('login.submitting') : t('login.submit')}
        </button>
      </div>
    </form>
  );
};
