'use client';

import { useState } from 'react';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Save,
} from 'lucide-react';

const SettingsPage = () => {
  // Couleurs harmonisées
  const colors = {
    primary: {
      light: 'bg-blue-600 hover:bg-blue-700',
      dark: 'dark:bg-blue-700 dark:hover:bg-blue-800',
    },
    success: {
      light: 'bg-green-100 text-green-800',
      dark: 'dark:bg-green-900 dark:text-green-200',
    },
    danger: {
      light: 'bg-red-100 text-red-800',
      dark: 'dark:bg-red-900 dark:text-red-200',
    },
  };

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    email: 'utilisateur@example.com',
    phone: '+33 6 12 34 56 78',
    firstName: 'Jean',
    lastName: 'Dupont',
    city: 'Paris',
    password: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    newsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    security: false,
    preferences: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simuler une sauvegarde des données
      console.log('Données sauvegardées:', formData);
      setSuccessMessage('Vos paramètres ont été mis à jour avec succès');
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
          <User className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Paramètres du compte
        </h1>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Informations personnelles */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-neutral-700">
          <button 
            type="button"
            className="flex justify-between items-center w-full p-4 cursor-pointer"
            onClick={() => toggleSection('personalInfo')}
            aria-expanded={expandedSections.personalInfo}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations personnelles
            </h2>
            {expandedSections.personalInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.personalInfo && (
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="flex text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="flex text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="flex text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Sécurité */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-neutral-700">
          <button 
            type="button"
            className="flex justify-between items-center w-full p-4 cursor-pointer"
            onClick={() => toggleSection('security')}
            aria-expanded={expandedSections.security}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Sécurité
            </h2>
            {expandedSections.security ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.security && (
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-neutral-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                <p>Le mot de passe doit contenir au moins :</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>8 caractères minimum</li>
                  <li>1 lettre majuscule</li>
                  <li>1 chiffre</li>
                  <li>1 caractère spécial</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section Préférences */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-neutral-700">
          <button 
            type="button"
            className="flex justify-between items-center w-full p-4 cursor-pointer"
            onClick={() => toggleSection('preferences')}
            aria-expanded={expandedSections.preferences}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Préférences
            </h2>
            {expandedSections.preferences ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.preferences && (
            <div className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Notifications par email</h3>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir des notifications importantes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Newsletter</h3>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir notre newsletter mensuelle</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Messages d'erreur/succès */}
        {Object.keys(errors).length > 0 && (
          <div className={`p-4 rounded-lg ${colors.danger.light} ${colors.danger.dark} flex items-start`}>
            <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Erreurs dans le formulaire</h3>
              <ul className="mt-1 list-disc list-inside text-sm">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {successMessage && (
          <div className={`p-4 rounded-lg ${colors.success.light} ${colors.success.dark} flex items-start`}>
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Succès</h3>
              <p className="mt-1 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity flex items-center`}
          >
            <Save className="w-5 h-5 mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </main>
  );
};

export default SettingsPage;