'use client';

import { useState, useEffect } from 'react';
import { 
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  Download,
  Printer,
  MapPin,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import { getCourriers, createCourrier, deleteCourrier, Courrier } from '@/services/courrierApi';

interface CourrierCongé {
  id: number;
  locataire: string;
  email: string;
  telephone: string;
  adresse_logement: string;
  date_reception: string;
  date_sortie_prevue: string;
  date_pre_edl: string;
  date_edl: string;
  statut: 'en attente' | 'traité' | 'confirmé';
  impayes: boolean;
  montant_impayes?: number;
  actions: string[];
  logement: {
    reference: string;
    type: string;
    surface: number;
    batiment: string;
    etage: string;
    porte: string;
  };
  referent_technique: string;
}

/*
interface ExpandedSections {
  [key: string]: boolean;
}
  */

type StatusFilter = 'all' | 'en attente' | 'traité' | 'confirmé';

const CourrierCongesPage = () => {
  const [selectedCourrier, setSelectedCourrier] = useState<CourrierCongé | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCourrierModalOpen, setIsNewCourrierModalOpen] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // État pour le nouveau courrier
  const [newCourrier, setNewCourrier] = useState<Partial<CourrierCongé>>({
    locataire: '',
    email: '',
    telephone: '',
    adresse_logement: '',
    date_reception: new Date().toLocaleDateString('fr-FR'),
    date_sortie_prevue: '',
    date_pre_edl: '',
    date_edl: '',
    statut: 'en attente',
    impayes: false,
    montant_impayes: 0,
    actions: ['À traiter'],
    logement: {
      reference: '',
      type: '',
      surface: 0,
      batiment: '',
      etage: '',
      porte: ''
    },
    referent_technique: ''
  });

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

  // Données mock des courriers de congé
  const [courriersList, setCourriersList] = useState<Courrier[]>([]);

  // Ajoute un état pour la notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const openModal = (courrier: Courrier) => {
    setSelectedCourrier({
      id: courrier.metadata?.id_courrier ?? '',
      locataire: courrier.locataire.nom_complet,
      email: courrier.locataire.email,
      telephone: courrier.locataire.telephone,
      adresse_logement: courrier.logement.adresse,
      date_reception: courrier.dates_importantes.reception_courrier,
      date_sortie_prevue: courrier.dates_importantes.sortie_prevue,
      date_pre_edl: courrier.dates_importantes.pre_edl,
      date_edl: courrier.dates_importantes.edl,
      statut: courrier.statut,
      impayes: courrier.locataire.situation_impayes,
      montant_impayes: courrier.locataire.montant_impayes,
      actions: courrier.actions_realisees,
      logement: courrier.logement,
      referent_technique: courrier.referent_technique
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourrier(null);
  };

  const openNewCourrierModal = () => {
    setIsNewCourrierModalOpen(true);
  };

  const closeNewCourrierModal = () => {
    setIsNewCourrierModalOpen(false);
    setNewCourrier({
      locataire: '',
      email: '',
      telephone: '',
      adresse_logement: '',
      date_reception: new Date().toLocaleDateString('fr-FR'),
      date_sortie_prevue: '',
      date_pre_edl: '',
      date_edl: '',
      statut: 'en attente',
      impayes: false,
      montant_impayes: 0,
      actions: ['À traiter'],
      logement: {
        reference: '',
        type: '',
        surface: 0,
        batiment: '',
        etage: '',
        porte: ''
      },
      referent_technique: ''
    });
  };

  const handleSendNotifications = () => {
    if (!selectedCourrier) return;
    
    // Logique d'envoi des notifications selon le cahier des charges
    if (selectedCourrier.impayes) {
      // Envoi aux services comptabilité, contentieux, GT et gardien
      console.log('Envoi notifications aux services: Comptabilité, Contentieux, GT, Gardien');
    } else {
      // Envoi uniquement au GT et gardien
      console.log('Envoi notifications aux services: GT, Gardien');
    }
    
    // Mettre à jour le statut du courrier
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name.startsWith('logement.')) {
      const field = name.split('.')[1];
      setNewCourrier(prev => ({
        ...prev,
        logement: {
          ...prev.logement!,
          [field]: field === 'surface' ? Number(value) : value
        }
      }));
    } else {
      setNewCourrier(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImportLogement = () => {
    // Simulation d'import des informations du logement
    setNewCourrier(prev => ({
      ...prev,
      logement: {
        reference: "LOG-NEW",
        type: "T2",
        surface: 50,
        batiment: "Bâtiment Nouveau",
        etage: "2",
        porte: "15"
      },
      adresse_logement: "25 RUE NOUVELLE, 75000 PARIS",
      referent_technique: "Nouveau Référent"
    }));
  };

  const handleCreateCourrier = async () => {
    try {
      // Préparer la structure attendue par le backend
      const courrierToAdd: Courrier = {
        locataire: {
          nom_complet: newCourrier.locataire || '',
          email: newCourrier.email || '',
          telephone: newCourrier.telephone || '',
          situation_impayes: newCourrier.impayes || false,
          montant_impayes: newCourrier.montant_impayes || 0,
        },
        logement: {
          adresse: newCourrier.adresse_logement || '',
          reference: newCourrier.logement?.reference || '',
          type: newCourrier.logement?.type || '',
          surface: newCourrier.logement?.surface || 0,
          batiment: newCourrier.logement?.batiment || '',
          etage: newCourrier.logement?.etage || '',
          porte: newCourrier.logement?.porte || '',
        },
        dates_importantes: {
          reception_courrier: newCourrier.date_reception || '',
          sortie_prevue: newCourrier.date_sortie_prevue || '',
          pre_edl: newCourrier.date_pre_edl || '',
          edl: newCourrier.date_edl || '',
        },
        referent_technique: newCourrier.referent_technique || '',
        statut: newCourrier.statut || 'en attente',
        actions_realisees: newCourrier.actions || ['À traiter'],
        metadata: {
          date_export: new Date().toISOString(),
          id_courrier: Date.now(), // ou autre logique
        }
      };
      await createCourrier(courrierToAdd);
      const res = await getCourriers();
      setCourriersList(res.data);
      setNotification({ type: 'success', message: 'Courrier créé avec succès !' });
      closeNewCourrierModal();
    } catch (err: unknown) {
      let errorMessage = 'Erreur lors de la création du courrier';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        if (response?.data?.error) {
          errorMessage = response.data.error;
        }
      }
      setNotification({ type: 'error', message: errorMessage });
    }
  };

  const handleDeleteCourrier = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier de congé ?')) {
      try {
        await deleteCourrier(id);
        const res = await getCourriers();
        setCourriersList(res.data);
      } catch {
        // setError('Erreur lors de la suppression du courrier');
      }
    }
  };

  const getStatusLabel = (statut: CourrierCongé['statut']) => {
    switch(statut) {
      case 'en attente': return 'En attente';
      case 'traité': return 'Traité';
      case 'confirmé': return 'Confirmé';
      default: return statut;
    }
  };

  const getStatusBadge = (statut: CourrierCongé['statut']) => {
    switch(statut) {
      case 'en attente':
        return `${colors.warning.light} ${colors.warning.dark}`;
      case 'traité':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'confirmé':
        return `${colors.success.light} ${colors.success.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpayesBadge = (impayes: boolean) => {
    return impayes 
      ? `${colors.danger.light} ${colors.danger.dark}` 
      : `${colors.success.light} ${colors.success.dark}`;
  };

  const filteredCourriers = courriersList.filter(courrier => {
    if (filter !== 'all' && courrier.statut !== filter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        courrier.locataire.nom_complet.toLowerCase().includes(term) ||
        courrier.logement.adresse.toLowerCase().includes(term) ||
        courrier.logement.reference.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredCourriers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedCourriers = filteredCourriers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const res = await getCourriers();
        setCourriersList(res.data);
      } catch {
        // setError('Erreur lors du chargement des courriers');
      }
    };
    fetchCourriers();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
          <FileText className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Courriers de Congé
        </h1>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher locataire, adresse, référence..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            onClick={openNewCourrierModal}
            className={`px-3 py-2 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center justify-center`}
          >
            <Plus className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Nouveau congé</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { status: 'en attente', icon: <Clock className="h-4 w-4 mr-1" /> },
            { status: 'traité', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
            { status: 'confirmé', icon: <FileText className="h-4 w-4 mr-1" /> },
            { status: 'all', icon: <Filter className="h-4 w-4 mr-1" /> },
          ].map((item) => (
            <button
              key={item.status}
              onClick={() => {
                setFilter(item.status as StatusFilter);
                setCurrentPage(1);
              }}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                filter === item.status
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              {item.icon}
              {item.status === 'all' ? 'Tous' : getStatusLabel(item.status as CourrierCongé['statut'])}
              {item.status !== 'all' && (
                <span className={`ml-1 ${getStatusBadge(item.status as CourrierCongé['statut'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {courriersList.filter(d => d.statut === item.status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Impayés</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedCourriers.length > 0 ? (
                paginatedCourriers.map(courrier => (
                  <tr 
                    key={courrier.metadata?.id_courrier ?? courrier._id ?? Math.random()} 
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-700 ${
                      courrier.statut === 'en attente' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                      courrier.statut === 'traité' ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-gray-900 dark:text-neutral-200">
                            {courrier.locataire.nom_complet}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                            {courrier.locataire.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                            {courrier.locataire.telephone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-900 dark:text-neutral-200">
                          {courrier.logement.reference} - {courrier.logement.type}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center truncate">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {courrier.logement.adresse}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                          <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                          {courrier.logement.batiment} - Étage {courrier.logement.etage} - Porte {courrier.logement.porte}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">Reçu: {courrier.dates_importantes.reception_courrier}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Sortie: {courrier.dates_importantes.sortie_prevue}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Pré-EDL: {courrier.dates_importantes.pre_edl}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          EDL: {courrier.dates_importantes.edl}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {courrier.locataire.situation_impayes ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-medium whitespace-nowrap">
                              {courrier.locataire.montant_impayes?.toFixed(2)} €
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpayesBadge(courrier.locataire.situation_impayes)}`}>
                            Avec impayés
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">Aucun</span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpayesBadge(courrier.locataire.situation_impayes)}`}>
                            Sans impayés
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(courrier.statut)}`}>
                        {getStatusLabel(courrier.statut)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(courrier)}
                          className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
                        >
                          Voir détails
                        </button>
                        <button
                          onClick={(e) => handleDeleteCourrier(String(courrier.metadata?.id_courrier ?? courrier._id ?? ''), e)}
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
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun courrier de congé trouvé
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
      {isModalOpen && selectedCourrier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    Détails du courrier de congé
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    {selectedCourrier.locataire} - {selectedCourrier.logement.reference}
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
              {/* Informations locataire */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations locataire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom complet</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.locataire}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Téléphone</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.telephone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Situation impayés</label>
                    <div className={`w-full px-3 py-2 rounded-lg text-center font-medium ${
                      selectedCourrier.impayes 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {selectedCourrier.impayes ? `Avec impayés (${selectedCourrier.montant_impayes?.toFixed(2)} €)` : 'Sans impayés'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations logement */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations logement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.adresse_logement}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.logement.reference}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.logement.type} - {selectedCourrier.logement.surface}m²
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Localisation</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.logement.batiment} - Étage {selectedCourrier.logement.etage} - Porte {selectedCourrier.logement.porte}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates importantes */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Dates importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date réception courrier</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.date_reception}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date sortie prévue</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.date_sortie_prevue}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date pré-EDL</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.date_pre_edl}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date EDL</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.date_edl}
                    </div>
                  </div>
                </div>
              </div>

              {/* Référent technique */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Référent technique</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom du référent</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedCourrier.referent_technique}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions réalisées */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Actions réalisées</h3>
                <div className="space-y-2">
                  {selectedCourrier.actions.map((action, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-neutral-300">{action}</span>
                    </div>
                  ))}
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
                  onClick={handleSendNotifications}
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {selectedCourrier.impayes 
                    ? 'Envoyer aux services concernés' 
                    : 'Envoyer au GT et Gardien'}
                </button>
              </div>
              
              {/* Informations sur les services concernés */}
              <div className="mt-3 text-xs text-gray-500 dark:text-neutral-400">
                {selectedCourrier.impayes ? (
                  <div className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                    <span>Services concernés: Comptabilité, Contentieux, GT, Gardien</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Services concernés: GT, Gardien</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour nouveau courrier */}
      {isNewCourrierModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    Nouveau courrier de congé
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    Renseignez les informations du nouveau congé
                  </p>
                </div>
                <button 
                  onClick={closeNewCourrierModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Fermer le modal"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Informations locataire */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations locataire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      name="locataire"
                      value={newCourrier.locataire || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newCourrier.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={newCourrier.telephone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="impayes"
                      checked={newCourrier.impayes || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Avec impayés</label>
                  </div>
                  {newCourrier.impayes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Montant impayés (€)</label>
                      <input
                        type="number"
                        name="montant_impayes"
                        value={newCourrier.montant_impayes || 0}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Informations logement */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200">Informations logement</h3>
                  <button
                    onClick={handleImportLogement}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Importer les informations
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse *</label>
                    <input
                      type="text"
                      name="adresse_logement"
                      value={newCourrier.adresse_logement || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence logement</label>
                    <input
                      type="text"
                      name="logement.reference"
                      value={newCourrier.logement?.reference || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type</label>
                    <select
                      name="logement.type"
                      value={newCourrier.logement?.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Studio">Studio</option>
                      <option value="T1">T1</option>
                      <option value="T2">T2</option>
                      <option value="T3">T3</option>
                      <option value="T4">T4</option>
                      <option value="T5">T5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Surface (m²)</label>
                    <input
                      type="number"
                      name="logement.surface"
                      value={newCourrier.logement?.surface || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Bâtiment</label>
                    <input
                      type="text"
                      name="logement.batiment"
                      value={newCourrier.logement?.batiment || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Étage</label>
                    <input
                      type="text"
                      name="logement.etage"
                      value={newCourrier.logement?.etage || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Porte</label>
                    <input
                      type="text"
                      name="logement.porte"
                      value={newCourrier.logement?.porte || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>
              </div>

              {/* Dates importantes */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Dates importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date réception *</label>
                    <input
                      type="text"
                      name="date_reception"
                      value={newCourrier.date_reception || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date sortie prévue *</label>
                    <input
                      type="text"
                      name="date_sortie_prevue"
                      value={newCourrier.date_sortie_prevue || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date pré-EDL</label>
                    <input
                      type="text"
                      name="date_pre_edl"
                      value={newCourrier.date_pre_edl || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date EDL</label>
                    <input
                      type="text"
                      name="date_edl"
                      value={newCourrier.date_edl || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>
              </div>

              {/* Référent technique */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Référent technique</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom du référent</label>
                    <input
                      type="text"
                      name="referent_technique"
                      value={newCourrier.referent_technique || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={closeNewCourrierModal}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreateCourrier}
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                  disabled={!newCourrier.locataire || !newCourrier.adresse_logement || !newCourrier.date_reception || !newCourrier.date_sortie_prevue}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le courrier
                </button>
              </div> 
            </div>
          </div>
        </div>
      )}

      {/* Affichage de la notification en haut de la page */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
          <button className="ml-4 text-white font-bold" onClick={() => setNotification(null)}>
            ×
          </button>
        </div>
      )}
    </main>
  );
};

export default CourrierCongesPage;