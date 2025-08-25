'use client';

import { useState } from 'react';
import { 
  Search,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Brain,
  Download,
  Check,
  Camera,
  FileText,
  AlertCircle
} from 'lucide-react';

// Types pour les états des lieux
type EDLType = 'EDL Entrant' | 'Pré-EDL' | 'EDL Sortant';
type EDLStatus = 'planifié' | 'en attente' | 'réalisé' | 'analysé' | 'en retard' | 'en attente analyse IA';

interface Diagnostic {
  id: number;
  type: string;
  statut: 'à réaliser' | 'en cours' | 'terminé';
  date_limite: string;
}

interface EDL {
  id: number;
  reference: string;
  type: EDLType;
  statut: EDLStatus;
  date_prevue: string;
  date_reelle: string | null;
  logement: string;
  batiment: string;
  porte: string;
  locataire: string;
  locataire_contact: string;
  gestionnaire: string;
  observations: string;
  photos: number;
  diagnostics: Diagnostic[];
  rapport: string | null;
  elements: EDLElement[];
}

interface EDLElement {
  id: number;
  nom: string;
  etat: 'bon' | 'moyen' | 'mauvais' | 'à contrôler';
  observations: string;
  photos: number;
}

const EDLPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<EDLType | 'tous'>('tous');
  const [statusFilter, setStatusFilter] = useState<EDLStatus | 'tous'>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEDL, setSelectedEDL] = useState<EDL | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const itemsPerPage = 3;

  // Données des états des lieux - tous initialisés comme EDL Entrant
  const [edlData, setEdlData] = useState<EDL[]>([
    {
      id: 1,
      reference: "EDL-2024-001",
      type: "EDL Entrant",
      statut: "en attente",
      date_prevue: "15/11/2024",
      date_reelle: null,
      logement: "6 SQUARE ESQUIROL, Porte 31081",
      batiment: "6 SQUARE ESQUIROL",
      porte: "31081",
      locataire: "M. Jean Dupont",
      locataire_contact: "06 12 34 56 78",
      gestionnaire: "Sophie Martin",
      observations: "",
      photos: 0,
      diagnostics: [],
      rapport: null,
      elements: [
        { id: 1, nom: "Sol séjour", etat: "bon", observations: "", photos: 0 },
        { id: 2, nom: "Murs séjour", etat: "à contrôler", observations: "Trace d'humidité", photos: 0 },
        { id: 3, nom: "Plafond cuisine", etat: "bon", observations: "", photos: 0 }
      ]
    },
    {
      id: 2,
      reference: "EDL-2024-002",
      type: "EDL Entrant",
      statut: "en attente",
      date_prevue: "18/11/2024",
      date_reelle: null,
      logement: "6 SQUARE ESQUIROL, Porte 21045",
      batiment: "6 SQUARE ESQUIROL",
      porte: "21045",
      locataire: "Mme Marie Lambert",
      locataire_contact: "06 23 45 67 89",
      gestionnaire: "Pierre Dubois",
      observations: "",
      photos: 0,
      diagnostics: [],
      rapport: null,
      elements: [
        { id: 1, nom: "Porte entrée", etat: "mauvais", observations: "Serrures à changer", photos: 0 },
        { id: 2, nom: "Fenêtres salon", etat: "bon", observations: "", photos: 0 }
      ]
    },
    {
      id: 3,
      reference: "EDL-2024-003",
      type: "EDL Entrant",
      statut: "en attente",
      date_prevue: "20/11/2024",
      date_reelle: null,
      logement: "6 SQUARE ESQUIROL, Porte 11022",
      batiment: "6 SQUARE ESQUIROL",
      porte: "11022",
      locataire: "M. Thomas Bernard",
      locataire_contact: "06 34 56 78 90",
      gestionnaire: "Lucie Petit",
      observations: "",
      photos: 0,
      diagnostics: [],
      rapport: null,
      elements: [
        { id: 1, nom: "Salle de bain", etat: "moyen", observations: "Joint à refaire", photos: 0 },
        { id: 2, nom: "Cuisine", etat: "bon", observations: "", photos: 0 }
      ]
    },
    {
      id: 4,
      reference: "EDL-2024-004",
      type: "EDL Entrant",
      statut: "en attente",
      date_prevue: "10/11/2024",
      date_reelle: null,
      logement: "12 AVENUE DE LA RÉPUBLIQUE, Porte 12",
      batiment: "12 AVENUE DE LA RÉPUBLIQUE",
      porte: "12",
      locataire: "Mme Julie Moreau",
      locataire_contact: "06 45 67 89 01",
      gestionnaire: "Michel Durand",
      observations: "",
      photos: 0,
      diagnostics: [],
      rapport: null,
      elements: [
        { id: 1, nom: "Chambre principale", etat: "bon", observations: "", photos: 0 },
        { id: 2, nom: "Balcon", etat: "à contrôler", observations: "Garde-corps à vérifier", photos: 0 }
      ]
    },
    {
      id: 5,
      reference: "EDL-2024-005",
      type: "EDL Entrant",
      statut: "en attente",
      date_prevue: "25/11/2024",
      date_reelle: null,
      logement: "6 SQUARE ESQUIROL, Porte 41093",
      batiment: "6 SQUARE ESQUIROL",
      porte: "41093",
      locataire: "M. David Leroy",
      locataire_contact: "06 56 78 90 12",
      gestionnaire: "Céline Roux",
      observations: "",
      photos: 0,
      diagnostics: [],
      rapport: null,
      elements: [
        { id: 1, nom: "Toilettes", etat: "bon", observations: "", photos: 0 },
        { id: 2, nom: "Couloir", etat: "moyen", observations: "Peinture écaillée", photos: 0 }
      ]
    }
  ]);

  // Filtrer les EDL
  const filteredEDL = edlData.filter(edl => {
    const matchesSearch = 
      edl.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edl.logement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edl.locataire.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'tous' || edl.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' || edl.statut === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEDL.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredEDL.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fonctions pour les modales
  const openViewModal = (edl: EDL) => {
    setSelectedEDL(edl);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setSelectedEDL(null);
    setIsAnalyzing(false);
  };

  // Fonction pour valider un EDL selon le workflow
  const handleValidateEDL = () => {
    if (!selectedEDL) return;
    
    let updatedEDL: EDL;
    
    if (selectedEDL.type === 'EDL Entrant') {
      // EDL Entrant → Pré-EDL
      updatedEDL = {
        ...selectedEDL,
        type: 'Pré-EDL',
        statut: 'en attente',
        date_reelle: new Date().toLocaleDateString('fr-FR'),
        // Ajout d'éléments spécifiques au Pré-EDL
        elements: selectedEDL.elements.map(el => ({
          ...el,
          etat: el.etat === 'à contrôler' ? 'bon' : el.etat,
          observations: el.etat === 'à contrôler' ? 'Contrôle effectué - OK' : el.observations
        }))
      };
    } else if (selectedEDL.type === 'Pré-EDL') {
      // Pré-EDL → EDL Sortant
      updatedEDL = {
        ...selectedEDL,
        type: 'EDL Sortant',
        statut: 'en attente',
        date_reelle: new Date().toLocaleDateString('fr-FR'),
        // Ajout d'observations pour l'EDL Sortant
        observations: "État des lieux de sortie programmé"
      };
    } else if (selectedEDL.type === 'EDL Sortant') {
      // EDL Sortant → En attente analyse IA
      updatedEDL = {
        ...selectedEDL,
        statut: 'en attente analyse IA',
        date_reelle: new Date().toLocaleDateString('fr-FR'),
        // Prise de photos pour l'analyse IA
        photos: 15
      };
    } else {
      return; // Type non reconnu
    }
    
    // Mise à jour des données
    setEdlData(prev => 
      prev.map(e => 
        e.id === selectedEDL.id ? updatedEDL : e
      )
    );
    
    // Mise à jour de l'EDL sélectionné
    setSelectedEDL(updatedEDL);
    
    closeModals();
  };

  // Fonction pour lancer l'analyse IA
  const handleAnalyzeIA = () => {
    if (!selectedEDL) return;
    
    setIsAnalyzing(true);
    
    // Simulation de l'analyse IA (2 secondes)
    setTimeout(() => {
      // Mise à jour du statut après analyse avec ajout de diagnostics
      const updatedEDL: EDL = {
        ...selectedEDL,
        statut: 'analysé',
        observations: "Logement en bon état général, quelques traces d'usure normales",
        photos: 18,
        diagnostics: [
          { id: 1, type: "DPE", statut: "à réaliser", date_limite: "20/12/2024" },
          { id: 2, type: "Électricité", statut: "à réaliser", date_limite: "20/12/2024" },
          { id: 3, type: "Plomb", statut: "à réaliser", date_limite: "20/12/2024" }
        ],
        rapport: "/rapports/edl-" + selectedEDL.porte + ".pdf",
        // Mise à jour des éléments après analyse IA
        elements: selectedEDL.elements.map(el => ({
          ...el,
          etat: el.etat === 'moyen' ? 'bon' : el.etat,
          observations: el.etat === 'moyen' ? 'Usure normale constatée' : el.observations
        }))
      };
      
      setEdlData(prev => 
        prev.map(e => e.id === selectedEDL.id ? updatedEDL : e)
      );
      
      setSelectedEDL(updatedEDL);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Fonctions d'aide pour l'affichage
  const getStatusIcon = (status: EDLStatus) => {
    switch(status) {
      case 'analysé': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'réalisé': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'en attente': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'planifié': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'en retard': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'en attente analyse IA': return <Brain className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: EDLStatus) => {
    switch(status) {
      case 'analysé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'réalisé': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'en attente': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'planifié': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'en retard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'en attente analyse IA': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: EDLType) => {
    switch(type) {
      case 'EDL Entrant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pré-EDL': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'EDL Sortant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDiagnosticStatusColor = (status: Diagnostic['statut']) => {
    switch(status) {
      case 'terminé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'à réaliser': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getElementEtatColor = (etat: string) => {
    switch(etat) {
      case 'bon': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moyen': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'mauvais': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'à contrôler': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Composant Modal pour visualisation
  const ViewModal = () => {
    if (!selectedEDL) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                Détails de l&apos;État des Lieux - {selectedEDL.reference}
              </h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Informations générales</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type</label>
                    <span className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedEDL.type)}`}>
                      {selectedEDL.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Statut</label>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedEDL.statut)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEDL.statut)}`}>
                        {selectedEDL.statut}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date prévue</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.date_prevue}</p>
                  </div>
                  {selectedEDL.date_reelle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date réelle</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.date_reelle}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Localisation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Bâtiment</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.batiment}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Porte</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.porte}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Logement</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.logement}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Photos</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200 flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      {selectedEDL.photos} photo(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personnes concernées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Locataire</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Nom</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.locataire}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.locataire_contact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Gestionnaire</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Nom</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.gestionnaire}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ÉLÉMENTS SPÉCIFIQUES PAR TYPE D'EDL */}
            
            {/* Éléments pour EDL Entrant */}
            {selectedEDL.type === 'EDL Entrant' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Éléments à contrôler (EDL Entrant)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedEDL.elements.map((element) => (
                    <div key={element.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200">{element.nom}</h4>
                          {element.observations && (
                            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{element.observations}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getElementEtatColor(element.etat)}`}>
                          {element.etat}
                        </span>
                      </div>
                      {element.photos > 0 && (
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-neutral-400">
                          <Camera className="h-3 w-3 mr-1" />
                          {element.photos} photo(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Ces éléments doivent être contrôlés lors de l&apos;état des lieux entrant.
                </p>
              </div>
            )}

            {/* Éléments pour Pré-EDL */}
            {selectedEDL.type === 'Pré-EDL' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-500" />
                  Éléments vérifiés (Pré-EDL)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedEDL.elements.map((element) => (
                    <div key={element.id} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200">{element.nom}</h4>
                          {element.observations && (
                            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{element.observations}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getElementEtatColor(element.etat)}`}>
                          {element.etat}
                        </span>
                      </div>
                      {element.photos > 0 && (
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-neutral-400">
                          <Camera className="h-3 w-3 mr-1" />
                          {element.photos} photo(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Ces éléments ont été vérifiés lors du pré-EDL.
                </p>
              </div>
            )}

            {/* Éléments pour EDL Sortant */}
            {selectedEDL.type === 'EDL Sortant' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Éléments contrôlés (EDL Sortant)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedEDL.elements.map((element) => (
                    <div key={element.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200">{element.nom}</h4>
                          {element.observations && (
                            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{element.observations}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getElementEtatColor(element.etat)}`}>
                          {element.etat}
                        </span>
                      </div>
                      {element.photos > 0 && (
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-neutral-400">
                          <Camera className="h-3 w-3 mr-1" />
                          {element.photos} photo(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Ces éléments ont été contrôlés lors de l&apos;état des lieux sortant.
                </p>
              </div>
            )}

            {/* Diagnostics - Afficher seulement pour EDL analysé */}
            {selectedEDL.statut === 'analysé' && selectedEDL.diagnostics.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Diagnostics à effectuer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEDL.diagnostics.map((diagnostic) => (
                    <div key={diagnostic.id} className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200">{diagnostic.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">Date limite: {diagnostic.date_limite}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDiagnosticStatusColor(diagnostic.statut)}`}>
                          {diagnostic.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observations générales */}
            {selectedEDL.observations && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Observations générales</h3>
                <p className="text-sm text-gray-900 dark:text-neutral-200 bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                  {selectedEDL.observations}
                </p>
              </div>
            )}

            {/* Rapport */}
            {selectedEDL.rapport && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Rapport</h3>
                <a href={selectedEDL.rapport} className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le rapport complet
                </a>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-between">
            <button
              onClick={closeModals}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
            
            <div className="flex space-x-2">
              {/* Bouton Valider pour EDL Entrant et Pré-EDL */}
              {(selectedEDL.type === 'EDL Entrant' || selectedEDL.type === 'Pré-EDL' || 
                (selectedEDL.type === 'EDL Sortant' && selectedEDL.statut === 'en attente')) && (
                <button
                  onClick={handleValidateEDL}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Valider
                </button>
              )}
              
              {/* Bouton Analyse IA pour EDL en attente d'analyse IA */}
              {selectedEDL.statut === 'en attente analyse IA' && (
                <button
                  onClick={handleAnalyzeIA}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Lancer l&apos;analyse IA
                    </>
                  )}
                </button>
              )}
            </div>
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Gestion des États des Lieux</h1>
          <p className="text-gray-600 dark:text-neutral-400">Suivi des états des lieux entrants, pré-EDL et sortants</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel EDL
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un EDL..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EDLType | 'tous')}
          >
            <option value="tous">Tous les types</option>
            <option value="EDL Entrant">EDL Entrant</option>
            <option value="Pré-EDL">Pré-EDL</option>
            <option value="EDL Sortant">EDL Sortant</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EDLStatus | 'tous')}
          >
            <option value="tous">Tous les statuts</option>
            <option value="planifié">Planifié</option>
            <option value="en attente">En attente</option>
            <option value="réalisé">Réalisé</option>
            <option value="en attente analyse IA">En attente analyse IA</option>
            <option value="analysé">Analysé</option>
            <option value="en retard">En retard</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Total</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{edlData.length}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">EDL Entrants</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {edlData.filter(e => e.type === 'EDL Entrant').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Pré-EDL</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {edlData.filter(e => e.type === 'Pré-EDL').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">EDL Sortants</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {edlData.filter(e => e.type === 'EDL Sortant').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">À analyser</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {edlData.filter(e => e.statut !== 'analysé').length}
          </div>
        </div>
      </div>

      {/* Tableau des EDL */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date prévue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {currentItems.length > 0 ? (
                currentItems.map((edl) => (
                  <tr key={edl.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {edl.reference}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(edl.type)}`}>
                        {edl.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                        <div className="text-sm">
                          {edl.batiment}
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            Porte {edl.porte}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                        <div className="text-sm">
                          {edl.locataire}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{edl.date_prevue}</div>
                      {edl.date_reelle && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Réalisé: {edl.date_reelle}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getStatusIcon(edl.statut)}
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(edl.statut)}`}>
                          {edl.statut}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {edl.rapport && (
                          <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => openViewModal(edl)}
                          className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                    Aucun état des lieux trouvé avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredEDL.length > 0 && (
          <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredEDL.length)}
                  </span> sur <span className="font-medium">{filteredEDL.length}</span> résultats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale */}
      {isViewModalOpen && <ViewModal />}
    </div>
  );
};

export default EDLPage;