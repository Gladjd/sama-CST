'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ousmane.fall@technologies-services.sn');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Quick demo login or Supabase Auth
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 600);
  };

  const handleDemoLogin = (role: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ts-navy via-slate-900 to-ts-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Top Header */}
        <div className="p-8 bg-gradient-to-br from-slate-900 to-ts-navy text-white text-center border-b border-slate-800 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ts-green to-ts-green-dark flex items-center justify-center text-white font-black text-2xl shadow-ts-green mx-auto mb-3">
            TS
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">SAMA CST — Supervision</h1>
          <p className="text-xs text-slate-300 mt-1">Technologies Services • Atelier & Parc Équipements</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-ts-green/20 border border-ts-green/40 text-[10px] font-bold text-lime-300 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-ts-green animate-pulse"></span>
            Supabase Cloud Auth & Database
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse Email Professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="agent@technologies-services.sn"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20 focus:border-ts-blue"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mot de passe
                </label>
                <a href="#" className="text-[11px] text-ts-blue hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20 focus:border-ts-blue"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Accès Démo Rapide
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('superviseur')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors"
            >
              <div className="text-xs font-bold text-slate-800">Superviseur CST</div>
              <div className="text-[10px] text-slate-400">Ousmane Fall (Admin)</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('technicien')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors"
            >
              <div className="text-xs font-bold text-slate-800">Technicien Atelier</div>
              <div className="text-[10px] text-slate-400">Ibrahima Gueye</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Technologies Services • CST Supervision v2.0 • Hébergé sur Vercel
        </div>
      </div>
    </div>
  );
}
