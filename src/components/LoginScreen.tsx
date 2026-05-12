import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const { login, register, error, clearError, isLoading: authLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (localLoading) return;
    setLocalLoading(true);
    clearError();

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch {
      // Error is set in context
    } finally {
      setLocalLoading(false);
    }
  };

  const isValid = isRegister
    ? name.trim() && email.includes('@') && password.length >= 6
    : email.includes('@') && password.length >= 6;

  const loading = localLoading || authLoading;

  return (
    <div className="login-screen">
      <div className="gate-bg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="gate-ring gate-ring-1" />
        <div className="gate-ring gate-ring-2" />
        <div className="gate-ring gate-ring-3" />
        <div className="gate-core" />
      </div>
      <div className="shadow-ornament" />
      <div className="shadow-ornament-left" />
      <div className="login-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="login-system-icon">⚔️</div>
        <h1 className="login-title">SOLO LEVELING</h1>
        <h2 className="login-subtitle">Hunter System</h2>
        <p className="login-quote">"The strong do what they can, the weak suffer what they must."</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              className="input-field"
              placeholder="Hunter Name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              disabled={loading}
            />
          )}
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            minLength={6}
          />

          {error && <div className="login-error">[SYSTEM] {error}</div>}

          <button
            type="submit"
            className="activate-btn"
            disabled={!isValid || loading}
          >
            {loading ? (
              <span className="login-loading">SYSTEM LOADING...</span>
            ) : (
              isRegister ? 'Awaken the System' : 'Enter the Gate'
            )}
          </button>
        </form>

        <button
          className="login-toggle"
          onClick={() => { setIsRegister(!isRegister); clearError(); }}
          disabled={loading}
        >
          {isRegister
            ? 'Already a Hunter? Enter the Gate'
            : 'New Hunter? Awaken the System'}
        </button>
      </div>
    </div>
  );
}
