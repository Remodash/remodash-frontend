'use client';

import { useState } from 'react';
import { 
  Search,
  Plus,
  Download,
  Eye,
  Clock,
  CheckCircle,
  FileText,
  Home,
  X,
  Send,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Building,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';

// Types pour les diagnostics
type DiagnosticType = 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites' | 'Audit énergétique';
type DiagnosticStatus = 'Attente validation GT' | 'Diagnostic non réalisé' | 'Diagnostic réalisé';
type GroupingOption = 'aucun' | 'logement' | 'prestataire' | 'statut';
type DelaiStatus = 'normal' | 'en retard';

interface Diagnostic {
  id: number;
  reference: string;
  type: DiagnosticType;
  statut: DiagnosticStatus;
  date_demande: string;
  date_realisation: string | null;
  date_limite: string;
  logement: string;
  batiment: string;
  porte: string;
  prestataire: string;
  prestataire_contact: string;
  rapport: string | null;
  observations: string;
  priorite: 'normale' | 'élevée' | 'urgente';
  delai: DelaiStatus;
  edlReference?: string;
  edlId?: number;
}

// Types pour les états des lieux
type EDLType = 'EDL Entrant' | 'Pré-EDL' | 'EDL Sortant';
type EDLStatus = 'planifié' | 'en attente' | 'réalisé' | 'analysé' | 'en retard' | 'en attente analyse IA';

interface EDLElement {
  id: number;
  nom: string;
  etat: 'bon' | 'moyen' | 'mauvais' | 'à contrôler';
  observations: string;
  photos: number;
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

const DiagnosticsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DiagnosticStatus | 'tous'>('tous');
  const [typeFilter, setTypeFilter] = useState<DiagnosticType | 'tous'>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [selectedEDL, setSelectedEDL] = useState<EDL | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedDiagnostic, setEditedDiagnostic] = useState<Diagnostic | null>(null);
  const [grouping, setGrouping] = useState<GroupingOption>('aucun');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isSendingToRA, setIsSendingToRA] = useState(false);
  const [isSendingToPD, setIsSendingToPD] = useState(false);
  const [newDiagnosticType, setNewDiagnosticType] = useState<DiagnosticType>('DPE');
  const itemsPerPage = 3;

  // Données des EDL avec statuts initiaux modifiés
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
      diagnostics: [
        { 
          id: 1, 
          reference: "DIA-EDL-001-1",
          type: "DPE", 
          statut: "Attente validation GT", 
          date_demande: "15/11/2024", 
          date_realisation: null, 
          date_limite: "30/11/2024",
          logement: "6 SQUARE ESQUIROL, Porte 31081",
          batiment: "6 SQUARE ESQUIROL",
          porte: "31081",
          prestataire: "Diagnostiqueurs Associés",
          prestataire_contact: "01 45 67 89 10",
          rapport: null,
          observations: "Diagnostic à réaliser avant signature du bail",
          priorite: "normale",
          delai: "normal"
        },
        { 
          id: 2, 
          reference: "DIA-EDL-001-2",
          type: "Électricité", 
          statut: "Attente validation GT", 
          date_demande: "15/11/2024", 
          date_realisation: null, 
          date_limite: "30/11/2024",
          logement: "6 SQUARE ESQUIROL, Porte 31081",
          batiment: "6 SQUARE ESQUIROL",
          porte: "31081",
          prestataire: "Élec-Sécurité",
          prestataire_contact: "01 46 72 83 94",
          rapport: null,
          observations: "Vérification de l'installation électrique",
          priorite: "normale",
          delai: "normal"
        }
      ],
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
      diagnostics: [
        { 
          id: 3, 
          reference: "DIA-EDL-002-1",
          type: "Plomb", 
          statut: "Attente validation GT", 
          date_demande: "18/11/2024", 
          date_realisation: null, 
          date_limite: "02/12/2024",
          logement: "6 SQUARE ESQUIROL, Porte 21045",
          batiment: "6 SQUARE ESQUIROL",
          porte: "21045",
          prestataire: "Plomb Experts",
          prestataire_contact: "01 47 61 52 43",
          rapport: null,
          observations: "Bâtiment antérieur à 1949, diagnostic obligatoire",
          priorite: "normale",
          delai: "normal"
        }
      ],
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
      diagnostics: [
        { 
          id: 4, 
          reference: "DIA-EDL-003-1",
          type: "Amiante", 
          statut: "Attente validation GT", 
          date_demande: "20/11/2024", 
          date_realisation: null, 
          date_limite: "05/12/2024",
          logement: "6 SQUARE ESQUIROL, Porte 11022",
          batiment: "6 SQUARE ESQUIROL",
          porte: "11022",
          prestataire: "Amiante Control",
          prestataire_contact: "01 48 53 74 95",
          rapport: null,
          observations: "Immeuble construit en 1995, DTA manquant",
          priorite: "normale",
          delai: "normal"
        }
      ],
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
      statut: "analysé",
      date_prevue: "10/11/2024",
      date_reelle: "12/11/2024",
      logement: "12 AVENUE DE LA RÉPUBLIQUE, Porte 12",
      batiment: "12 AVENUE DE LA RÉPUBLIQUE",
      porte: "12",
      locataire: "Mme Julie Moreau",
      locataire_contact: "06 45 67 89 01",
      gestionnaire: "Michel Durand",
      observations: "Logement en bon état général, quelques traces d'usure normales",
      photos: 18,
      diagnostics: [
        { 
          id: 5, 
          reference: "DIA-EDL-004-1",
          type: "DPE", 
          statut: "Diagnostic non réalisé", 
          date_demande: "10/11/2024", 
          date_realisation: null, 
          date_limite: "20/11/2024",
          logement: "12 AVENUE DE LA RÉPUBLIQUE, Porte 12",
          batiment: "12 AVENUE DE LA RÉPUBLIQUE",
          porte: "12",
          prestataire: "Diagnostiqueurs Associés",
          prestataire_contact: "01 45 67 89 10",
          rapport: null,
          observations: "Logement bien isolé, performance énergétique correcte",
          priorite: "normale",
          delai: "normal"
        },
        { 
          id: 6, 
          reference: "DIA-EDL-004-2",
          type: "Électricité", 
          statut: "Diagnostic réalisé", 
          date_demande: "10/11/2024", 
          date_realisation: "14/11/2024", 
          date_limite: "20/11/2024",
          logement: "12 AVENUE DE LA RÉPUBLIQUE, Porte 12",
          batiment: "12 AVENUE DE LA RÉPUBLIQUE",
          porte: "12",
          prestataire: "Élec-Sécurité",
          prestataire_contact: "01 46 72 83 94",
          rapport: "/rapports/elec-12.pdf",
          observations: "Installation conforme aux normes en vigueur",
          priorite: "normale",
          delai: "normal"
        }
      ],
      rapport: "/rapports/edl-12.pdf",
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
      diagnostics: [
        { 
          id: 7, 
          reference: "DIA-EDL-005-1",
          type: "Gaz", 
          statut: "Attente validation GT", 
          date_demande: "25/11/2024", 
          date_realisation: null, 
          date_limite: "05/12/2024",
          logement: "6 SQUARE ESQUIROL, Porte 41093",
          batiment: "6 SQUARE ESQUIROL",
          porte: "41093",
          prestataire: "Gaz Check",
          prestataire_contact: "01 49 54 76 37",
          rapport: null,
          observations: "Vérification de l'installation gaz",
          priorite: "normale",
          delai: "normal"
        }
      ],
      rapport: null,
      elements: [
        { id: 1, nom: "Toilettes", etat: "bon", observations: "", photos: 0 },
        { id: 2, nom: "Couloir", etat: "moyen", observations: "Peinture écaillée", photos: 0 }
      ]
    }
  ]);

  // Extraire tous les diagnostics des EDL
  const allDiagnostics: Diagnostic[] = edlData.flatMap(edl => 
    edl.diagnostics.map(d => ({
      ...d,
      edlReference: edl.reference,
      edlId: edl.id
    }))
  );

  // Filtrer les diagnostics
  const filteredDiagnostics = allDiagnostics.filter(diagnostic => {
    const matchesSearch = 
      diagnostic.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.logement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.prestataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || diagnostic.statut === statusFilter;
    const matchesType = typeFilter === 'tous' || diagnostic.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Trier les diagnostics par date limite
  const sortedDiagnostics = [...filteredDiagnostics].sort((a, b) => {
    const dateA = new Date(a.date_limite.split('/').reverse().join('-'));
    const dateB = new Date(b.date_limite.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  // Grouper les diagnostics selon l'option sélectionnée
  const groupedDiagnostics = () => {
    if (grouping === 'logement') {
      const groups: Record<string, Diagnostic[]> = {};
      sortedDiagnostics.forEach(diagnostic => {
        const key = diagnostic.batiment;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(diagnostic);
      });
      return groups;
    } else if (grouping === 'prestataire') {
      const groups: Record<string, Diagnostic[]> = {};
      sortedDiagnostics.forEach(diagnostic => {
        const key = diagnostic.prestataire;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(diagnostic);
      });
      return groups;
    } else if (grouping === 'statut') {
      const groups: Record<string, Diagnostic[]> = {};
      sortedDiagnostics.forEach(diagnostic => {
        const key = diagnostic.statut;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(diagnostic);
      });
      return groups;
    } else {
      return { 'Tous les diagnostics': sortedDiagnostics };
    }
  };

  // Pagination
  const totalPages = Math.ceil(sortedDiagnostics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedDiagnostics.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fonctions pour les modales
  const openViewModal = (diagnostic: Diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    
    // Trouver l'EDL associé à ce diagnostic
    const associatedEDL = edlData.find(edl => 
      edl.diagnostics.some(d => d.id === diagnostic.id)
    );
    
    if (associatedEDL) {
      setSelectedEDL(associatedEDL);
    }
    
    setIsViewModalOpen(true);
    // Initialiser toutes les sections comme fermées
    setExpandedSections({
      general: false,
      dates: false,
      location: false,
      provider: false,
      observations: false,
      report: false,
      logement: false,
      diagnostics: true
    });
  };

  const openEditModal = (diagnostic: Diagnostic) => {
    setEditedDiagnostic({...diagnostic});
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedDiagnostic(null);
    setSelectedEDL(null);
    setEditedDiagnostic(null);
    setIsSendingToRA(false);
    setIsSendingToPD(false);
  };

  const handleSaveChanges = () => {
    if (editedDiagnostic) {
      setEdlData(prev => 
        prev.map(edl => ({
          ...edl,
          diagnostics: edl.diagnostics.map(d => 
            d.id === editedDiagnostic.id ? editedDiagnostic : d
          )
        }))
      );
      closeModals();
    }
  };

  // Fonction pour envoyer au Responsable d'Agence
  const handleSendToRA = () => {
    setIsSendingToRA(true);
    
    // Simuler l'envoi au RA pendant 10 secondes
    setTimeout(() => {
      if (selectedEDL && selectedDiagnostic) {
        setEdlData(prev => 
          prev.map(edl => ({
            ...edl,
            diagnostics: edl.diagnostics.map(d => 
              d.id === selectedDiagnostic.id ? { ...d, statut: 'Diagnostic non réalisé' } : d
            )
          }))
        );
        
        setIsSendingToRA(false);
        closeModals();
        alert(`Diagnostic ${selectedDiagnostic.reference} validé par le Responsable d'Agence. Statut mis à jour: Diagnostic non réalisé`);
      }
    }, 10000);
  };

  // Fonction pour envoyer au Prestataire de Diagnostics
  const handleSendToPD = () => {
    setIsSendingToPD(true);
    
    // Simuler l'envoi au PD pendant 10 secondes
    setTimeout(() => {
      if (selectedEDL && selectedDiagnostic) {
        setEdlData(prev => 
          prev.map(edl => ({
            ...edl,
            diagnostics: edl.diagnostics.map(d => 
              d.id === selectedDiagnostic.id ? { 
                ...d, 
                statut: 'Diagnostic réalisé',
                date_realisation: new Date().toLocaleDateString('fr-FR')
              } : d
            )
          }))
        );
        
        setIsSendingToPD(false);
        closeModals();
        alert(`Diagnostic ${selectedDiagnostic.reference} réalisé par le Prestataire. Statut mis à jour: Diagnostic réalisé`);
      }
    }, 10000);
  };

  // Fonction pour ajouter un diagnostic à un EDL
  const addDiagnosticToEDL = () => {
    if (selectedEDL && newDiagnosticType) {
      // Générer un nouvel ID unique
      const allDiagnosticIds = edlData.flatMap(edl => edl.diagnostics.map(d => d.id));
      const newId = Math.max(...allDiagnosticIds, 0) + 1;
      
      const newReference = `DIA-${selectedEDL.reference}-${newId}`;
      
      const newDiagnostic: Diagnostic = {
        id: newId,
        reference: newReference,
        type: newDiagnosticType,
        statut: "Attente validation GT",
        date_demande: new Date().toLocaleDateString('fr-FR'),
        date_realisation: null,
        date_limite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
        logement: selectedEDL.logement,
        batiment: selectedEDL.batiment,
        porte: selectedEDL.porte,
        prestataire: "À définir",
        prestataire_contact: "",
        rapport: null,
        observations: "Nouveau diagnostic à planifier",
        priorite: "normale",
        delai: "normal",
        edlReference: selectedEDL.reference,
        edlId: selectedEDL.id
      };
      
      setEdlData(prev => 
        prev.map(edl => 
          edl.id === selectedEDL.id 
            ? { ...edl, diagnostics: [...edl.diagnostics, newDiagnostic] } 
            : edl
        )
      );
      
      // Mettre à jour le diagnostic sélectionné
      setSelectedDiagnostic(newDiagnostic);
      
      alert(`Diagnostic ${newReference} ajouté avec succès`);
    }
  };

  // Fonction pour supprimer un diagnostic d'un EDL
  const removeDiagnosticFromEDL = (diagnosticId: number) => {
    if (selectedEDL) {
      setEdlData(prev => 
        prev.map(edl => 
          edl.id === selectedEDL.id 
            ? { ...edl, diagnostics: edl.diagnostics.filter(d => d.id !== diagnosticId) } 
            : edl
        )
      );
      
      // Si on supprime le diagnostic actuellement sélectionné, le désélectionner
      if (selectedDiagnostic && selectedDiagnostic.id === diagnosticId) {
        setSelectedDiagnostic(null);
      }
      
      alert("Diagnostic supprimé avec succès");
    }
  };

  // Toggle pour les sections dépliables
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fonctions d'aide pour l'affichage
  const getStatusIcon = (status: DiagnosticStatus) => {
    switch(status) {
      case 'Diagnostic réalisé': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Diagnostic non réalisé': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Attente validation GT': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DiagnosticStatus) => {
    switch(status) {
      case 'Diagnostic réalisé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Diagnostic non réalisé': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Attente validation GT': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: Diagnostic['priorite']) => {
    switch(priority) {
      case 'urgente': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'élevée': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'normale': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDelaiColor = (delai: DelaiStatus) => {
    return delai === 'normal' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  // Composant Modal pour visualisation avec collapses
  const ViewModal = () => {
    if (!selectedDiagnostic || !selectedEDL) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-800 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                Détails du diagnostic - {selectedDiagnostic.reference}
              </h2>
              <button 
                onClick={closeModals} 
                className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Section Informations sur le logement avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('logement')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Informations sur le logement</h3>
                {expandedSections.logement ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.logement && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence EDL</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type EDL</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Bâtiment</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.batiment}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Porte</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.porte}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Locataire</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.locataire}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact locataire</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.locataire_contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Gestionnaire</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedEDL.gestionnaire}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section Diagnostics à réaliser avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('diagnostics')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Diagnostics à réaliser</h3>
                {expandedSections.diagnostics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.diagnostics && (
                <div className="p-4">
                  <div className="mb-4 flex items-center space-x-2">
                    <select
                      value={newDiagnosticType}
                      onChange={(e) => setNewDiagnosticType(e.target.value as DiagnosticType)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    >
                      <option value="DPE">DPE</option>
                      <option value="Amiante">Amiante</option>
                      <option value="Plomb">Plomb (CREP)</option>
                      <option value="Électricité">Électricité</option>
                      <option value="Gaz">Gaz</option>
                      <option value="ERPS">ERPS</option>
                      <option value="Humidité">Humidité</option>
                      <option value="Termites">Termites</option>
                      <option value="Audit énergétique">Audit énergétique</option>
                    </select>
                    <button
                      onClick={addDiagnosticToEDL}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedEDL.diagnostics.map((diagnostic) => (
                      <div key={diagnostic.id} className="border rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{diagnostic.type} - {diagnostic.reference}</div>
                          <div className="text-sm text-gray-500 dark:text-neutral-400">
                            Statut: 
                            <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(diagnostic.statut)}`}>
                              {diagnostic.statut}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedDiagnostic(diagnostic)}
                            className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeDiagnosticFromEDL(diagnostic.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Statut</label>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedDiagnostic.statut)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDiagnostic.statut)}`}>
                        {selectedDiagnostic.statut}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Priorité</label>
                    <span className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedDiagnostic.priorite)}`}>
                      {selectedDiagnostic.priorite}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section Dates avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('dates')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Dates</h3>
                {expandedSections.dates ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.dates && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date demande</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.date_demande}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date limite</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.date_limite}</p>
                  </div>
                  {selectedDiagnostic.date_realisation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date réalisation</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.date_realisation}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Délai</label>
                    <span className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDelaiColor(selectedDiagnostic.delai)}`}>
                      {selectedDiagnostic.delai === 'normal' ? 'Délai normal' : 'En retard'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section Prestataire avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('provider')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Prestataire</h3>
                {expandedSections.provider ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.provider && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Nom</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.prestataire}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDiagnostic.prestataire_contact}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section Observations avec collapse */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                onClick={() => toggleSection('observations')}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Observations</h3>
                {expandedSections.observations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedSections.observations && (
                <div className="p-4">
                  <p className="text-sm text-gray-900 dark:text-neutral-200 bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                    {selectedDiagnostic.observations || "Aucune observation"}
                  </p>
                </div>
              )}
            </div>

            {/* Section Rapport avec collapse */}
            {selectedDiagnostic.rapport && (
              <div className="border rounded-lg overflow-hidden">
                <button 
                  className="w-full p-4 bg-gray-50 dark:bg-neutral-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                  onClick={() => toggleSection('report')}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Rapport</h3>
                  {expandedSections.report ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {expandedSections.report && (
                  <div className="p-4">
                    <a 
                      href={selectedDiagnostic.rapport} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le rapport complet
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
            <button
              onClick={closeModals}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Fermer
            </button>
            
            {selectedDiagnostic.statut === 'Attente validation GT' && (
              <button
                onClick={handleSendToRA}
                disabled={isSendingToRA}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingToRA ? (
                  <>
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Envoyer au RA pour validation
                  </>
                )}
              </button>
            )}
            
            {selectedDiagnostic.statut === 'Diagnostic non réalisé' && (
              <button
                onClick={handleSendToPD}
                disabled={isSendingToPD}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingToPD ? (
                  <>
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Envoyer au Prestataire de diagnostics
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour afficher le tableau des diagnostics
  const renderDiagnosticsTable = (diagnostics: Diagnostic[]) => {
    return (
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-neutral-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date limite</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Délai</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {diagnostics.length > 0 ? (
            diagnostics.map((diagnostic) => (
              <tr key={diagnostic.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-blue-600 dark:text-blue-400">
                    {diagnostic.reference}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{diagnostic.type}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                    <div className="text-sm">
                      {diagnostic.batiment}
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        Porte {diagnostic.porte}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{diagnostic.prestataire}</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">
                    {diagnostic.prestataire_contact}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{diagnostic.date_limite}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDelaiColor(diagnostic.delai)}`}>
                    {diagnostic.delai === 'normal' ? 'Normal' : 'Retard'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {getStatusIcon(diagnostic.statut)}
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnostic.statut)}`}>
                      {diagnostic.statut}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {diagnostic.rapport && (
                      <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => openViewModal(diagnostic)}
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
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                Aucun diagnostic trouvé avec les filtres actuels.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Gestion des Diagnostics</h1>
          <p className="text-gray-600 dark:text-neutral-400">Suivi et planification des diagnostics techniques</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau diagnostic
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un diagnostic..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DiagnosticStatus | 'tous')}
          >
            <option value="tous">Tous les statuts</option>
            <option value="Attente validation GT">Attente validation GT</option>
            <option value="Diagnostic non réalisé">Diagnostic non réalisé</option>
            <option value="Diagnostic réalisé">Diagnostic réalisé</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DiagnosticType | 'tous')}
          >
            <option value="tous">Tous les types</option>
            <option value="DPE">DPE</option>
            <option value="Amiante">Amiante</option>
            <option value="Plomb">Plomb (CREP)</option>
            <option value="Électricité">Électricité</option>
            <option value="Gaz">Gaz</option>
            <option value="ERPS">ERPS</option>
            <option value="Humidité">Humidité</option>
            <option value="Termites">Termites</option>
            <option value="Audit énergétique">Audit énergétique</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={grouping}
            onChange={(e) => setGrouping(e.target.value as GroupingOption)}
          >
            <option value="aucun">Aucun regroupement</option>
            <option value="logement">Regrouper par logement</option>
            <option value="prestataire">Regrouper par prestataire</option>
            <option value="statut">Regrouper par statut</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Total</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{allDiagnostics.length}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Attente validation GT</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {allDiagnostics.filter(d => d.statut === 'Attente validation GT').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Non réalisés</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {allDiagnostics.filter(d => d.statut === 'Diagnostic non réalisé').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Réalisés</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {allDiagnostics.filter(d => d.statut === 'Diagnostic réalisé').length}
          </div>
        </div>
      </div>

      {/* Tableau des diagnostics */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {grouping === 'aucun' ? (
            renderDiagnosticsTable(currentItems)
          ) : (
            Object.entries(groupedDiagnostics()).map(([groupName, diagnostics]) => (
              <div key={groupName} className="border-b border-gray-200 dark:border-neutral-700 last:border-b-0">
                <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 flex items-center">
                  {grouping === 'logement' ? (
                    <Building className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                  ) : grouping === 'prestataire' ? (
                    <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                  ) : (
                    <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                  )}
                  <span className="font-medium text-gray-700 dark:text-neutral-300">
                    {groupName} ({diagnostics.length} diagnostic{diagnostics.length > 1 ? 's' : ''})
                  </span>
                </div>
                {renderDiagnosticsTable(diagnostics)}
              </div>
            ))
          )}
        </div>
        
        {/* Pagination (uniquement si aucun regroupement) */}
        {grouping === 'aucun' && sortedDiagnostics.length > 0 && (
          <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, sortedDiagnostics.length)}
                  </span> sur <span className="font-medium">{sortedDiagnostics.length}</span> résultats
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

      {/* Modales */}
      {isViewModalOpen && <ViewModal />}
    </div>
  );
};

export default DiagnosticsPage;