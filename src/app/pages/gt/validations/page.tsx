'use client';

import { useState, useMemo } from 'react';
import { 
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Home,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Wrench,
  ClipboardCheck,
  Send
} from 'lucide-react';

// Types pour les données
type DocumentType = 'diagnostic' | 'work_order';
type DocumentStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'validated';
type RAValidationStatus = 'validated' | 'not_validated';

interface Document {
  id: number;
  reference: string;
  type: DocumentType;
  documentType: string;
  status: DocumentStatus;
  requestDate: string;
  completionDate: string | null;
  deadline: string;
  property: string;
  building: string;
  door: string;
  technician: string;
  technicianContact: string;
  report: string | null;
  observations: string;
  raValidation: RAValidationStatus;
  technicalNotes: string;
  validationDate: string | null;
  validator: string | null;
  estimatedCost?: number;
  actualCost?: number;
  workDuration?: string;
  materialsUsed?: string;
}

const TechnicalManagerValidationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [raValidationFilter, setRAValidationFilter] = useState<RAValidationStatus | 'all'>('all');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationNotes, setValidationNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Pagination à partir de 3 items

  // Données de démonstration
  const documentsData: Document[] = useMemo(() => [
    // Diagnostics
    {
      id: 1,
      reference: "DIA-2024-001",
      type: "diagnostic",
      documentType: "DPE",
      status: "completed",
      requestDate: "10/11/2024",
      completionDate: "15/11/2024",
      deadline: "20/11/2024",
      property: "6 SQUARE ESQUIROL, Porte 31081",
      building: "6 SQUARE ESQUIROL",
      door: "31081",
      technician: "Martin Dupont",
      technicianContact: "01 45 67 89 10",
      report: "/rapports/dpe-31081.pdf",
      observations: "Logement bien isolé, performance énergétique correcte",
      raValidation: "validated",
      technicalNotes: "Vérifier l'étanchéité des fenêtres",
      validationDate: null,
      validator: null
    },
    {
      id: 2,
      reference: "DIA-2024-002",
      type: "diagnostic",
      documentType: "Électricité",
      status: "completed",
      requestDate: "18/11/2024",
      completionDate: "22/11/2024",
      deadline: "25/11/2024",
      property: "6 SQUARE ESQUIROL, Porte 21045",
      building: "6 SQUARE ESQUIROL",
      door: "21045",
      technician: "Sophie Martin",
      technicianContact: "01 46 72 83 94",
      report: "/rapports/elec-21045.pdf",
      observations: "Anomalies détectées sur le tableau électrique",
      raValidation: "not_validated",
      technicalNotes: "Remplacer le disjoncteur défectueux section 3B",
      validationDate: null,
      validator: null
    },
    // Bons de travaux
    {
      id: 3,
      type: "work_order",
      reference: "BT-2024-001",
      documentType: "Réparation électrique",
      status: "completed",
      requestDate: "20/11/2024",
      completionDate: "25/11/2024",
      deadline: "27/11/2024",
      property: "6 SQUARE ESQUIROL, Porte 21045",
      building: "6 SQUARE ESQUIROL",
      door: "21045",
      technician: "Sophie Martin",
      technicianContact: "01 46 72 83 94",
      report: "/rapports/travaux-electrique-21045.pdf",
      observations: "Remplacement du disjoncteur défectueux et mise aux normes",
      raValidation: "validated",
      technicalNotes: "Intervention standard, pas de difficultés particulières",
      validationDate: null,
      validator: null,
      estimatedCost: 450,
      actualCost: 420,
      workDuration: "3 heures",
      materialsUsed: "Disjoncteur 32A, câble électrique 6mm², bornes de connexion"
    },
    {
      id: 4,
      type: "work_order",
      reference: "BT-2024-002",
      documentType: "Rénovation salle de bain",
      status: "completed",
      requestDate: "22/11/2024",
      completionDate: "28/11/2024",
      deadline: "29/11/2024",
      property: "6 SQUARE ESQUIROL, Porte 41093",
      building: "6 SQUARE ESQUIROL",
      door: "41093",
      technician: "Lucie Bernard",
      technicianContact: "01 48 53 74 95",
      report: "/rapports/renovation-sdb-41093.pdf",
      observations: "Rénovation complète de la salle de bain avec remplacement des équipements",
      raValidation: "not_validated",
      technicalNotes: "Problème d'étanchéité détecté et corrigé",
      validationDate: null,
      validator: null,
      estimatedCost: 2850,
      actualCost: 3020,
      workDuration: "4 jours",
      materialsUsed: "Carrelage, receveur de douche, robinetterie, miroir, meuble vasque"
    },
    {
      id: 5,
      reference: "DIA-2024-003",
      type: "diagnostic",
      documentType: "Amiante",
      status: "completed",
      requestDate: "25/11/2024",
      completionDate: "30/11/2024",
      deadline: "05/12/2024",
      property: "6 SQUARE ESQUIROL, Porte 11022",
      building: "6 SQUARE ESQUIROL",
      door: "11022",
      technician: "Pierre Leroy",
      technicianContact: "01 49 64 75 86",
      report: "/rapports/amiante-11022.pdf",
      observations: "Présence d'amiante dans les colles de carrelage",
      raValidation: "not_validated",
      technicalNotes: "Nécessite des travaux de désamiantage",
      validationDate: null,
      validator: null
    }
  ], []);

  // Filtrer les documents
  const filteredDocuments = useMemo(() => {
    return documentsData.filter(document => {
      const matchesSearch = 
        document.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = documentTypeFilter === 'all' || document.type === documentTypeFilter;
      const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
      const matchesRAValidation = raValidationFilter === 'all' || document.raValidation === raValidationFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesRAValidation;
    });
  }, [searchTerm, documentTypeFilter, statusFilter, raValidationFilter, documentsData]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredDocuments]);

  // Gestion du changement de page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Basculer l'expansion d'une ligne
  const toggleRowExpansion = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  // Ouvrir la modal de validation
  const openValidationModal = (document: Document) => {
    setSelectedDocument(document);
    setValidationNotes('');
    setIsModalOpen(true);
  };

  // Fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
    setValidationNotes('');
  };

  // Valider un document
  const processDocument = () => {
    if (selectedDocument) {
      // Ici, on simulerait normalement l'appel API pour mettre à jour le document
      console.log(`Document ${selectedDocument.reference} traité avec notes: ${validationNotes}`);
      
      // Déterminer l'action en fonction du type de document et de la validation RA
      let actionMessage = "";
      if (selectedDocument.raValidation === "validated") {
        actionMessage = selectedDocument.type === "diagnostic" 
          ? "envoyé au Prestataire de diagnostics" 
          : "envoyé au Prestataire de travaux";
      } else {
        actionMessage = "envoyé au Responsable d'agence pour validation";
      }
      
      alert(`${selectedDocument.type === 'diagnostic' ? 'Diagnostic' : 'Bon de travail'} ${selectedDocument.reference} ${actionMessage} avec succès.`);
      closeModal();
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status: DocumentStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'validated': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Obtenir le texte du statut
  const getStatusText = (status: DocumentStatus) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  // Obtenir la couleur de la validation RA
  const getRAValidationColor = (validation: RAValidationStatus) => {
    switch(validation) {
      case 'validated': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'not_validated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Obtenir le texte de la validation RA
  const getRAValidationText = (validation: RAValidationStatus) => {
    switch(validation) {
      case 'validated': return 'Validé';
      case 'not_validated': return 'Non validé';
      default: return 'Inconnu';
    }
  };

  // Obtenir l'icône selon le type de document
  const getDocumentIcon = (type: DocumentType) => {
    return type === 'diagnostic' 
      ? <ClipboardCheck className="h-4 w-4 mr-1 flex-shrink-0 text-blue-500" /> 
      : <Wrench className="h-4 w-4 mr-1 flex-shrink-0 text-orange-500" />;
  };

  // Obtenir le texte du type de document
  const getDocumentTypeText = (type: DocumentType) => {
    return type === 'diagnostic' ? 'Diagnostic' : 'Bon de travail';
  };

  // Composant de pagination
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
        <div className="mb-4 md:mb-0">
          <span className="text-sm text-gray-700 dark:text-neutral-300">
            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredDocuments.length)}
            </span> sur <span className="font-medium">{filteredDocuments.length}</span> résultats
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className={`w-8 h-8 rounded-md text-sm border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-600`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-1">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md text-sm ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1">...</span>}
              <button
                onClick={() => goToPage(totalPages)}
                className={`w-8 h-8 rounded-md text-sm border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-600`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Modal de validation
  const ValidationModal = () => {
    if (!selectedDocument) return null;

    // Déterminer le texte du bouton en fonction du type de document et de la validation RA
    const getButtonText = () => {
      if (selectedDocument.raValidation === "validated") {
        return selectedDocument.type === "diagnostic" 
          ? "Envoyer au Prestataire de diagnostics" 
          : "Envoyer au Prestataire de travaux";
      } else {
        return "Envoyer au Responsable d'agence";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                Traitement {selectedDocument.type === 'diagnostic' ? 'du diagnostic' : 'du bon de travail'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Référence</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Type</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">
                  {getDocumentTypeText(selectedDocument.type)} - {selectedDocument.documentType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Validation RA</label>
                <p className="mt-1 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRAValidationColor(selectedDocument.raValidation)}`}>
                    {getRAValidationText(selectedDocument.raValidation)}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Bâtiment</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.building}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Porte</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.door}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Technicien</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.technician}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.technicianContact}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Observations du technicien</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.observations}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Notes techniques</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.technicalNotes}</p>
            </div>
            
            {/* Informations spécifiques aux bons de travaux */}
            {selectedDocument.type === 'work_order' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Coût estimé</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.estimatedCost} €</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Coût réel</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.actualCost} €</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Durée des travaux</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.workDuration}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Matériaux utilisés</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-neutral-200">{selectedDocument.materialsUsed}</p>
                </div>
              </div>
            )}
            
            {selectedDocument.report && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Rapport</label>
                <a href={selectedDocument.report} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <FileText className="h-4 w-4 mr-1" />
                  Voir le rapport
                </a>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Vos notes</label>
              <textarea
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                placeholder="Ajoutez vos commentaires sur ce document..."
              />
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-500"
            >
              Annuler
            </button>
            <button
              onClick={processDocument}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Send className="h-4 w-4 mr-1" />
              {getButtonText()}
            </button>
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Validation des Documents Techniques</h1>
          <p className="text-gray-600 dark:text-neutral-400">Validation technique des diagnostics et bons de travaux</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-neutral-400">Gestionnaire: Jean Techvalide</span>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value as DocumentType | 'all')}
            >
              <option value="all">Tous les types</option>
              <option value="diagnostic">Diagnostics</option>
              <option value="work_order">Bons de travaux</option>
            </select>
          </div>
          
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminé (à valider)</option>
              <option value="validated">Validé</option>
              <option value="rejected">Rejeté</option>
              <option value="in_progress">En cours</option>
              <option value="pending">En attente</option>
            </select>
          </div>
          
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
              value={raValidationFilter}
              onChange={(e) => setRAValidationFilter(e.target.value as RAValidationStatus | 'all')}
            >
              <option value="all">Toutes les validations RA</option>
              <option value="validated">Validé par RA</option>
              <option value="not_validated">Non validé par RA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">À valider</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {documentsData.filter(d => d.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Validés RA</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {documentsData.filter(d => d.raValidation === 'validated').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Non validés RA</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {documentsData.filter(d => d.raValidation === 'not_validated').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Diagnostics</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {documentsData.filter(d => d.type === 'diagnostic').length}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Travaux</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {documentsData.filter(d => d.type === 'work_order').length}
          </div>
        </div>
      </div>

      {/* Tableau des documents */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Détails
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Logement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Date limite
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Validation RA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {currentItems.length > 0 ? (
                currentItems.map((document) => (
                  <>
                    <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => toggleRowExpansion(document.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          {expandedRows.includes(document.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-blue-600 dark:text-blue-400">
                          {document.reference}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          {getDocumentIcon(document.type)}
                          {getDocumentTypeText(document.type)} - {document.documentType}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                          <div className="text-sm">
                            {document.building}
                            <div className="text-xs text-gray-500 dark:text-neutral-400">
                              Porte {document.door}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                          <div className="text-sm">{document.technician}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                          <div className="text-sm">{document.deadline}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRAValidationColor(document.raValidation)}`}>
                          {getRAValidationText(document.raValidation)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {getStatusText(document.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {document.report && (
                            <a 
                              href={document.report} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          {document.status === 'completed' && (
                            <button 
                              onClick={() => openValidationModal(document)}
                              className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              title="Traiter le document"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRows.includes(document.id) && (
                      <tr className="bg-gray-50 dark:bg-neutral-700">
                        <td colSpan={9} className="px-4 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Observations du technicien</h4>
                              <p className="text-gray-600 dark:text-neutral-400">{document.observations}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Notes techniques</h4>
                              <p className="text-gray-600 dark:text-neutral-400">{document.technicalNotes}</p>
                            </div>
                            {document.type === 'work_order' && (
                              <>
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Coût estimé / réel</h4>
                                  <p className="text-gray-600 dark:text-neutral-400">
                                    {document.estimatedCost} € / {document.actualCost} €
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Durée des travaux</h4>
                                  <p className="text-gray-600 dark:text-neutral-400">{document.workDuration}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Matériaux utilisés</h4>
                                  <p className="text-gray-600 dark:text-neutral-400">{document.materialsUsed}</p>
                                </div>
                              </>
                            )}
                            {document.validationDate && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">Validation</h4>
                                <p className="text-gray-600 dark:text-neutral-400">
                                  {document.status === 'validated' ? 'Validé' : 'Rejeté'} par {document.validator} le {document.validationDate}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                    Aucun document trouvé avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <Pagination />
      </div>

      {/* Modal de validation */}
      {isModalOpen && <ValidationModal />}
    </div>
  );
};

export default TechnicalManagerValidationPage;