import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function LoginModal() {
  const { loginOpen, setLoginOpen, login, register, user, setCurrentView } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setShowPass(false);
  };

  const handleClose = () => {
    setLoginOpen(false);
    reset();
    setMode('login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        if (email === 'admin@solem.com') setCurrentView('admin');
        handleClose();
      } else {
        setError(result.message);
      }
    } else {
      if (!name.trim()) { setError('Ingresá tu nombre'); setLoading(false); return; }
      if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); setLoading(false); return; }
      const result = register(name, email, password);
      if (result.success) {
        handleClose();
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  if (!loginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}
      onClick={handleClose}
    >
      <div
        style={{ backgroundColor: '#F5F0E8', maxWidth: '420px', width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }} className="flex items-center justify-between px-8 py-6">
          <div>
            <p style={{ color: '#6B8F71', fontSize: '0.68rem', letterSpacing: '0.18em' }} className="uppercase mb-1">SOLEM</p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond","Georgia",serif',
                fontSize: '1.6rem',
                color: '#1a1a1a',
                fontWeight: 400,
              }}
            >
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
          </div>
          <button onClick={handleClose} style={{ color: '#1a1a1a' }} className="hover:opacity-60 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.12em' }} className="uppercase block mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                style={{
                  width: '100%',
                  border: '1px solid rgba(0,0,0,0.15)',
                  backgroundColor: 'transparent',
                  padding: '10px 14px',
                  color: '#1a1a1a',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.12em' }} className="uppercase block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                border: '1px solid rgba(0,0,0,0.15)',
                backgroundColor: 'transparent',
                padding: '10px 14px',
                color: '#1a1a1a',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.12em' }} className="uppercase block mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  border: '1px solid rgba(0,0,0,0.15)',
                  backgroundColor: 'transparent',
                  padding: '10px 40px 10px 14px',
                  color: '#1a1a1a',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div style={{ padding: '10px 14px', backgroundColor: 'rgba(107,143,113,0.08)', border: '1px solid rgba(107,143,113,0.2)' }}>
              <p style={{ color: '#6B8F71', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <strong>Admin:</strong> admin@solem.com / solem2025
              </p>
            </div>
          )}

          {error && (
            <p style={{ color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#aaa' : '#1a1a1a',
              color: '#F5F0E8',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              padding: '14px',
              marginTop: '4px',
            }}
            className="uppercase hover:bg-black/80 transition-colors"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>

          <div className="text-center">
            {mode === 'login' ? (
              <p style={{ color: '#888', fontSize: '0.8rem' }}>
                ¿No tenés cuenta?{' '}
                <button type="button" onClick={() => { setMode('register'); reset(); }} style={{ color: '#6B8F71', textDecoration: 'underline' }}>
                  Crear una
                </button>
              </p>
            ) : (
              <p style={{ color: '#888', fontSize: '0.8rem' }}>
                ¿Ya tenés cuenta?{' '}
                <button type="button" onClick={() => { setMode('login'); reset(); }} style={{ color: '#6B8F71', textDecoration: 'underline' }}>
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
