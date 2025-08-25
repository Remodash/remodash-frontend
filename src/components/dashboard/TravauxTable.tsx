'use client';

import { useState } from 'react';
import { MapPin, Calendar, Euro, Construction } from 'lucide-react';
import { Travaux } from '../../types';
import Pagination from './Pagination';

interface TravauxTableProps {
  travaux: Travaux[];
}

export default function TravauxTable({ travaux }: TravauxTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const travauxPerPage = 3;
  const totalPages = Math.ceil(travaux.length / travauxPerPage);
  const startIndex = (currentPage - 1) * travauxPerPage;
  const currentTravauxItems = travaux.slice(startIndex, startIndex + travauxPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPriorityBadge = (priority: Travaux['priorite']) => {
    switch (priority) {
      case 'critique':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'élevée':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'faible':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusBadge = (status: Travaux['statut']) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planifié':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'annulé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeLabel = (type: Travaux['type']) => {
    switch (type) {
      case 'entretien':
        return 'Entretien';
      case 'réparation':
        return 'Réparation';
      case 'rénovation':
        return 'Rénovation';
      case 'urgence':
        return 'Urgence';
      default:
        return type;
    }
  };

  const getPriorityLabel = (priority: Travaux['priorite']) => {
    switch (priority) {
      case 'faible':
        return 'Faible';
      case 'moyenne':
        return 'Moyenne';
      case 'élevée':
        return 'Élevée';
      case 'critique':
        return 'Critique';
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: Travaux['statut']) => {
    switch (status) {
      case 'terminé':
        return 'Terminé';
      case 'en cours':
        return 'En cours';
      case 'planifié':
        return 'Planifié';
      case 'annulé':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
          <Construction className="h-5 w-5 mr-2" />
          Travaux en cours et planifiés
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Référence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Localisation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Priorité
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Budget
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {currentTravauxItems.map((travaux) => (
              <tr key={travaux.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                <td className="px-4 py-3">
                  <div className="font-medium text-blue-600 dark:text-blue-400">
                    {travaux.reference}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">
                    {getTypeLabel(travaux.type)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium truncate max-w-xs">{travaux.titre}</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 max-w-xs">
                    {travaux.description}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm">{travaux.batiment}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {travaux.etage} {travaux.porte !== 'N/A' && `- Porte ${travaux.porte}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      Début: {travaux.date_debut}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      Fin prévue: {travaux.date_fin_prevue}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                      travaux.priorite
                    )}`}
                  >
                    {getPriorityLabel(travaux.priorite)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      travaux.statut
                    )}`}
                  >
                    {getStatusLabel(travaux.statut)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <Euro className="h-4 w-4 mr-1 text-green-500" />
                    {travaux.cout_reel} € / {travaux.budget_prevue} €
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={Math.min(startIndex + travauxPerPage, travaux.length)}
        totalItems={travaux.length}
        itemsPerPage={travauxPerPage}
      />

      <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-neutral-700">
        <button
          onClick={() => console.log('Naviguer vers gestion des travaux')}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center"
        >
          <Construction className="h-4 w-4 mr-2" />
          Ouvrir la gestion complète des travaux
        </button>
      </div>
    </div>
  );
}