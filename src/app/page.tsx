// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Home, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Clock, 
  ShieldCheck,
  ArrowRight,
  Play,
  Building,
  Users,
  FileText,
  CheckCircle
} from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    title: "Gestion Intelligente des Départs Locataires",
    description: "Automatisez le processus de départ et optimisez la remise en état des logements"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600566753052-d04fcf6d278d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    title: "Diagnostics Automatisés par IA",
    description: "Notre intelligence artificielle détermine les diagnostics nécessaires et génère les bons de travail"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    title: "Suivi en Temps Réel des Travaux",
    description: "Surveillez l'avancement des travaux et gérez les délais avec précision"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: "Processus Automatisé",
      description: "De la notification de congé à la réception des travaux, tout est fluidifié"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Gestion des Travaux",
      description: "Bons de travail générés automatiquement avec répartition des coûts"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analyses Avancées",
      description: "Tableaux de bord complets avec indicateurs de performance"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Suivi Temps Réel",
      description: "Surveillance des délais et application automatique des pénalités"
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Conformité RGPD",
      description: "Gestion sécurisée des données locataires et logements"
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Patrimoine Optimisé",
      description: "Réduction des délais de vacance et meilleure rotation des logements"
    }
  ];

  const stats = [
    { value: "65%", label: "Réduction délais de vacance" },
    { value: "40%", label: "Économie sur les coûts travaux" },
    { value: "92%", label: "Satisfaction des gestionnaires" },
    { value: "100%", label: "Conformité aux réglementations" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section avec Diaporama réduit */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover transition-opacity duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-background/30" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-6 flex flex-col items-center">
            <div className="max-w-3xl">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Remodash
                </h1>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-md text-foreground/90 mb-6">
                {slides[currentSlide].description}
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center">
                  Démarrer <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors flex items-center">
                  <Play className="mr-2 h-5 w-5" /> Voir la démo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles du diaporama */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary' : 'bg-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-foreground/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Une Solution Complète de Gestion Immobilière
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Remodash révolutionne la gestion des départs locataires et la remise en état des logements grâce à l&apos;intelligence artificielle et l&apos;automatisation des processus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background border border-accent/20 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Processus Optimisé
            </h2>
            <p className="text-lg text-foreground/80">
              De la notification de congé à la remise en location, Remodash gère chaque étape
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-background h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Notification</h3>
              <p className="text-sm text-foreground/70">Réception du congé locataire et intégration automatique</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="text-background h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Diagnostics</h3>
              <p className="text-sm text-foreground/70">Analyse IA et génération des bons de diagnostic</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="text-background h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Travaux</h3>
              <p className="text-sm text-foreground/70">Génération automatique des bons de travail et suivi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-background h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Réception</h3>
              <p className="text-sm text-foreground/70">Contrôle qualité et mise en location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Avantages Concrets
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center justify-center md:justify-start">
                <Building className="text-primary mr-3 h-6 w-6" />
                Pour les gestionnaires
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Réduction des délais de traitement de 65%</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Automatisation des tâches répétitives</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Meilleure traçabilité des interventions</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center justify-center md:justify-start">
                <Users className="text-primary mr-3 h-6 w-6" />
                Pour les locataires
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Processus de départ simplifié et transparent</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Justification détaillée des retenues sur dépôt de garantie</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">Réduction des litiges grâce à la transparence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-background mb-6">
            Prêt à transformer votre gestion immobilière ?
          </h2>
          <p className="text-background/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les professionnels qui utilisent déjà Remodash pour optimiser leurs processus et réduire leurs délais de vacance.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors">
              Demander une démo
            </button>
            <button className="border border-background text-background px-8 py-3 rounded-lg font-semibold hover:bg-background/10 transition-colors">
              Contact commercial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center justify-center mb-4 md:mb-0">
              <div className="p-2 bg-primary/20 rounded-lg mr-3">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-semibold">Remodash</span>
            </div>
            <div className="text-sm text-background/80 text-center md:text-right">
              <p>© 2024 Remodash. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}