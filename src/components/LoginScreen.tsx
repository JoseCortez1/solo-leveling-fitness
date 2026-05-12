import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    <div className="relative min-h-screen bg-gradient-to-b from-[#000] via-[#0a1543] to-[#000] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Portal gate decorative element */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/portal-gate.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'portalSpin 20s linear infinite',
        }}
      />
      
      {/* Rotating portal rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-accent-blue/20 absolute animate-ping" style={{ animationDuration: '3s' }} />
        <div className="w-80 h-80 rounded-full border border-accent-gold/15 absolute animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="w-96 h-96 rounded-full border border-accent-blue/10 absolute animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* Main content with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚔️</div>
          <h1 
            className="font-heading text-4xl md:text-5xl text-accent-gold tracking-[0.2em] uppercase mb-2"
            style={{
              textShadow: '0 0 20px rgba(255, 214, 10, 0.5), 0 0 40px rgba(255, 214, 10, 0.3)',
            }}
          >
            SOLO LEVELING
          </h1>
          <h2 className="text-accent-blue tracking-[0.25em] uppercase text-lg font-medium">
            Hunter System
          </h2>
        </div>

        {/* Quote */}
        <div className="border-l-2 border-accent-gold/60 pl-4 mb-8 mx-4">
          <p className="text-text-secondary italic font-body text-sm leading-relaxed">
            "The strong do what they can, the weak suffer what they must."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          {isRegister && (
            <Input
              type="text"
              placeholder="Hunter Name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              disabled={loading}
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            minLength={6}
          />

          {error && (
            <div className="text-danger text-sm font-mono text-center py-2">
              [SYSTEM] {error}
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="xl"
            disabled={!isValid || loading}
            className="w-full mt-2"
          >
            {loading ? (
              <span className="font-mono tracking-wider">SYSTEM LOADING...</span>
            ) : (
              isRegister ? 'Awaken the System' : 'Enter the Gate'
            )}
          </Button>
        </form>

        {/* Toggle register/login */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => { setIsRegister(!isRegister); clearError(); }}
            disabled={loading}
            className="text-text-secondary hover:text-accent-blue"
          >
            {isRegister
              ? 'Already a Hunter? Enter the Gate'
              : 'New Hunter? Awaken the System'}
          </Button>
        </div>

        {/* System message */}
        <div className="text-center mt-8">
          <p className="text-accent-blue font-mono text-xs tracking-wider opacity-70">
            [The System has chosen you.]
          </p>
        </div>
      </motion.div>

      {/* Shadow silhouette decorative */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/shadow-silhouette.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* CSS animation for portal rotation */}
      <style>{`
        @keyframes portalSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}