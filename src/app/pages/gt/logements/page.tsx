'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Home,
  User,
  Wrench,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';

// Types pour les logements
type LogementStatus = 'Libre' | 'Occupé' | 'En travaux' | 'En attente EDL' | 'En attente diagnostic';
type BatimentType = 'Appartement' | 'Maison' | 'Studio' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+';

interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateEntree: string;
  dateSortie: string | null;
  caution: number;
  loyer: number;
  garant: string;
  garantTelephone: string;
}

interface Diagnostic {
  id: number;
  type: string;
  statut: 'À réaliser' | 'En cours' | 'Terminé' | 'Expiré';
  dateRealisation: string;
  dateExpiration: string;
  prestataire: string;
}

interface EDL {
  id: number;
  type: 'Entrant' | 'Sortant';
  statut: 'Planifié' | 'Réalisé' | 'En attente' | 'Analysé';
  datePrevue: string;
  dateReelle: string | null;
  gestionnaire: string;
}

interface Travaux {
  id: number;
  type: string;
  statut: 'Planifié' | 'En cours' | 'Terminé';
  dateDebut: string;
  dateFinPrevue: string;
  prestataire: string;
  cout: number;
}

interface Logement {
  id: number;
  reference: string;
  adresse: string;
  batiment: string;
  porte: string;
  ville: string;
  codePostal: string;
  type: BatimentType;
  surface: number;
  nbPieces: number;
  nbChambres: number;
  anneeConstruction: number;
  etage: number | null;
  orientation: string;
  chauffage: string;
  energie: string;
  ges: string;
  prixAcquisition: number;
  dateAcquisition: string;
  statut: LogementStatus;
  locataire: Locataire | null;
  diagnostics: Diagnostic[];
  edls: EDL[];
  travaux: Travaux[];
  observations: string;
}

const LogementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LogementStatus | 'tous'>('tous');
  const [anneeConstructionFilter, setAnneeConstructionFilter] = useState<string>('toutes');
  const [locataireFilter, setLocataireFilter] = useState<string>('tous');
  const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Données de démonstration
  const [logements] = useState<Logement[]>([
    {
      id: 1,
      reference: "LOG-2024-001",
      adresse: "6 Square Esquirol",
      batiment: "Résidence Les Tilleuls",
      porte: "31081",
      ville: "Toulouse",
      codePostal: "31000",
      type: "T2",
      surface: 45,
      nbPieces: 2,
      nbChambres: 1,
      anneeConstruction: 2010,
      etage: 3,
      orientation: "Sud",
      chauffage: "Électrique",
      energie: "C",
      ges: "B",
      prixAcquisition: 185000,
      dateAcquisition: "15/06/2018",
      statut: "Occupé",
      observations: "Appartement bien situé, proche commodités",
      locataire: {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        telephone: "06 12 34 56 78",
        dateEntree: "01/09/2022",
        dateSortie: null,
        caution: 1200,
        loyer: 650,
        garant: "Marie Dupont",
        garantTelephone: "06 98 76 54 32"
      },
      diagnostics: [
        {
          id: 1,
          type: "DPE",
          statut: "Terminé",
          dateRealisation: "15/05/2023",
          dateExpiration: "15/05/2033",
          prestataire: "Diagnostiqueurs Associés"
        },
        {
          id: 2,
          type: "Électricité",
          statut: "À réaliser",
          dateRealisation: "",
          dateExpiration: "30/11/2024",
          prestataire: "À définir"
        }
      ],
      edls: [
        {
          id: 1,
          type: "Entrant",
          statut: "Réalisé",
          datePrevue: "01/09/2022",
          dateReelle: "01/09/2022",
          gestionnaire: "Sophie Martin"
        }
      ],
      travaux: [
        {
          id: 1,
          type: "Rénovation salle de bain",
          statut: "Terminé",
          dateDebut: "01/07/2022",
          dateFinPrevue: "15/08/2022",
          prestataire: "Artisans Pro",
          cout: 4200
        }
      ]
    },
    {
      id: 2,
      reference: "LOG-2024-002",
      adresse: "12 Avenue de la République",
      batiment: "Immeuble République",
      porte: "12",
      ville: "Toulouse",
      codePostal: "31000",
      type: "T3",
      surface: 72,
      nbPieces: 3,
      nbChambres: 2,
      anneeConstruction: 2005,
      etage: 2,
      orientation: "Est",
      chauffage: "Gaz",
      energie: "B",
      ges: "A",
      prixAcquisition: 245000,
      dateAcquisition: "22/03/2019",
      statut: "Libre",
      observations: "Appartement lumineux, balcon agréable",
      locataire: null,
      diagnostics: [
        {
          id: 1,
          type: "DPE",
          statut: "Terminé",
          dateRealisation: "10/01/2023",
          dateExpiration: "10/01/2033",
          prestataire: "Diagnostiqueurs Associés"
        },
        {
          id: 2,
          type: "Gaz",
          statut: "Expiré",
          dateRealisation: "15/06/2021",
          dateExpiration: "15/06/2024",
          prestataire: "Gaz Experts"
        }
      ],
      edls: [
        {
          id: 1,
          type: "Sortant",
          statut: "Réalisé",
          datePrevue: "30/06/2024",
          dateReelle: "30/06/2024",
          gestionnaire: "Pierre Dubois"
        }
      ],
      travaux: [
        {
          id: 1,
          type: "Peinture complète",
          statut: "Planifié",
          dateDebut: "01/09/2024",
          dateFinPrevue: "10/09/2024",
          prestataire: "Peinture Pro",
          cout: 1800
        }
      ]
    },
    {
      id: 3,
      reference: "LOG-2024-003",
      adresse: "25 Rue Alsace-Lorraine",
      batiment: "Résidence Alsace",
      porte: "45",
      ville: "Toulouse",
      codePostal: "31000",
      type: "Studio",
      surface: 28,
      nbPieces: 1,
      nbChambres: 0,
      anneeConstruction: 2018,
      etage: 1,
      orientation: "Ouest",
      chauffage: "Électrique",
      energie: "A",
      ges: "A",
      prixAcquisition: 125000,
      dateAcquisition: "10/11/2020",
      statut: "En travaux",
      observations: "Studio étudiant, proche université",
      locataire: null,
      diagnostics: [
        {
          id: 1,
          type: "DPE",
          statut: "Terminé",
          dateRealisation: "20/02/2023",
          dateExpiration: "20/02/2033",
          prestataire: "Diagnostiqueurs Associés"
        }
      ],
      edls: [],
      travaux: [
        {
          id: 1,
          type: "Rénovation cuisine",
          statut: "En cours",
          dateDebut: "15/07/2024",
          dateFinPrevue: "30/08/2024",
          prestataire: "Cuisines Modernes",
          cout: 5500
        }
      ]
    },
    {
      id: 4,
      reference: "LOG-2024-004",
      adresse: "8 Boulevard de Strasbourg",
      batiment: "Immeuble Strasbourg",
      porte: "18B",
      ville: "Toulouse",
      codePostal: "31000",
      type: "T4",
      surface: 92,
      nbPieces: 4,
      nbChambres: 3,
      anneeConstruction: 1995,
      etage: 4,
      orientation: "Sud",
      chauffage: "Gaz",
      energie: "D",
      ges: "C",
      prixAcquisition: 285000,
      dateAcquisition: "05/02/2017",
      statut: "En attente EDL",
      observations: "Appartement spacieux, vue dégagée",
      locataire: {
        id: 2,
        nom: "Lambert",
        prenom: "Marie",
        email: "marie.lambert@email.com",
        telephone: "06 23 45 67 89",
        dateEntree: "01/10/2023",
        dateSortie: "30/06/2024",
        caution: 1800,
        loyer: 850,
        garant: "Paul Lambert",
        garantTelephone: "06 87 65 43 21"
      },
      diagnostics: [
        {
          id: 1,
          type: "Amiante",
          statut: "Terminé",
          dateRealisation: "12/03/2022",
          dateExpiration: "12/03/2032",
          prestataire: "Amiante Control"
        },
        {
          id: 2,
          type: "Plomb",
          statut: "À réaliser",
          dateRealisation: "",
          dateExpiration: "15/10/2024",
          prestataire: "À définir"
        }
      ],
      edls: [
        {
          id: 1,
          type: "Sortant",
          statut: "Planifié",
          datePrevue: "28/06/2024",
          dateReelle: null,
          gestionnaire: "Lucie Petit"
        },
        {
          id: 2,
          type: "Entrant",
          statut: "En attente",
          datePrevue: "01/09/2024",
          dateReelle: null,
          gestionnaire: "À définir"
        }
      ],
      travaux: []
    },
    {
      id: 5,
      reference: "LOG-2024-005",
      adresse: "3 Place du Capitole",
      batiment: "Immeuble Capitole",
      porte: "7",
      ville: "Toulouse",
      codePostal: "31000",
      type: "T1",
      surface: 32,
      nbPieces: 1,
      nbChambres: 0,
      anneeConstruction: 2020,
      etage: 5,
      orientation: "Sud",
      chauffage: "Électrique",
      energie: "A",
      ges: "A",
      prixAcquisition: 165000,
      dateAcquisition: "18/09/2021",
      statut: "En attente diagnostic",
      observations: "Appartement neuf, centre ville",
      locataire: {
        id: 3,
        nom: "Bernard",
        prenom: "Thomas",
        email: "thomas.bernard@email.com",
        telephone: "06 34 56 78 90",
        dateEntree: "01/07/2024",
        dateSortie: null,
        caution: 1100,
        loyer: 720,
        garant: "Julie Bernard",
        garantTelephone: "06 76 54 32 10"
      },
      diagnostics: [
        {
          id: 1,
          type: "DPE",
          statut: "En cours",
          dateRealisation: "10/06/2024",
          dateExpiration: "10/06/2034",
          prestataire: "Diagnostiqueurs Associés"
        },
        {
          id: 2,
          type: "Électricité",
          statut: "À réaliser",
          dateRealisation: "",
          dateExpiration: "30/07/2024",
          prestataire: "À définir"
        }
      ],
      edls: [
        {
          id: 1,
          type: "Entrant",
          statut: "Réalisé",
          datePrevue: "01/07/2024",
          dateReelle: "01/07/2024",
          gestionnaire: "Michel Durand"
        }
      ],
      travaux: []
    }
  ]);

  // Filtrer les logements
  const filteredLogements = logements.filter(logement => {
    const matchesSearch = 
      logement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logement.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logement.batiment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (logement.locataire && `${logement.locataire.nom} ${logement.locataire.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'tous' || logement.statut === statusFilter;
    
    const matchesAnneeConstruction = anneeConstructionFilter === 'toutes' || 
      (anneeConstructionFilter === 'avant-2000' && logement.anneeConstruction < 2000) ||
      (anneeConstructionFilter === '2000-2010' && logement.anneeConstruction >= 2000 && logement.anneeConstruction <= 2010) ||
      (anneeConstructionFilter === 'apres-2010' && logement.anneeConstruction > 2010);
    
    const matchesLocataire = locataireFilter === 'tous' || 
      (locataireFilter === 'avec' && logement.locataire !== null) ||
      (locataireFilter === 'sans' && logement.locataire === null);
    
    return matchesSearch && matchesStatus && matchesAnneeConstruction && matchesLocataire;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredLogements.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Ouvrir la modal de détails
  const openModal = (logement: Logement) => {
    setSelectedLogement(logement);
    setIsModalOpen(true);
    setExpandedSections({
      general: true,
      locataire: false,
      diagnostics: false,
      edls: false,
      travaux: false,
      financier: false
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLogement(null);
  };

  // Toggle pour les sections dépliables
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fonctions d'aide pour l'affichage
  const getStatusColor = (status: LogementStatus) => {
    switch(status) {
      case 'Occupé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Libre': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'En travaux': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'En attente EDL': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'En attente diagnostic': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: LogementStatus) => {
    switch(status) {
      case 'Occupé': return <User className="h-4 w-4" />;
      case 'Libre': return <Home className="h-4 w-4" />;
      case 'En travaux': return <Wrench className="h-4 w-4" />;
      case 'En attente EDL': return <FileText className="h-4 w-4" />;
      case 'En attente diagnostic': return <AlertCircle className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getDiagnosticStatusColor = (status: string) => {
    switch(status) {
      case 'Terminé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'En cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'À réaliser': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Expiré': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEDLStatusColor = (status: string) => {
    switch(status) {
      case 'Réalisé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Planifié': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'En attente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Analysé': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTravauxStatusColor = (status: string) => {
    switch(status) {
      case 'Terminé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'En cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Planifié': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Composant Modal pour visualisation avec collapses
  const LogementModal = () => {
    if (!selectedLogement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-800 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                Détails du logement - {selectedLogement.reference}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Section Informations générales avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('general')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Informations générales</h3>
                {expandedSections.general ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.general && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Statut</label>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedLogement.statut)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLogement.statut)}`}>
                        {selectedLogement.statut}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Adresse</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.adresse}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Bâtiment</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.batiment}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Porte</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.porte}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Ville</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.ville} {selectedLogement.codePostal}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Surface</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.surface} m²</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Pièces</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.nbPieces} pièces ({selectedLogement.nbChambres} chambres)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Étage</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.etage !== null ? `${selectedLogement.etage}ème étage` : 'Rez-de-chaussée'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Année construction</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.anneeConstruction}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Orientation</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.orientation}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Chauffage</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.chauffage}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Classe énergie</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.energie}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">GES</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.ges}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Observations</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.observations}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section Informations financières avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('financier')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Informations financières</h3>
                {expandedSections.financier ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.financier && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Prix d&apos;acquisition</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.prixAcquisition.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date d&apos;acquisition</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.dateAcquisition}</p>
                  </div>
                  {selectedLogement.locataire && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Loyer mensuel</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.loyer.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Caution</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.caution.toLocaleString('fr-FR')} €</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Section Locataire avec collapse */}
            {selectedLogement.locataire && (
              <div className="border rounded-lg overflow-hidden">
                <button 
                  className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                  onClick={() => toggleSection('locataire')}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Informations locataire</h3>
                  {expandedSections.locataire ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {expandedSections.locataire && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Nom complet</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.prenom} {selectedLogement.locataire.nom}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Téléphone</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedLogement.locataire.telephone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Email</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {selectedLogement.locataire.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date d&apos;entrée</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.dateEntree}</p>
                    </div>
                    {selectedLogement.locataire.dateSortie && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date de sortie</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.dateSortie}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Garant</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.garant}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Téléphone garant</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedLogement.locataire.garantTelephone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section Diagnostics avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('diagnostics')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Diagnostics</h3>
                {expandedSections.diagnostics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.diagnostics && (
                <div className="p-4">
                  {selectedLogement.diagnostics.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLogement.diagnostics.map((diagnostic) => (
                        <div key={diagnostic.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{diagnostic.type}</div>
                              <div className="text-sm text-gray-500 dark:text-neutral-400">
                                Prestataire: {diagnostic.prestataire}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDiagnosticStatusColor(diagnostic.statut)}`}>
                              {diagnostic.statut}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {diagnostic.dateRealisation && (
                              <div>
                                <span className="text-gray-500 dark:text-neutral-400">Réalisé le: </span>
                                {diagnostic.dateRealisation}
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500 dark:text-neutral-400">Expiration: </span>
                              {diagnostic.dateExpiration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Aucun diagnostic enregistré.</p>
                  )}
                </div>
              )}
            </div>

            {/* Section États des lieux avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('edls')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">États des lieux</h3>
                {expandedSections.edls ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.edls && (
                <div className="p-4">
                  {selectedLogement.edls.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLogement.edls.map((edl) => (
                        <div key={edl.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">EDL {edl.type}</div>
                              <div className="text-sm text-gray-500 dark:text-neutral-400">
                                Gestionnaire: {edl.gestionnaire}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEDLStatusColor(edl.statut)}`}>
                              {edl.statut}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-neutral-400">Date prévue: </span>
                              {edl.datePrevue}
                            </div>
                            {edl.dateReelle && (
                              <div>
                                <span className="text-gray-500 dark:text-neutral-400">Date réelle: </span>
                                {edl.dateReelle}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Aucun état des lieux enregistré.</p>
                  )}
                </div>
              )}
            </div>

            {/* Section Travaux avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('travaux')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Travaux</h3>
                {expandedSections.travaux ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.travaux && (
                <div className="p-4">
                  {selectedLogement.travaux.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLogement.travaux.map((travail) => (
                        <div key={travail.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{travail.type}</div>
                              <div className="text-sm text-gray-500 dark:text-neutral-400">
                                Prestataire: {travail.prestataire}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTravauxStatusColor(travail.statut)}`}>
                              {travail.statut}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-neutral-400">Début: </span>
                              {travail.dateDebut}
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-neutral-400">Fin prévue: </span>
                              {travail.dateFinPrevue}
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-gray-500 dark:text-neutral-400">Coût: </span>
                              {travail.cout.toLocaleString('fr-FR')} €
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Aucun travail enregistré.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Fermer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors">
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Gestion des Logements</h1>
          <p className="text-gray-600 dark:text-neutral-400">Suivi et gestion du parc immobilier</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau logement
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un logement..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LogementStatus | 'tous')}
          >
            <option value="tous">Tous les statuts</option>
            <option value="Occupé">Occupé</option>
            <option value="Libre">Libre</option>
            <option value="En travaux">En travaux</option>
            <option value="En attente EDL">En attente EDL</option>
            <option value="En attente diagnostic">En attente diagnostic</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={anneeConstructionFilter}
            onChange={(e) => setAnneeConstructionFilter(e.target.value)}
          >
            <option value="toutes">Toutes périodes</option>
            <option value="avant-2000">Avant 2000</option>
            <option value="2000-2010">2000 - 2010</option>
            <option value="apres-2010">Après 2010</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={locataireFilter}
            onChange={(e) => setLocataireFilter(e.target.value)}
          >
            <option value="tous">Avec ou sans locataire</option>
            <option value="avec">Avec locataire</option>
            <option value="sans">Sans locataire</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Plus de filtres
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Total</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{logements.length}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Occupés</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {logements.filter(l => l.statut === 'Occupé').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Libres</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {logements.filter(l => l.statut === 'Libre').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">En travaux</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {logements.filter(l => l.statut === 'En travaux').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">En attente</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {logements.filter(l => l.statut === 'En attente EDL' || l.statut === 'En attente diagnostic').length}
          </div>
        </div>
      </div>

      {/* Tableau des logements */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Surface</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Année</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {currentItems.length > 0 ? (
                currentItems.map((logement) => (
                  <tr key={logement.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {logement.reference}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                        <div className="text-sm">
                          {logement.adresse}
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            {logement.ville} {logement.codePostal}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{logement.type}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {logement.nbPieces} pièces
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{logement.surface} m²</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{logement.anneeConstruction}</div>
                    </td>
                    <td className="px-4 py-3">
                      {logement.locataire ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-green-500" />
                          <div className="text-sm">
                            {logement.locataire.prenom} {logement.locataire.nom}
                            <div className="text-xs text-gray-500 dark:text-neutral-400">
                              Depuis {logement.locataire.dateEntree}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-neutral-400">Aucun</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getStatusIcon(logement.statut)}
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(logement.statut)}`}>
                          {logement.statut}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openModal(logement)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                    Aucun logement trouvé avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredLogements.length > 0 && (
          <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredLogements.length)}
                  </span> sur <span className="font-medium">{filteredLogements.length}</span> résultats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {isModalOpen && <LogementModal />}
    </div>
  );
};

export default LogementsPage;