import React from "react";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";

export const AdminDashboard: React.FC = () => {
    // Mock data - will be replaced with real API calls
    const stats = [
        {
            name: 'Total Events',
            value: '12',
            change: '+2.1%',
            icon: Calendar,
            color: 'blue'
        },
        {
            name: 'Total Users',
            value: '1,247',
            change: '+12.5%',
            icon: Users,
            color: 'green'
        },
        {
            name: 'Revenue',
            value: 'ksh24,780',
            change: '+8.2%',
            icon: DollarSign,
            color: 'purple'
        },
        {
            name: 'Growth',
            value: '18.2%',
            change: '+2.4%',
            icon: TrendingUp,
            color: 'orange'
        }
    ];

    const recentEvent = [
        { id: 1, name: 'Tech Conference 2025', attendees: 150, revenue: 'ksh4,500', status: 'Active' },
        { id: 2, name: 'Music Festival', attendees: 500, revenue: 'ksh12,000', status: 'Sold Out' },
        { id: 3, name: 'Art Exhibition', attendees: 75, revenue: 'ksh1,800', status: 'Active' },
        { id: 4, name: 'Food Fair', attendees: 200, revenue: 'ksh3,200', status: 'Active' },
    ];

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your events and track performance
            </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
            const Icon = stat.icon;
            return (
                <div
                key={stat.name}
                className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6"
                >
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                        {stat.change} from last month
                    </p>
                    </div>
                    <div className={`p-3 bg-primary-100 dark:bg-primary-900 rounded-full`}>
                    <Icon className={`w-6 h-6 text-primary-600 dark:text-primary-400`} />
                    </div>
                </div>
                </div>
            );
            })}
        </div>

        {/* Recent Events */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Events
            </h2>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attendees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {recentEvent.map((event) => (
                    <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.name}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                        {event.attendees}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                        {event.revenue}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                        {event.status}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
};