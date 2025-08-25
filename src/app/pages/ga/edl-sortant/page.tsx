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
  Check,
  AlertTriangle,
  Save,
  Download,
  Printer
} from 'lucide-react';

// Types basés sur le JSON fourni
interface Bailleur {
  nom: string;
  adresse: string;
  telephone: string;
}

interface Locataire {
  nom: string;
  email: string;
  adresse_actuelle: string;
  nouvelle_adresse: string;
}

interface InformationsGenerales {
  contrat: string;
  logement: string;
  type_de_logement: string;
  date_edl: string;
  numero_edl: string;
}

interface Composant {
  nom: string;
  etat: 'BON ETAT' | 'MAUVAIS ETAT';
  observations?: string;
}

interface CorpsEtat {
  nom: string;
  composants: Composant[];
}

interface Piece {
  dimensions?: string;
  corps_etat: CorpsEtat[];
}

interface Constat {
  [key: string]: Piece;
}

interface Cle {
  libelle: string;
  remises: number;
  rendues: number;
  prix_unitaire: string;
}

interface Compteur {
  code: string;
  numero_de_serie: string;
  type: string;
  emplacement: string;
  index_precedent: string;
  index_actuel: string;
}

interface ReparationsLocatives {
  total_locataire: string;
}

interface Signatures {
  date: string;
  locataire: string;
  representant_logial_coop: string;
}

interface CompteurPrive {
  type: string;
  numero: string;
  emplacement: string;
  index_depart?: number;
  unite?: string;
}

interface LogementData {
  bailleur: Bailleur;
  locataire: Locataire;
  informations_generales: InformationsGenerales;
  constat: Constat;
  cles_et_compteurs: {
    cles: Cle[];
    compteurs_quittances: Compteur[];
    compteurs_prives: CompteurPrive[];
  };
  reparations_locatives: ReparationsLocatives;
  signatures: Signatures;
}

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

interface FormData extends LogementData {
  photos: PhotoItem[];
}

interface PhotoItem {
  id: string;
  room: string;
  file: File | null;
  previewUrl: string;
}

interface ExpandedSections {
  [key: string]: boolean;
}

type StatusFilter = 'all' | 'en cours' | 'à réaliser' | 'terminé';

const EDLSortantPage = () => {
  // Données initiales basées sur le JSON
  const initialData: LogementData = {
    bailleur: {
      nom: "Logial-COOP",
      adresse: "86 bis Quai Blanqui, 94146 ALFORTVILLE CEDEX",
      telephone: "01 45 18 20 00"
    },
    locataire: {
      nom: "Mme JENNIFER TAVER",
      email: "COLIBRIHIBISCUS@HOTMAIL.FR",
      adresse_actuelle: "6 SQUARE ESQUIROL, Porte 31081 Etage 08 BATIMENT 03, 94000 CRETEIL",
      nouvelle_adresse: "2 allee nicolas fouquet, 77380 Combs la ville"
    },
    informations_generales: {
      contrat: "9578148",
      logement: "131033081",
      type_de_logement: "3 PIECES",
      date_edl: "12/09/2024",
      numero_edl: "2024-829"
    },
    constat: {
      cuisine: {
        dimensions: "> 4M2",
        corps_etat: [
          {
            nom: "CHAUFFAGE",
            composants: [
              { nom: "RADIATEUR", etat: "BON ETAT" },
              { nom: "ROBINET THERMOSTATIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "ELEC",
            composants: [
              { nom: "APPLIQUE", etat: "BON ETAT" },
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "DOUILLE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "FENETRE", etat: "BON ETAT" },
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE INTERIEURE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "VITRAGE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "DALLES PVC", etat: "BON ETAT" },
              { nom: "FAIENCE", etat: "BON ETAT" },
              { nom: "PEINTURE", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PLOMBERIE",
            composants: [
              { nom: "EVIER", etat: "BON ETAT" },
              { nom: "MEUBLE SOUS EVIER", etat: "BON ETAT" },
              { nom: "ROBINETTERIE", etat: "BON ETAT" },
              { nom: "VIDANGE", etat: "BON ETAT" },
              { nom: "VMC", etat: "BON ETAT" }
            ]
          }
        ]
      },
      salle_de_bain: {
        corps_etat: [
          {
            nom: "ELEC",
            composants: [
              { nom: "APPLIQUE", etat: "BON ETAT" },
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "DOUILLE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE INTERIEURE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" },
              { nom: "VERROU", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "DALLES PVC", etat: "BON ETAT" },
              { nom: "FAIENCE", etat: "BON ETAT" },
              { nom: "PEINTURE", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PLOMBERIE",
            composants: [
              { nom: "BAIGNOIRE", etat: "BON ETAT" },
              { nom: "LAVABO", etat: "BON ETAT" },
              { nom: "ROBINETTERIE", etat: "BON ETAT" },
              { nom: "VIDANGE", etat: "BON ETAT" },
              { nom: "VMC", etat: "BON ETAT" },
              { nom: "WC", etat: "BON ETAT" }
            ]
          }
        ]
      },
      "w.c.": {
        corps_etat: [
          {
            nom: "ELEC",
            composants: [
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "DOUILLE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE INTERIEURE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" },
              { nom: "VERROU", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PARQUET", etat: "MAUVAIS ETAT" },
              { nom: "PEINTURE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PLOMBERIE",
            composants: [
              { nom: "ROBINETTERIE", etat: "BON ETAT" },
              { nom: "VIDANGE", etat: "BON ETAT" },
              { nom: "VMC", etat: "BON ETAT" },
              { nom: "WC", etat: "BON ETAT" }
            ]
          }
        ]
      },
      chambre_1: {
        corps_etat: [
          {
            nom: "CHAUFFAGE",
            composants: [
              { nom: "RADIATEUR", etat: "BON ETAT" },
              { nom: "ROBINET THERMOSTATIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "ELEC",
            composants: [
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" },
              { nom: "PRISE TV TELEPHONE INTERNET", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "FENETRE", etat: "BON ETAT" },
              { nom: "GRILLE AERATION", etat: "BON ETAT" },
              { nom: "MANIVELLE SANGLE VOLET", etat: "BON ETAT" },
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE INTERIEURE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" },
              { nom: "VITRAGE", etat: "BON ETAT" },
              { nom: "VOLETS", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PAPIER PEINT", etat: "MAUVAIS ETAT", observations: "decolle" },
              { nom: "PARQUET", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          }
        ]
      },
      chambre_2: {
        corps_etat: [
          {
            nom: "CHAUFFAGE",
            composants: [
              { nom: "RADIATEUR", etat: "BON ETAT" },
              { nom: "ROBINET THERMOSTATIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "ELEC",
            composants: [
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" },
              { nom: "PRISE TV TELEPHONE INTERNET", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "FENETRE", etat: "BON ETAT" },
              { nom: "GRILLE AERATION", etat: "BON ETAT" },
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE INTERIEURE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" },
              { nom: "VITRAGE", etat: "BON ETAT" },
              { nom: "VOLETS", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PAPIER PEINT", etat: "BON ETAT" },
              { nom: "PARQUET", etat: "BON ETAT" },
              { nom: "PEINTURE", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          }
        ]
      },
      salle_de_sejour: {
        corps_etat: [
          {
            nom: "ELEC",
            composants: [
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" },
              { nom: "PRISE TV TELEPHONE INTERNET", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE INTERIEURE",
            composants: [
              { nom: "PORTE ALVEOLAIRE", etat: "BON ETAT" },
              { nom: "PORTE FENETRE", etat: "BON ETAT" },
              { nom: "VOLET ROULANT", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PEINTURE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "REVETEMENTS SOLS",
            composants: [
              { nom: "REVETEMENTS SOLS", etat: "BON ETAT" }
            ]
          }
        ]
      },
      placard: {
        corps_etat: [
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "PORTE PLACARD", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "LINOS", etat: "BON ETAT" },
              { nom: "PAPIER PEINT", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          }
        ]
      },
      degagement: {
        corps_etat: [
          {
            nom: "CHAUFFAGE",
            composants: [
              { nom: "CHAUFFAGE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "ELEC",
            composants: [
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "DOUILLE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PAPIER PEINT", etat: "BON ETAT" },
              { nom: "PARQUET", etat: "BON ETAT" },
              { nom: "PEINTURE", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          }
        ]
      },
      entree: {
        corps_etat: [
          {
            nom: "ELEC",
            composants: [
              { nom: "CABLE", etat: "BON ETAT" },
              { nom: "CACHE PRISE", etat: "BON ETAT" },
              { nom: "COMBINET INTERPHONE", etat: "BON ETAT" },
              { nom: "DOUILLE", etat: "BON ETAT" },
              { nom: "INTERRUPTEUR", etat: "BON ETAT" },
              { nom: "MOULURE", etat: "BON ETAT" },
              { nom: "PRISE ELECTRIQUE", etat: "BON ETAT" },
              { nom: "SONNETTE", etat: "BON ETAT" },
              { nom: "TABLEAU", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE INTERIEURE",
            composants: [
              { nom: "PORTE PALIERE/ENTREE", etat: "BON ETAT" }
            ]
          },
          {
            nom: "MENUISERIE/SERRURERIE",
            composants: [
              { nom: "ENTREBAILLEUR", etat: "BON ETAT" },
              { nom: "JUDAS", etat: "BON ETAT" },
              { nom: "PLINTHE", etat: "BON ETAT" },
              { nom: "POIGNEE", etat: "BON ETAT" },
              { nom: "RIVE BLOC", etat: "BON ETAT" },
              { nom: "SERRURE", etat: "BON ETAT" },
              { nom: "VERROU", etat: "BON ETAT" }
            ]
          },
          {
            nom: "PEINTURE",
            composants: [
              { nom: "PAPIER PEINT", etat: "BON ETAT" },
              { nom: "PARQUET", etat: "BON ETAT" },
              { nom: "PLAFOND", etat: "BON ETAT" }
            ]
          }
        ]
      },
      loggia: {
        corps_etat: [
          {
            nom: "BALCON TERRASSE LOGIA",
            composants: [
              { nom: "GARDE CORPS", etat: "BON ETAT" },
              { nom: "MACONNERIE", etat: "BON ETAT" },
              { nom: "REVET SOL", etat: "BON ETAT" }
            ]
          }
        ]
      }
    },
    cles_et_compteurs: {
      cles: [
        { libelle: "BADGE", remises: 3, rendues: 3, prix_unitaire: "20.00" },
        { libelle: "CLE BOITE LETTRES", remises: 1, rendues: 1, prix_unitaire: "12.00" },
        { libelle: "CYLINDRE EURO", remises: 4, rendues: 4, prix_unitaire: "10.00" }
      ],
      compteurs_quittances: [
        {
          code: "0131000000030095F1",
          numero_de_serie: "19CA035204",
          type: "EAU FROIDE",
          emplacement: "TOILETTES",
          index_precedent: "160.000",
          index_actuel: "160.000"
        },
        {
          code: "0131000000030095C2",
          numero_de_serie: "19BA006578",
          type: "EAU CHAUDE",
          emplacement: "TOILETTES",
          index_precedent: "108.000",
          index_actuel: "108.000"
        }
      ],
      compteurs_prives: []
    },
    reparations_locatives: {
      total_locataire: "0.00"
    },
    signatures: {
      date: "12/09/2024",
      locataire: "Mme JENNIFER TAVER",
      representant_logial_coop: "Viviane ANKE"
    }
  };

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    keys: true,
    property: true,
    photos: true,
    signature: true
  });
  const [formData, setFormData] = useState<FormData>({
    ...initialData,
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
      newAddress: "2 allee nicolas fouquet, 77380 Combs la ville",
      entryDate: "12/09/2024",
      status: "en cours",
      inspection: {
        number: "2024-829",
        date: "12/09/2024"
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
      entryDate: "15/09/2024",
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
      entryDate: "20/09/2024",
      status: "terminé",
      inspection: {
        number: "2024-830",
        date: "20/09/2024"
      },
      property: {
        contract: "9578150",
        type: "4 PIECES",
        reference: "131033083"
      }
    }
  ];

  // Liste des pièces basée sur le JSON
  //const rooms = Object.keys(initialData.constat);

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
      photos: true,
      signature: true
    });
    
    // Initialiser les données du formulaire avec les valeurs du JSON
    setFormData({
      ...initialData,
      locataire: {
        ...initialData.locataire,
        nom: tenant.name,
        email: tenant.email,
        adresse_actuelle: tenant.currentAddress,
        nouvelle_adresse: tenant.newAddress
      },
      informations_generales: {
        ...initialData.informations_generales,
        contrat: tenant.property.contract,
        logement: tenant.property.reference,
        type_de_logement: tenant.property.type,
        date_edl: tenant.entryDate,
        numero_edl: tenant.inspection?.number || "2024-XXX"
      },
      signatures: {
        ...initialData.signatures,
        date: tenant.inspection?.date || new Date().toLocaleDateString('fr-FR'),
        locataire: tenant.name
      },
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleKeyChange = (index: number, field: keyof Cle, value: string | number) => {
    const updatedCles = [...formData.cles_et_compteurs.cles];
    updatedCles[index] = {
      ...updatedCles[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        cles: updatedCles
      }
    }));
  };

  const handleAddKey = () => {
    const newKey: Cle = {
      libelle: '',
      remises: 1,
      rendues: 1,
      prix_unitaire: '0.00'
    };
    
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        cles: [...prev.cles_et_compteurs.cles, newKey]
      }
    }));
  };

  const handleRemoveKey = (index: number) => {
    const updatedCles = [...formData.cles_et_compteurs.cles];
    updatedCles.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        cles: updatedCles
      }
    }));
  };

  const handleCounterChange = (index: number, field: keyof Compteur, value: string) => {
    const updatedCompteurs = [...formData.cles_et_compteurs.compteurs_quittances];
    updatedCompteurs[index] = {
      ...updatedCompteurs[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        compteurs_quittances: updatedCompteurs
      }
    }));
  };

  const handleAddCounter = () => {
    const newCounter: Compteur = {
      code: '',
      numero_de_serie: '',
      type: 'EAU FROIDE',
      emplacement: '',
      index_precedent: '0.000',
      index_actuel: '0.000'
    };
    
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        compteurs_quittances: [...prev.cles_et_compteurs.compteurs_quittances, newCounter]
      }
    }));
  };

  const handleRemoveCounter = (index: number) => {
    const updatedCompteurs = [...formData.cles_et_compteurs.compteurs_quittances];
    updatedCompteurs.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      cles_et_compteurs: {
        ...prev.cles_et_compteurs,
        compteurs_quittances: updatedCompteurs
      }
    }));
  };

  const handleComponentStateChange = (room: string, corpsEtatIndex: number, componentIndex: number, etat: 'BON ETAT' | 'MAUVAIS ETAT') => {
    const updatedConstat = { ...formData.constat };
    updatedConstat[room].corps_etat[corpsEtatIndex].composants[componentIndex].etat = etat;
    
    setFormData(prev => ({
      ...prev,
      constat: updatedConstat
    }));
  };

  const handleObservationChange = (room: string, corpsEtatIndex: number, componentIndex: number, observation: string) => {
    const updatedConstat = { ...formData.constat };
    updatedConstat[room].corps_etat[corpsEtatIndex].composants[componentIndex].observations = observation;
    
    setFormData(prev => ({
      ...prev,
      constat: updatedConstat
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
          États des Lieux Sortants
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
            <Search className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="text-sm sm:text-base">Rechercher</span>
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
                        {tenant.inspection ? 'Voir EDL' : 'Créer EDL'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun état des lieux trouvé
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
                    État des Lieux Sortant - {formData.informations_generales.numero_edl}
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">
                    {formData.locataire.nom} - {formData.informations_generales.type_de_logement}
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Bailleur</label>
                        <input 
                          type="text" 
                          value={formData.bailleur.nom} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse bailleur</label>
                        <input 
                          type="text" 
                          value={formData.bailleur.adresse} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Téléphone bailleur</label>
                        <input 
                          type="text" 
                          value={formData.bailleur.telephone} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Locataire</label>
                        <input 
                          type="text" 
                          value={formData.locataire.nom} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email locataire</label>
                        <input 
                          type="text" 
                          value={formData.locataire.email} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse actuelle</label>
                        <input 
                          type="text" 
                          value={formData.locataire.adresse_actuelle} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nouvelle adresse</label>
                        <input 
                          type="text" 
                          value={formData.locataire.nouvelle_adresse} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Numéro de contrat</label>
                        <input 
                          type="text" 
                          value={formData.informations_generales.contrat} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Référence logement</label>
                        <input 
                          type="text" 
                          value={formData.informations_generales.logement} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Type de logement</label>
                        <input 
                          type="text" 
                          value={formData.informations_generales.type_de_logement} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date de l&apos;EDL</label>
                        <input 
                          type="text" 
                          value={formData.informations_generales.date_edl} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Numéro EDL</label>
                        <input 
                          type="text" 
                          value={formData.informations_generales.numero_edl} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
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
                        {formData.cles_et_compteurs.cles.map((cle, index) => (
                          <div key={index} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                            <div className="p-3">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Libellé</label>
                                  <input
                                    type="text"
                                    value={cle.libelle}
                                    onChange={(e) => handleKeyChange(index, 'libelle', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                    placeholder="Type de clé"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Remises</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={cle.remises}
                                    onChange={(e) => handleKeyChange(index, 'remises', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Rendues</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={cle.rendues}
                                    onChange={(e) => handleKeyChange(index, 'rendues', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Prix unitaire (€)</label>
                                  <input
                                    type="text"
                                    value={cle.prix_unitaire}
                                    onChange={(e) => handleKeyChange(index, 'prix_unitaire', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <button 
                                  onClick={() => handleRemoveKey(index)}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm flex items-center"
                                  aria-label={`Supprimer la clé ${cle.libelle}`}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
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
                        {formData.cles_et_compteurs.compteurs_quittances.map((compteur, index) => (
                          <div key={index} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                            <div className="p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Code</label>
                                  <input
                                    type="text"
                                    value={compteur.code}
                                    onChange={(e) => handleCounterChange(index, 'code', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Type</label>
                                  <select
                                    value={compteur.type}
                                    onChange={(e) => handleCounterChange(index, 'type', e.target.value)}
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
                                    value={compteur.numero_de_serie}
                                    onChange={(e) => handleCounterChange(index, 'numero_de_serie', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Emplacement</label>
                                  <input
                                    type="text"
                                    value={compteur.emplacement}
                                    onChange={(e) => handleCounterChange(index, 'emplacement', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Index précédent</label>
                                  <input
                                    type="text"
                                    value={compteur.index_precedent}
                                    onChange={(e) => handleCounterChange(index, 'index_precedent', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Index actuel</label>
                                  <input
                                    type="text"
                                    value={compteur.index_actuel}
                                    onChange={(e) => handleCounterChange(index, 'index_actuel', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <button 
                                  onClick={() => handleRemoveCounter(index)}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm flex items-center"
                                  aria-label={`Supprimer le compteur ${compteur.numero_de_serie}`}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* État des lieux par pièce */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('property')}
                  aria-expanded={expandedSections.property}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">État des lieux par pièce</h3>
                  {expandedSections.property ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.property && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
                    {Object.entries(formData.constat).map(([room, pieceData]) => (
                      <div key={room} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                        <button 
                          className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                          onClick={() => toggleSection(`room-${room}`)}
                          aria-expanded={expandedSections[`room-${room}`]}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-neutral-200 capitalize">
                            {room.replace(/_/g, ' ')}
                            {pieceData.dimensions && (
                              <span className="ml-2 text-sm text-gray-500 dark:text-neutral-400">
                                ({pieceData.dimensions})
                              </span>
                            )}
                          </h4>
                          {expandedSections[`room-${room}`] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        
                        {expandedSections[`room-${room}`] && (
                          <div className="p-3 sm:p-4 pt-0 space-y-4">
                            {pieceData.corps_etat.map((corpsEtat, corpsEtatIndex) => (
                              <div key={`${room}-${corpsEtat.nom}`} className="space-y-3">
                                <h5 className="font-medium text-gray-800 dark:text-neutral-300">{corpsEtat.nom}</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {corpsEtat.composants.map((composant, componentIndex) => (
                                    <div key={`${room}-${corpsEtat.nom}-${composant.nom}`} className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 dark:text-neutral-300">{composant.nom}</span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleComponentStateChange(room, corpsEtatIndex, componentIndex, 'BON ETAT')}
                                            className={`p-1 rounded ${composant.etat === 'BON ETAT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400'}`}
                                            title="Bon état"
                                          >
                                            <Check className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleComponentStateChange(room, corpsEtatIndex, componentIndex, 'MAUVAIS ETAT')}
                                            className={`p-1 rounded ${composant.etat === 'MAUVAIS ETAT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400'}`}
                                            title="Mauvais état"
                                          >
                                            <AlertTriangle className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                      {composant.etat === 'MAUVAIS ETAT' && (
                                        <div className="mt-1">
                                          <input
                                            type="text"
                                            value={composant.observations || ''}
                                            onChange={(e) => handleObservationChange(room, corpsEtatIndex, componentIndex, e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700"
                                            placeholder="Observations..."
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
                        {Object.keys(formData.constat).map((room) => (
                          <button
                            key={room}
                            onClick={() => triggerFileInput(room)}
                            className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <div className="text-gray-500 dark:text-neutral-400">
                              <Camera className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs capitalize">{room.replace(/_/g, ' ')}</span>
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
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded capitalize">
                                {photo.room.replace(/_/g, ' ')}
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

              {/* Réparations locatives */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('reparations')}
                  aria-expanded={expandedSections.reparations}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Réparations locatives</h3>
                  {expandedSections.reparations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.reparations && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Total à la charge du locataire (€)</label>
                        <input 
                          type="text" 
                          value={formData.reparations_locatives.total_locataire} 
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            reparations_locatives: {
                              ...prev.reparations_locatives,
                              total_locataire: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                <button 
                  className="flex justify-between items-center w-full p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleSection('signature')}
                  aria-expanded={expandedSections.signature}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Signatures</h3>
                  {expandedSections.signature ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {expandedSections.signature && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date</label>
                        <input 
                          type="text" 
                          value={formData.signatures.date} 
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            signatures: {
                              ...prev.signatures,
                              date: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Locataire</label>
                        <input 
                          type="text" 
                          value={formData.signatures.locataire} 
                          readOnly 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Représentant Logial-COOP</label>
                        <input 
                          type="text" 
                          value={formData.signatures.representant_logial_coop} 
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            signatures: {
                              ...prev.signatures,
                              representant_logial_coop: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700"
                        />
                      </div>
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
                  className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2 flex items-center justify-center`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {selectedTenant.inspection ? 'Mettre à jour' : 'Enregistrer EDL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EDLSortantPage;