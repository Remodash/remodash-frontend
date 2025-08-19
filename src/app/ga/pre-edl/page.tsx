'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  FileText,
  Camera,
  Search,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ChevronUp,
  ChevronDown, 
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from 'lucide-react';

// Types
interface Tenant {
  id: number;
  name: string;
  email: string;
  currentAddress: string;
  newAddress: string;
  entryDate: string;
  status: 'en cours' | 'à réaliser' | 'terminé';
  inspection: {
    number: string;
    date: string;
  } | null;
  property: {
    contract: string;
    type: string;
    reference: string;
  };
}

interface KeyItem {
  id: string;
  libelle: string;
  remises: number;
  rendues: number;
  prix_unitaire: string;
  collapsed: boolean;
}

interface CounterItem {
  id: string;
  code: string;
  type: string;
  numero_serie: string;
  emplacement: string;
  index_precedent: string;
  index_actuel: string;
  collapsed: boolean;
}

interface RoomState {
  id: string;
  room: string;
  component: string;
  etat: string;
  observation?: string;
}

interface PhotoItem {
  id: string;
  room: string;
  file: File | null;
  previewUrl: string;
}

interface FormData {
  keys: KeyItem[];
  counters: CounterItem[];
  roomStates: RoomState[];
  photos: PhotoItem[];
}

interface ExpandedSections {
  general?: boolean;
  keys?: boolean;
  property?: boolean;
  photos?: boolean;
}

type StatusFilter = 'all' | 'en cours' | 'à réaliser' | 'terminé';

const PreEDLPage = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    keys: true,
    property: true,
    photos: true
  });
  const [formData, setFormData] = useState<FormData>({
    keys: [
      { 
        id: '1', 
        libelle: 'BADGE', 
        remises: 3, 
        rendues: 3, 
        prix_unitaire: '20.00',
        collapsed: false 
      },
      { 
        id: '2', 
        libelle: 'CLE BOITE LETTRES', 
        remises: 1, 
        rendues: 1, 
        prix_unitaire: '12.00',
        collapsed: false 
      },
      { 
        id: '3', 
        libelle: 'CYLINDRE EURO', 
        remises: 4, 
        rendues: 4, 
        prix_unitaire: '10.00',
        collapsed: false 
      }
    ],
    counters: [
      { 
        id: '1',
        code: '0131000000030095F1',
        type: 'EAU FROIDE', 
        numero_serie: '19CA035204', 
        emplacement: 'TOILETTES', 
        index_precedent: '160.000', 
        index_actuel: '160.000',
        collapsed: false
      },
      { 
        id: '2',
        code: '0131000000030095C2',
        type: 'EAU CHAUDE', 
        numero_serie: '19BA006578', 
        emplacement: 'TOILETTES', 
        index_precedent: '108.000', 
        index_actuel: '108.000',
        collapsed: false
      }
    ],
    roomStates: [],
    photos: []
  });
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRoomForPhoto, setSelectedRoomForPhoto] = useState('');

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

  // Données des locataires
  const tenants: Tenant[] = [
    {
      id: 1,
      name: "Mme JENNIFER TAVER",
      email: "COLIBRIHIBISCUS@HOTMAIL.FR",
      currentAddress: "6 SQUARE ESQUIROL, Porte 31081 Etage 08 BATIMENT 03, 94000 CRETEIL",
      newAddress: "2 AVENUE FRANCOIS MITTERRAND, 94000 CRETEIL",
      entryDate: "03/09/2024",
      status: "en cours",
      inspection: {
        number: "2024-828",
        date: "05/09/2024"
      },
      property: {
        contract: "9578148",
        type: "3 PIECES",
        reference: "131033081"
      }
    },
    {
      id: 2,
      name: "M. JEAN DUPONT",
      email: "jean.dupont@example.com",
      currentAddress: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
      newAddress: "15 RUE DES LILAS, 75011 PARIS",
      entryDate: "10/09/2024",
      status: "à réaliser",
      inspection: null,
      property: {
        contract: "9578149",
        type: "2 PIECES",
        reference: "131033082"
      }
    },
    {
      id: 3,
      name: "Mme MARIE LEROY",
      email: "marie.leroy@example.com",
      currentAddress: "5 RUE DES LILAS, 92100 BOULOGNE",
      newAddress: "8 AVENUE VICTOR HUGO, 92100 BOULOGNE",
      entryDate: "15/09/2024",
      status: "terminé",
      inspection: {
        number: "2024-829",
        date: "15/09/2024"
      },
      property: {
        contract: "9578150",
        type: "4 PIECES",
        reference: "131033083"
      }
    }
  ];

  // Données des pièces et composants basées sur le JSON
  const rooms = ['Cuisine', 'Salle de bain', 'WC', 'Chambre 1', 'Chambre 2', 'Salle de séjour', 'Entrée', 'Loggia'];
  const roomComponents: Record<string, string[]> = {
    'Cuisine': [
      'RADIATEUR', 'ROBINET THERMOSTATIQUE', 'APPLIQUE', 'CABLE', 'CACHE PRISE', 
      'DOUILLE', 'INTERRUPTEUR', 'MOULURE', 'PRISE ELECTRIQUE', 'FENETRE', 
      'PLINTHE', 'POIGNEE', 'PORTE INTERIEURE', 'RIVE BLOC', 'VITRAGE', 
      'DALLES PVC', 'FAIENCE', 'PEINTURE', 'PLAFOND', 'EVIER', 
      'MEUBLE SOUS EVIER', 'ROBINETTERIE', 'VIDANGE', 'VMC'
    ],
    'Salle de bain': [
      'APPLIQUE', 'CABLE', 'CACHE PRISE', 'DOUILLE', 'INTERRUPTEUR', 
      'MOULURE', 'PRISE ELECTRIQUE', 'PLINTHE', 'POIGNEE', 'PORTE INTERIEURE', 
      'RIVE BLOC', 'SERRURE', 'VERROU', 'DALLES PVC', 'FAIENCE', 
      'PEINTURE', 'PLAFOND', 'BAIGNOIRE', 'LAVABO', 'ROBINETTERIE', 
      'VIDANGE', 'VMC', 'WC'
    ],
    'WC': [
      'CABLE', 'DOUILLE', 'INTERRUPTEUR', 'MOULURE', 'PLINTHE', 
      'POIGNEE', 'PORTE INTERIEURE', 'RIVE BLOC', 'SERRURE', 'VERROU', 
      'PARQUET', 'PEINTURE', 'ROBINETTERIE', 'VIDANGE', 'VMC', 
      'WC'
    ],
    'Chambre 1': [
      'RADIATEUR', 'ROBINET THERMOSTATIQUE', 'CABLE', 'CACHE PRISE', 
      'INTERRUPTEUR', 'MOULURE', 'PRISE ELECTRIQUE', 'PRISE TV TELEPHONE INTERNET', 
      'FENETRE', 'GRILLE AERATION', 'MANIVELLE SANGLE VOLET', 'PLINTHE', 
      'POIGNEE', 'PORTE INTERIEURE', 'RIVE BLOC', 'SERRURE', 'VITRAGE', 
      'VOLETS', 'PAPIER PEINT', 'PARQUET', 'PLAFOND'
    ],
    'Chambre 2': [
      'RADIATEUR', 'ROBINET THERMOSTATIQUE', 'CABLE', 'CACHE PRISE', 
      'INTERRUPTEUR', 'MOULURE', 'PRISE ELECTRIQUE', 'PRISE TV TELEPHONE INTERNET', 
      'FENETRE', 'GRILLE AERATION', 'PLINTHE', 'POIGNEE', 'PORTE INTERIEURE', 
      'RIVE BLOC', 'SERRURE', 'VITRAGE', 'VOLETS', 'PAPIER PEINT', 
      'PARQUET', 'PEINTURE', 'PLAFOND'
    ],
    'Salle de séjour': [
      'CACHE PRISE', 'INTERRUPTEUR', 'MOULURE', 'PRISE ELECTRIQUE', 
      'PRISE TV TELEPHONE INTERNET', 'PORTE ALVEOLAIRE', 'PORTE FENETRE', 
      'VOLET ROULANT', 'PEINTURE', 'REVETEMENTS SOLS'
    ],
    'Entrée': [
      'CABLE', 'CACHE PRISE', 'COMBINET INTERPHONE', 'DOUILLE', 
      'INTERRUPTEUR', 'MOULURE', 'PRISE ELECTRIQUE', 'SONNETTE', 
      'TABLEAU', 'PORTE PALIERE/ENTREE', 'ENTREBAILLEUR', 'JUDAS', 
      'PLINTHE', 'POIGNEE', 'RIVE BLOC', 'SERRURE', 'VERROU', 
      'PAPIER PEINT', 'PARQUET', 'PLAFOND'
    ],
    'Loggia': [
      'GARDE CORPS', 'MACONNERIE', 'REVET SOL'
    ]
  };
  const roomStatesOptions = ['BON ETAT', 'MAUVAIS ETAT'];

  useEffect(() => {
    return () => {
      formData.photos.forEach(photo => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [formData.photos]);

  const openModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
    setExpandedSections({
      general: true,
      keys: true,
      property: true,
      photos: true
    });
    
    // Initialiser les données du formulaire avec les valeurs du JSON
    setFormData({
      keys: [
        { 
          id: '1', 
          libelle: 'BADGE', 
          remises: 3, 
          rendues: 3, 
          prix_unitaire: '20.00',
          collapsed: false 
        },
        { 
          id: '2', 
          libelle: 'CLE BOITE LETTRES', 
          remises: 1, 
          rendues: 1, 
          prix_unitaire: '12.00',
          collapsed: false 
        },
        { 
          id: '3', 
          libelle: 'CYLINDRE EURO', 
          remises: 4, 
          rendues: 4, 
          prix_unitaire: '10.00',
          collapsed: false 
        }
      ],
      counters: [
        { 
          id: '1',
          code: '0131000000030095F1',
          type: 'EAU FROIDE', 
          numero_serie: '19CA035204', 
          emplacement: 'TOILETTES', 
          index_precedent: '160.000', 
          index_actuel: '160.000',
          collapsed: false
        },
        { 
          id: '2',
          code: '0131000000030095C2',
          type: 'EAU CHAUDE', 
          numero_serie: '19BA006578', 
          emplacement: 'TOILETTES', 
          index_precedent: '108.000', 
          index_actuel: '108.000',
          collapsed: false
        }
      ],
      roomStates: [],
      photos: []
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTenant(null);
  };

  const handleSave = () => {
    console.log('Sauvegarde des données:', formData);
    closeModal();
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleKeyCollapse = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.map(key => 
        key.id === id ? { ...key, collapsed: !key.collapsed } : key
      )
    }));
  };

  const toggleCounterCollapse = (id: string) => {
    setFormData(prev => ({
      ...prev,
      counters: prev.counters.map(counter => 
        counter.id === id ? { ...counter, collapsed: !counter.collapsed } : counter
      )
    }));
  };

  const handleKeyChange = (id: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.map(key => 
        key.id === id ? { ...key, [field]: value } : key
      )
    }));
  };

  const handleAddKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      libelle: '',
      remises: 1,
      rendues: 1,
      prix_unitaire: '0.00',
      collapsed: false
    };
    
    setFormData(prev => ({
      ...prev,
      keys: [...prev.keys, newKey]
    }));
  };

  const handleRemoveKey = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.filter(key => key.id !== id)
    }));
  };

  const handleCounterChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      counters: prev.counters.map(counter => 
        counter.id === id ? { ...counter, [field]: value } : counter
      )
    }));
  };

  const handleAddCounter = () => {
    const newCounter = {
      id: `counter-${Date.now()}`,
      code: '',
      type: 'EAU FROIDE',
      numero_serie: '',
      emplacement: '',
      index_precedent: '0.000',
      index_actuel: '0.000',
      collapsed: false
    };
    
    setFormData(prev => ({
      ...prev,
      counters: [...prev.counters, newCounter]
    }));
  };

  const handleRemoveCounter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      counters: prev.counters.filter(counter => counter.id !== id)
    }));
  };

  const handleRoomStateChange = (room: string, component: string, etat: string) => {
    setFormData(prev => {
      const existingIndex = prev.roomStates.findIndex(
        rs => rs.room === room && rs.component === component
      );
      
      if (existingIndex >= 0) {
        const newRoomStates = [...prev.roomStates];
        newRoomStates[existingIndex] = { ...newRoomStates[existingIndex], etat };
        return { ...prev, roomStates: newRoomStates };
      } else {
        return {
          ...prev,
          roomStates: [
            ...prev.roomStates,
            {
              id: `${room}-${component}-${Date.now()}`,
              room,
              component,
              etat
            }
          ]
        };
      }
    });
  };

  const getRoomState = (room: string, component: string) => {
    const state = formData.roomStates.find(
      rs => rs.room === room && rs.component === component
    );
    return state ? state.etat : 'BON ETAT';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, room: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newPhotos = files.map(file => ({
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        room,
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleRemovePhoto = (id: string) => {
    setFormData(prev => {
      const photoToRemove = prev.photos.find(photo => photo.id === id);
      if (photoToRemove && photoToRemove.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }
      return {
        ...prev,
        photos: prev.photos.filter(photo => photo.id !== id)
      };
    });
  };

  const triggerFileInput = (room: string) => {
    setSelectedRoomForPhoto(room);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const getStatusLabel = (status: Tenant['status']) => {
    switch(status) {
      case 'terminé': return 'Terminé';
      case 'en cours': return 'En cours';
      case 'à réaliser': return 'À réaliser';
      default: return status;
    }
  };

  const getStatusBadge = (status: Tenant['status']) => {
    switch(status) {
      case 'terminé':
        return `${colors.success.light} ${colors.success.dark}`;
      case 'en cours':
        return `${colors.info.light} ${colors.info.dark}`;
      case 'à réaliser':
        return `${colors.warning.light} ${colors.warning.dark}`;
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    if (filter !== 'all' && tenant.status !== filter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        tenant.currentAddress.toLowerCase().includes(term) ||
        tenant.name.toLowerCase().includes(term) ||
        tenant.property.reference.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalItems = filteredTenants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTenants = filteredTenants.slice(
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
          <FileText className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
          Pré-États des Lieux Sortants
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
            <span className="text-sm sm:text-base">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { status: 'à réaliser', icon: <AlertCircle className="h-4 w-4 mr-1" /> },
            { status: 'en cours', icon: <Clock className="h-4 w-4 mr-1" /> },
            { status: 'terminé', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
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
              {item.status === 'all' ? 'Tous' : item.status === 'à réaliser' ? 'À réaliser' : item.status === 'en cours' ? 'En cours' : 'Terminés'}
              {item.status !== 'all' && (
                <span className={`ml-1 ${getStatusBadge(item.status as Tenant['status'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {tenants.filter(d => d.status === item.status).length}
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse actuelle</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date sortie</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {paginatedTenants.length > 0 ? (
                paginatedTenants.map(tenant => (
                  <tr 
                    key={tenant.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-700 ${
                      tenant.status === 'à réaliser' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                      tenant.status === 'en cours' ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate">{tenant.name}</div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                            {tenant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200 truncate">{tenant.currentAddress}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                        Nouvelle adresse: {tenant.newAddress}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{tenant.entryDate}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <div>Contrat: {tenant.property.contract}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Réf: {tenant.property.reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(tenant.status)}`}>
                        {getStatusLabel(tenant.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => openModal(tenant)}
                        className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 ${colors.primary.light} ${colors.primary.dark} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        {tenant.inspection ? 'Voir pré-EDL' : 'Créer pré-EDL'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun pré-état des lieux trouvé
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
      {isModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                    Pré-État des Lieux Sortant
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    {selectedTenant.name} - Contrat: {selectedTenant.property.contract}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Fermer le modal"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom du locataire</label>
                        <input 
                          type="text" 
                          value={selectedTenant.name} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email</label>
                        <input 
                          type="text" 
                          value={selectedTenant.email} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse actuelle</label>
                        <input 
                          type="text" 
                          value={selectedTenant.currentAddress} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nouvelle adresse</label>
                        <input 
                          type="text" 
                          value={selectedTenant.newAddress} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de sortie</label>
                        <input 
                          type="text" 
                          value={selectedTenant.entryDate} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence logement</label>
                        <input 
                          type="text" 
                          value={selectedTenant.property.reference} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type de logement</label>
                        <input 
                          type="text" 
                          value={selectedTenant.property.type} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      {selectedTenant.inspection && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Numéro pré-EDL</label>
                          <input 
                            type="text" 
                            value={selectedTenant.inspection.number} 
                            readOnly 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Clés et compteurs */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('keys')}
                  aria-expanded={expandedSections.keys}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Clés et compteurs</h3>
                  {expandedSections.keys ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.keys && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-neutral-200">Clés remises</h4>
                        <button 
                          onClick={handleAddKey}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter une clé
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.keys.map((key) => (
                          <div key={key.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                            <button 
                              className="flex justify-between items-center w-full p-3 cursor-pointer"
                              onClick={() => toggleKeyCollapse(key.id)}
                              aria-expanded={!key.collapsed}
                            >
                              <span className={`font-medium ${key.remises !== key.rendues ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-neutral-200'}`}>
                                {key.libelle || 'Nouvelle clé'}
                              </span>
                              {key.collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                            </button>
                            
                            {!key.collapsed && (
                              <div className="p-3 pt-0 border-t border-gray-200 dark:border-neutral-600">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Libellé</label>
                                    <input
                                      type="text"
                                      value={key.libelle}
                                      onChange={(e) => handleKeyChange(key.id, 'libelle', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                      placeholder="Type de clé"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Remises</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={key.remises}
                                      onChange={(e) => handleKeyChange(key.id, 'remises', parseInt(e.target.value) || 0)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Rendues</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={key.rendues}
                                      onChange={(e) => handleKeyChange(key.id, 'rendues', parseInt(e.target.value) || 0)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Prix unitaire (€)</label>
                                    <input
                                      type="text"
                                      value={key.prix_unitaire}
                                      onChange={(e) => handleKeyChange(key.id, 'prix_unitaire', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                  <button 
                                    onClick={() => handleRemoveKey(key.id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm flex items-center"
                                    aria-label={`Supprimer la clé ${key.libelle}`}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-neutral-200">Relevés des compteurs</h4>
                        <button 
                          onClick={handleAddCounter}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un compteur
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.counters.map((counter) => (
                          <div key={counter.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                            <button 
                              className="flex justify-between items-center w-full p-3 cursor-pointer"
                              onClick={() => toggleCounterCollapse(counter.id)}
                              aria-expanded={!counter.collapsed}
                            >
                              <div className="font-medium text-gray-900 dark:text-neutral-200">
                                {counter.type} - {counter.numero_serie}
                              </div>
                              {counter.collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                            </button>
                            
                            {!counter.collapsed && (
                              <div className="p-3 pt-0 border-t border-gray-200 dark:border-neutral-600">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                                    Détails du compteur
                                  </div>
                                  <button 
                                    onClick={() => handleRemoveCounter(counter.id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    aria-label={`Supprimer le compteur ${counter.numero_serie}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Code</label>
                                    <input
                                      type="text"
                                      value={counter.code}
                                      onChange={(e) => handleCounterChange(counter.id, 'code', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Type</label>
                                    <select
                                      value={counter.type}
                                      onChange={(e) => handleCounterChange(counter.id, 'type', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    >
                                      <option value="EAU FROIDE">Eau froide</option>
                                      <option value="EAU CHAUDE">Eau chaude</option>
                                      <option value="ELECTRICITE">Électricité</option>
                                      <option value="GAZ">Gaz</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Numéro de série</label>
                                    <input
                                      type="text"
                                      value={counter.numero_serie}
                                      onChange={(e) => handleCounterChange(counter.id, 'numero_serie', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Emplacement</label>
                                    <input
                                      type="text"
                                      value={counter.emplacement}
                                      onChange={(e) => handleCounterChange(counter.id, 'emplacement', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Index précédent</label>
                                    <input
                                      type="text"
                                      value={counter.index_precedent}
                                      onChange={(e) => handleCounterChange(counter.id, 'index_precedent', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Index actuel</label>
                                    <input
                                      type="text"
                                      value={counter.index_actuel}
                                      onChange={(e) => handleCounterChange(counter.id, 'index_actuel', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* État de la propriété */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('property')}
                  aria-expanded={expandedSections.property}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">État de la propriété</h3>
                  {expandedSections.property ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.property && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
                    {rooms.map((room) => (
                      <div key={room} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                        <button 
                          className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                          onClick={() => {}}
                          aria-expanded={true}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200">{room}</h4>
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        
                        <div className="p-3 sm:p-4 pt-0 space-y-4">
                          {roomComponents[room]?.map((component) => {
                            const etat = getRoomState(room, component);
                            const observation = formData.roomStates.find(
                              rs => rs.room === room && rs.component === component
                            )?.observation;
                            
                            return (
                              <div key={`${room}-${component}`} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{component}</span>
                                  <div className="flex items-center gap-2">
                                    {roomStatesOptions.map((option) => (
                                      <label key={option} className="flex items-center gap-1 cursor-pointer">
                                        <input 
                                          type="radio" 
                                          name={`${room}-${component}`} 
                                          value={option}
                                          checked={etat === option}
                                          onChange={() => handleRoomStateChange(room, component, option)}
                                          className="w-3 h-3 text-blue-600 border-gray-300 dark:border-neutral-600 focus:ring-blue-500 dark:bg-neutral-700"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-neutral-400">{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                
                                {observation && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-sm text-gray-700 dark:text-neutral-300 flex justify-between">
                                    <span>{observation}</span>
                                    <button 
                                      onClick={() => {
                                        const state = formData.roomStates.find(
                                          rs => rs.room === room && rs.component === component
                                        );
                                        if (state) {
                                          setFormData(prev => ({
                                            ...prev,
                                            roomStates: prev.roomStates.filter(rs => rs.id !== state.id)
                                          }));
                                        }
                                      }}
                                      className="text-gray-500 hover:text-gray-700 dark:hover:text-neutral-200"
                                      aria-label="Supprimer l'observation"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handlePhotoUpload(e, selectedRoomForPhoto)}
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-neutral-200 mb-3">Ajouter des photos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {rooms.map((room) => (
                          <button
                            key={room}
                            onClick={() => triggerFileInput(room)}
                            className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <div className="text-gray-500 dark:text-neutral-400">
                              <Camera className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs">{room}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-neutral-200 mb-3">Photos ajoutées</h4>
                      {formData.photos.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-neutral-400 py-4">
                          Aucune photo ajoutée
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                              <div className="aspect-square bg-gray-200 dark:bg-neutral-600 rounded-lg overflow-hidden">
                                <Image
                                  src={photo.previewUrl} 
                                  alt={`Photo ${photo.room}`}
                                  className="w-full h-full object-cover"
                                  width={200}
                                  height={200}
                                />
                              </div>
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {photo.room}
                              </div>
                              <button
                                onClick={() => handleRemovePhoto(photo.id)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Supprimer la photo de ${photo.room}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2`}
                >
                  {selectedTenant.inspection ? 'Mettre à jour' : 'Enregistrer pré-EDL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PreEDLPage;