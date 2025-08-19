'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Camera,
  XCircle,
  ChevronUp,
  ChevronDown, 
  Plus,
  Trash2,
  X,
} from 'lucide-react';

// Types
interface Tenant {
  id: number;
  name: string;
  address: string;
  entryDate: string;
  status: 'en cours' | 'à réaliser' | 'terminé';
  hasDebt: boolean;
  debtAmount?: number;
  inspection: {
    type: string;
    number: string;
    date: string;
    inspector: string;
  } | null;
  property: {
    type: string;
    surface: number;
    building: string;
    floor: string;
    doorNumber: string;
  };
}

interface KeyItem {
  id: string;
  libelle: string;
  quantite: number;
  provided: boolean;
}

interface CounterItem {
  id: string;
  type: string;
  numero_serie: string;
  emplacement: string;
  index_precedent: string;
  index_actuel: string;
}

interface RoomState {
  id: string;
  room: string;
  component: string;
  state: string;
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

interface EDLModalProps {
  tenant: Tenant;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const defaultTenant: Tenant = {
  id: 0,
  name: 'Locataire inconnu',
  address: 'Adresse inconnue',
  entryDate: new Date().toLocaleDateString('fr-FR'),
  status: 'à réaliser',
  hasDebt: false,
  inspection: null,
  property: {
    type: 'Inconnu',
    surface: 0,
    building: 'Inconnu',
    floor: 'Inconnu',
    doorNumber: 'Inconnu'
  }
};

const EDLModal = ({ 
  tenant = defaultTenant, 
  onClose, 
  onSave 
}: EDLModalProps) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    keys: true,
    property: true,
    photos: true
  });
  
  const [formData, setFormData] = useState<FormData>({
    keys: [
      { id: '1', libelle: 'BADGE', quantite: 2, provided: false },
      { id: '2', libelle: 'CLE BOITE LETTRES', quantite: 1, provided: false },
      { id: '3', libelle: 'CYLINDRE EURO', quantite: 2, provided: false }
    ],
    counters: [
      { 
        id: '1', 
        type: 'EAU FROIDE', 
        numero_serie: '19CA035204', 
        emplacement: 'TOILETTES', 
        index_precedent: '160.000', 
        index_actuel: '0.000' 
      },
      { 
        id: '2', 
        type: 'EAU CHAUDE', 
        numero_serie: '19BA006578', 
        emplacement: 'TOILETTES', 
        index_precedent: '108.000', 
        index_actuel: '0.000' 
      }
    ],
    roomStates: [],
    photos: []
  });

  const [newObservation, setNewObservation] = useState({
    room: '',
    component: '',
    observation: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRoomForPhoto, setSelectedRoomForPhoto] = useState('');

  // Nettoyer les URLs des photos lorsque le composant est démonté
  useEffect(() => {
    return () => {
      formData.photos.forEach(photo => {
        URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [formData.photos]);

  const rooms = [
    'Cuisine', 
    'Salle de bain', 
    'WC', 
    'Chambre 1', 
    'Chambre 2', 
    'Salle de séjour', 
    'Entrée', 
    'Loggia'
  ];

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
      'VOLET ROULANT', 'PEINTURE', 'REVÊTEMENT SOL'
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

  const roomStatesOptions = ['Bon état', 'Usure normale', 'À réparer', 'À remplacer'];

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleKeyToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.map(key => 
        key.id === id ? { ...key, provided: !key.provided } : key
      )
    }));
  };

  const handleKeyQuantityChange = (id: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.map(key => 
        key.id === id ? { ...key, quantite: Math.max(0, value) } : key
      )
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

  const handleRoomStateChange = (room: string, component: string, state: string) => {
    setFormData(prev => {
      const existingIndex = prev.roomStates.findIndex(
        rs => rs.room === room && rs.component === component
      );
      
      if (existingIndex >= 0) {
        const newRoomStates = [...prev.roomStates];
        newRoomStates[existingIndex] = { ...newRoomStates[existingIndex], state };
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
              state
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
    return state ? state.state : 'Bon état';
  };

  const handleAddObservation = () => {
    if (!newObservation.room || !newObservation.component || !newObservation.observation) return;

    setFormData(prev => {
      const existingIndex = prev.roomStates.findIndex(
        rs => rs.room === newObservation.room && rs.component === newObservation.component
      );
      
      if (existingIndex >= 0) {
        const newRoomStates = [...prev.roomStates];
        newRoomStates[existingIndex] = { 
          ...newRoomStates[existingIndex], 
          observation: newObservation.observation 
        };
        return { ...prev, roomStates: newRoomStates };
      } else {
        return {
          ...prev,
          roomStates: [
            ...prev.roomStates,
            {
              id: `${newObservation.room}-${newObservation.component}-${Date.now()}`,
              room: newObservation.room,
              component: newObservation.component,
              state: 'Bon état',
              observation: newObservation.observation
            }
          ]
        };
      }
    });

    setNewObservation({ room: '', component: '', observation: '' });
  };

  const handleRemoveObservation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      roomStates: prev.roomStates.filter(rs => rs.id !== id)
    }));
  };

  const handleAddKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      libelle: '',
      quantite: 1,
      provided: true
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

  const handleKeyLabelChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      keys: prev.keys.map(key => 
        key.id === id ? { ...key, libelle: value } : key
      )
    }));
  };

  const handleAddCounter = () => {
    const newCounter = {
      id: `counter-${Date.now()}`,
      type: 'EAU FROIDE',
      numero_serie: '',
      emplacement: '',
      index_precedent: '0.000',
      index_actuel: '0.000'
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
      if (photoToRemove) {
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
      fileInputRef.current.value = ''; // Permet de sélectionner le même fichier plusieurs fois
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                État des Lieux Entrant
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">{tenant.name}</p>
            </div>
            <button 
              onClick={onClose}
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
                      value={tenant.name} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse du logement</label>
                    <input 
                      type="text" 
                      value={tenant.address} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date d&apos;entrée</label>
                    <input 
                      type="text" 
                      value={tenant.entryDate} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  {tenant.inspection && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Inspecteur</label>
                      <input 
                        type="text" 
                        value={tenant.inspection.inspector} 
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
                    <h4 className="font-medium text-gray-900 dark:text-neutral-200">Clés fournies</h4>
                    <button 
                      onClick={handleAddKey}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une clé
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.keys.map((key) => (
                      <div key={key.id} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            type="checkbox" 
                            checked={key.provided}
                            onChange={() => handleKeyToggle(key.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 dark:bg-neutral-700"
                            aria-label={`Clé ${key.libelle} fournie`}
                          />
                          <input
                            type="text"
                            value={key.libelle}
                            onChange={(e) => handleKeyLabelChange(key.id, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                            placeholder="Type de clé"
                          />
                          <input
                            type="number"
                            min="0"
                            value={key.quantite}
                            onChange={(e) => handleKeyQuantityChange(key.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveKey(key.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          aria-label={`Supprimer la clé ${key.libelle}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                  <div className="space-y-4">
                    {formData.counters.map((counter) => (
                      <div key={counter.id} className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-gray-200 dark:border-neutral-600">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-gray-900 dark:text-neutral-200">
                            {counter.type} - {counter.numero_serie}
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
                  <div key={room} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-neutral-200">{room}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {roomComponents[room]?.map((component) => {
                        const state = getRoomState(room, component);
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
                                      checked={state === option}
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
                                  onClick={() => handleRemoveObservation(
                                    formData.roomStates.find(
                                      rs => rs.room === room && rs.component === component
                                    )?.id || ''
                                  )}
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
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-neutral-600">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Composant</label>
                            <select
                              value={newObservation.room === room ? newObservation.component : ''}
                              onChange={(e) => setNewObservation(prev => ({ 
                                ...prev, 
                                room,
                                component: e.target.value 
                              }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                            >
                              <option value="">Sélectionner</option>
                              {roomComponents[room]?.map((comp) => (
                                <option key={comp} value={comp}>{comp}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Observation</label>
                            <input
                              type="text"
                              value={newObservation.room === room ? newObservation.observation : ''}
                              onChange={(e) => setNewObservation(prev => ({ 
                                ...prev, 
                                observation: e.target.value 
                              }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                              placeholder="Décrire le problème"
                              disabled={!newObservation.component || newObservation.room !== room}
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={handleAddObservation}
                              disabled={!newObservation.component || !newObservation.observation || newObservation.room !== room}
                              className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-neutral-600 dark:disabled:text-neutral-400"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors order-2 sm:order-1"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
            >
              {tenant.inspection ? 'Mettre à jour' : 'Enregistrer EDL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDLModal;