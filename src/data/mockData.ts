import { Travaux, RecentActivity, StatsCard } from '@/types';

export const travauxList: Travaux[] = [
    {
      id: 1,
      reference: "TRV-2024-001",
      titre: "Rénovation salle de bain - Appartement 31081",
      type: "rénovation",
      priorite: "moyenne",
      statut: "en cours",
      date_creation: "15/10/2024",
      date_debut: "20/10/2024",
      date_fin_prevue: "05/11/2024",
      batiment: "Bâtiment 03",
      etage: "8ème étage",
      porte: "31081",
      description: "Rénovation complète de la salle de bain avec remplacement carrelage, robinetterie et installation nouveau miroir",
      budget_prevue: "3500.00",
      cout_reel: "2850.00",
      etapes: [
        {
          id: "1",
          description: "Démolition ancien carrelage et sanitaires",
          statut: "terminé",
          date_debut: "20/10/2024",
          date_fin: "22/10/2024",
          intervenants: [
            {
              nom: "SARL Démolition Pro",
              telephone: "01 45 23 45 67",
              email: "contact@demolitionpro.fr",
              specialite: "Démolition"
            }
          ],
          materiaux: [],
          observations: "Ancien carrelage difficile à enlever, prévoir temps supplémentaire",
          photos: []
        },
        {
          id: "2",
          description: "Installation nouveau carrelage mural et sol",
          statut: "en cours",
          date_debut: "23/10/2024",
          date_fin: "28/10/2024",
          intervenants: [
            {
              nom: "Jean Carreleur",
              telephone: "06 12 34 56 78",
              email: "j.carreleur@email.fr",
              specialite: "Carrelage"
            }
          ],
          materiaux: [
            {
              nom: "Carrelage mural blanc 20x25",
              quantite: 45,
              prix_unitaire: "25.50",
              fournisseur: "Leroy Merlin"
            },
            {
              nom: "Carrelage sol antidérapant gris 30x30",
              quantite: 20,
              prix_unitaire: "32.75",
              fournisseur: "Point P"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 2,
      reference: "TRV-2024-002",
      titre: "Réparation fuite d'eau - Appartement 12",
      type: "réparation",
      priorite: "critique",
      statut: "terminé",
      date_creation: "05/10/2024",
      date_debut: "06/10/2024",
      date_fin_prevue: "06/10/2024",
      batiment: "Bâtiment A",
      etage: "2ème étage",
      porte: "12",
      description: "Réparation urgente d'une fuite d'eau sous l'évier de la cuisine",
      budget_prevue: "250.00",
      cout_reel: "180.00",
      etapes: [
        {
          id: "1",
          description: "Diagnostic et réparation de la fuite",
          statut: "terminé",
          date_debut: "06/10/2024",
          date_fin: "06/10/2024",
          intervenants: [
            {
              nom: "Plomberie Express",
              telephone: "01 46 78 90 12",
              email: "urgence@plomberie-express.fr",
              specialite: "Plomberie urgente"
            }
          ],
          materiaux: [
            {
              nom: "Joint silicone alimentaire",
              quantite: 1,
              prix_unitaire: "8.50",
              fournisseur: "Plomberie Express"
            }
          ],
          observations: "Fuite réparée en moins de 2 heures, bon travail",
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 3,
      reference: "TRV-2024-003",
      titre: "Entretien chaudière - Bâtiment C",
      type: "entretien",
      priorite: "moyenne",
      statut: "planifié",
      date_creation: "01/11/2024",
      date_debut: "15/11/2024",
      date_fin_prevue: "15/11/2024",
      batiment: "Bâtiment C",
      etage: "Tous étages",
      porte: "N/A",
      description: "Entretien annuel des chaudières collectives du bâtiment C",
      budget_prevue: "1200.00",
      cout_reel: "0.00",
      etapes: [
        {
          id: "1",
          description: "Contrôle et entretien chaudière principale",
          statut: "planifié",
          date_debut: "15/11/2024",
          date_fin: "15/11/2024",
          intervenants: [
            {
              nom: "Chauffage Service",
              telephone: "01 34 56 78 90",
              email: "contact@chauffage-service.fr",
              specialite: "Entretien chaudières"
            }
          ],
          materiaux: [
            {
              nom: "Kit entretien chaudière",
              quantite: 1,
              prix_unitaire: "85.00",
              fournisseur: "Chauffage Service"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 4,
      reference: "TRV-2024-004",
      titre: "Réparation ascenseur - Bâtiment B",
      type: "réparation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "10/11/2024",
      date_debut: "12/11/2024",
      date_fin_prevue: "18/11/2024",
      batiment: "Bâtiment B",
      etage: "Tous étages",
      porte: "N/A",
      description: "Réparation du système de contrôle de l'ascenseur principal",
      budget_prevue: "4200.00",
      cout_reel: "3800.00",
      etapes: [
        {
          id: "1",
          description: "Diagnostic du problème électronique",
          statut: "terminé",
          date_debut: "12/11/2024",
          date_fin: "13/11/2024",
          intervenants: [
            {
              nom: "Ascenseurs Technologie",
              telephone: "01 56 78 90 12",
              email: "tech@ascenseurs-tech.fr",
              specialite: "Réparation ascenseurs"
            }
          ],
          materiaux: [],
          observations: "Problème identifié dans la carte mère du système de contrôle",
          photos: []
        },
        {
          id: "2",
          description: "Remplacement des composants défectueux",
          statut: "en cours",
          date_debut: "14/11/2024",
          date_fin: "18/11/2024",
          intervenants: [
            {
              nom: "Ascenseurs Technologie",
              telephone: "01 56 78 90 12",
              email: "tech@ascenseurs-tech.fr",
              specialite: "Réparation ascenseurs"
            }
          ],
          materiaux: [
            {
              nom: "Carte mère système contrôle",
              quantite: 1,
              prix_unitaire: "2450.00",
              fournisseur: "Otis Components"
            },
            {
              nom: "Capteurs de sécurité",
              quantite: 4,
              prix_unitaire: "185.00",
              fournisseur: "Otis Components"
            }
          ],
          photos: []
        }
      ],
      photos: []
    },
    {
      id: 5,
      reference: "TRV-2024-005",
      titre: "Changement porte d'entrée - Appartement 502",
      type: "rénovation",
      priorite: "élevée",
      statut: "en cours",
      date_creation: "22/10/2024",
      date_debut: "25/10/2024",
      date_fin_prevue: "28/10/2024",
      batiment: "Bâtiment F",
      etage: "5ème étage",
      porte: "502",
      description: "Remplacement de la porte d'entrée endommagée",
      budget_prevue: "1200.00",
      cout_reel: "1350.00",
      etapes: [
        {
          id: "1",
          description: "Démontage ancienne porte",
          statut: "terminé",
          date_debut: "25/10/2024",
          date_fin: "25/10/2024",
          intervenants: [
            {
              nom: "Menuiserie Moderne",
              telephone: "01 43 21 65 87",
              email: "devis@menuiserie-moderne.fr",
              specialite: "Portes et fenêtres"
            }
          ],
          materiaux: [],
          observations: "Ancienne porte très difficile à démonter",
          photos: []
        },
        {
          id: "2",
          description: "Installation nouvelle porte blindée",
          statut: "en cours",
          date_debut: "26/10/2024",
          date_fin: "28/10/2024",
          intervenants: [
            {
              nom: "Menuiserie Moderne",
              telephone: "01 43 21 65 87",
              email: "devis@menuiserie-moderne.fr",
              specialite: "Portes et fenêtres"
            }
          ],
          materiaux: [
            {
              nom: "Porte blindée modèle SecureHome",
              quantite: 1,
              prix_unitaire: "890.00",
              fournisseur: "Menuiserie Moderne"
            },
            {
              nom: "Serrures multipoints",
              quantite: 1,
              prix_unitaire: "220.00",
              fournisseur: "Menuiserie Moderne"
            }
          ],
          photos: []
        }
      ],
      photos: []
    }
  ];

export const recentActivities: RecentActivity[] = [
  // Vos données activités récentes ici (copiées depuis le code original)
  
];

export const statsData: StatsCard[] = [
  // Vos données statistiques ici (copiées depuis le code original)
];