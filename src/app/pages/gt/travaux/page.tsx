'use client';

import { useState} from 'react';
import { 
  Search,
  Plus,
  Eye,
  Edit,
  Calendar,
  Clock,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  UserCog,
  Building,
  ClipboardCheck,
  CheckSquare,
  Square,
  Play
} from 'lucide-react';

// Types basés sur le cahier des charges
type TravauxType = 'remise_etat' | 'gros_entretien' | 'nettoyage' | 'diagnostic';
type TravauxStatus = 'attente_validation_gt' | 'attente_validation_ra' | 'planifié' | 'en_cours' | 'reception_gardien';
type PrioriteType = 'normale' | 'élevée' | 'urgente';

interface Tache {
  id: number;
  description: string;
  terminee: boolean;
}

interface BonTravaux {
  id: number;
  reference: string;
  type_travaux: TravauxType;
  statut: TravauxStatus;
  date_creation: string;
  date_debut: string | null;
  date_fin_prevue: string | null;
  date_fin_reelle: string | null;
  logement: {
    id: number;
    adresse: string;
    batiment: string;
    porte: string;
    surface: number;
    type: string;
  };
  prestataire: {
    id: number;
    nom: string;
    contact: string;
    specialite: string;
  };
  description: string;
  cout_estime: number;
  cout_reel: number;
  priorite: PrioriteType;
  taches: Tache[];
  diagnostics_requis: string[];
  refacturable_locataire: boolean;
  montant_refacturable: number;
  delai_contractuel: number;
  penalites_retard: number;
}

const TravauxPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TravauxStatus | 'tous'>('tous');
  const [typeFilter, setTypeFilter] = useState<TravauxType | 'tous'>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTravaux, setSelectedTravaux] = useState<BonTravaux | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTravaux, setEditedTravaux] = useState<BonTravaux | null>(null);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const itemsPerPage = 5;

  // Données des travaux basées sur le processus du cahier des charges
  const [travauxData, setTravauxData] = useState<BonTravaux[]>([
    {
      id: 1,
      reference: "BT-2024-001",
      type_travaux: "remise_etat",
      statut: "attente_validation_gt",
      date_creation: "15/11/2024",
      date_debut: null,
      date_fin_prevue: null,
      date_fin_reelle: null,
      logement: {
        id: 31081,
        adresse: "6 SQUARE ESQUIROL",
        batiment: "Bâtiment A",
        porte: "31081",
        surface: 65,
        type: "T3"
      },
      prestataire: {
        id: 1,
        nom: "Multi Services BTP",
        contact: "01 45 67 89 10",
        specialite: "Rénovation complète"
      },
      description: "Remise en état complète après départ du locataire : peinture, sols, électricité, plomberie",
      cout_estime: 3500,
      cout_reel: 0,
      priorite: "élevée",
      taches: [
        { id: 1, description: "Préparation des surfaces", terminee: false },
        { id: 2, description: "Travaux d'électricité", terminee: false },
        { id: 3, description: "Travaux de plomberie", terminee: false },
        { id: 4, description: "Peinture", terminee: false }
      ],
      diagnostics_requis: ["DPE", "Électricité", "Plomb"],
      refacturable_locataire: true,
      montant_refacturable: 450,
      delai_contractuel: 7,
      penalites_retard: 50
    },
    {
      id: 2,
      reference: "BT-2024-002",
      type_travaux: "diagnostic",
      statut: "attente_validation_gt",
      date_creation: "10/11/2024",
      date_debut: null,
      date_fin_prevue: null,
      date_fin_reelle: null,
      logement: {
        id: 21045,
        adresse: "6 SQUARE ESQUIROL",
        batiment: "Bâtiment B",
        porte: "21045",
        surface: 45,
        type: "T2"
      },
      prestataire: {
        id: 2,
        nom: "Diagnostics Pro",
        contact: "01 46 72 83 94",
        specialite: "Diagnostics immobiliers"
      },
      description: "Diagnostics obligatoires après départ locataire",
      cout_estime: 450,
      cout_reel: 0,
      priorite: "normale",
      taches: [
        { id: 1, description: "Diagnostic DPE", terminee: false },
        { id: 2, description: "Diagnostic électricité", terminee: false },
        { id: 3, description: "Diagnostic plomb", terminee: false }
      ],
      diagnostics_requis: ["DPE", "Électricité", "Plomb"],
      refacturable_locataire: false,
      montant_refacturable: 0,
      delai_contractuel: 1,
      penalites_retard: 100
    },
    {
      id: 3,
      reference: "BT-2024-003",
      type_travaux: "gros_entretien",
      statut: "attente_validation_gt",
      date_creation: "20/11/2024",
      date_debut: null,
      date_fin_prevue: null,
      date_fin_reelle: null,
      logement: {
        id: 11022,
        adresse: "6 SQUARE ESQUIROL",
        batiment: "Bâtiment C",
        porte: "11022",
        surface: 75,
        type: "T4"
      },
      prestataire: {
        id: 3,
        nom: "Chauffage Pro",
        contact: "01 47 61 52 43",
        specialite: "Installation chauffage"
      },
      description: "Remplacement de la chaudière vétuste",
      cout_estime: 2800,
      cout_reel: 0,
      priorite: "élevée",
      taches: [
        { id: 1, description: "Démontage ancienne chaudière", terminee: false },
        { id: 2, description: "Installation nouvelle chaudière", terminee: false },
        { id: 3, description: "Mise en service et tests", terminee: false }
      ],
      diagnostics_requis: ["Gaz"],
      refacturable_locataire: false,
      montant_refacturable: 0,
      delai_contractuel: 3,
      penalites_retard: 150
    }
  ]);

  // Filtrer les travaux
  const filteredTravaux = travauxData.filter(travaux => {
    const matchesSearch = 
      travaux.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travaux.logement.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travaux.prestataire.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || travaux.statut === statusFilter;
    const matchesType = typeFilter === 'tous' || travaux.type_travaux === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTravaux.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTravaux.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculer la progression
  const calculateProgress = (travaux: BonTravaux) => {
    if (travaux.statut === 'reception_gardien') return 100;
    if (travaux.statut !== 'en_cours') return 0;
    
    const totalTasks = travaux.taches.length;
    if (totalTasks === 0) return 0;
    
    const completedTasks = travaux.taches.filter(t => t.terminee).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Fonctions pour les modales
  const openViewModal = (travaux: BonTravaux) => {
    setSelectedTravaux(travaux);
    setIsViewModalOpen(true);
  };

  const openEditModal = (travaux: BonTravaux) => {
    setEditedTravaux({...travaux});
    setIsEditModalOpen(true);
    setValidationMessage('');
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTravaux(null);
    setEditedTravaux(null);
    setNewTaskDescription('');
    setValidationMessage('');
  };

 

  const handleSendToRA = () => {
    if (editedTravaux) {
      const updatedTravaux = {...editedTravaux, statut: 'attente_validation_ra' as TravauxStatus};
      setTravauxData(prev => 
        prev.map(t => t.id === updatedTravaux.id ? updatedTravaux : t)
      );
      alert(`Bon de Travaux ${editedTravaux.reference} envoyé au Responsable d'Agence pour validation`);
      closeModals();
    }
  };

  const simulateRAValidation = () => {
    if (editedTravaux) {
      setValidationMessage("En attente de validation par le Responsable d'Agence...");
      
      setTimeout(() => {
        const updatedTravaux = {
          ...editedTravaux, 
          statut: 'planifié' as TravauxStatus,
          date_debut: new Date().toLocaleDateString('fr-FR'),
          date_fin_prevue: new Date(Date.now() + editedTravaux.delai_contractuel * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
        };
        
        setTravauxData(prev => 
          prev.map(t => t.id === updatedTravaux.id ? updatedTravaux : t)
        );
        
        setValidationMessage("Le Responsable d'Agence a validé le bon de travaux. Statut mis à jour: Planifié");
        
        setTimeout(() => {
          closeModals();
        }, 2000);
      }, 10000);
    }
  };

  const handleStartTravaux = () => {
    if (editedTravaux) {
      const updatedTravaux = {...editedTravaux, statut: 'en_cours' as TravauxStatus};
      setTravauxData(prev => 
        prev.map(t => t.id === updatedTravaux.id ? updatedTravaux : t)
      );
      closeModals();
    }
  };

  const handleReceptionGardien = () => {
    if (editedTravaux) {
      // Marquer toutes les tâches comme terminées
      const updatedTaches = editedTravaux.taches.map(tache => ({...tache, terminee: true}));
      const updatedTravaux = {
        ...editedTravaux, 
        statut: 'reception_gardien' as TravauxStatus,
        taches: updatedTaches,
        date_fin_reelle: new Date().toLocaleDateString('fr-FR')
      };
      
      setTravauxData(prev => 
        prev.map(t => t.id === updatedTravaux.id ? updatedTravaux : t)
      );
      closeModals();
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    if (editedTravaux) {
      const updatedTaches = editedTravaux.taches.map(tache => 
        tache.id === taskId ? {...tache, terminee: !tache.terminee} : tache
      );
      setEditedTravaux({...editedTravaux, taches: updatedTaches});
    }
  };

  const addNewTask = () => {
    if (editedTravaux && newTaskDescription.trim()) {
      const newTask: Tache = {
        id: Math.max(...editedTravaux.taches.map(t => t.id), 0) + 1,
        description: newTaskDescription.trim(),
        terminee: false
      };
      
      setEditedTravaux({
        ...editedTravaux, 
        taches: [...editedTravaux.taches, newTask]
      });
      
      setNewTaskDescription('');
    }
  };

  const deleteTask = (taskId: number) => {
    if (editedTravaux) {
      const updatedTaches = editedTravaux.taches.filter(tache => tache.id !== taskId);
      setEditedTravaux({...editedTravaux, taches: updatedTaches});
    }
  };

  // Fonctions d'aide pour l'affichage
  const getStatusIcon = (status: TravauxStatus) => {
    switch(status) {
      case 'en_cours': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planifié': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'attente_validation_ra': return <UserCog className="h-4 w-4 text-purple-500" />;
      case 'attente_validation_gt': return <UserCheck className="h-4 w-4 text-indigo-500" />;
      case 'reception_gardien': return <ClipboardCheck className="h-4 w-4 text-teal-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: TravauxStatus) => {
    switch(status) {
      case 'en_cours': return 'En cours';
      case 'planifié': return 'Planifié';
      case 'attente_validation_ra': return 'Attente validation RA';
      case 'attente_validation_gt': return 'Attente validation GT';
      case 'reception_gardien': return 'Réception gardien';
      default: return status;
    }
  };

  const getStatusColor = (status: TravauxStatus) => {
    switch(status) {
      case 'en_cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planifié': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'attente_validation_ra': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'attente_validation_gt': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'reception_gardien': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeLabel = (type: TravauxType) => {
    switch(type) {
      case 'remise_etat': return 'Remise en état';
      case 'gros_entretien': return 'Gros entretien';
      case 'nettoyage': return 'Nettoyage';
      case 'diagnostic': return 'Diagnostic';
      default: return type;
    }
  };

  // Composant Modal pour visualisation
  const ViewModal = () => {
    if (!selectedTravaux) return null;

    const progress = calculateProgress(selectedTravaux);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                Détails du Bon de Travaux - {selectedTravaux.reference}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence BT</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type de travaux</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{getTypeLabel(selectedTravaux.type_travaux)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Statut</label>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedTravaux.statut)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-neutral-200">{getStatusLabel(selectedTravaux.statut)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Priorité</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.priorite}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date création</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.date_creation}</p>
                  </div>
                  {selectedTravaux.date_debut && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date début</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.date_debut}</p>
                    </div>
                  )}
                  {selectedTravaux.date_fin_prevue && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date fin prévue</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.date_fin_prevue}</p>
                    </div>
                  )}
                  {selectedTravaux.date_fin_reelle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Date fin réelle</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.date_fin_reelle}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Localisation et prestataire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Localisation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Adresse</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.logement.adresse}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Bâtiment</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.logement.batiment}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Porte</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.logement.porte}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type et surface</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.logement.type} - {selectedTravaux.logement.surface} m²</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Prestataire</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Nom</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.prestataire.nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.prestataire.contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Spécialité</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.prestataire.specialite}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget et informations financières */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Budget et coûts</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Coût estimé</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.cout_estime} €</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Coût réel</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.cout_reel} €</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Refacturable locataire</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">
                      {selectedTravaux.refacturable_locataire ? `Oui (${selectedTravaux.montant_refacturable} €)` : 'Non'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Délais et pénalités</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Délai contractuel</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.delai_contractuel} jours</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Pénalités de retard</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.penalites_retard} € / jour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostics requis */}
            {selectedTravaux.diagnostics_requis.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Diagnostics requis</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTravaux.diagnostics_requis.map((diagnostic, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200">
                      {diagnostic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Description des travaux</h3>
              <p className="text-sm text-gray-900 dark:text-neutral-200">{selectedTravaux.description}</p>
            </div>

            {/* Infographie d'évolution */}
            {selectedTravaux.taches.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Tâches à réaliser</h3>
                
                {/* Barre de progression globale */}
                {selectedTravaux.statut === 'en_cours' || selectedTravaux.statut === 'reception_gardien' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression globale</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    La progression sera disponible lorsque les travaux seront en cours
                  </div>
                )}

                {/* Détails des tâches */}
                <div className="space-y-3 mt-4">
                  {selectedTravaux.taches.map((tache) => (
                    <div key={tache.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-neutral-700">
                      <div className="flex items-center">
                        {tache.terminee ? (
                          <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <span className={tache.terminee ? "line-through text-gray-500" : ""}>
                          {tache.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
            <button
              onClick={closeModals}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Composant Modal pour édition
  const EditModal = () => {
    if (!editedTravaux) return null;

    const progress = calculateProgress(editedTravaux);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                {editedTravaux.statut === 'attente_validation_gt' ? 'Valider le Bon de Travaux' : 'Modifier le Bon de Travaux'} - {editedTravaux.reference}
              </h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {validationMessage && (
              <div className={`p-3 rounded-md ${validationMessage.includes('validé') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {validationMessage}
              </div>
            )}

            {editedTravaux.statut === 'attente_validation_ra' && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-blue-800">En attente de validation par le Responsable d&apos;Agence</p>
              </div>
            )}

            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence</label>
                <p className="mt-1 text-sm font-medium">{editedTravaux.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type</label>
                <p className="mt-1 text-sm font-medium">{getTypeLabel(editedTravaux.type_travaux)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Statut</label>
                <div className="flex items-center mt-1">
                  {getStatusIcon(editedTravaux.statut)}
                  <span className="ml-2 text-sm font-medium">{getStatusLabel(editedTravaux.statut)}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Priorité</label>
                <p className="mt-1 text-sm font-medium">{editedTravaux.priorite}</p>
              </div>
            </div>

            {/* Gestion des tâches - seulement pour GT et travaux en cours */}
            {(editedTravaux.statut === 'attente_validation_gt' || editedTravaux.statut === 'en_cours') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  {editedTravaux.statut === 'attente_validation_gt' ? 'Tâches à prévoir' : 'Tâches en cours'}
                </h3>
                
                {/* Ajouter une nouvelle tâche - seulement pour GT */}
                {editedTravaux.statut === 'attente_validation_gt' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Nouvelle tâche..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    />
                    <button
                      onClick={addNewTask}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                )}
                
                {/* Liste des tâches */}
                <div className="space-y-2">
                  {editedTravaux.taches.map((tache) => (
                    <div key={tache.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-neutral-700">
                      <div className="flex items-center">
                        {editedTravaux.statut === 'en_cours' ? (
                          <button 
                            onClick={() => toggleTaskCompletion(tache.id)}
                            className="mr-2"
                          >
                            {tache.terminee ? (
                              <CheckSquare className="h-5 w-5 text-green-500" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        ) : (
                          <div className="mr-2">
                            {tache.terminee ? (
                              <CheckSquare className="h-5 w-5 text-green-500" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        )}
                        <span className={tache.terminee ? "line-through text-gray-500" : ""}>
                          {tache.description}
                        </span>
                      </div>
                      
                      {editedTravaux.statut === 'attente_validation_gt' && (
                        <button
                          onClick={() => deleteTask(tache.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Barre de progression pour les travaux en cours */}
                {editedTravaux.statut === 'en_cours' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Barre de progression pour réception gardien */}
            {editedTravaux.statut === 'reception_gardien' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `100%` }}
                  ></div>
                </div>
                <p className="text-sm text-green-600">Tous les travaux ont été réceptionnés par le gardien</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
            <button
              onClick={closeModals}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {editedTravaux.statut === 'attente_validation_ra' ? 'Fermer' : 'Annuler'}
            </button>
            
            {/* Actions selon le statut */}
            {editedTravaux.statut === 'attente_validation_gt' && (
              <button
                onClick={handleSendToRA}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Send className="h-4 w-4 mr-1" />
                Envoyer au RA pour validation
              </button>
            )}
            
            {editedTravaux.statut === 'attente_validation_ra' && (
              <button
                onClick={simulateRAValidation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <UserCog className="h-4 w-4 mr-1" />
                Simuler validation RA
              </button>
            )}
            
            {editedTravaux.statut === 'planifié' && (
              <button
                onClick={handleStartTravaux}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Play className="h-4 w-4 mr-1" />
                Démarrer les travaux
              </button>
            )}
            
            {editedTravaux.statut === 'en_cours' && (
              <button
                onClick={handleReceptionGardien}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
                disabled={progress < 100}
              >
                <ClipboardCheck className="h-4 w-4 mr-1" />
                Réception par le gardien
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Gestion des Travaux</h1>
          <p className="text-gray-600 dark:text-neutral-400">Suivi et planification des travaux techniques</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Bon de Travaux
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des travaux..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TravauxStatus | 'tous')}
          >
            <option value="tous">Tous les statuts</option>
            <option value="attente_validation_gt">Attente validation GT</option>
            <option value="attente_validation_ra">Attente validation RA</option>
            <option value="planifié">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="reception_gardien">Réception gardien</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TravauxType | 'tous')}
          >
            <option value="tous">Tous les types</option>
            <option value="remise_etat">Remise en état</option>
            <option value="gros_entretien">Gros entretien</option>
            <option value="nettoyage">Nettoyage</option>
            <option value="diagnostic">Diagnostic</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Total</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{travauxData.length}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Attente GT</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {travauxData.filter(t => t.statut === 'attente_validation_gt').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Attente RA</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {travauxData.filter(t => t.statut === 'attente_validation_ra').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">En cours</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {travauxData.filter(t => t.statut === 'en_cours').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Réceptionnés</div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {travauxData.filter(t => t.statut === 'reception_gardien').length}
          </div>
        </div>
      </div>

      {/* Tableau des travaux */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Localisation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Progression</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {currentItems.length > 0 ? (
                currentItems.map((travaux) => {
                  const progress = calculateProgress(travaux);
                  return (
                    <tr key={travaux.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3">
                        <div className="font-medium text-blue-600 dark:text-blue-400">
                          {travaux.reference}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{getTypeLabel(travaux.type_travaux)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                          <div className="text-sm">
                            {travaux.logement.batiment}
                            <div className="text-xs text-gray-500 dark:text-neutral-400">
                              Porte {travaux.logement.porte}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {travaux.date_debut ? (
                            <>
                              <div>Début: {travaux.date_debut}</div>
                              <div className="text-xs text-gray-500 dark:text-neutral-400">
                                Fin: {travaux.date_fin_prevue}
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-500 dark:text-neutral-400">Non planifié</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {travaux.cout_reel} € / {travaux.cout_estime} €
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                              }`} 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-neutral-400">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {getStatusIcon(travaux.statut)}
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(travaux.statut)}`}>
                            {getStatusLabel(travaux.statut)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openViewModal(travaux)}
                            className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(travaux)}
                            className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                    Aucun travaux trouvé avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredTravaux.length > 0 && (
          <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredTravaux.length)}
                  </span> sur <span className="font-medium">{filteredTravaux.length}</span> résultats
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

      {/* Modales */}
      {isViewModalOpen && <ViewModal />}
      {isEditModalOpen && <EditModal />}
    </div>
  );
};

export default TravauxPage;