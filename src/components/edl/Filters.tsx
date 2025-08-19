import { AlertCircle, Clock, CheckCircle2, Filter } from 'lucide-react';
import { StatusFilter, Tenant, Colors } from '../../types/edlTypes';
import { tenants } from '../../data/tenantsData';

interface FiltersProps {
  filter: StatusFilter;
  setFilter: (filter: StatusFilter) => void;
  setCurrentPage: (page: number) => void;
  colors: Colors;
  getStatusBadge: (status: Tenant['status']) => string;
}

export const Filters = ({ filter, setFilter, setCurrentPage,  getStatusBadge }: FiltersProps) => {
  return (
    <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
      <div className="flex space-x-2 sm:space-x-4 min-w-max">
        {[
          { status: 'à réaliser', icon: <AlertCircle className="h-4 w-4 mr-1" /> },
          { status: 'en cours', icon: <Clock className="h-4 w-4 mr-1" /> },
          { status: 'terminé', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
          { status: 'all', icon: <Filter className="h-4 w-4 mr-1" /> },
        ].map((item) => (
          <button
            key={item.status}
            onClick={() => {
              setFilter(item.status as StatusFilter);
              setCurrentPage(1);
            }}
            className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              filter === item.status
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
            }`}
          >
            {item.icon}
            {item.status === 'all' ? 'Tous' : item.status === 'à réaliser' ? 'À réaliser' : item.status === 'en cours' ? 'En cours' : 'Terminés'}
            {item.status !== 'all' && (
              <span className={`ml-1 ${getStatusBadge(item.status as Tenant['status'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
                {tenants.filter(d => d.status === item.status).length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};