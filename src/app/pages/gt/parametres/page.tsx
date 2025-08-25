'use client';

import { useState } from 'react';
import { 
  Save,
  Bell,
  User,
  Shield,
  Database,
  Mail,
  Clock,
  Calendar,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

const ParametresPage = () => {
  const [activeSection, setActiveSection] = useState('compte');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    travaux: true,
    urgences: true,
    rappels: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityTracking: true,
    dataCollection: false
  });
  const [backup, setBackup] = useState({
    autoBackup: true,
    backupFrequency: 'weekly',
    cloudStorage: true
  });
  const [formData, setFormData] = useState({
    nom: 'Dupont',
    prenom: 'Martin',
    email: 'martin.dupont@example.com',
    telephone: '+33 6 12 34 56 78',
    poste: 'Gestionnaire Technique',
    service: 'Maintenance'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [saved, setSaved] = useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleBackupChange = (key: keyof typeof backup, value?: string) => {
    if (value) {
      setBackup(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      setBackup(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof backup]
      }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { id: 'compte', label: 'Compte', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'confidentialite', label: 'Confidentialité', icon: Shield },
    { id: 'sauvegarde', label: 'Sauvegarde', icon: Database },
    { id: 'preferences', label: 'Préférences', icon: Calendar }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'compte':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Poste
                </label>
                <input
                  type="text"
                  value={formData.poste}
                  onChange={(e) => handleInputChange('poste', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Service
                </label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-4">
                Changer le mot de passe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => handlePasswordChange('current', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Préférences de notification
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Notifications par email</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Recevoir les notifications par email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Notifications SMS</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Recevoir les notifications par SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('sms')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.sms ? 'bg-green-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Nouveaux travaux</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Alertes pour nouveaux travaux</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('travaux')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.travaux ? 'bg-orange-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.travaux ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Travaux urgents</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Alertes pour travaux urgents</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('urgences')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.urgences ? 'bg-red-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.urgences ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Rappels</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Rappels de tâches et échéances</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('rappels')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.rappels ? 'bg-purple-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.rappels ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case 'confidentialite':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Paramètres de confidentialité
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Profil visible</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Rendre votre profil visible aux autres utilisateurs</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrivacyChange('profileVisible')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.profileVisible ? 'bg-blue-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Suivi d&apos;activité</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Autoriser le suivi de votre activité</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrivacyChange('activityTracking')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.activityTracking ? 'bg-green-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.activityTracking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Collecte de données</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Autoriser la collecte de données anonymes</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrivacyChange('dataCollection')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.dataCollection ? 'bg-red-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.dataCollection ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h4 className="text-md font-semibold text-gray-800 dark:text-neutral-200 mb-4">
                Historique des données
              </h4>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer toutes les données
              </button>
            </div>
          </div>
        );

      case 'sauvegarde':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Paramètres de sauvegarde
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Sauvegarde automatique</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Sauvegarder automatiquement les données</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBackupChange('autoBackup')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    backup.autoBackup ? 'bg-blue-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Fréquence de sauvegarde
                </label>
                <select
                  value={backup.backupFrequency}
                  onChange={(e) => handleBackupChange('backupFrequency', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500"
                >
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <div className="flex items-center space-x-3">
                  <Cloud className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">Stockage cloud</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Sauvegarder dans le cloud</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBackupChange('cloudStorage')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    backup.cloudStorage ? 'bg-green-600' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backup.cloudStorage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Sauvegarder maintenant
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Restaurer
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Préférences générales
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Langue
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Fuseau horaire
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500">
                  <option value="europe/paris">Europe/Paris (UTC+1)</option>
                  <option value="utc">UTC</option>
                  <option value="america/new_york">America/New York (UTC-5)</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Format de date
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500">
                  <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
                  <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
                  <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-neutral-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Thème
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500">
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Paramètres</h1>
          <p className="text-gray-600 dark:text-neutral-400">Gérez vos préférences et paramètres</p>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Paramètres sauvegardés</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Navigation latérale */}
          <div className="md:w-64 bg-gray-50 dark:bg-neutral-700 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                    {isActive ? (
                      <ChevronUp className="h-4 w-4 ml-auto" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6">
            {renderSection()}
            
            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6 mt-6">
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700">
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Cloud pour l'icône de stockage cloud
const Cloud = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

export default ParametresPage;