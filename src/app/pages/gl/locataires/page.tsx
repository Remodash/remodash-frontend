'use client';

import { useState } from 'react';
import { 
  User,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Euro,
  AlertCircle,
  CheckCircle2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';

interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_entree: string;
  date_sortie: string | null;
  loyer: string;
  caution: string;
  statut: 'actif' | 'sortant' | 'en cours départ';
  impayes: boolean;
  montant_impayes?: number;
  logement: {
    reference: string;
    type: string;
    surface: number;
    batiment: string;
    etage: string;
    porte: string;
  };
  referent: string;
}

type StatusFilter = 'all' | 'actif' | 'sortant' | 'en cours départ';

const TousLocatairesPage = () => {
  const [selectedLocataire, setSelectedLocataire] = useState<Locataire | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  // Données mock des locataires
  const locatairesList: Locataire[] = [
    {
      id: 1,
      nom: "THIAM",
      prenom: "NDEYE THIORO",
      email: "ndeye.thiam@email.com",
      telephone: "06 12 34 56 78",
      adresse: "6 SQUARE ESQUIROL, 94000 CRETEIL",
      date_entree: "15/03/2020",
      date_sortie: "13/11/2024",
      loyer: "650€",
      caution: "1300€",
      statut: "en cours départ",
      impayes: false,
      logement: {
        reference: "LOG-001",
        type: "T2",
        surface: 45,
        batiment: "Bâtiment A",
        etage: "3",
        porte: "12"
      },
      referent: "Viviane ANKE"
    },
    {
      id: 2,
      nom: "TAVER",
      prenom: "JENNIFER",
      email: "jennifer.taver@email.com",
      telephone: "06 98 76 54 32",
      adresse: "6 SQUARE ESQUIROL, Porte 31081",
      date_entree: "10/06/2019",
      date_sortie: "12/09/2024",
      loyer: "720€",
      caution: "1440€",
      statut: "sortant",
      impayes: true,
      montant_impayes: 320,
      logement: {
        reference: "LOG-002",
        type: "T1",
        surface: 32,
        batiment: "Bâtiment B",
        etage: "1",
        porte: "5"
      },
      referent: "Pierre MARTIN"
    },
    {
      id: 3,
      nom: "DUPONT",
      prenom: "JEAN",
      email: "jean.dupont@email.com",
      telephone: "07 65 43 21 09",
      adresse: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
      date_entree: "01/04/2022",
      date_sortie: null,
      loyer: "850€",
      caution: "1700€",
      statut: "actif",
      impayes: false,
      logement: {
        reference: "LOG-003",
        type: "T3",
        surface: 62,
        batiment: "Bâtiment C",
        etage: "4",
        porte: "18"
      },
      referent: "Sophie DUBOIS"
    },
    {
      id: 4,
      nom: "MARTIN",
      prenom: "PIERRE",
      email: "pierre.martin@email.com",
      telephone: "06 11 22 33 44",
      adresse: "15 RUE DE LA PAIX, 75002 PARIS",
      date_entree: "20/08/2021",
      date_sortie: "05/12/2024",
      loyer: "920€",
      caution: "1840€",
      statut: "en cours départ",
      impayes: false,
      logement: {
        reference: "LOG-004",
        type: "T2",
        surface: 48,
        batiment: "Bâtiment A",
        etage: "2",
        porte: "7"
      },
      referent: "Viviane ANKE"
    },
    {
      id: 5,
      nom: "DURAND",
      prenom: "SOPHIE",
      email: "sophie.durand@email.com",
      telephone: "06 55 66 77 88",
      adresse: "22 AVENUE VICTOR HUGO, 75116 PARIS",
      date_entree: "05/01/2023",
      date_sortie: null,
      loyer: "780€",
      caution: "1560€",
      statut: "actif",
      impayes: true,
      montant_impayes: 450,
      logement: {
        reference: "LOG-005",
        type: "T3",
        surface: 65,
        batiment: "Bâtiment B",
        etage: "5",
        porte: "22"
      },
      referent: "Pierre MARTIN"
    },
    {
      id: 6,
      nom: "LEMAIRE",
      prenom: "THOMAS",
      email: "thomas.lemaire@email.com",
      telephone: "06 44 55 66 77",
      adresse: "8 RUE DU COMMERCE, 75015 PARIS",
      date_entree: "10/02/2022",
      date_sortie: "20/01/2025",
      loyer: "890€",
      caution: "1780€",
      statut: "en cours départ",
      impayes: false,
      logement: {
        reference: "LOG-006",
        type: "T2",
        surface: 50,
        batiment: "Bâtiment C",
        etage: "2",
        porte: "10"
      },
      referent: "Sophie DUBOIS"
    }
  ];

  const openModal = (locataire: Locataire) => {
    setSelectedLocataire(locataire);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLocataire(null);
  };

  const handleDeleteLocataire = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
      console.log('Suppression du locataire:', id);
    }
  };

  const getStatusLabel = (statut: Locataire['statut']) => {
    switch(statut) {
      case 'actif': return 'Actif';
      case 'sortant': return 'Sortant';
      case 'en cours départ': return 'En cours départ';
      default: return statut;
    }
  };

  const getStatusBadge = (statut: Locataire['statut']) => {
    switch(statut) {
      case 'actif':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'sortant':
        return `${colors.danger.light} ${colors.danger.dark}`;
      case 'en cours départ':
        return `${colors.warning.light} ${colors.warning.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpayesBadge = (impayes: boolean) => {
    return impayes 
      ? `${colors.danger.light} ${colors.danger.dark}` 
      : `${colors.success.light} ${colors.success.dark}`;
  };

  const filteredLocataires = locatairesList.filter(locataire => {
    if (filter !== 'all' && locataire.statut !== filter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        `${locataire.nom} ${locataire.prenom}`.toLowerCase().includes(term) ||
        locataire.adresse.toLowerCase().includes(term) ||
        locataire.logement.reference.toLowerCase().includes(term) ||
        locataire.email.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredLocataires.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLocataires = filteredLocataires.slice(
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
          <User className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Tous les locataires
        </h1>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher nom, adresse, référence..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className={`px-3 py-2 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg flex items-center justify-center`}>
            <Plus className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Nouveau locataire</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { status: 'actif', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
            { status: 'en cours départ', icon: <Clock className="h-4 w-4 mr-1" /> },
            { status: 'sortant', icon: <FileText className="h-4 w-4 mr-1" /> },
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
              {item.status === 'all' ? 'Tous' : getStatusLabel(item.status as Locataire['statut'])}
              {item.status !== 'all' && (
                <span className={`ml-1 ${getStatusBadge(item.status as Locataire['statut'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {locatairesList.filter(d => d.statut === item.status).length}
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Contact</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Loyer/Caution</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedLocataires.length > 0 ? (
                paginatedLocataires.map(locataire => (
                  <tr 
                    key={locataire.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-700 ${
                      locataire.statut === 'en cours départ' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                      locataire.statut === 'sortant' ? 'bg-red-50/10 dark:bg-red-900/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-gray-900 dark:text-neutral-200">
                            {locataire.nom} {locataire.prenom}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            ID: {locataire.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{locataire.email}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{locataire.telephone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-900 dark:text-neutral-200">
                          {locataire.logement.reference} - {locataire.logement.type}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center truncate">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {locataire.adresse}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                          <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                          {locataire.logement.batiment} - Étage {locataire.logement.etage} - Porte {locataire.logement.porte}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">Entrée: {locataire.date_entree}</span>
                        </div>
                        {locataire.date_sortie && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="whitespace-nowrap">Sortie: {locataire.date_sortie}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                          <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="whitespace-nowrap">{locataire.loyer}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Caution: {locataire.caution}
                        </div>
                        {locataire.impayes && (
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              Impayé: {locataire.montant_impayes}€
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(locataire.statut)}`}>
                          {getStatusLabel(locataire.statut)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpayesBadge(locataire.impayes)}`}>
                          {locataire.impayes ? 'Avec impayés' : 'Sans impayés'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(locataire)}
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
                          onClick={(e) => handleDeleteLocataire(locataire.id, e)}
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
                    Aucun locataire trouvé
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
      {isModalOpen && selectedLocataire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    Détails du locataire
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    {selectedLocataire.nom} {selectedLocataire.prenom} - {selectedLocataire.logement.reference}
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
              {/* Informations personnelles */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom complet</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.nom} {selectedLocataire.prenom}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Téléphone</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.telephone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référent</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.referent}
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
                      {selectedLocataire.adresse}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.logement.reference}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.logement.type} - {selectedLocataire.logement.surface}m²
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Localisation</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.logement.batiment} - Étage {selectedLocataire.logement.etage} - Porte {selectedLocataire.logement.porte}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations financières */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Informations financières</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Loyer</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.loyer}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Caution</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.caution}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Situation impayés</label>
                    <div className={`w-full px-3 py-2 rounded-lg text-center font-medium ${
                      selectedLocataire.impayes 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {selectedLocataire.impayes ? `Avec impayés (${selectedLocataire.montant_impayes}€)` : 'Sans impayés'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Statut</label>
                    <div className={`w-full px-3 py-2 rounded-lg text-center font-medium ${getStatusBadge(selectedLocataire.statut)}`}>
                      {getStatusLabel(selectedLocataire.statut)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates importantes */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 mb-3">Dates importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date d&apos;entrée</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.date_entree}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de sortie</label>
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      {selectedLocataire.date_sortie || 'Non définie'}
                    </div>
                  </div>
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
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TousLocatairesPage;