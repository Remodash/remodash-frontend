'use client';

import { useState } from 'react';
import { MapPin, Calendar, Download, Printer, ChevronRight } from 'lucide-react';
import { RecentActivity } from '@/types';
import Pagination from './Pagination';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + activitiesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status: RecentActivity['status']) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'à réaliser':
      case 'planifié':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'annulé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: RecentActivity['status']) => {
    switch (status) {
      case 'terminé':
        return 'Terminé';
      case 'en cours':
        return 'En cours';
      case 'à réaliser':
        return 'À réaliser';
      case 'planifié':
        return 'Planifié';
      case 'annulé':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: 'incoming' | 'outgoing' | 'travaux') => {
    switch (type) {
      case 'incoming':
        return 'EDL Entrant';
      case 'outgoing':
        return 'EDL Sortant';
      case 'travaux':
        return 'Travaux';
      default:
        return type;
    }
  };

  const getTypeBadge = (type: 'incoming' | 'outgoing' | 'travaux') => {
    switch (type) {
      case 'incoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'outgoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'travaux':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200">
          Activités récentes
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Détails
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Localisation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {currentActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                <td className="px-4 py-3">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(
                      activity.type
                    )}`}
                  >
                    {getTypeLabel(activity.type)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900 dark:text-neutral-200">
                      {activity.type === 'travaux' ? activity.travaux?.titre : activity.tenant}
                    </div>
                    {activity.type === 'travaux' && activity.travaux && (
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {activity.travaux.reference}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900 dark:text-neutral-200 truncate max-w-xs flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {activity.address}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-900 dark:text-neutral-200">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">{activity.date}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      activity.status
                    )}`}
                  >
                    {getStatusLabel(activity.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
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
        endIndex={Math.min(startIndex + activitiesPerPage, activities.length)}
        totalItems={activities.length}
        itemsPerPage={activitiesPerPage}
      />
    </div>
  );
}