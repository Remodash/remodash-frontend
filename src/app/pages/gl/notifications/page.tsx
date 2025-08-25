'use client';

import { useState } from 'react';
import { 
  Bell,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  User,
  Home,
  Clock,
  Euro,
  Download,
  Printer
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'impayé' | 'alerte' | 'validation' | 'rapport' | 'travaux' | 'information';
  titre: string;
  description: string;
  date: string;
  lue: boolean;
  urgence: 'haute' | 'moyenne' | 'basse';
  logement_reference?: string;
  logement_adresse?: string;
  locataire?: string;
  montant_impaye?: number;
  action_requise?: boolean;
  lien?: string;
}

type NotificationFilter = 'all' | 'impayé' | 'alerte' | 'validation' | 'rapport' | 'travaux' | 'information';
type UrgenceFilter = 'all' | 'haute' | 'moyenne' | 'basse';
type StatutFilter = 'all' | 'lue' | 'non-lue';

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<NotificationFilter>('all');
  const [urgenceFilter, setUrgenceFilter] = useState<UrgenceFilter>('all');
  const [statutFilter, setStatutFilter] = useState<StatutFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Pagination après 3 items

  // Fonction pour tronquer le texte après 82 caractères
  const truncateText = (text: string, maxLength: number = 82) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
    warning: {
      light: 'bg-yellow-100 text-yellow-800',
      dark: 'dark:bg-yellow-900 dark:text-yellow-200',
    },
    danger: {
      light: 'bg-red-100 text-red-800',
      dark: 'dark:bg-red-900 dark:text-red-200',
    },
    info: {
      light: 'bg-blue-100 text-blue-800',
      dark: 'dark:bg-blue-900 dark:text-blue-200',
    },
  };

  // Données mock des notifications
  const [notificationsList, setNotificationsList] = useState<Notification[]>([
    {
      id: 1,
      type: 'impayé',
      titre: 'Impayé détecté - M. DUPONT Jean',
      description: 'Le locataire M. DUPONT Jean présente un impayé de 850€ pour le logement LOG-003. Notification envoyée aux services comptabilité et contentieux.',
      date: '2024-01-15 09:30',
      lue: false,
      urgence: 'haute',
      logement_reference: 'LOG-003',
      logement_adresse: '12 AVENUE DE LA REPUBLIQUE, 75011 PARIS',
      locataire: 'M. JEAN DUPONT',
      montant_impaye: 850,
      action_requise: true,
      lien: '/logements/LOG-003'
    },
    {
      id: 2,
      type: 'alerte',
      titre: 'Pré-EDL programmé - LOG-002',
      description: 'Le Pré-État des Lieux pour le logement LOG-002 est programmé le 20/01/2024 à 10h00. Le gardien a été notifié.',
      date: '2024-01-14 14:15',
      lue: false,
      urgence: 'moyenne',
      logement_reference: 'LOG-002',
      logement_adresse: '6 SQUARE ESQUIROL, 94000 CRETEIL',
      action_requise: false,
      lien: '/calendrier'
    },
    {
      id: 3,
      type: 'validation',
      titre: 'Diagnostics à valider - LOG-001',
      description: 'L\'IA a généré une liste de diagnostics pour le logement LOG-001. Validation requise par le Gestionnaire Technique.',
      date: '2024-01-14 11:45',
      lue: true,
      urgence: 'moyenne',
      logement_reference: 'LOG-001',
      logement_adresse: '6 SQUARE ESQUIROL, 94000 CRETEIL',
      action_requise: true,
      lien: '/diagnostics/LOG-001'
    },
    {
      id: 4,
      type: 'rapport',
      titre: 'Rapport de diagnostic disponible - LOG-004',
      description: 'Les rapports de diagnostic pour le logement LOG-004 sont disponibles et ont été intégrés au système.',
      date: '2024-01-13 16:20',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-004',
      logement_adresse: '15 RUE DE LA PAIX, 75002 PARIS',
      action_requise: false,
      lien: '/diagnostics/LOG-004/rapports'
    },
    {
      id: 5,
      type: 'travaux',
      titre: 'BT générés - LOG-006',
      description: 'Les Bons de Travaux pour le logement LOG-006 ont été générés par l\'IA et sont en attente de validation.',
      date: '2024-01-13 10:30',
      lue: false,
      urgence: 'moyenne',
      logement_reference: 'LOG-006',
      logement_adresse: '8 RUE DU COMMERCE, 75015 PARIS',
      action_requise: true,
      lien: '/travaux/LOG-006'
    },
    {
      id: 6,
      type: 'information',
      titre: 'Nettoyage programmé - LOG-007',
      description: 'Le nettoyage général du logement LOG-007 a été programmé pour le 25/01/2024.',
      date: '2024-01-12 15:40',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-007',
      logement_adresse: '25 BOULEVARD SAINT-GERMAIN, 75005 PARIS',
      action_requise: false,
      lien: '/travaux/LOG-007'
    },
    {
      id: 7,
      type: 'impayé',
      titre: 'Impayé résolu - Mme THIAM Ndeye',
      description: 'L\'impayé de 650€ pour le logement LOG-001 a été réglé par Mme THIAM Ndeye.',
      date: '2024-01-12 09:15',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-001',
      logement_adresse: '6 SQUARE ESQUIROL, 94000 CRETEIL',
      locataire: 'Mme NDEYE THIORO THIAM',
      montant_impaye: 650,
      action_requise: false,
      lien: '/logements/LOG-001'
    },
    {
      id: 8,
      type: 'alerte',
      titre: 'Retard travaux - LOG-008',
      description: 'Le prestataire de travaux signale un retard pour le logement LOG-008 en raison de livraison retardée de matériaux.',
      date: '2024-01-11 17:30',
      lue: false,
      urgence: 'haute',
      logement_reference: 'LOG-008',
      logement_adresse: '3 RUE DES ROSIERS, 75004 PARIS',
      action_requise: true,
      lien: '/travaux/LOG-008'
    },
    {
      id: 9,
      type: 'validation',
      titre: 'BT approuvés - LOG-005',
      description: 'Les Bons de Travaux pour le logement LOG-005 ont été approuvés par le Responsable d\'Agence.',
      date: '2024-01-11 14:20',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-005',
      logement_adresse: '22 AVENUE VICTOR HUGO, 75116 PARIS',
      action_requise: false,
      lien: '/travaux/LOG-005'
    },
    {
      id: 10,
      type: 'rapport',
      titre: 'Rapport journalier - LOG-006',
      description: 'Le gardien a soumis le rapport journalier des travaux pour le logement LOG-006.',
      date: '2024-01-11 11:10',
      lue: false,
      urgence: 'moyenne',
      logement_reference: 'LOG-006',
      logement_adresse: '8 RUE DU COMMERCE, 75015 PARIS',
      action_requise: true,
      lien: '/travaux/LOG-006/rapports'
    },
    {
      id: 11,
      type: 'travaux',
      titre: 'Travaux terminés - LOG-007',
      description: 'Les travaux de remise en état du logement LOG-007 sont terminés. Réception programmée demain.',
      date: '2024-01-10 16:45',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-007',
      logement_adresse: '25 BOULEVARD SAINT-GERMAIN, 75005 PARIS',
      action_requise: false,
      lien: '/travaux/LOG-007'
    },
    {
      id: 12,
      type: 'information',
      titre: 'Logement prêt - LOG-002',
      description: 'Le logement LOG-002 est maintenant prêt pour attribution après travaux et nettoyage.',
      date: '2024-01-10 10:30',
      lue: true,
      urgence: 'basse',
      logement_reference: 'LOG-002',
      logement_adresse: '6 SQUARE ESQUIROL, 94000 CRETEIL',
      action_requise: false,
      lien: '/logements/LOG-002'
    }
  ]);

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    
    // Marquer comme lue lorsqu'on ouvre le modal
    if (!notification.lue) {
      setNotificationsList(prev => 
        prev.map(n => n.id === notification.id ? { ...n, lue: true } : n)
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const marquerCommeLue = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, lue: true } : n)
    );
  };

  const marquerCommeNonLue = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, lue: false } : n)
    );
  };

  const marquerToutesCommeLues = () => {
    setNotificationsList(prev => 
      prev.map(n => ({ ...n, lue: true }))
    );
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch(type) {
      case 'impayé': return <Euro className="h-5 w-5" />;
      case 'alerte': return <AlertTriangle className="h-5 w-5" />;
      case 'validation': return <CheckCircle className="h-5 w-5" />;
      case 'rapport': return <Download className="h-5 w-5" />;
      case 'travaux': return <Home className="h-5 w-5" />;
      case 'information': return <Info className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch(type) {
      case 'impayé': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'alerte': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'validation': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'rapport': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      case 'travaux': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'information': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getUrgenceColor = (urgence: Notification['urgence']) => {
    switch(urgence) {
      case 'haute': return 'bg-red-500';
      case 'moyenne': return 'bg-yellow-500';
      case 'basse': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch(type) {
      case 'impayé': return 'Impayé';
      case 'alerte': return 'Alerte';
      case 'validation': return 'Validation';
      case 'rapport': return 'Rapport';
      case 'travaux': return 'Travaux';
      case 'information': return 'Information';
      default: return type;
    }
  };

  const filteredNotifications = notificationsList.filter(notification => {
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    if (urgenceFilter !== 'all' && notification.urgence !== urgenceFilter) return false;
    if (statutFilter !== 'all') {
      if (statutFilter === 'lue' && !notification.lue) return false;
      if (statutFilter === 'non-lue' && notification.lue) return false;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        notification.titre.toLowerCase().includes(term) ||
        notification.description.toLowerCase().includes(term) ||
        (notification.logement_reference?.toLowerCase().includes(term) || false) ||
        (notification.locataire?.toLowerCase().includes(term) || false)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nonLuesCount = notificationsList.filter(n => !n.lue).length;

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <div className="relative">
            <Bell className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3 text-blue-600" />
            {nonLuesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {nonLuesCount}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
            Notifications
          </h1>
        </div>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher dans les notifications..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            onClick={marquerToutesCommeLues}
            className="px-3 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Tout marquer comme lu</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtre par type */}
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 py-2">Type:</span>
            {[
              { type: 'all', icon: <Filter className="h-4 w-4 mr-1" /> },
              { type: 'impayé', icon: <Euro className="h-4 w-4 mr-1" /> },
              { type: 'alerte', icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
              { type: 'validation', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
              { type: 'rapport', icon: <Download className="h-4 w-4 mr-1" /> },
              { type: 'travaux', icon: <Home className="h-4 w-4 mr-1" /> },
              { type: 'information', icon: <Info className="h-4 w-4 mr-1" /> },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setTypeFilter(item.type as NotificationFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  typeFilter === item.type
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {item.icon}
                {item.type === 'all' ? 'Tous' : getTypeLabel(item.type as Notification['type'])}
                {item.type !== 'all' && (
                  <span className="ml-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    {notificationsList.filter(d => d.type === item.type).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filtre par urgence */}
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 py-2">Urgence:</span>
            {[
              { urgence: 'all', label: 'Toutes' },
              { urgence: 'haute', label: 'Haute' },
              { urgence: 'moyenne', label: 'Moyenne' },
              { urgence: 'basse', label: 'Basse' },
            ].map((item) => (
              <button
                key={item.urgence}
                onClick={() => {
                  setUrgenceFilter(item.urgence as UrgenceFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm ${
                  urgenceFilter === item.urgence
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {item.label}
                {item.urgence !== 'all' && (
                  <span className="ml-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    {notificationsList.filter(d => d.urgence === item.urgence).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filtre par statut */}
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 py-2">Statut:</span>
            {[
              { statut: 'all', label: 'Tous' },
              { statut: 'non-lue', label: 'Non lues' },
              { statut: 'lue', label: 'Lues' },
            ].map((item) => (
              <button
                key={item.statut}
                onClick={() => {
                  setStatutFilter(item.statut as StatutFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm ${
                  statutFilter === item.statut
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {item.label}
                {item.statut !== 'all' && (
                  <span className="ml-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.statut === 'non-lue' 
                      ? notificationsList.filter(d => !d.lue).length
                      : notificationsList.filter(d => d.lue).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Notification</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map(notification => (
                  <tr 
                    key={notification.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer ${
                      !notification.lue ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => openModal(notification)}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getUrgenceColor(notification.urgence)} mr-2`}></div>
                        {!notification.lue ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Non lue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            Lue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <span className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </span>
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {truncateText(notification.titre, 60)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">
                          {truncateText(notification.description)}
                        </div>
                        {notification.logement_reference && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-1">
                            <Home className="h-3 w-3 mr-1 flex-shrink-0" />
                            {truncateText(notification.logement_reference, 30)}
                            {notification.locataire && (
                              <span className="ml-2 flex items-center">
                                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                {truncateText(notification.locataire, 25)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-neutral-400">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        {new Date(notification.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(notification)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {notification.lue ? (
                          <button
                            onClick={(e) => marquerCommeNonLue(notification.id, e)}
                            className="p-1.5 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                            title="Marquer comme non lue"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => marquerCommeLue(notification.id, e)}
                            className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            title="Marquer comme lue"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucune notification trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - affichée même s'il y a moins de 3 éléments */}
        {totalItems > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-neutral-400">
              Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur{' '}
              <span className="font-medium">{totalItems}</span> résultats
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-neutral-500 border-gray-200 dark:border-neutral-700 cursor-not-allowed'
                    : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? `${colors.primary.light} ${colors.primary.dark} text-white border-blue-600 dark:border-blue-700`
                      : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-neutral-500 border-gray-200 dark:border-neutral-700 cursor-not-allowed'
                    : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
                >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`p-2 rounded-full ${getTypeColor(selectedNotification.type)} mr-3`}>
                    {getTypeIcon(selectedNotification.type)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200">
                      {selectedNotification.titre}
                    </h2>
                    <p className="text-gray-600 dark:text-neutral-400 mt-1 flex items-center">
                      <span className={`h-2 w-2 rounded-full ${getUrgenceColor(selectedNotification.urgence)} mr-2`}></span>
                      {selectedNotification.urgence === 'haute' ? 'Haute urgence' : 
                       selectedNotification.urgence === 'moyenne' ? 'Urgence moyenne' : 'Basse urgence'}
                      <span className="mx-2">•</span>
                      {new Date(selectedNotification.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Fermer le modal"
                  >
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Informations générales */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Détails de la notification</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Type:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{getTypeLabel(selectedNotification.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Urgence:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-200 capitalize">{selectedNotification.urgence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Statut:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                      {selectedNotification.lue ? 'Lue' : 'Non lue'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Date:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                      {new Date(selectedNotification.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {selectedNotification.action_requise !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">Action requise:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {selectedNotification.action_requise ? 'Oui' : 'Non'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Description</h3>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  {selectedNotification.description}
                </p>
              </div>

              {/* Informations liées */}
              {(selectedNotification.logement_reference || selectedNotification.locataire || selectedNotification.montant_impaye) && (
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations liées</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedNotification.logement_reference && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Logement:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {selectedNotification.logement_reference}
                        </span>
                      </div>
                    )}
                    {selectedNotification.logement_adresse && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Adresse:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {selectedNotification.logement_adresse}
                        </span>
                      </div>
                    )}
                    {selectedNotification.locataire && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Locataire:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {selectedNotification.locataire}
                        </span>
                      </div>
                    )}
                    {selectedNotification.montant_impaye && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Montant impayé:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {selectedNotification.montant_impaye}€
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedNotification.action_requise && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">Action requise</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                    Cette notification nécessite votre attention. Veuillez traiter cette demande dans les plus brefs délais.
                  </p>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Traiter maintenant
                    </button>
                    {selectedNotification.lien && (
                      <a 
                        href={selectedNotification.lien}
                        className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        Voir les détails
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex space-x-2">
                  {selectedNotification.lue ? (
                    <button 
                      onClick={(e) => marquerCommeNonLue(selectedNotification.id, e as React.MouseEvent)}
                      className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Marquer comme non lue
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => marquerCommeLue(selectedNotification.id, e as React.MouseEvent)}
                      className="px-4 py-2 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme lue
                    </button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Fermer
                  </button>
                  {selectedNotification.lien && (
                    <a 
                      href={selectedNotification.lien}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les détails complets
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;