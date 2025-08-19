import { Calendar, User, Building, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tenant, Colors } from '../../types/edlTypes';

interface TenantTableProps {
  paginatedTenants: Tenant[];
  colors: Colors;
  getStatusBadge: (status: Tenant['status']) => string;
  getStatusLabel: (status: Tenant['status']) => string;
  openModal: (tenant: Tenant) => void;
}

export const TenantTable = ({ 
  paginatedTenants, 
  colors, 
  getStatusBadge, 
  getStatusLabel, 
  openModal 
}: TenantTableProps) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date entrée</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Impayés</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {paginatedTenants.length > 0 ? (
              paginatedTenants.map(tenant => (
                <tr 
                  key={tenant.id} 
                  className={`
                    hover:bg-gray-50 dark:hover:bg-neutral-700
                    ${tenant.status === 'à réaliser' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                     tenant.status === 'en cours' ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}
                  `}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="truncate">{tenant.name}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                          {tenant.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium truncate">{tenant.property.type} - {tenant.property.surface}m²</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center truncate">
                      <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                      {tenant.property.building} - {tenant.property.floor} - Porte {tenant.property.doorNumber}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">{tenant.entryDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {tenant.hasDebt ? (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">{tenant.debtAmount?.toFixed(2)} €</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm whitespace-nowrap">Aucun</span>
                      </div>
                    )}
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
    </div>
  );
};