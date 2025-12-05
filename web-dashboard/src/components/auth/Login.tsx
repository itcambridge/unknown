import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { signIn } from '../../lib/supabase';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      if (data.user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-orbitron text-neon-cyan mb-2">Beach Cache Detection</h1>
          <p className="text-gray-400 text-sm">YEAR 2100</p>
          <p className="text-neon-cyan font-orbitron mt-4 text-sm">STATUS: ACTIVE</p>
        </div>
        
        {/* Login Form */}
        <div className="glass-panel">
          <h2 className="text-neon-cyan font-orbitron text-xl mb-6 text-center">AUTHENTICATION REQUIRED</h2>
          
          {error && (
            <div className="danger-alert mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-400 text-xs font-mono mb-1">
                OPERATOR ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-gray-200 p-3 rounded-md focus:outline-none focus:border-neon-cyan"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-400 text-xs font-mono mb-1">
                ACCESS CODE
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-gray-200 p-3 rounded-md focus:outline-none focus:border-neon-cyan"
                placeholder="Enter password"
                required
              />
            </div>
            
            <div>
              <button 
                type="submit"
                disabled={loading}
                className="neon-button w-full py-3 text-center"
              >
                {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 font-mono">
              AUTHORIZED PERSONNEL ONLY • SECURE CHANNEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
