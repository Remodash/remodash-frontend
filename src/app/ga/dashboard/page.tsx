'use client';

import { useState } from 'react';
import { 
  UserCheck,
  UserX,
  CheckCircle2,
  BarChart3,
  Calendar,
  Search,
  Plus,
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
  ChevronsRight
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
  type: 'incoming' | 'outgoing' | 'travaux';
  tenant?: string;
  travaux?: Travaux;
  address: string;
  date: string;
  status: 'en cours' | 'à réaliser' | 'terminé' | 'planifié' | 'annulé';
}

type ActiveTab = 'overview' | 'incoming' | 'outgoing' | 'travaux';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  // États pour la pagination des travaux
  const [currentTravauxPage, setCurrentTravauxPage] = useState(1);
  const travauxPerPage = 3;
  
  // États pour la pagination des activités récentes
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const activitiesPerPage = 3;

  // Données des travaux
  const travauxList: Travaux[] = [
    {
      id: 1,
      reference: "TRV-2024-001",
      titre: "Rénovation salle de bain - Appartement 31081",
      type: "rénovation",
      priorite: "moyenne",
      statut: "en cours",
      date_creation: "15/10/2024",
      date_debut: "20/10/2024",
      date_fin_prevue: "05/11/2024",
      batiment: "Bâtiment 03",
      etage: "8ème étage",
      porte: "31081",
      description: "Rénovation complète de la salle de bain avec remplacement carrelage, robinetterie et installation nouveau miroir",
      budget_prevue: "3500.00",
      cout_reel: "2850.00",
      etapes: [
        {
          id: "1",
          description: "Démolition ancien carrelage et sanitaires",
          statut: "terminé",
          date_debut: "20/10/2024",
          date_fin: "22/10/2024",
          intervenants: [
            {
              nom: "SARL Démolition Pro",
              telephone: "01 45 23 45 67",
              email: "contact@demolitionpro.fr",
              specialite: "Démolition"
            }
          ],
          materiaux: [],
          observations: "Ancien carrelage difficile à enlever, prévoir temps supplémentaire",
          photos: []
        },
        {
          id: "2",
          description: "Installation nouveau carrelage mural et sol",
          statut: "en cours",
          date_debut: "23/10/2024",
          date_fin: "28/10/2024",
          intervenants: [
            {
              nom: "Jean Carreleur",
              telephone: "06 12 34 56 78",
              email: "j.carreleur@email.fr",
              specialite: "Carrelage"
            }
          ],
          materiaux: [
            {
              nom: "Carrelage mural blanc 20x25",
              quantite: 45,
              prix_unitaire: "25.50",
              fournisseur: "Leroy Merlin"
            },
            {
              nom: "Carrelage sol antidérapant gris 30x30",
              quantite: 20,
              prix_unitaire: "32.75",
              fournisseur: "Point P"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 2,
      reference: "TRV-2024-002",
      titre: "Réparation fuite d'eau - Appartement 12",
      type: "réparation",
      priorite: "critique",
      statut: "terminé",
      date_creation: "05/10/2024",
      date_debut: "06/10/2024",
      date_fin_prevue: "06/10/2024",
      batiment: "Bâtiment A",
      etage: "2ème étage",
      porte: "12",
      description: "Réparation urgente d'une fuite d'eau sous l'évier de la cuisine",
      budget_prevue: "250.00",
      cout_reel: "180.00",
      etapes: [
        {
          id: "1",
          description: "Diagnostic et réparation de la fuite",
          statut: "terminé",
          date_debut: "06/10/2024",
          date_fin: "06/10/2024",
          intervenants: [
            {
              nom: "Plomberie Express",
              telephone: "01 46 78 90 12",
              email: "urgence@plomberie-express.fr",
              specialite: "Plomberie urgente"
            }
          ],
          materiaux: [
            {
              nom: "Joint silicone alimentaire",
              quantite: 1,
              prix_unitaire: "8.50",
              fournisseur: "Plomberie Express"
            }
          ],
          observations: "Fuite réparée en moins de 2 heures, bon travail",
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 3,
      reference: "TRV-2024-003",
      titre: "Entretien chaudière - Bâtiment C",
      type: "entretien",
      priorite: "moyenne",
      statut: "planifié",
      date_creation: "01/11/2024",
      date_debut: "15/11/2024",
      date_fin_prevue: "15/11/2024",
      batiment: "Bâtiment C",
      etage: "Tous étages",
      porte: "N/A",
      description: "Entretien annuel des chaudières collectives du bâtiment C",
      budget_prevue: "1200.00",
      cout_reel: "0.00",
      etapes: [
        {
          id: "1",
          description: "Contrôle et entretien chaudière principale",
          statut: "planifié",
          date_debut: "15/11/2024",
          date_fin: "15/11/2024",
          intervenants: [
            {
              nom: "Chauffage Service",
              telephone: "01 34 56 78 90",
              email: "contact@chauffage-service.fr",
              specialite: "Entretien chaudières"
            }
          ],
          materiaux: [
            {
              nom: "Kit entretien chaudière",
              quantite: 1,
              prix_unitaire: "85.00",
              fournisseur: "Chauffage Service"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 4,
      reference: "TRV-2024-004",
      titre: "Réparation ascenseur - Bâtiment B",
      type: "réparation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "10/11/2024",
      date_debut: "12/11/2024",
      date_fin_prevue: "18/11/2024",
      batiment: "Bâtiment B",
      etage: "Tous étages",
      porte: "N/A",
      description: "Réparation du système de contrôle de l'ascenseur principal",
      budget_prevue: "4200.00",
      cout_reel: "3800.00",
      etapes: [
        {
          id: "1",
          description: "Diagnostic du problème électronique",
          statut: "terminé",
          date_debut: "12/11/2024",
          date_fin: "13/11/2024",
          intervenants: [
            {
              nom: "Ascenseurs Technologie",
              telephone: "01 56 78 90 12",
              email: "tech@ascenseurs-tech.fr",
              specialite: "Réparation ascenseurs"
            }
          ],
          materiaux: [],
          observations: "Problème identifié dans la carte mère du système de contrôle",
          photos: []
        },
        {
          id: "2",
          description: "Remplacement des composants défectueux",
          statut: "en cours",
          date_debut: "14/11/2024",
          date_fin: "18/11/2024",
          intervenants: [
            {
              nom: "Ascenseurs Technologie",
              telephone: "01 56 78 90 12",
              email: "tech@ascenseurs-tech.fr",
              specialite: "Réparation ascenseurs"
            }
          ],
          materiaux: [
            {
              nom: "Carte mère système contrôle",
              quantite: 1,
              prix_unitaire: "2450.00",
              fournisseur: "Otis Components"
            },
            {
              nom: "Capteurs de sécurité",
              quantite: 4,
              prix_unitaire: "185.00",
              fournisseur: "Otis Components"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 5,
      reference: "TRV-2024-005",
      titre: "Changement porte d'entrée - Appartement 502",
      type: "rénovation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "22/10/2024",
      date_debut: "25/10/2024",
      date_fin_prevue: "28/10/2024",
      batiment: "Bâtiment F",
      etage: "5ème étage",
      porte: "502",
      description: "Remplacement de la porte d'entrée endommagée",
      budget_prevue: "1200.00",
      cout_reel: "1350.00",
      etapes: [
        {
          id: "1",
          description: "Démontage ancienne porte",
          statut: "terminé",
          date_debut: "25/10/2024",
          date_fin: "25/10/2024",
          intervenants: [
            {
              nom: "Menuiserie Moderne",
              telephone: "01 43 21 65 87",
              email: "devis@menuiserie-moderne.fr",
              specialite: "Portes et fenêtres"
            }
          ],
          materiaux: [],
          observations: "Ancienne porte très difficile à démonter",
          photos: []
        },
        {
          id: "2",
          description: "Installation nouvelle porte blindée",
          statut: "en cours",
          date_debut: "26/10/2024",
          date_fin: "28/10/2024",
          intervenants: [
            {
              nom: "Menuiserie Moderne",
              telephone: "01 43 21 65 87",
              email: "devis@menuiserie-moderne.fr",
              specialite: "Portes et fenêtres"
            }
          ],
          materiaux: [
            {
              nom: "Porte blindée modèle SecureHome",
              quantite: 1,
              prix_unitaire: "890.00",
              fournisseur: "Menuiserie Moderne"
            },
            {
              nom: "Serrures multipoints",
              quantite: 1,
              prix_unitaire: "220.00",
              fournisseur: "Menuiserie Moderne"
            }
          ],
          photos: []
        }
      ],
      photos: []
    }
  ];

  // Données statistiques
  const statsData: StatsCard[] = [
    {
      title: "EDL Entrants",
      value: "24",
      icon: <UserCheck className="h-6 w-6" />,
      trend: "+12%",
      color: "bg-blue-500"
    },
    {
      title: "EDL Sortants",
      value: "18",
      icon: <UserX className="h-6 w-6" />,
      trend: "+5%",
      color: "bg-green-500"
    },
    {
      title: "Travaux en cours",
      value: travauxList.filter(t => t.statut === 'en cours').length.toString(),
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-amber-500"
    },
    {
      title: "Travaux terminés",
      value: travauxList.filter(t => t.statut === 'terminé').length.toString(),
      icon: <CheckCircle2 className="h-6 w-6" />,
      trend: "+18%",
      color: "bg-purple-500"
    }
  ];

  // Activités récentes
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'incoming',
      tenant: "Mme NDEYE THIORO THIAM",
      address: "6 SQUARE ESQUIROL, 94000 CRETEIL",
      date: "13/11/2024",
      status: "en cours"
    },
    {
      id: 2,
      type: 'travaux',
      travaux: travauxList[0],
      address: `${travauxList[0].batiment}, ${travauxList[0].etage}, Porte ${travauxList[0].porte}`,
      date: travauxList[0].date_debut,
      status: travauxList[0].statut
    },
    {
      id: 3,
      type: 'outgoing',
      tenant: "Mme JENNIFER TAVER",
      address: "6 SQUARE ESQUIROL, Porte 31081",
      date: "12/09/2024",
      status: "terminé"
    },
    {
      id: 4,
      type: 'travaux',
      travaux: travauxList[1],
      address: `${travauxList[1].batiment}, ${travauxList[1].etage}, Porte ${travauxList[1].porte}`,
      date: travauxList[1].date_debut,
      status: travauxList[1].statut
    },
    {
      id: 5,
      type: 'incoming',
      tenant: "M. JEAN DUPONT",
      address: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
      date: "01/12/2024",
      status: "à réaliser"
    },
    {
      id: 6,
      type: 'travaux',
      travaux: travauxList[2],
      address: `${travauxList[2].batiment}, ${travauxList[2].etage}`,
      date: travauxList[2].date_debut,
      status: travauxList[2].statut
    },
    {
      id: 7,
      type: 'travaux',
      travaux: travauxList[3],
      address: `${travauxList[3].batiment}, ${travauxList[3].etage}`,
      date: travauxList[3].date_debut,
      status: travauxList[3].statut
    },
    {
      id: 8,
      type: 'outgoing',
      tenant: "M. PIERRE MARTIN",
      address: "15 RUE DE LA PAIX, 75002 PARIS",
      date: "05/12/2024",
      status: "planifié"
    },
    {
      id: 9,
      type: 'incoming',
      tenant: "MME SOPHIE DURAND",
      address: "22 AVENUE VICTOR HUGO, 75116 PARIS",
      date: "10/12/2024",
      status: "à réaliser"
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

  // Fonctions pour la pagination des activités récentes
  const activitiesTotalPages = Math.ceil(recentActivities.length / activitiesPerPage);
  const activitiesStartIndex = (currentActivityPage - 1) * activitiesPerPage;
  const currentActivities = recentActivities.slice(activitiesStartIndex, activitiesStartIndex + activitiesPerPage);

  const handleActivityPageChange = (page: number) => {
    if (page >= 1 && page <= activitiesTotalPages) {
      setCurrentActivityPage(page);
    }
  };

  const getStatusBadge = (status: RecentActivity['status']) => {
    switch(status) {
      case 'terminé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'à réaliser':
      case 'planifié':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'annulé':
        return `${colors.danger.light} ${colors.danger.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: RecentActivity['status']) => {
    switch(status) {
      case 'terminé': return 'Terminé';
      case 'en cours': return 'En cours';
      case 'à réaliser': return 'À réaliser';
      case 'planifié': return 'Planifié';
      case 'annulé': return 'Annulé';
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

  // Composant de pagination réutilisable
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    startIndex,
    endIndex,
    totalItems,
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
          Tableau de bord
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
            <Plus className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Nouvelle action</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="h-4 w-4 mr-1" /> },
            { id: 'incoming', label: 'EDL Entrants', icon: <UserCheck className="h-4 w-4 mr-1" /> },
            { id: 'outgoing', label: 'EDL Sortants', icon: <UserX className="h-4 w-4 mr-1" /> },
            { id: 'travaux', label: 'Travaux', icon: <Construction className="h-4 w-4 mr-1" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab);
                // Réinitialiser la pagination quand on change d'onglet
                if (tab.id === 'travaux') {
                  setCurrentTravauxPage(1);
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
                  {currentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === 'incoming' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : activity.type === 'outgoing'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                          {activity.type === 'incoming' ? 'EDL Entrant' : activity.type === 'outgoing' ? 'EDL Sortant' : 'Travaux'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900 dark:text-neutral-200">
                            {activity.type === 'travaux' 
                              ? activity.travaux?.titre 
                              : activity.tenant}
                          </div>
                          {activity.type === 'travaux' && activity.travaux && (
                            <div className="text-xs text-gray-500 dark:text-neutral-400">
                              {activity.travaux.reference} • {getTypeLabel(activity.travaux.type)}
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

      {activeTab === 'incoming' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-4">EDL Entrants</h2>
          <p className="text-gray-600 dark:text-neutral-400">
            Cette section afficherait la liste des états des lieux entrants.
          </p>
          <button 
            onClick={() => console.log("Naviguer vers EDL entrants")}
            className={`mt-4 ${colors.primary.light} ${colors.primary.dark} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            Ouvrir la gestion des EDL entrants
          </button>
        </div>
      )}

      {activeTab === 'outgoing' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-4">EDL Sortants</h2>
          <p className="text-gray-600 dark:text-neutral-400">
            Cette section afficherait la liste des états des lieux sortants.
          </p>
          <button 
            onClick={() => console.log("Naviguer vers EDL sortants")}
            className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Ouvrir la gestion des EDL sortants
          </button>
        </div>
      )}

      {activeTab === 'travaux' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Construction className="h-5 w-5 mr-2" />
              Travaux en cours et planifiés
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Priorité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentTravauxItems.map((travaux) => (
                  <tr key={travaux.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">{travaux.reference}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {getTypeLabel(travaux.type)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium truncate max-w-xs">{travaux.titre}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 max-w-xs">
                        {travaux.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-sm">{travaux.batiment}</div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            {travaux.etage} {travaux.porte !== 'N/A' && `- Porte ${travaux.porte}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          Début: {travaux.date_debut}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          Fin prévue: {travaux.date_fin_prevue}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        travaux.priorite === 'critique' 
                          ? `${colors.danger.light} ${colors.danger.dark}`
                          : travaux.priorite === 'élevée'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : travaux.priorite === 'moyenne'
                          ? `${colors.warning.light} ${colors.warning.dark}`
                          : `${colors.success.light} ${colors.success.dark}`
                      }`}>
                        {getPriorityLabel(travaux.priorite)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        travaux.statut === 'terminé'
                          ? `${colors.success.light} ${colors.success.dark}`
                          : travaux.statut === 'en cours'
                          ? `${colors.info.light} ${colors.info.dark}`
                          : travaux.statut === 'planifié'
                          ? `${colors.warning.light} ${colors.warning.dark}`
                          : `${colors.danger.light} ${colors.danger.dark}`
                      }`}>
                        {travaux.statut === 'terminé' ? 'Terminé' : travaux.statut === 'en cours' ? 'En cours' : travaux.statut === 'planifié' ? 'Planifié' : 'Annulé'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <Euro className="h-4 w-4 mr-1 text-green-500" />
                        {travaux.cout_reel} € / {travaux.budget_prevue} €
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
          
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-neutral-700">
            <button 
              onClick={() => console.log("Naviguer vers gestion des travaux")}
              className={`${colors.primary.light} ${colors.primary.dark} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center`}
            >
              <Construction className="h-4 w-4 mr-2" />
              Ouvrir la gestion complète des travaux
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;