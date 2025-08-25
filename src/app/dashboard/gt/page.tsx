'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  BarChart3,
  Calendar,
  Search,
  ChevronRight,
  Download,
  Printer,
  Construction,
  Wrench,
  MapPin,
  Euro,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
  FileText,
  Home,
  Clock,
  CheckSquare,
  XCircle,
  Filter
} from 'lucide-react';

// Types pour les travaux
interface Intervenant {
  nom: string;
  telephone: string;
  email: string;
  specialite: string;
}

interface Materiau {
  nom: string;
  quantite: number;
  prix_unitaire: string;
  fournisseur: string;
}

interface PhotoItem {
  id: string;
  file: File | null;
  previewUrl: string;
  type: 'avant' | 'pendant' | 'après';
}

type StatutTravaux = 'planifié' | 'en cours' | 'terminé' | 'annulé';
type StatutEtape = 'planifié' | 'en cours' | 'terminé' | 'reporté';

interface EtapeTravaux {
  id: string;
  description: string;
  statut: StatutEtape;
  date_debut: string;
  date_fin: string;
  intervenants: Intervenant[];
  materiaux: Materiau[];
  observations?: string;
  photos: PhotoItem[];
}

interface Travaux {
  id: number;
  reference: string;
  titre: string;
  type: 'entretien' | 'réparation' | 'rénovation' | 'urgence';
  priorite: 'faible' | 'moyenne' | 'élevée' | 'critique';
  statut: StatutTravaux;
  date_creation: string;
  date_debut: string;
  date_fin_prevue: string;
  batiment: string;
  etage: string;
  porte: string;
  description: string;
  budget_prevue: string;
  cout_reel: string;
  etapes: EtapeTravaux[];
  photos: PhotoItem[];
}

// Types pour les diagnostics
interface Diagnostic {
  id: number;
  type: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites' | 'Audit énergétique';
  statut: 'en attente' | 'planifié' | 'en cours' | 'terminé' | 'annulé';
  date_demande: string;
  date_realisation: string;
  date_limite: string;
  logement: string;
  prestataire: string;
  rapport: string | null;
}

// Types pour les bons de travaux
interface BonTravaux {
  id: number;
  reference: string;
  statut: 'en attente' | 'validé' | 'en cours' | 'terminé' | 'annulé';
  date_creation: string;
  date_debut: string;
  date_fin_prevue: string;
  logement: string;
  prestataire: string;
  cout_estime: string;
  travaux: Travaux[];
  diagnostics_associes: number[];
}

// Types pour le tableau de bord
interface StatsCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  onClick: () => void;
}

interface RecentActivity {
  id: number;
  type: 'diagnostic' | 'travaux' | 'validation' | 'alerte';
  title: string;
  description: string;
  date: string;
  status: 'en attente' | 'en cours' | 'terminé' | 'à valider' | 'urgent';
  entity?: Diagnostic | BonTravaux | Travaux;
  onClick: () => void;
}

type ActiveTab = 'overview' | 'diagnostics' | 'travaux' | 'validations';

const GTDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  // États pour la pagination des travaux
  const [currentTravauxPage, setCurrentTravauxPage] = useState(1);
  const travauxPerPage = 5;
  
  // États pour la pagination des diagnostics
  const [currentDiagnosticsPage, setCurrentDiagnosticsPage] = useState(1);
  const diagnosticsPerPage = 5;

  // États pour la pagination des activités récentes
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const activitiesPerPage = 3;

  // Fonctions de navigation
  const navigateToDiagnostics = () => {
    window.location.href = '/pages/gt/diagnostics';
  };

  const navigateToTravaux = () => {
    window.location.href = '/pages/gt/travaux';
  };

  const navigateToValidations = () => {
    window.location.href = '/pages/gt/validations';
  };

  const navigateToDiagnosticDetail = ({/*id: number*/}) => {
    window.location.href = `/pages/gt/diagnostics`;
  };

  const navigateToTravauxDetail = ({/*id: number*/}) => {
    window.location.href = `/pages/gt/travaux`;
  };

  const navigateToValidationDetail = ({/*id: number*/}) => {
    window.location.href = `/pages/gt/validations`;
  };

  // Données des diagnostics
  const diagnosticsList: Diagnostic[] = [
    {
      id: 1,
      type: 'DPE',
      statut: 'terminé',
      date_demande: '10/11/2024',
      date_realisation: '15/11/2024',
      date_limite: '20/11/2024',
      logement: '6 SQUARE ESQUIROL, Porte 31081',
      prestataire: 'Diagnostiqueurs Associés',
      rapport: '/rapports/dpe-31081.pdf'
    },
    {
      id: 2,
      type: 'Électricité',
      statut: 'en cours',
      date_demande: '18/11/2024',
      date_realisation: '',
      date_limite: '25/11/2024',
      logement: '6 SQUARE ESQUIROL, Porte 21045',
      prestataire: 'Élec-Sécurité',
      rapport: null
    },
    {
      id: 3,
      type: 'Plomb',
      statut: 'en attente',
      date_demande: '20/11/2024',
      date_realisation: '',
      date_limite: '27/11/2024',
      logement: '6 SQUARE ESQUIROL, Porte 11022',
      prestataire: 'Plomb Experts',
      rapport: null
    },
    {
      id: 4,
      type: 'Amiante',
      statut: 'planifié',
      date_demande: '22/11/2024',
      date_realisation: '',
      date_limite: '29/11/2024',
      logement: '6 SQUARE ESQUIROL, Porte 41093',
      prestataire: 'Amiante Control',
      rapport: null
    },
    {
      id: 5,
      type: 'Gaz',
      statut: 'terminé',
      date_demande: '05/11/2024',
      date_realisation: '10/11/2024',
      date_limite: '15/11/2024',
      logement: '6 SQUARE ESQUIROL, Porte 51067',
      prestataire: 'Gaz Check',
      rapport: '/rapports/gaz-51067.pdf'
    }
  ];

  // Données des travaux
  const travauxList: Travaux[] = [
    {
      id: 1,
      reference: "BT-2024-001",
      titre: "Remise en état après départ locataire",
      type: "rénovation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "15/11/2024",
      date_debut: "18/11/2024",
      date_fin_prevue: "25/11/2024",
      batiment: "6 SQUARE ESQUIROL",
      etage: "3",
      porte: "31081",
      description: "Remise en état complète après départ du locataire : peinture, sols, électricité, plomberie",
      budget_prevue: "3500",
      cout_reel: "1200",
      etapes: [],
      photos: []
    },
    {
      id: 2,
      reference: "BT-2024-002",
      titre: "Réparation fuite eau",
      type: "réparation",
      priorite: "critique",
      statut: "terminé",
      date_creation: "10/11/2024",
      date_debut: "11/11/2024",
      date_fin_prevue: "11/11/2024",
      batiment: "6 SQUARE ESQUIROL",
      etage: "2",
      porte: "21045",
      description: "Réparation fuite eau dans la salle de bain",
      budget_prevue: "450",
      cout_reel: "420",
      etapes: [],
      photos: []
    },
    {
      id: 3,
      reference: "BT-2024-003",
      titre: "Remplacement chaudière",
      type: "rénovation",
      priorite: "élevée",
      statut: "planifié",
      date_creation: "20/11/2024",
      date_debut: "25/11/2024",
      date_fin_prevue: "27/11/2024",
      batiment: "6 SQUARE ESQUIROL",
      etage: "1",
      porte: "11022",
      description: "Remplacement de la chaudière vétuste",
      budget_prevue: "2800",
      cout_reel: "0",
      etapes: [],
      photos: []
    },
    {
      id: 4,
      reference: "BT-2024-004",
      titre: "Nettoyage après travaux",
      type: "entretien",
      priorite: "moyenne",
      statut: "en cours",
      date_creation: "19/11/2024",
      date_debut: "20/11/2024",
      date_fin_prevue: "20/11/2024",
      batiment: "6 SQUARE ESQUIROL",
      etage: "4",
      porte: "41093",
      description: "Nettoyage complet après travaux de rénovation",
      budget_prevue: "300",
      cout_reel: "150",
      etapes: [],
      photos: []
    },
    {
      id: 5,
      reference: "BT-2024-005",
      titre: "Mise aux normes électriques",
      type: "rénovation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "12/11/2024",
      date_debut: "15/11/2024",
      date_fin_prevue: "22/11/2024",
      batiment: "6 SQUARE ESQUIROL",
      etage: "5",
      porte: "51067",
      description: "Mise aux normes de l'installation électrique",
      budget_prevue: "1800",
      cout_reel: "950",
      etapes: [],
      photos: []
    }
  ];

  // Bons de travaux à valider
  const bonsTravauxValidation: BonTravaux[] = [
    {
      id: 1,
      reference: "BT-2024-006",
      statut: 'en attente',
      date_creation: "22/11/2024",
      date_debut: "25/11/2024",
      date_fin_prevue: "30/11/2024",
      logement: "6 SQUARE ESQUIROL, Porte 61012",
      prestataire: "Multi Services BTP",
      cout_estime: "2250",
      travaux: [],
      diagnostics_associes: [3, 4]
    },
    {
      id: 2,
      reference: "BT-2024-007",
      statut: 'en attente',
      date_creation: "23/11/2024",
      date_debut: "26/11/2024",
      date_fin_prevue: "02/12/2024",
      logement: "6 SQUARE ESQUIROL, Porte 71034",
      prestataire: "Peinture Pro",
      cout_estime: "1750",
      travaux: [],
      diagnostics_associes: [1]
    }
  ];

  // Données statistiques pour le GT
  const statsData: StatsCard[] = [
    {
      title: "Travaux en cours",
      value: travauxList.filter(t => t.statut === 'en cours').length.toString(),
      icon: <Wrench className="h-6 w-6" />,
      trend: "+3",
      color: "bg-amber-500",
      onClick: navigateToTravaux
    },
    {
      title: "Diagnostics à planifier",
      value: diagnosticsList.filter(d => d.statut === 'en attente').length.toString(),
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-500",
      onClick: navigateToDiagnostics
    },
    {
      title: "Validations en attente",
      value: bonsTravauxValidation.length.toString(),
      icon: <CheckSquare className="h-6 w-6" />,
      color: "bg-purple-500",
      onClick: navigateToValidations
    },
    {
      title: "Retards",
      value: "2",
      icon: <Clock className="h-6 w-6" />,
      trend: "+1",
      color: "bg-red-500",
      onClick: () => window.location.href = '/pages/gt/retards'
    }
  ];

  // Activités récentes pour le GT
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'diagnostic',
      title: "Diagnostic DPE terminé",
      description: "Le diagnostic DPE pour le logement 31081 a été complété",
      date: "15/11/2024 14:30",
      status: 'terminé',
      entity: diagnosticsList[0],
      onClick: () => navigateToDiagnosticDetail(1)
    },
    {
      id: 2,
      type: 'travaux',
      title: "Début des travaux BT-2024-001",
      description: "Les travaux de remise en état ont commencé au logement 31081",
      date: "18/11/2024 09:15",
      status: 'en cours',
      entity: travauxList[0],
      onClick: () => navigateToTravauxDetail(1)
    },
    {
      id: 3,
      type: 'validation',
      title: "Bon de travaux à valider",
      description: "Nouveau bon de travaux BT-2024-006 nécessite votre validation",
      date: "22/11/2024 11:45",
      status: 'à valider',
      entity: bonsTravauxValidation[0],
      onClick: () => navigateToValidationDetail(1)
    },
    {
      id: 4,
      type: 'alerte',
      title: "Retard sur diagnostic",
      description: "Le diagnostic électricité pour le logement 21045 prend du retard",
      date: "23/11/2024 16:20",
      status: 'urgent',
      entity: diagnosticsList[1],
      onClick: () => navigateToDiagnosticDetail(2)
    },
    {
      id: 5,
      type: 'travaux',
      title: "Travaux terminés",
      description: "Les travaux de réparation fuite d'eau (BT-2024-002) sont terminés",
      date: "11/11/2024 17:30",
      status: 'terminé',
      entity: travauxList[1],
      onClick: () => navigateToTravauxDetail(2)
    },
    {
      id: 6,
      type: 'diagnostic',
      title: "Nouveau diagnostic demandé",
      description: "Diagnostic plomb demandé pour le logement 11022",
      date: "20/11/2024 10:00",
      status: 'en attente',
      entity: diagnosticsList[2],
      onClick: () => navigateToDiagnosticDetail(3)
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

  // Fonctions pour la pagination des travaux
  const travauxTotalPages = Math.ceil(travauxList.length / travauxPerPage);
  const travauxStartIndex = (currentTravauxPage - 1) * travauxPerPage;
  const currentTravauxItems = travauxList.slice(travauxStartIndex, travauxStartIndex + travauxPerPage);

  const handleTravauxPageChange = (page: number) => {
    if (page >= 1 && page <= travauxTotalPages) {
      setCurrentTravauxPage(page);
    }
  };

  // Fonctions pour la pagination des diagnostics
  const diagnosticsTotalPages = Math.ceil(diagnosticsList.length / diagnosticsPerPage);
  const diagnosticsStartIndex = (currentDiagnosticsPage - 1) * diagnosticsPerPage;
  const currentDiagnosticsItems = diagnosticsList.slice(diagnosticsStartIndex, diagnosticsStartIndex + diagnosticsPerPage);

  const handleDiagnosticsPageChange = (page: number) => {
    if (page >= 1 && page <= diagnosticsTotalPages) {
      setCurrentDiagnosticsPage(page);
    }
  };

  // Fonctions pour la pagination des activités récentes
  const activitiesTotalPages = Math.ceil(recentActivities.length / activitiesPerPage);
  const activitiesStartIndex = (currentActivityPage - 1) * activitiesPerPage;
  const currentActivities = recentActivities.slice(activitiesStartIndex, activitiesStartIndex + activitiesPerPage);

  const handleActivityPageChange = (page: number) => {
    if (page >= 1 && page <= activitiesTotalPages) {
      setCurrentActivityPage(page);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'terminé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'en attente':
      case 'à valider':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'annulé':
      case 'urgent':
        return `${colors.danger.light} ${colors.danger.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'terminé': return 'Terminé';
      case 'en cours': return 'En cours';
      case 'en attente': return 'En attente';
      case 'à valider': return 'À valider';
      case 'planifié': return 'Planifié';
      case 'annulé': return 'Annulé';
      case 'urgent': return 'Urgent';
      default: return status;
    }
  };

  const getTypeLabel = (type: Travaux['type']) => {
    switch(type) {
      case 'entretien': return 'Entretien';
      case 'réparation': return 'Réparation';
      case 'rénovation': return 'Rénovation';
      case 'urgence': return 'Urgence';
      default: return type;
    }
  };

  const getPriorityLabel = (priority: Travaux['priorite']) => {
    switch(priority) {
      case 'faible': return 'Faible';
      case 'moyenne': return 'Moyenne';
      case 'élevée': return 'Élevée';
      case 'critique': return 'Critique';
      default: return priority;
    }
  };

  const getDiagnosticTypeLabel = (type: Diagnostic['type']) => {
    switch(type) {
      case 'DPE': return 'DPE';
      case 'Amiante': return 'Amiante';
      case 'Plomb': return 'Plomb (CREP)';
      case 'Électricité': return 'Électricité';
      case 'Gaz': return 'Gaz';
      case 'ERPS': return 'ERPS';
      case 'Humidité': return 'Humidité';
      case 'Termites': return 'Termites';
      case 'Audit énergétique': return 'Audit énergétique';
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
    itemsPerPage: number;
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
          Tableau de bord Gestionnaire Technique
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
          <button className="p-2 border rounded-lg hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-700">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="h-4 w-4 mr-1" /> },
            { id: 'diagnostics', label: 'Diagnostics', icon: <FileText className="h-4 w-4 mr-1" /> },
            { id: 'travaux', label: 'Travaux', icon: <Construction className="h-4 w-4 mr-1" /> },
            { id: 'validations', label: 'Validations', icon: <CheckSquare className="h-4 w-4 mr-1" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab);
                // Réinitialiser la pagination quand on change d'onglet
                if (tab.id === 'travaux') {
                  setCurrentTravauxPage(1);
                } else if (tab.id === 'diagnostics') {
                  setCurrentDiagnosticsPage(1);
                } else if (tab.id === 'overview') {
                  setCurrentActivityPage(1);
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
              <div 
                key={index} 
                className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={stat.onClick}
              >
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {currentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === 'diagnostic' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : activity.type === 'travaux'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : activity.type === 'validation'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {activity.type === 'diagnostic' ? 'Diagnostic' : activity.type === 'travaux' ? 'Travaux' : activity.type === 'validation' ? 'Validation' : 'Alerte'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 dark:text-neutral-200">
                            {activity.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                            {activity.description}
                          </div>
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
                          <button 
                            className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            onClick={activity.onClick}
                          >
                            <ChevronRight className="w-4 h-4" />
                            <span className="sr-only">Voir les détails</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination pour les activités récentes */}
            <Pagination
              currentPage={currentActivityPage}
              totalPages={activitiesTotalPages}
              onPageChange={handleActivityPageChange}
              startIndex={activitiesStartIndex}
              endIndex={Math.min(activitiesStartIndex + activitiesPerPage, recentActivities.length)}
              totalItems={recentActivities.length}
              itemsPerPage={activitiesPerPage}
            />
          </div>
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Gestion des Diagnostics
            </h2>
            <button 
              className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center`}
              onClick={navigateToDiagnostics}
            >
              <FileText className="h-4 w-4 mr-2" />
              Nouveau diagnostic
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentDiagnosticsItems.map((diagnostic) => (
                  <tr key={diagnostic.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {getDiagnosticTypeLabel(diagnostic.type)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="text-sm">{diagnostic.logement}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{diagnostic.prestataire}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>Demandé: {diagnostic.date_demande}</div>
                        {diagnostic.date_realisation && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            Réalisé: {diagnostic.date_realisation}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Limite: {diagnostic.date_limite}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(diagnostic.statut)}`}>
                        {getStatusLabel(diagnostic.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {diagnostic.rapport ? (
                          <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-1 text-gray-400 dark:text-neutral-500 cursor-not-allowed" disabled>
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          onClick={() => navigateToDiagnosticDetail(diagnostic.id)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination pour les diagnostics */}
          <Pagination
            currentPage={currentDiagnosticsPage}
            totalPages={diagnosticsTotalPages}
            onPageChange={handleDiagnosticsPageChange}
            startIndex={diagnosticsStartIndex}
            endIndex={Math.min(diagnosticsStartIndex + diagnosticsPerPage, diagnosticsList.length)}
            totalItems={diagnosticsList.length}
            itemsPerPage={diagnosticsPerPage}
          />
        </div>
      )}

      {activeTab === 'travaux' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Construction className="h-5 w-5 mr-2" />
              Gestion des Travaux
            </h2>
            <button 
              className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center`}
              onClick={navigateToTravaux}
            >
              <Construction className="h-4 w-4 mr-2" />
              Nouveaux travaux
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentTravauxItems.map((travaux) => (
                  <tr key={travaux.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {travaux.reference}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {getTypeLabel(travaux.type)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-neutral-200">
                          {travaux.titre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                          {travaux.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="text-sm">
                          {travaux.batiment}
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            {travaux.etage} - {travaux.porte}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>Début: {travaux.date_debut}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Fin prévue: {travaux.date_fin_prevue}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
                        <div className="text-sm">
                          {travaux.cout_reel !== "0" ? travaux.cout_reel : travaux.budget_prevue}
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            {travaux.cout_reel !== "0" && `Prévu: ${travaux.budget_prevue}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(travaux.statut)}`}>
                          {getStatusLabel(travaux.statut)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          travaux.priorite === 'critique' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : travaux.priorite === 'élevée'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : travaux.priorite === 'moyenne'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {getPriorityLabel(travaux.priorite)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          onClick={() => navigateToTravauxDetail(travaux.id)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination pour les travaux */}
          <Pagination
            currentPage={currentTravauxPage}
            totalPages={travauxTotalPages}
            onPageChange={handleTravauxPageChange}
            startIndex={travauxStartIndex}
            endIndex={Math.min(travauxStartIndex + travauxPerPage, travauxList.length)}
            totalItems={travauxList.length}
            itemsPerPage={travauxPerPage}
          />
        </div>
      )}

      {activeTab === 'validations' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              Bons de Travaux à Valider
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût estimé</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {bonsTravauxValidation.map((bon) => (
                  <tr key={bon.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {bon.reference}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="text-sm">{bon.logement}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{bon.prestataire}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>Début: {bon.date_debut}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Fin prévue: {bon.date_fin_prevue}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
                        <div className="text-sm">{bon.cout_estime}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          onClick={() => navigateToValidationDetail(bon.id)}
                        >
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
      )}
    </main>
  );
};

export default GTDashboardPage;