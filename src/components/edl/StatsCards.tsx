import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Tenant, Colors } from '../../types/edlTypes';
import { tenants } from '../../data/tenantsData';

interface StatsCardsProps {
  colors: Colors;
  getStatusBadge: (status: Tenant['status']) => string;
}

export const StatsCards = ({getStatusBadge }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {[
        { status: 'à réaliser', icon: <AlertCircle className="h-4 w-4" />, count: tenants.filter(d => d.status === 'à réaliser').length },
        { status: 'en cours', icon: <Clock className="h-4 w-4" />, count: tenants.filter(d => d.status === 'en cours').length },
        { status: 'terminé', icon: <CheckCircle2 className="h-4 w-4" />, count: tenants.filter(d => d.status === 'terminé').length },
      ].map((stat) => (
        <div key={stat.status} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-neutral-200">
              {stat.status === 'à réaliser' ? 'À réaliser' : stat.status === 'en cours' ? 'En cours' : 'Terminés'}
            </h3>
            <span className={`${getStatusBadge(stat.status as Tenant['status'])} text-xs font-medium px-2 py-0.5 rounded-full`}>
              {stat.count}
            </span>
          </div>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-neutral-100">
            {stat.count}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
            {stat.icon}
            <span>{stat.status === 'à réaliser' ? 'EDL à réaliser' : stat.status === 'en cours' ? 'EDL en cours' : 'EDL finalisés'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};