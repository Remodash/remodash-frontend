// types.ts
export interface EDL {
  id: number;
  numero: string;
  date: string;
  locataire: string;
  adresse: string;
  etat: string;
  informations_locataire?: {
    nom_agence: string;
    adresse_agence: string;
    telephone_agence: string;
    nom_locataire: string;
    email_locataire: string;
    adresse_propriete: string;
    details_propriete: {
      batiment: string;
      etage: string;
      porte: string;
      type: string;
      numero_contrat: string;
      numero_logement: string;
    };
  };
  details_inspection?: {
    type_inspection: string;
    numero_inspection: string;
    date_inspection: string;
    date_rapport: string;
    nom_inspecteur: string;
  };
  etat_propriete?: {
    [key: string]: {
      [category: string]: Array<{
        composant: string | null;
        etat: string;
        observation?: string;
      }>;
    };
  };
  reparations_et_cout?: {
    cout_total_ht: number;
    cout_total_locataire: number;
  };
}

export interface EDLModalProps {
  isOpen: boolean;
  onClose: () => void;
  edl?: EDL; // Rend la prop optionnelle
  type: ModalType;
}

// app/interfaces/types/types.ts
export type ModalType = 'view' | 'edit' | 'send' | 'create'; // Ajoutez 'create'