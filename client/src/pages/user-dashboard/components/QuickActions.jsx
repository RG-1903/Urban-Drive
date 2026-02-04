import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'new-booking',
      title: 'Book a Vehicle',
      description: 'Start a new reservation',
      icon: 'Car',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      hoverBorder: 'hover:border-blue-200'
    },
    {
      id: 'extend-rental',
      title: 'Extend Rental',
      description: 'Keep your vehicle longer',
      icon: 'Clock',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      hoverBorder: 'hover:border-orange-200'
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: '24/7 assistance',
      icon: 'Headphones',
      color: 'text-green-600',
      bg: 'bg-green-50',
      hoverBorder: 'hover:border-green-200'
    },
    {
      id: 'documents',
      title: 'My Documents',
      description: 'License & Insurance',
      icon: 'FileText',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      hoverBorder: 'hover:border-purple-200'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
      <h2 className="text-xl font-bold font-accent text-slate-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-slate-50 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 ${action.hoverBorder}`}
          >
            <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
              <Icon name={action.icon} size={24} className={action.color} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">{action.title}</h3>
              <p className="text-xs text-slate-500">{action.description}</p>
            </div>
            <div className="ml-auto opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              <Icon name="ChevronRight" size={16} className="text-slate-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;