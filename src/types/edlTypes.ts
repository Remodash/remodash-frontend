export type StatusFilter = 'all' | 'en cours' | 'à réaliser' | 'terminé';

export interface Tenant {
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

export interface FormData {
  badge?: boolean;
  letterbox?: boolean;
  cylinder?: boolean;
  waterCold?: string;
  waterHot?: string;
  [key: string]: string | boolean | undefined;
}

export interface ExpandedSections {
  general?: boolean;
  keys?: boolean;
  property?: boolean;
  photos?: boolean;
}

export interface Colors {
  primary: {
    light: string;
    dark: string;
  };
  secondary: {
    light: string;
    dark: string;
  };
  success: {
    light: string;
    dark: string;
  };
  warning: {
    light: string;
    dark: string;
  };
  info: {
    light: string;
    dark: string;
  };
  danger: {
    light: string;
    dark: string;
  };
}