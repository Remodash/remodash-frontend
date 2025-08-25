'use client';

import { useState } from 'react';
import { 
  Home,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  User,
  Euro,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  XCircle,
  Clock,
  Bed,
  Ruler,
  Save
} from 'lucide-react';

interface Logement {
  id: number;
  reference: string;
  adresse: string;
  type: 'Studio' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+';
  surface: number;
  batiment: string;
  etage: string;
  porte: string;
  loyer: string;
  charges: string;
  statut: 'occupé' | 'vacant' | 'en travaux';
  locataire_actuel?: string;
  date_liberation?: string;
  date_entree: string;
  equipements: string[];
  description: string;
  photos: string[];
  ville: string;
  code_postal: string;
}

type StatusFilter = 'all' | 'occupé' | 'vacant' | 'en travaux';
type TypeFilter = 'all' | 'Studio' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+';

const LogementsPage = () => {
  const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // États pour le formulaire de création
  const [newLogement, setNewLogement] = useState<Partial<Logement>>({
    reference: '',
    adresse: '',
    type: 'T2',
    surface: 0,
    batiment: '',
    etage: '',
    porte: '',
    loyer: '',
    charges: '',
    statut: 'vacant',
    date_entree: new Date().toISOString().split('T')[0],
    equipements: [],
    description: '',
    photos: [],
    ville: '',
    code_postal: ''
  });

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

  // Données mock des logements
  const [logementsList, setLogementsList] = useState<Logement[]>([
    {
      id: 1,
      reference: "LOG-001",
      adresse: "6 SQUARE ESQUIROL",
      ville: "CRETEIL",
      code_postal: "94000",
      type: "T2",
      surface: 45,
      batiment: "Bâtiment A",
      etage: "3",
      porte: "12",
      loyer: "650",
      charges: "50",
      statut: "occupé",
      locataire_actuel: "Mme NDEYE THIORO THIAM",
      date_entree: "15/03/2020",
      date_liberation: "13/11/2024",
      equipements: ["Cuisine équipée", "Double vitrage", "VMC", "Interphone"],
      description: "Appartement lumineux avec vue dégagée, proche des commodités.",
      photos: ["/placeholder-logement-1.jpg"]
    },
    {
      id: 2,
      reference: "LOG-002",
      adresse: "6 SQUARE ESQUIROL",
      ville: "CRETEIL",
      code_postal: "94000",
      type: "T1",
      surface: 32,
      batiment: "Bâtiment B",
      etage: "1",
      porte: "5",
      loyer: "550",
      charges: "45",
      statut: "vacant",
      date_entree: "10/06/2019",
      date_liberation: "12/09/2024",
      equipements: ["Cuisine équipée", "Ascenseur", "Parking"],
      description: "Studio fonctionnel idéal pour étudiant ou jeune actif.",
      photos: ["/placeholder-logement-2.jpg"]
    },
    {
      id: 3,
      reference: "LOG-003",
      adresse: "12 AVENUE DE LA REPUBLIQUE",
      ville: "PARIS",
      code_postal: "75011",
      type: "T3",
      surface: 62,
      batiment: "Bâtiment C",
      etage: "4",
      porte: "18",
      loyer: "850",
      charges: "65",
      statut: "occupé",
      locataire_actuel: "M. JEAN DUPONT",
      date_entree: "01/04/2022",
      equipements: ["Balcon", "Cave", "Fibre optique", "Gardien"],
      description: "Spacieux T3 avec balcon, proche métro et commerces.",
      photos: ["/placeholder-logement-3.jpg"]
    },
    {
      id: 4,
      reference: "LOG-004",
      adresse: "15 RUE DE LA PAIX",
      ville: "PARIS",
      code_postal: "75002",
      type: "T2",
      surface: 48,
      batiment: "Bâtiment A",
      etage: "2",
      porte: "7",
      loyer: "920",
      charges: "70",
      statut: "occupé",
      locataire_actuel: "M. PIERRE MARTIN",
      date_entree: "20/08/2021",
      date_liberation: "05/12/2024",
      equipements: ["Parquet", "Cheminée", "Concierge"],
      description: "T2 de charme avec parquet et hauteur sous plafond.",
      photos: ["/placeholder-logement-4.jpg"]
    },
    {
      id: 5,
      reference: "LOG-005",
      adresse: "22 AVENUE VICTOR HUGO",
      ville: "PARIS",
      code_postal: "75116",
      type: "T3",
      surface: 65,
      batiment: "Bâtiment B",
      etage: "5",
      porte: "22",
      loyer: "780",
      charges: "60",
      statut: "occupé",
      locataire_actuel: "Mme SOPHIE DURAND",
      date_entree: "05/01/2023",
      equipements: ["Terrasse", "Piscine collective", "Gym"],
      description: "T3 avec terrasse dans résidence sécurisée avec piscine.",
      photos: ["/placeholder-logement-5.jpg"]
    },
    {
      id: 6,
      reference: "LOG-006",
      adresse: "8 RUE DU COMMERCE",
      ville: "PARIS",
      code_postal: "75015",
      type: "T2",
      surface: 50,
      batiment: "Bâtiment C",
      etage: "2",
      porte: "10",
      loyer: "890",
      charges: "75",
      statut: "en travaux",
      date_entree: "10/02/2022",
      date_liberation: "20/01/2025",
      equipements: ["Cuisine américaine", "Verrière", "Jardin"],
      description: "T2 en rénovation avec cuisine ouverte et verrière.",
      photos: ["/placeholder-logement-6.jpg"]
    },
    {
      id: 7,
      reference: "LOG-007",
      adresse: "25 BOULEVARD SAINT-GERMAIN",
      ville: "PARIS",
      code_postal: "75005",
      type: "Studio",
      surface: 28,
      batiment: "Bâtiment D",
      etage: "6",
      porte: "3",
      loyer: "620",
      charges: "55",
      statut: "vacant",
      date_entree: "15/09/2023",
      equipements: ["Mezzanine", "Vue sur monuments", "Proche RER"],
      description: "Studio avec mezzanine dans quartier historique.",
      photos: ["/placeholder-logement-7.jpg"]
    },
    {
      id: 8,
      reference: "LOG-008",
      adresse: "3 RUE DES ROSIERS",
      ville: "PARIS",
      code_postal: "75004",
      type: "T4",
      surface: 85,
      batiment: "Bâtiment E",
      etage: "3",
      porte: "8",
      loyer: "1200",
      charges: "90",
      statut: "occupé",
      locataire_actuel: "Famille LEROY",
      date_entree: "01/07/2022",
      equipements: ["3 chambres", "2 salles de bain", "Buanderie", "Terrasse"],
      description: "Spacieux T4 familial avec terrasse et deux salles de bain.",
      photos: ["/placeholder-logement-8.jpg"]
    }
  ]);

  const openModal = (logement: Logement) => {
    setSelectedLogement(logement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLogement(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewLogement({
      reference: '',
      adresse: '',
      type: 'T2',
      surface: 0,
      batiment: '',
      etage: '',
      porte: '',
      loyer: '',
      charges: '',
      statut: 'vacant',
      date_entree: new Date().toISOString().split('T')[0],
      equipements: [],
      description: '',
      photos: [],
      ville: '',
      code_postal: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLogement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateLogement = () => {
    // Générer un ID unique
    const newId = Math.max(...logementsList.map(l => l.id), 0) + 1;
    
    // Créer le nouveau logement
    const createdLogement: Logement = {
      id: newId,
      reference: newLogement.reference || `LOG-${String(newId).padStart(3, '0')}`,
      adresse: newLogement.adresse || '',
      ville: newLogement.ville || '',
      code_postal: newLogement.code_postal || '',
      type: newLogement.type as Logement['type'] || 'T2',
      surface: Number(newLogement.surface) || 0,
      batiment: newLogement.batiment || '',
      etage: newLogement.etage || '',
      porte: newLogement.porte || '',
      loyer: newLogement.loyer || '',
      charges: newLogement.charges || '',
      statut: newLogement.statut as Logement['statut'] || 'vacant',
      date_entree: newLogement.date_entree || new Date().toISOString().split('T')[0],
      equipements: newLogement.equipements || [],
      description: newLogement.description || '',
      photos: newLogement.photos || [],
      locataire_actuel: newLogement.statut === 'occupé' ? 'Nouveau locataire' : undefined
    };

    // Ajouter à la liste
    setLogementsList(prev => [...prev, createdLogement]);
    
    // Fermer le modal
    closeCreateModal();
  };

  const handleDeleteLogement = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
      setLogementsList(prev => prev.filter(logement => logement.id !== id));
    }
  };

  const getStatusLabel = (statut: Logement['statut']) => {
    switch(statut) {
      case 'occupé': return 'Occupé';
      case 'vacant': return 'Vacant';
      case 'en travaux': return 'En travaux';
      default: return statut;
    }
  };

  const getStatusBadge = (statut: Logement['statut']) => {
    switch(statut) {
      case 'occupé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'vacant':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'en travaux':
        return `${colors.warning.light} ${colors.warning.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: Logement['type']) => {
    switch(type) {
      case 'Studio': return <Bed className="h-4 w-4" />;
      case 'T1': return <Home className="h-4 w-4" />;
      case 'T2': return <Bed className="h-4 w-4" />;
      case 'T3': return <Bed className="h-4 w-4" />;
      case 'T4': return <Bed className="h-4 w-4" />;
      case 'T5+': return <Bed className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const filteredLogements = logementsList.filter(logement => {
    if (statusFilter !== 'all' && logement.statut !== statusFilter) return false;
    if (typeFilter !== 'all' && logement.type !== typeFilter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        logement.reference.toLowerCase().includes(term) ||
        logement.adresse.toLowerCase().includes(term) ||
        logement.batiment.toLowerCase().includes(term) ||
        (logement.locataire_actuel?.toLowerCase().includes(term) || false)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredLogements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLogements = filteredLogements.slice(
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
          <Home className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Gestion des Logements
        </h1>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher référence, adresse, bâtiment..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            onClick={openCreateModal}
            className={`px-3 py-2 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center justify-center`}
          >
            <Plus className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Nouveau logement</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtre par statut */}
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 py-2">Statut:</span>
            {[
              { status: 'occupé', icon: <User className="h-4 w-4 mr-1" /> },
              { status: 'vacant', icon: <Home className="h-4 w-4 mr-1" /> },
              { status: 'en travaux', icon: <Clock className="h-4 w-4 mr-1" /> },
              { status: 'all', icon: <Filter className="h-4 w-4 mr-1" /> },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => {
                  setStatusFilter(item.status as StatusFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  statusFilter === item.status
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {item.icon}
                {item.status === 'all' ? 'Tous' : getStatusLabel(item.status as Logement['statut'])}
                {item.status !== 'all' && (
                  <span className={`ml-1 ${getStatusBadge(item.status as Logement['statut'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {logementsList.filter(d => d.statut === item.status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filtre par type */}
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 py-2">Type:</span>
            {[
              { type: 'Studio', icon: <Bed className="h-4 w-4 mr-1" /> },
              { type: 'T1', icon: <Home className="h-4 w-4 mr-1" /> },
              { type: 'T2', icon: <Bed className="h-4 w-4 mr-1" /> },
              { type: 'T3', icon: <Bed className="h-4 w-4 mr-1" /> },
              { type: 'all', icon: <Filter className="h-4 w-4 mr-1" /> },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setTypeFilter(item.type as TypeFilter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  typeFilter === item.type
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {item.icon}
                {item.type === 'all' ? 'Tous types' : item.type}
                {item.type !== 'all' && (
                  <span className="ml-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    {logementsList.filter(d => d.type === item.type).length}
                  </span>
                )}
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type/Surface</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Loyer/Charges</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedLogements.length > 0 ? (
                paginatedLogements.map(logement => (
                  <tr 
                    key={logement.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-700 ${
                      logement.statut === 'vacant' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                      logement.statut === 'en travaux' ? 'bg-yellow-50/10 dark:bg-yellow-900/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                        <div className="font-medium text-gray-900 dark:text-neutral-200">
                          {logement.reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{logement.adresse.split(',')[0]}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                          {logement.batiment} - Étage {logement.etage} - Porte {logement.porte}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          {getTypeIcon(logement.type)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-neutral-200">
                            {logement.type}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400">
                            <Ruler className="h-3 w-3 mr-1" />
                            {logement.surface}m²
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="whitespace-nowrap">{logement.loyer}€</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Charges: {logement.charges}€
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(logement.statut)}`}>
                        {getStatusLabel(logement.statut)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {logement.locataire_actuel ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                          <div className="min-w-0">
                            <div className="text-sm text-gray-900 dark:text-neutral-200 truncate">
                              {logement.locataire_actuel}
                            </div>
                            {logement.date_liberation && (
                              <div className="text-xs text-gray-500 dark:text-neutral-400">
                                Libération: {logement.date_liberation}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 dark:text-neutral-400">
                          <User className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Aucun locataire</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(logement)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteLogement(logement.id, e)}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun logement trouvé
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

      {/* Modal de détails */}
      {isModalOpen && selectedLogement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    {selectedLogement.reference} - {selectedLogement.type}
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    {selectedLogement.adresse}, {selectedLogement.code_postal} {selectedLogement.ville}
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
            <div className="p-4 sm:p-6 space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations générales</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Référence:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Type:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Surface:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.surface}m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Bâtiment:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.batiment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Étage/Porte:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">Étage {selectedLogement.etage} - Porte {selectedLogement.porte}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations financières</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Loyer:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.loyer}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Charges:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.charges}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Total:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                          {parseFloat(selectedLogement.loyer) + parseFloat(selectedLogement.charges)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Statut et occupation</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Statut:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedLogement.statut)}`}>
                          {getStatusLabel(selectedLogement.statut)}
                        </span>
                      </div>
                      {selectedLogement.locataire_actuel && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">Locataire actuel:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.locataire_actuel}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-neutral-400">Date d&apos;entrée:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.date_entree}</span>
                      </div>
                      {selectedLogement.date_liberation && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">Date de libération:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-neutral-200">{selectedLogement.date_liberation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Équipements</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLogement.equipements.map((equipement, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full"
                        >
                          {equipement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description et adresse */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Description</h3>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  {selectedLogement.description}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Adresse complète</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-neutral-300">
                    {selectedLogement.adresse}, {selectedLogement.code_postal} {selectedLogement.ville}
                  </p>
                </div>
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
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le logement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200">
                  Nouveau logement
                </h2>
                <button 
                  onClick={closeCreateModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Fermer le modal"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Référence*
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={newLogement.reference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="LOG-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Type d&apos;appartement*
                    </label>
                    <select
                      name="type"
                      value={newLogement.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    >
                      <option value="Studio">Studio</option>
                      <option value="T1">T1</option>
                      <option value="T2">T2</option>
                      <option value="T3">T3</option>
                      <option value="T4">T4</option>
                      <option value="T5+">T5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Surface (m²)*
                    </label>
                    <input
                      type="number"
                      name="surface"
                      value={newLogement.surface}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="45"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Adresse*
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={newLogement.adresse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="6 SQUARE ESQUIROL"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Code postal*
                      </label>
                      <input
                        type="text"
                        name="code_postal"
                        value={newLogement.code_postal}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="94000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Ville*
                      </label>
                      <input
                        type="text"
                        name="ville"
                        value={newLogement.ville}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="CRETEIL"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Statut*
                    </label>
                    <select
                      name="statut"
                      value={newLogement.statut}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    >
                      <option value="vacant">Vacant</option>
                      <option value="occupé">Occupé</option>
                      <option value="en travaux">En travaux</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Bâtiment
                      </label>
                      <input
                        type="text"
                        name="batiment"
                        value={newLogement.batiment}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="Bâtiment A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Étage
                      </label>
                      <input
                        type="text"
                        name="etage"
                        value={newLogement.etage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Porte
                      </label>
                      <input
                        type="text"
                        name="porte"
                        value={newLogement.porte}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Loyer (€)*
                      </label>
                      <input
                        type="number"
                        name="loyer"
                        value={newLogement.loyer}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="650"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Charges (€)*
                      </label>
                      <input
                        type="number"
                        name="charges"
                        value={newLogement.charges}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                        placeholder="50"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Date d&apos;entrée*
                    </label>
                    <input
                      type="date"
                      name="date_entree"
                      value={newLogement.date_entree}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newLogement.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  placeholder="Description du logement..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Équipements (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="equipements"
                  value={newLogement.equipements?.join(', ')}
                  onChange={(e) => {
                    const equipementsArray = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                    setNewLogement(prev => ({
                      ...prev,
                      equipements: equipementsArray
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  placeholder="Cuisine équipée, Double vitrage, VMC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Photos (URLs séparées par des virgules)
                </label>
                <input
                  type="text"
                  name="photos"
                  value={newLogement.photos?.join(', ')}
                  onChange={(e) => {
                    const photosArray = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                    setNewLogement(prev => ({
                      ...prev,
                      photos: photosArray
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  placeholder="/photo1.jpg, /photo2.jpg"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={closeCreateModal}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreateLogement}
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                  disabled={!newLogement.reference || !newLogement.adresse || !newLogement.loyer || !newLogement.charges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Créer le logement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LogementsPage;