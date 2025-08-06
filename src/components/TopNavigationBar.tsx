import React, { useState } from 'react';

// Icon components for alerts
const AlertIcon = ({ type }: { type: 'urgent' | 'warning' | 'info' }) => {
  const icons = {
    urgent: '🚨',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return <span className="text-lg">{icons[type]}</span>;
};

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  trigger: string;
  recommendedActions: string[];
  links: {
    text: string;
    action: string;
  }[];
  isExpanded?: boolean;
}

interface TopNavigationBarProps {
  currentChildName?: string;
  unreadNotifications?: number;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ 
  currentChildName = "Jamie", 
  unreadNotifications = 2 
}) => {
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);

  // Mock alerts data - in a real app, this would come from props or context
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Low Iron Levels Detected',
      description: 'Recent blood work shows iron levels below recommended range.',
      timestamp: '5 min ago',
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
      timestamp: '2 hours ago',
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
      timestamp: '1 day ago',
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
    }
  ]);

  const toggleChildDropdown = () => {
    setIsChildDropdownOpen(!isChildDropdownOpen);
    if (isAlertsDropdownOpen) setIsAlertsDropdownOpen(false);
  };

  const toggleAlertsDropdown = () => {
    setIsAlertsDropdownOpen(!isAlertsDropdownOpen);
    if (isChildDropdownOpen) setIsChildDropdownOpen(false);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };

  const handleViewDetails = (alertId: string) => {
    // In a real app, this would navigate to the full alerts screen
    console.log('View details for alert:', alertId);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const recentAlerts = alerts.slice(0, 5); // Show up to 5 most recent alerts

  const getAlertBorderColor = (type: 'urgent' | 'warning' | 'info') => {
    switch (type) {
      case 'urgent': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'info': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
              CareGene
            </h1>
          </div>

          {/* Right side - Child info and notifications */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Child selector */}
            <div className="relative">
              <button
                onClick={toggleChildDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Switch child"
              >
                {/* Child avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentChildName.charAt(0)}
                </div>
                
                {/* Child name and condition tag */}
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {currentChildName}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    PMS
                  </span>
                </div>
                
                {/* Dropdown chevron */}
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Child dropdown menu */}
              {isChildDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    Switch Child
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      J
                    </div>
                    <span>Jamie</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      PMS
                    </span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                    + Add New Child
                  </button>
                </div>
              )}
            </div>

            {/* Alerts/Notifications */}
            <div className="relative">
              <button 
                onClick={toggleAlertsDropdown}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label={`Alerts ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75a2.25 2.25 0 0 0 4.5 0V9.75a6 6 0 0 0-12 0v3.75a2.25 2.25 0 0 0 4.5 0V9.75z" />
                </svg>
                
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown */}
              {isAlertsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Alerts
                        {unreadCount > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({unreadCount} unread)
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Alerts List */}
                  <div className="max-h-96 overflow-y-auto">
                    {recentAlerts.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="text-green-500 mb-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">No alerts. Jamie's care is on track!</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {recentAlerts.map(alert => (
                          <div 
                            key={alert.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${getAlertBorderColor(alert.type)} ${
                              alert.isRead ? 'opacity-75' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <AlertIcon type={alert.type} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className={`text-sm font-medium ${
                                      alert.isRead ? 'text-gray-600' : 'text-gray-900'
                                    }`}>
                                      {alert.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {alert.description}
                                    </p>
                                    
                                    <div className="flex items-center mt-2 space-x-3">
                                      <div className="flex items-center text-xs text-gray-500">
                                        <ClockIcon />
                                        <span className="ml-1">{alert.timestamp}</span>
                                      </div>
                                      
                                      {!alert.isRead && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          New
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 ml-2">
                                    {!alert.isRead && (
                                      <button
                                        onClick={() => handleMarkAsRead(alert.id)}
                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                        title="Mark as read"
                                        aria-label="Mark as read"
                                      >
                                        <CheckIcon />
                                      </button>
                                    )}
                                    
                                    <button
                                      onClick={() => handleDismissAlert(alert.id)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Dismiss"
                                      aria-label="Dismiss alert"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <div className="mt-3">
                                  <button 
                                    onClick={() => handleViewDetails(alert.id)}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                  >
                                    {alert.actionText}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar; 