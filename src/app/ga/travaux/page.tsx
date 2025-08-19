'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Plus,
  Search,
  XCircle,
  Calendar,
  ChevronUp,
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Download,
  Printer,
  MapPin,
  Euro,
  Wrench,
  Construction
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

// Correction: Utiliser le même type de statut pour les étapes et les travaux
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

interface ExpandedSections {
  [key: string]: boolean;
}

type StatusFilter = 'all' | StatutTravaux;
type PriorityFilter = 'all' | 'faible' | 'moyenne' | 'élevée' | 'critique';

const TravauxPage = () => {
  const [selectedTravaux, setSelectedTravaux] = useState<Travaux | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    etapes: true,
    budget: true,
    photos: true,
    documents: true
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  //const fileInputRef = useRef<HTMLInputElement>(null);

  // Couleurs harmonisées
  const colors = {
    primary: {
      light: 'bg-blue-600 hover:bg-blue-700',
      dark: 'dark:bg-blue-700 dark:hover:bg-blue-800',
    },
    secondary: {
      light: 'bg-gray-100 hover:bg-gray-200',
      dark: 'dark:bg-neutral-700 dark:hover:bg-neutral-600',
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

  // Fonction pour obtenir le label du statut des étapes
  const getEtapeStatusLabel = (status: StatutEtape) => {
    switch(status) {
      case 'terminé': return 'Terminé';
      case 'en cours': return 'En cours';
      case 'planifié': return 'Planifié';
      case 'reporté': return 'Reporté';
      default: return status;
    }
  };

  // Fonction pour obtenir le badge du statut des étapes
  const getEtapeStatusBadge = (status: StatutEtape) => {
    switch(status) {
      case 'terminé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'planifié':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'reporté':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
      titre: "Peinture couloir - RDC",
      type: "entretien",
      priorite: "faible",
      statut: "annulé",
      date_creation: "10/10/2024",
      date_debut: "18/10/2024",
      date_fin_prevue: "20/10/2024",
      batiment: "Bâtiment Principal",
      etage: "RDC",
      porte: "N/A",
      description: "Remise en peinture du couloir du rez-de-chaussée",
      budget_prevue: "850.00",
      cout_reel: "0.00",
      etapes: [],
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

  useEffect(() => {
    return () => {
      if (selectedTravaux) {
        selectedTravaux.photos.forEach(photo => {
          if (photo.previewUrl) {
            URL.revokeObjectURL(photo.previewUrl);
          }
        });
        selectedTravaux.etapes.forEach(etape => {
          etape.photos.forEach(photo => {
            if (photo.previewUrl) {
              URL.revokeObjectURL(photo.previewUrl);
            }
          });
        });
      }
    };
  }, [selectedTravaux]);

  const openModal = (travaux: Travaux) => {
    setSelectedTravaux(travaux);
    setIsModalOpen(true);
    setExpandedSections({
      general: true,
      etapes: true,
      budget: true,
      photos: true,
      documents: true
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTravaux(null);
  };

  const handleSave = () => {
    console.log('Sauvegarde des travaux:', selectedTravaux);
    closeModal();
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusLabel = (status: StatutTravaux) => {
    switch(status) {
      case 'terminé': return 'Terminé';
      case 'en cours': return 'En cours';
      case 'planifié': return 'Planifié';
      case 'annulé': return 'Annulé';
      default: return status;
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

  const getTypeLabel = (type: Travaux['type']) => {
    switch(type) {
      case 'entretien': return 'Entretien';
      case 'réparation': return 'Réparation';
      case 'rénovation': return 'Rénovation';
      case 'urgence': return 'Urgence';
      default: return type;
    }
  };

  const getStatusBadge = (status: StatutTravaux) => {
    switch(status) {
      case 'terminé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'planifié':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'annulé':
        return `${colors.danger.light} ${colors.danger.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityBadge = (priority: Travaux['priorite']) => {
    switch(priority) {
      case 'critique':
        return `${colors.danger.light} ${colors.danger.dark}`;
      case 'élevée':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moyenne':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'faible':
        return `${colors.success.light} ${colors.success.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredTravaux = travauxList.filter(travaux => {
    if (statusFilter !== 'all' && travaux.statut !== statusFilter) return false;
    if (priorityFilter !== 'all' && travaux.priorite !== priorityFilter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        travaux.titre.toLowerCase().includes(term) ||
        travaux.reference.toLowerCase().includes(term) ||
        travaux.batiment.toLowerCase().includes(term) ||
        travaux.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredTravaux.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTravaux = filteredTravaux.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
          <Construction className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Gestion des Travaux
        </h1>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className={`px-3 py-2 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center justify-center`}>
            <Plus className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Nouveaux travaux</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:space-x-4 min-w-max gap-3">
          <div className="flex space-x-2">
            <span className="py-2 text-sm font-medium text-gray-700 dark:text-neutral-300">Statut:</span>
            {['all', 'planifié', 'en cours', 'terminé', 'annulé'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status as StatusFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  statusFilter === status
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {status === 'all' ? 'Tous' : getStatusLabel(status as StatutTravaux)}
                {status !== 'all' && (
                  <span className={`ml-1 ${getStatusBadge(status as StatutTravaux)} text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {travauxList.filter(d => d.statut === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <span className="py-2 text-sm font-medium text-gray-700 dark:text-neutral-300">Priorité:</span>
            {['all', 'faible', 'moyenne', 'élevée', 'critique'].map((priority) => (
              <button
                key={priority}
                onClick={() => {
                  setPriorityFilter(priority as PriorityFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  priorityFilter === priority
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {priority === 'all' ? 'Toutes' : getPriorityLabel(priority as Travaux['priorite'])}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Priorité</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedTravaux.length > 0 ? (
                paginatedTravaux.map(travaux => (
                  <tr 
                    key={travaux.id} 
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">{travaux.reference}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {getTypeLabel(travaux.type)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium truncate max-w-xs">{travaux.titre}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 max-w-xs">
                        {travaux.description}
                      </div>
                    </td>
                    <td className="px-3 py-3">
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
                    <td className="px-3 py-3">
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
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(travaux.priorite)}`}>
                        {getPriorityLabel(travaux.priorite)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(travaux.statut)}`}>
                        {getStatusLabel(travaux.statut)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => openModal(travaux)}
                        className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun travaux trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > itemsPerPage && (
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

      {/* Modal */}
      {isModalOpen && selectedTravaux && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    {selectedTravaux.reference} - {selectedTravaux.titre}
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedTravaux.batiment} - {selectedTravaux.etage} {selectedTravaux.porte !== 'N/A' && `- Porte ${selectedTravaux.porte}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    <Download className="w-5 h-5" />
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
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Informations générales */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('general')}
                  aria-expanded={expandedSections.general}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Informations générales</h3>
                  {expandedSections.general ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.general && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence</label>
                        <input 
                          type="text" 
                          value={selectedTravaux.reference} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type de travaux</label>
                        <input 
                          type="text" 
                          value={getTypeLabel(selectedTravaux.type)} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Priorité</label>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedTravaux.priorite)}`}>
                          {getPriorityLabel(selectedTravaux.priorite)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Statut</label>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedTravaux.statut)}`}>
                          {getStatusLabel(selectedTravaux.statut)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de création</label>
                        <input 
                          type="text" 
                          value={selectedTravaux.date_creation} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de début</label>
                        <input 
                          type="text" 
                          value={selectedTravaux.date_debut} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de fin prévue</label>
                        <input 
                          type="text" 
                          value={selectedTravaux.date_fin_prevue} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Description</label>
                        <textarea 
                          value={selectedTravaux.description} 
                          readOnly 
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Étapes des travaux */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('etapes')}
                  aria-expanded={expandedSections.etapes}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Étapes des travaux</h3>
                  {expandedSections.etapes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.etapes && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
                    {selectedTravaux.etapes.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-neutral-400 py-4">
                        Aucune étape planifiée
                      </div>
                    ) : (
                      selectedTravaux.etapes.map((etape) => (
                        <div key={etape.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-neutral-200">{etape.description}</h4>
                                <div className="flex items-center mt-2 space-x-4">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-neutral-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {etape.date_debut} - {etape.date_fin}
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEtapeStatusBadge(etape.statut)}`}>
                                    {getEtapeStatusLabel(etape.statut)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {etape.intervenants.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Intervenants</h5>
                                <div className="space-y-2">
                                  {etape.intervenants.map((intervenant, index) => (
                                    <div key={index} className="text-sm">
                                      <div className="font-medium">{intervenant.nom}</div>
                                      <div className="text-gray-500 dark:text-neutral-400">{intervenant.specialite}</div>
                                      <div className="text-gray-500 dark:text-neutral-400">{intervenant.telephone} • {intervenant.email}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {etape.materiaux.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Matériaux</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200 dark:border-neutral-600">
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Nom</th>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Quantité</th>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Prix unitaire</th>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Fournisseur</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {etape.materiaux.map((materiau, index) => (
                                        <tr key={index} className="border-b border-gray-100 dark:border-neutral-700 last:border-0">
                                          <td className="py-2 text-sm">{materiau.nom}</td>
                                          <td className="py-2 text-sm">{materiau.quantite}</td>
                                          <td className="py-2 text-sm">{materiau.prix_unitaire} €</td>
                                          <td className="py-2 text-sm">{materiau.fournisseur}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            
                            {etape.observations && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Observations</h5>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">{etape.observations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Budget et coûts */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('budget')}
                  aria-expanded={expandedSections.budget}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Budget et coûts</h3>
                  {expandedSections.budget ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.budget && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                        <h4 className="font-medium text-gray-900 dark:text-neutral-200 mb-4 flex items-center">
                          <Euro className="h-5 w-5 mr-2 text-blue-500" />
                          Budget prévisionnel
                        </h4>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedTravaux.budget_prevue} €
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                        <h4 className="font-medium text-gray-900 dark:text-neutral-200 mb-4 flex items-center">
                          <Wrench className="h-5 w-5 mr-2 text-green-500" />
                          Coût réel
                        </h4>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedTravaux.cout_reel} €
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                      <h4 className="font-medium text-gray-900 dark:text-neutral-200 mb-4">Détail des coûts par étape</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-neutral-600">
                              <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Étape</th>
                              <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Coût matériaux</th>
                              <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Coût main d&apos;œuvre</th>
                              <th className="text-left text-xs font-medium text-gray-500 dark:text-neutral-300 py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTravaux.etapes.map((etape, index) => {
                              const coutMateriaux = etape.materiaux.reduce((total, materiau) => 
                                total + (parseFloat(materiau.prix_unitaire) * materiau.quantite), 0);
                              const coutMainOeuvre = coutMateriaux * 0.6; // Estimation
                              const totalEtape = coutMateriaux + coutMainOeuvre;
                              
                              return (
                                <tr key={index} className="border-b border-gray-100 dark:border-neutral-700 last:border-0">
                                  <td className="py-2 text-sm">{etape.description}</td>
                                  <td className="py-2 text-sm">{coutMateriaux.toFixed(2)} €</td>
                                  <td className="py-2 text-sm">{coutMainOeuvre.toFixed(2)} €</td>
                                  <td className="py-2 text-sm font-medium">{totalEtape.toFixed(2)} €</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Photos */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('photos')}
                  aria-expanded={expandedSections.photos}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Photos</h3>
                  {expandedSections.photos ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.photos && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    {selectedTravaux.photos.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-neutral-400 py-4">
                        Aucune photo ajoutée
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedTravaux.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div className="aspect-square bg-gray-200 dark:bg-neutral-600 rounded-lg overflow-hidden">
                              <Image
                                src={photo.previewUrl} 
                                alt={`Photo des travaux`}
                                className="w-full h-full object-cover"
                                width={200}
                                height={200}
                              />
                            </div>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded capitalize">
                              {photo.type}
                            </div>
                            <button
                              onClick={() => {}}
                              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label={`Supprimer la photo`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <button className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 hover:border-gray-400 dark:hover:border-neutral-500 transition-colors">
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter des photos
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors order-2 sm:order-1"
                >
                  Fermer
                </button>
                <button 
                  onClick={handleSave}
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TravauxPage;