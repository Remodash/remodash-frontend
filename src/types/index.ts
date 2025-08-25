export interface Intervenant {
  nom: string;
  telephone: string;
  email: string;
  specialite: string;
}

export interface Materiau {
  nom: string;
  quantite: number;
  prix_unitaire: string;
  fournisseur: string;
}

export interface PhotoItem {
  id: string;
  file: File | null;
  previewUrl: string;
  type: 'avant' | 'pendant' | 'après';
}

export type StatutTravaux = 'planifié' | 'en cours' | 'terminé' | 'annulé';
export type StatutEtape = 'planifié' | 'en cours' | 'terminé' | 'reporté';

export interface EtapeTravaux {
  id: string;
  description: string;
  statut: StatutEtape;
  date_debut: string;
  date_fin: string;
  intervenants: Intervenant[];
  materiaux: Materiau[];
  observations?: string;
  photos: PhotoItem[];
}

export interface Travaux {
  id: number;
  reference: string;
  titre: string;
  type: 'entretien' | 'réparation' | 'rénovation' | 'urgence';
  priorite: 'faible' | 'moyenne' | 'élevée' | 'critique';
  statut: StatutTravaux;
  date_creation: string;
  date_debut: string;
  date_fin_prevue: string;
  batiment: string;
  etage: string;
  porte: string;
  description: string;
  budget_prevue: string;
  cout_reel: string;
  etapes: EtapeTravaux[];
  photos: PhotoItem[];
}

export interface StatsCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export interface RecentActivity {
  id: number;
  type: 'incoming' | 'outgoing' | 'travaux';
  tenant?: string;
  travaux?: Travaux;
  address: string;
  date: string;
  status: 'en cours' | 'à réaliser' | 'terminé' | 'planifié' | 'annulé';
}

export type ActiveTab = 'overview' | 'incoming' | 'outgoing' | 'travaux';