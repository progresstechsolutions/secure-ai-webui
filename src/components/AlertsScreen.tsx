import React, { useState } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const AlertIcon = ({ type }: { type: 'urgent' | 'warning' | 'info' }) => {
  const icons = {
    urgent: '🚨',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return <span className="text-2xl">{icons[type]}</span>;
};

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  category: 'nutrition' | 'symptom' | 'medication' | 'general';
  isRead: boolean;
  actionRequired?: boolean;
  actionText?: string;
  // New fields for expanded view
  trigger: string;
  recommendedActions: string[];
  links: {
    text: string;
    action: string;
  }[];
  isExpanded?: boolean;
}

interface AlertsScreenProps {
  onBack: () => void;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ onBack }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Low Iron Levels Detected',
      description: 'Recent blood work shows iron levels below recommended range.',
      timestamp: 'Today, 9:15 AM',
      category: 'nutrition',
      isRead: false,
      actionRequired: true,
      actionText: 'View Details',
      trigger: 'Jamie\'s recent blood work shows iron levels at 8.5 mg/dL, which is below the recommended range of 10-15 mg/dL for her age.',
      recommendedActions: [
        'Add iron-rich foods to today\'s meal plan',
        'Consider iron supplements as recommended by your care team',
        'Schedule follow-up blood work in 2 weeks'
      ],
      links: [
        { text: 'See recommended foods', action: 'view_foods' },
        { text: 'Message care team', action: 'message_team' },
        { text: 'View nutrition plan', action: 'view_plan' }
      ],
      isExpanded: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Symptom Pattern Alert',
      description: 'Fatigue symptoms logged 3 times this week.',
      timestamp: 'Yesterday, 2:30 PM',
      category: 'symptom',
      isRead: false,
      actionRequired: true,
      actionText: 'View Details',
      trigger: 'Fatigue symptoms have been logged 3 times this week, which is above the typical frequency for Jamie.',
      recommendedActions: [
        'Review recent nutrition and sleep patterns',
        'Consider if this relates to PMS cycle timing',
        'Monitor for additional symptoms'
      ],
      links: [
        { text: 'Review symptom history', action: 'view_history' },
        { text: 'Message care team', action: 'message_team' },
        { text: 'Check nutrition plan', action: 'view_plan' }
      ],
      isExpanded: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Medication Reminder',
      description: 'Time to refill vitamin D supplement.',
      timestamp: '2 days ago',
      category: 'medication',
      isRead: true,
      actionRequired: false,
      actionText: 'Set Reminder',
      trigger: 'Current vitamin D supplement supply will last 5 more days.',
      recommendedActions: [
        'Order refill from pharmacy',
        'Set reminder for next refill date'
      ],
      links: [
        { text: 'Set reminder', action: 'set_reminder' },
        { text: 'View medication list', action: 'view_medications' }
      ],
      isExpanded: false
    },
    {
      id: '4',
      type: 'info',
      title: 'Growth Milestone',
      description: 'Jamie has grown 2cm this month!',
      timestamp: '3 days ago',
      category: 'general',
      isRead: true,
      actionRequired: false,
      trigger: 'Monthly growth measurement shows 2cm increase, which is within normal range.',
      recommendedActions: [
        'Continue current nutrition and care routine',
        'Document this milestone in Jamie\'s records'
      ],
      links: [
        { text: 'View growth chart', action: 'view_chart' },
        { text: 'Update records', action: 'update_records' }
      ],
      isExpanded: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleToggleExpand = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isExpanded: !alert.isExpanded } : alert
    ));
  };

  const handleMarkAsReviewed = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true, isExpanded: false } : alert
    ));
  };

  const filteredAlerts = selectedCategory === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.category === selectedCategory);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const urgentCount = alerts.filter(alert => alert.type === 'urgent' && !alert.isRead).length;

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = [
    { key: 'all', label: 'All', count: alerts.length },
    { key: 'urgent', label: 'Urgent', count: urgentCount },
    { key: 'nutrition', label: 'Nutrition', count: alerts.filter(a => a.category === 'nutrition').length },
    { key: 'symptom', label: 'Symptoms', count: alerts.filter(a => a.category === 'symptom').length },
    { key: 'medication', label: 'Medication', count: alerts.filter(a => a.category === 'medication').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Alerts</h1>
            <p className="text-sm text-gray-600">Stay informed about Jamie's safety and care.</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Summary Stats */}
        {unreadCount > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                </p>
                {urgentCount > 0 && (
                  <p className="text-xs text-red-700 mt-1">
                    {urgentCount} urgent alert{urgentCount !== 1 ? 's' : ''} require{urgentCount === 1 ? 's' : ''} attention
                  </p>
                )}
              </div>
              <button 
                onClick={() => setAlerts(alerts.map(alert => ({ ...alert, isRead: true })))}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Mark all read
              </button>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.label}
                {category.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.key
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-green-500 mb-4">
                <ShieldCheckIcon />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No urgent alerts. Jamie's care is on track!</h3>
              <p className="text-gray-600">We'll notify you if anything needs your attention.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`bg-white rounded-xl border transition-all ${
                  alert.isRead 
                    ? 'border-gray-200 opacity-75' 
                    : 'border-l-4 border-l-red-500 shadow-sm'
                }`}
              >
                {/* Alert Card Header */}
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertIcon type={alert.type} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-semibold ${
                            alert.isRead ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {alert.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.description}
                          </p>
                          
                          <div className="flex items-center mt-3 space-x-4">
                            <div className="flex items-center text-xs text-gray-500">
                              <ClockIcon />
                              <span className="ml-1">{alert.timestamp}</span>
                            </div>
                            
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(alert.type)}`}>
                              {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!alert.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <CheckIcon />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleToggleExpand(alert.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title={alert.isExpanded ? "Collapse" : "Expand"}
                          >
                            <ChevronDownIcon className={`transition-transform ${alert.isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex items-center space-x-3 mt-4">
                        <button 
                          onClick={() => handleToggleExpand(alert.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          {alert.actionText}
                        </button>
                        
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Alert Details */}
                {alert.isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="space-y-4">
                      {/* What triggered the alert */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">What triggered this alert:</h4>
                        <p className="text-sm text-gray-600">{alert.trigger}</p>
                      </div>

                      {/* Recommended actions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended actions:</h4>
                        <ul className="space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-indigo-500 mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Links */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Quick actions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.links.map((link, index) => (
                            <button
                              key={index}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors"
                            >
                              {link.text}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mark as reviewed button */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleMarkAsReviewed(alert.id)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Mark as reviewed
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AlertsScreen; 