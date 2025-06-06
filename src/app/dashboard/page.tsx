import { Navigation } from '@/components/Navigation';
import {
  ChartBarIcon,
  BeakerIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Active Projects', value: '12', icon: BeakerIcon },
  { name: 'Team Members', value: '24', icon: UserGroupIcon },
  { name: 'Research Papers', value: '8', icon: DocumentTextIcon },
  { name: 'Data Points', value: '1.2M', icon: ChartBarIcon },
];

const recentProjects = [
  {
    id: 1,
    name: 'Synthetic DNA Sequencing',
    description: 'Advanced sequencing techniques for synthetic DNA structures',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: 2,
    name: 'Neural Network Optimization',
    description: 'Optimizing neural networks for biological pattern recognition',
    status: 'Planning',
    progress: 25,
  },
  {
    id: 3,
    name: 'Protein Folding Analysis',
    description: 'AI-driven protein folding prediction and analysis',
    status: 'Completed',
    progress: 100,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>

          {/* Stats */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(stat => (
                <div
                  key={stat.name}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-indigo-500 p-3">
                      <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="mt-8">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Recent Projects</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="truncate text-sm text-gray-500">{project.description}</p>
                    </a>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="mt-1 block text-xs text-gray-500">{project.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
