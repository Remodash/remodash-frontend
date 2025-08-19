import { Tenant } from '../types/edlTypes';

export const tenants: Tenant[] = [
    {
      id: 1,
      name: "Mme NDEYE THIORO THIAM",
      address: "6 SQUARE ESQUIROL, 94000 CRETEIL",
      entryDate: "13/11/2024",
      status: "en cours",
      hasDebt: false,
      inspection: {
        type: "Etat des lieux entrant",
        number: "2024-1073",
        date: "13/11/2024",
        inspector: "Viviane ANKE"
      },
      property: {
        type: "T3",
        surface: 72,
        building: "Bâtiment 03",
        floor: "8ème étage",
        doorNumber: "31081"
      }
    },
    {
      id: 2,
      name: "M. JEAN DUPONT",
      address: "12 AVENUE DE LA REPUBLIQUE, 75011 PARIS",
      entryDate: "01/12/2024",
      status: "à réaliser",
      hasDebt: true,
      debtAmount: 850.50,
      inspection: null,
      property: {
        type: "T2",
        surface: 45,
        building: "Bâtiment A",
        floor: "2ème étage",
        doorNumber: "12"
      }
    },
    {
      id: 3,
      name: "Mme MARIE LEROY",
      address: "5 RUE DES LILAS, 92100 BOULOGNE",
      entryDate: "15/10/2024",
      status: "terminé",
      hasDebt: false,
      inspection: {
        type: "Etat des lieux entrant",
        number: "2024-0982",
        date: "15/10/2024",
        inspector: "Pierre MARTIN"
      },
      property: {
        type: "Studio",
        surface: 28,
        building: "Bâtiment C",
        floor: "RDC",
        doorNumber: "2"
      }
    },
    {
      id: 4,
      name: "M. PAUL BERNARD",
      address: "3 RUE DU COMMERCE, 93200 SAINT-DENIS",
      entryDate: "20/11/2024",
      status: "en cours",
      hasDebt: true,
      debtAmount: 1200.00,
      inspection: {
        type: "Etat des lieux entrant",
        number: "2024-1105",
        date: "20/11/2024",
        inspector: "Sophie DUBOIS"
      },
      property: {
        type: "T4",
        surface: 85,
        building: "Bâtiment D",
        floor: "3ème étage",
        doorNumber: "8"
      }
    },
    {
      id: 5,
      name: "Mme LUCIA GOMEZ",
      address: "8 BIS RUE DE VERDUN, 94120 FONTENAY",
      entryDate: "05/12/2024",
      status: "à réaliser",
      hasDebt: false,
      inspection: null,
      property: {
        type: "T1",
        surface: 35,
        building: "Bâtiment E",
        floor: "1er étage",
        doorNumber: "5"
      }
    },
    {
      id: 6,
      name: "M. THOMAS LEFEVRE",
      address: "14 ALLEE DES CHATAIGNIERS, 94300 VINCENNES",
      entryDate: "30/11/2024",
      status: "en cours",
      hasDebt: false,
      inspection: {
        type: "Etat des lieux entrant",
        number: "2024-1156",
        date: "30/11/2024",
        inspector: "Viviane ANKE"
      },
      property: {
        type: "T3",
        surface: 65,
        building: "Bâtiment F",
        floor: "5ème étage",
        doorNumber: "502"
      }
    }
  ];