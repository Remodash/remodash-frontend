import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/courriers';

// Types pour la structure du backend
export interface Locataire {
  nom_complet: string;
  email: string;
  telephone: string;
  situation_impayes: boolean;
  montant_impayes: number;
}

export interface Logement {
  adresse: string;
  reference: string;
  type: string;
  surface: number;
  batiment: string;
  etage: string;
  porte: string;
}

export interface DatesImportantes {
  reception_courrier: string;
  sortie_prevue: string;
  pre_edl: string;
  edl: string;
}

export interface Metadata {
  date_export: string;
  id_courrier: number;
}

export interface Courrier {
  _id?: string;
  locataire: Locataire;
  logement: Logement;
  dates_importantes: DatesImportantes;
  referent_technique: string;
  statut: 'en attente' | 'traité' | 'confirmé';
  actions_realisees: string[];
  metadata: Metadata;
}

export const getCourriers = async (): Promise<{ data: Courrier[] }> => {
  return axios.get(API_BASE_URL);
};

export const createCourrier = async (data: Courrier): Promise<{ data: Courrier }> => {
  return axios.post(API_BASE_URL, data);
};

export const updateCourrier = async (id: string, data: Partial<Courrier>): Promise<{ data: Courrier }> => {
  return axios.put(`${API_BASE_URL}/${id}`, data);
};

export const deleteCourrier = async (id: string): Promise<{ data: { success: boolean } }> => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
