// app/login/page.tsx
"use client";

import { Eye, EyeOff, Mail, Lock} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';
import type { AxiosError } from 'axios';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await loginUser(email, password);
      const data = res.data;
      // Stocker le token si besoin (localStorage, cookie...)
      if (rememberMe) {
        localStorage.setItem('remodash_token', data.token);
      }
      // Redirection selon le rôle
      router.push(data.redirectUrl || '/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
        setError(axiosError.response.data.error);
      } else {
        setError('Erreur réseau ou serveur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section Image (3/4 de la page) */}
      <div className="hidden md:block md:w-3/4 relative">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Belle maison moderne"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-background/0" />
        
        {/* Texte descriptif sur l'image */}
        <div className="absolute bottom-10 left-10 text-background max-w-md">
          <h2 className="text-2xl font-bold mb-2">Bienvenue sur Remodash</h2>
          <p className="text-base">Votre plateforme de gestion immobilière tout-en-un</p>
        </div>
      </div>

      {/* Section Login (1/4 de la page) avec couleur d'accent */}
      <div className="w-full md:w-1/4 bg-accent flex items-center justify-center p-5">
        <div className="w-full max-w-xs">
          {/* En-tête avec Logo */}
          <div className="text-center mb-6">
            {/* Logo */}
          
          <div className="text-center mb-6">
            {/* Logo SVG personnalisé */}
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-background/20 rounded-lg">
                <svg className="h-8 w-8 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-background mb-1">Remodash</h1>
            <p className="text-xs text-background/80">Connectez-vous à votre espace</p>
          </div>
            
          </div>

          {/* Formulaire */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-background mb-1">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-background/60" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-9 pr-2.5 py-2 border border-background/20 rounded-md focus:ring-1 focus:ring-background focus:border-transparent bg-accent/90 text-background placeholder-background/50 text-sm"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-background mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-background/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-9 pr-9 py-2 border border-background/20 rounded-md focus:ring-1 focus:ring-background focus:border-transparent bg-accent/90 text-background placeholder-background/50 text-sm"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-background/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-background/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-3.5 w-3.5 text-background focus:ring-background border-background/40 rounded-sm"
                />
                <label htmlFor="remember-me" className="ml-1.5 block text-xs text-background">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="text-background hover:text-background/80">
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-3 border border-transparent rounded-md text-xs font-medium text-accent bg-background hover:bg-background/95 focus:outline-none focus:ring-1 focus:ring-background transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
              {error && (
                <div className="mt-2 text-xs text-red-600 text-center">{error}</div>
              )}
            </div>
          </form>

          {/* Lien d'inscription */}
          <div className="mt-4 text-center">
            <p className="text-xs text-background">
              Pas encore de compte?{' '}
              <a href="#" className="text-background hover:text-background/90">
                Contacter l&apos;administrateur
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}