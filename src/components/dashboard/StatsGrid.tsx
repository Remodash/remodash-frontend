import { StatsCard } from '../../types';

interface StatsGridProps {
  statsData: StatsCard[];
}

export default function StatsGrid({ statsData }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${stat.color} text-white mr-3`}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                {stat.title}
              </p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-neutral-200">
                  {stat.value}
                </h3>
                {stat.trend && (
                  <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}