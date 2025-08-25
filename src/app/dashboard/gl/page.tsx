'use client';

import { useState } from 'react';
import { 
  UserCheck,
  UserX,
  BarChart3,
  Calendar,
  Search,
  ChevronRight,
  Download,
  Printer,
  MapPin,
  Euro,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
  Mail,
  FileText,
  AlertTriangle
} from 'lucide-react';

// Types pour les données du GL
interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateEntree: string;
  dateSortie: string;
  loyer: string;
  caution: string;
  statut: 'actif' | 'sortant' | 'en cours départ';
  impayes: boolean;
  montantImpayes?: string;
}

interface Logement {
  id: number;
  reference: string;
  adresse: string;
  batiment: string;
  etage: string;
  porte: string;
  type: 'Studio' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+';
  surface: string;
  loyer: string;
  charges: string;
  statut: 'occupé' | 'vacant' | 'en travaux';
  locataireActuel?: string;
  dateLiberation?: string;
}

interface Notification {
  id: number;
  type: 'congé' | 'impayé' | 'travaux' | 'edl' | 'alerte';
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  urgent: boolean;
  actionRequise: boolean;
}

interface CourrierCongé {
  id: number;
  locataire: string;
  logement: string;
  dateReception: string;
  dateSortiePrevue: string;
  statut: 'en attente' | 'traité' | 'confirmé';
  impayes: boolean;
  actions: string[];
}

// Données mock pour le GL
const locatairesList: Locataire[] = [
  {
    id: 1,
    nom: "THIAM",
    prenom: "NDEYE THIORO",
    email: "ndeye.thiam@email.com",
    telephone: "06 12 34 56 78",
    adresse: "6 SQUARE ESQUIROL, 94000 CRETEIL",
    dateEntree: "15/03/2020",
    dateSortie: "13/11/2024",
    loyer: "650€",
    caution: "1300€",
    statut: "en cours départ",
    impayes: false
  },
  {
    id: 2,
    nom: "TAVER",
    prenom: "JENNIFER",
    email: "jennifer.taver@email.com",
    telephone: "06 98 76 54 32",
    adresse: "6 SQUARE ESQUIROL, Porte 31081",
    dateEntree: "10/06/2019",
    dateSortie: "12/09/2024",
    loyer: "720€",
    caution: "1440€",
    statut: "sortant",
    impayes: true,
    montantImpayes: "320€"
  },
  {
    id: 3,
    nom: "DUPONT",
    prenom: "JEAN",
    email: "jean.dupont@email.com",
    telephone: "07 65 43 21 09",
    adresse: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
    dateEntree: "01/04/2022",
    dateSortie: "",
    loyer: "850€",
    caution: "1700€",
    statut: "actif",
    impayes: false
  },
  {
    id: 4,
    nom: "MARTIN",
    prenom: "PIERRE",
    email: "pierre.martin@email.com",
    telephone: "06 11 22 33 44",
    adresse: "15 RUE DE LA PAIX, 75002 PARIS",
    dateEntree: "20/08/2021",
    dateSortie: "05/12/2024",
    loyer: "920€",
    caution: "1840€",
    statut: "en cours départ",
    impayes: false
  },
  {
    id: 5,
    nom: "DURAND",
    prenom: "SOPHIE",
    email: "sophie.durand@email.com",
    telephone: "06 55 66 77 88",
    adresse: "22 AVENUE VICTOR HUGO, 75116 PARIS",
    dateEntree: "05/01/2023",
    dateSortie: "",
    loyer: "780€",
    caution: "1560€",
    statut: "actif",
    impayes: true,
    montantImpayes: "450€"
  },
  {
    id: 6,
    nom: "LEMAIRE",
    prenom: "THOMAS",
    email: "thomas.lemaire@email.com",
    telephone: "06 44 55 66 77",
    adresse: "8 RUE DU COMMERCE, 75015 PARIS",
    dateEntree: "10/02/2022",
    dateSortie: "20/01/2025",
    loyer: "890€",
    caution: "1780€",
    statut: "en cours départ",
    impayes: false
  }
];

const logementsList: Logement[] = [
  {
    id: 1,
    reference: "LOG-001",
    adresse: "6 SQUARE ESQUIROL, 94000 CRETEIL",
    batiment: "Bâtiment A",
    etage: "3",
    porte: "12",
    type: "T2",
    surface: "45m²",
    loyer: "650€",
    charges: "50€",
    statut: "occupé",
    locataireActuel: "NDEYE THIORO THIAM"
  },
  {
    id: 2,
    reference: "LOG-002",
    adresse: "6 SQUARE ESQUIROL, 94000 CRETEIL",
    batiment: "Bâtiment B",
    etage: "1",
    porte: "5",
    type: "T1",
    surface: "32m²",
    loyer: "550€",
    charges: "45€",
    statut: "vacant",
    dateLiberation: "12/09/2024"
  },
  {
    id: 3,
    reference: "LOG-003",
    adresse: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
    batiment: "Bâtiment C",
    etage: "4",
    porte: "18",
    type: "T3",
    surface: "62m²",
    loyer: "850€",
    charges: "65€",
    statut: "occupé",
    locataireActuel: "JEAN DUPONT"
  },
  {
    id: 4,
    reference: "LOG-004",
    adresse: "15 RUE DE LA PAIX, 75002 PARIS",
    batiment: "Bâtiment A",
    etage: "2",
    porte: "7",
    type: "T2",
    surface: "48m²",
    loyer: "920€",
    charges: "70€",
    statut: "occupé",
    locataireActuel: "PIERRE MARTIN"
  },
  {
    id: 5,
    reference: "LOG-005",
    adresse: "22 AVENUE VICTOR HUGO, 75116 PARIS",
    batiment: "Bâtiment B",
    etage: "5",
    porte: "22",
    type: "T3",
    surface: "65m²",
    loyer: "780€",
    charges: "60€",
    statut: "occupé",
    locataireActuel: "SOPHIE DURAND"
  },
  {
    id: 6,
    reference: "LOG-006",
    adresse: "8 RUE DU COMMERCE, 75015 PARIS",
    batiment: "Bâtiment C",
    etage: "2",
    porte: "10",
    type: "T2",
    surface: "50m²",
    loyer: "890€",
    charges: "75€",
    statut: "occupé",
    locataireActuel: "THOMAS LEMAIRE"
  }
];

const notificationsList: Notification[] = [
  {
    id: 1,
    type: "congé",
    titre: "Nouveau courrier de congé reçu",
    message: "M. PIERRE MARTIN a envoyé un courrier de congé pour le logement LOG-004",
    date: "10/11/2024",
    lu: false,
    urgent: true,
    actionRequise: true
  },
  {
    id: 2,
    type: "impayé",
    titre: "Impayé détecté",
    message: "Mme SOPHIE DURAND a un impayé de 450€ pour le logement LOG-005",
    date: "09/11/2024",
    lu: false,
    urgent: true,
    actionRequise: true
  },
  {
    id: 3,
    type: "edl",
    titre: "EDL sortant programmé",
    message: "EDL sortant prévu pour Mme JENNIFER TAVER le 12/09/2024",
    date: "08/11/2024",
    lu: true,
    urgent: false,
    actionRequise: false
  },
  {
    id: 4,
    type: "travaux",
    titre: "Travaux planifiés",
    message: "Travaux de remise en état programmés pour le logement LOG-002 à partir du 15/11/2024",
    date: "07/11/2024",
    lu: true,
    urgent: false,
    actionRequise: false
  },
  {
    id: 5,
    type: "alerte",
    titre: "Retard de paiement",
    message: "M. JEAN DUPONT n'a pas encore réglé le loyer du mois de novembre",
    date: "05/11/2024",
    lu: true,
    urgent: false,
    actionRequise: true
  },
  {
    id: 6,
    type: "congé",
    titre: "Courrier de congé reçu",
    message: "M. THOMAS LEMAIRE a envoyé un courrier de congé pour le logement LOG-006",
    date: "03/11/2024",
    lu: false,
    urgent: true,
    actionRequise: true
  }
];

const courriersList: CourrierCongé[] = [
  {
    id: 1,
    locataire: "NDEYE THIORO THIAM",
    logement: "LOG-001",
    dateReception: "01/11/2024",
    dateSortiePrevue: "13/11/2024",
    statut: "traité",
    impayes: false,
    actions: ["Date saisie dans ImmoWare", "Notification envoyée à Remodash"]
  },
  {
    id: 2,
    locataire: "JENNIFER TAVER",
    logement: "LOG-002",
    dateReception: "15/09/2024",
    dateSortiePrevue: "12/09/2024",
    statut: "confirmé",
    impayes: true,
    actions: ["Date saisie dans ImmoWare", "Notification comptabilité", "Notification contentieux"]
  },
  {
    id: 3,
    locataire: "PIERRE MARTIN",
    logement: "LOG-004",
    dateReception: "10/11/2024",
    dateSortiePrevue: "05/12/2024",
    statut: "en attente",
    impayes: false,
    actions: ["À traiter"]
  },
  {
    id: 4,
    locataire: "THOMAS LEMAIRE",
    logement: "LOG-006",
    dateReception: "03/11/2024",
    dateSortiePrevue: "20/01/2025",
    statut: "en attente",
    impayes: false,
    actions: ["À traiter"]
  }
];

// Types pour le tableau de bord
interface StatsCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

interface RecentActivity {
  id: number;
  type: 'courrier' | 'impayé' | 'travaux' | 'edl' | 'notification';
  locataire?: string;
  logement?: string;
  address: string;
  date: string;
  status: 'en cours' | 'à traiter' | 'traité' | 'planifié' | 'urgent';
}

type ActiveTab = 'overview' | 'locataires' | 'logements' | 'courriers' | 'notifications';

const DashboardGLPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // États pour la pagination
  const [currentLocatairesPage, setCurrentLocatairesPage] = useState(1);
  const [currentLogementsPage, setCurrentLogementsPage] = useState(1);
  const [currentCourriersPage, setCurrentCourriersPage] = useState(1);
  const [currentNotificationsPage, setCurrentNotificationsPage] = useState(1);
  
  // Configuration de la pagination - 3 éléments par page
  const itemsPerPage = 3;

  // Données statistiques
  const statsData: StatsCard[] = [
    {
      title: "Locataires actifs",
      value: locatairesList.filter(l => l.statut === 'actif').length.toString(),
      icon: <UserCheck className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      title: "Départs prévus",
      value: locatairesList.filter(l => l.statut === 'en cours départ' || l.statut === 'sortant').length.toString(),
      icon: <UserX className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      title: "Impayés",
      value: locatairesList.filter(l => l.impayes).length.toString(),
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "bg-amber-500"
    },
    {
      title: "Courriers à traiter",
      value: courriersList.filter(c => c.statut === 'en attente').length.toString(),
      icon: <Mail className="h-6 w-6" />,
      color: "bg-purple-500"
    }
  ];

  // Activités récentes
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'courrier',
      locataire: "M. PIERRE MARTIN",
      logement: "LOG-004",
      address: "15 RUE DE LA PAIX, 75002 PARIS",
      date: "10/11/2024",
      status: "à traiter"
    },
    {
      id: 2,
      type: 'impayé',
      locataire: "Mme SOPHIE DURAND",
      logement: "LOG-005",
      address: "22 AVENUE VICTOR HUGO, 75116 PARIS",
      date: "09/11/2024",
      status: "urgent"
    },
    {
      id: 3,
      type: 'edl',
      locataire: "Mme JENNIFER TAVER",
      logement: "LOG-002",
      address: "6 SQUARE ESQUIROL, 94000 CRETEIL",
      date: "12/09/2024",
      status: "traité"
    },
    {
      id: 4,
      type: 'notification',
      locataire: "M. JEAN DUPONT",
      logement: "LOG-003",
      address: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
      date: "05/11/2024",
      status: "en cours"
    },
    {
      id: 5,
      type: 'courrier',
      locataire: "Mme NDEYE THIORO THIAM",
      logement: "LOG-001",
      address: "6 SQUARE ESQUIROL, 94000 CRETEIL",
      date: "01/11/2024",
      status: "traité"
    }
  ];

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
    info: {
      light: 'bg-blue-100 text-blue-800',
      dark: 'dark:bg-blue-900 dark:text-blue-200',
    },
    danger: {
      light: 'bg-red-100 text-red-800',
      dark: 'dark:bg-red-900 dark:text-red-200',
    },
  };

  // Fonctions pour la pagination des locataires
  const locatairesTotalPages = Math.ceil(locatairesList.length / itemsPerPage);
  const locatairesStartIndex = (currentLocatairesPage - 1) * itemsPerPage;
  const currentLocatairesItems = locatairesList.slice(locatairesStartIndex, locatairesStartIndex + itemsPerPage);

  const handleLocatairesPageChange = (page: number) => {
    if (page >= 1 && page <= locatairesTotalPages) {
      setCurrentLocatairesPage(page);
    }
  };

  // Fonctions pour la pagination des logements
  const logementsTotalPages = Math.ceil(logementsList.length / itemsPerPage);
  const logementsStartIndex = (currentLogementsPage - 1) * itemsPerPage;
  const currentLogementsItems = logementsList.slice(logementsStartIndex, logementsStartIndex + itemsPerPage);

  const handleLogementsPageChange = (page: number) => {
    if (page >= 1 && page <= logementsTotalPages) {
      setCurrentLogementsPage(page);
    }
  };

  // Fonctions pour la pagination des courriers
  const courriersTotalPages = Math.ceil(courriersList.length / itemsPerPage);
  const courriersStartIndex = (currentCourriersPage - 1) * itemsPerPage;
  const currentCourriersItems = courriersList.slice(courriersStartIndex, courriersStartIndex + itemsPerPage);

  const handleCourriersPageChange = (page: number) => {
    if (page >= 1 && page <= courriersTotalPages) {
      setCurrentCourriersPage(page);
    }
  };

  // Fonctions pour la pagination des notifications
  const notificationsTotalPages = Math.ceil(notificationsList.length / itemsPerPage);
  const notificationsStartIndex = (currentNotificationsPage - 1) * itemsPerPage;
  const currentNotificationsItems = notificationsList.slice(notificationsStartIndex, notificationsStartIndex + itemsPerPage);

  const handleNotificationsPageChange = (page: number) => {
    if (page >= 1 && page <= notificationsTotalPages) {
      setCurrentNotificationsPage(page);
    }
  };

  const getStatusBadge = (status: RecentActivity['status']) => {
    switch(status) {
      case 'traité':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'à traiter':
      case 'planifié':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'urgent':
        return `${colors.danger.light} ${colors.danger.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: RecentActivity['status']) => {
    switch(status) {
      case 'traité': return 'Traité';
      case 'en cours': return 'En cours';
      case 'à traiter': return 'À traiter';
      case 'planifié': return 'Planifié';
      case 'urgent': return 'Urgent';
      default: return status;
    }
  };

  const getStatutLocataireLabel = (statut: Locataire['statut']) => {
    switch(statut) {
      case 'actif': return 'Actif';
      case 'sortant': return 'Sortant';
      case 'en cours départ': return 'En cours départ';
      default: return statut;
    }
  };

  const getStatutLogementLabel = (statut: Logement['statut']) => {
    switch(statut) {
      case 'occupé': return 'Occupé';
      case 'vacant': return 'Vacant';
      case 'en travaux': return 'En travaux';
      default: return statut;
    }
  };

  const getStatutCourrierLabel = (statut: CourrierCongé['statut']) => {
    switch(statut) {
      case 'en attente': return 'En attente';
      case 'traité': return 'Traité';
      case 'confirmé': return 'Confirmé';
      default: return statut;
    }
  };

  const getTypeLabel = (type: RecentActivity['type']) => {
    switch(type) {
      case 'courrier': return 'Courrier';
      case 'impayé': return 'Impayé';
      case 'travaux': return 'Travaux';
      case 'edl': return 'EDL';
      case 'notification': return 'Notification';
      default: return type;
    }
  };

  // Composant de pagination réutilisable
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    startIndex,
    endIndex,
    totalItems
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startIndex: number;
    endIndex: number;
    totalItems: number;
  }) => (
    <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-neutral-300">
            Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
              {endIndex}
            </span> sur <span className="font-medium">{totalItems}</span> éléments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Tableau de bord - Gestionnaire Locative
        </h1>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className={`px-3 py-2 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center justify-center`}>
            <Search className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Rechercher</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="h-4 w-4 mr-1" /> },
            { id: 'locataires', label: 'Locataires', icon: <UserCheck className="h-4 w-4 mr-1" /> },
            { id: 'logements', label: 'Logements', icon: <Home className="h-4 w-4 mr-1" /> },
            { id: 'courriers', label: 'Courriers', icon: <Mail className="h-4 w-4 mr-1" /> },
            { id: 'notifications', label: 'Notifications', icon: <FileText className="h-4 w-4 mr-1" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab);
                // Réinitialiser la pagination quand on change d'onglet
                if (tab.id === 'locataires') {
                  setCurrentLocatairesPage(1);
                } else if (tab.id === 'logements') {
                  setCurrentLogementsPage(1);
                } else if (tab.id === 'courriers') {
                  setCurrentCourriersPage(1);
                } else if (tab.id === 'notifications') {
                  setCurrentNotificationsPage(1);
                }
              }}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${stat.color} text-white mr-3`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">{stat.title}</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-neutral-200">{stat.value}</h3>
                      {stat.trend && (
                        <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                          {stat.trend}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200">Activités récentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Détails</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {recentActivities.slice(0, 3).map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === 'courrier' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : activity.type === 'impayé'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : activity.type === 'travaux'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : activity.type === 'edl'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {getTypeLabel(activity.type)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900 dark:text-neutral-200">
                            {activity.locataire}
                          </div>
                          {activity.logement && (
                            <div className="text-xs text-gray-500 dark:text-neutral-400">
                              {activity.logement}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 dark:text-neutral-200 truncate max-w-xs flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          {activity.address}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">{activity.date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}>
                          {getStatusLabel(activity.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'locataires' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Gestion des locataires
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Loyer/Caution</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentLocatairesItems.map((locataire) => (
                  <tr key={locataire.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {locataire.nom} {locataire.prenom}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          ID: {locataire.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">{locataire.email}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">{locataire.telephone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 truncate max-w-xs flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {locataire.adresse}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        <div>Entrée: {locataire.dateEntree}</div>
                        {locataire.dateSortie && <div>Sortie: {locataire.dateSortie}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        {locataire.loyer}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        Caution: {locataire.caution}
                      </div>
                      {locataire.impayes && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Impayé: {locataire.montantImpayes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        locataire.statut === 'actif'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : locataire.statut === 'sortant'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {getStatutLocataireLabel(locataire.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentLocatairesPage}
            totalPages={locatairesTotalPages}
            onPageChange={handleLocatairesPageChange}
            startIndex={locatairesStartIndex}
            endIndex={Math.min(locatairesStartIndex + itemsPerPage, locatairesList.length)}
            totalItems={locatairesList.length}
          />
        </div>
      )}

      {activeTab === 'logements' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Gestion des logements
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type/Surface</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Loyer/Charges</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentLogementsItems.map((logement) => (
                  <tr key={logement.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {logement.reference}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 truncate max-w-xs flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {logement.adresse}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {logement.batiment}, Étage {logement.etage}, Porte {logement.porte}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">{logement.type}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">{logement.surface}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        {logement.loyer}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        Charges: {logement.charges}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        logement.statut === 'occupé'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : logement.statut === 'vacant'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {getStatutLogementLabel(logement.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        {logement.locataireActuel || 'Aucun'}
                      </div>
                      {logement.dateLiberation && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Libération: {logement.dateLiberation}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentLogementsPage}
            totalPages={logementsTotalPages}
            onPageChange={handleLogementsPageChange}
            startIndex={logementsStartIndex}
            endIndex={Math.min(logementsStartIndex + itemsPerPage, logementsList.length)}
            totalItems={logementsList.length}
          />
        </div>
      )}

      {activeTab === 'courriers' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Gestion des courriers de congé
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Impayés</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentCourriersItems.map((courrier) => (
                  <tr key={courrier.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {courrier.locataire}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        {courrier.logement}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        <div>Reçu: {courrier.dateReception}</div>
                        <div>Sortie: {courrier.dateSortiePrevue}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        courrier.statut === 'en attente'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : courrier.statut === 'traité'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {getStatutCourrierLabel(courrier.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        courrier.impayes
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {courrier.impayes ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentCourriersPage}
            totalPages={courriersTotalPages}
            onPageChange={handleCourriersPageChange}
            startIndex={courriersStartIndex}
            endIndex={Math.min(courriersStartIndex + itemsPerPage, courriersList.length)}
            totalItems={courriersList.length}
          />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Notifications et alertes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentNotificationsItems.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.type === 'congé' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : notification.type === 'impayé'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : notification.type === 'travaux'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : notification.type === 'edl'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {notification.type}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {notification.titre}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 max-w-xs">
                        {notification.message}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{notification.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {notification.lu ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Lu
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Non lu
                          </span>
                        )}
                        {notification.urgent && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentNotificationsPage}
            totalPages={notificationsTotalPages}
            onPageChange={handleNotificationsPageChange}
            startIndex={notificationsStartIndex}
            endIndex={Math.min(notificationsStartIndex + itemsPerPage, notificationsList.length)}
            totalItems={notificationsList.length}
          />
        </div>
      )}
    </main>
  );
};

export default DashboardGLPage;

// Composant Home pour l'icône de logement
const Home = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);