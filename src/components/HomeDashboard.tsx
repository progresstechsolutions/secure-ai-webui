import React, { useState, useEffect } from 'react';

// Icon components
const QuickLogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const AISummaryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const OverflowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SymptomIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NutritionIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const MedicationIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

// Skip to main content link for accessibility
const SkipToMainContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Skip to main content
  </a>
);

// Toast System
interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-lg ${getToastStyles(toast.type)} transition-all duration-300 ease-in-out`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start space-x-3">
        {getIcon(toast.type)}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{toast.title}</h4>
          <p className="text-sm mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Confirm Dialog System
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'default',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    if (variant === 'destructive') {
      return {
        confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        icon: 'text-red-400'
      };
    }
    return {
      confirm: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      icon: 'text-indigo-400'
    };
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            {variant === 'destructive' ? (
              <svg className={`h-6 w-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              <svg className={`h-6 w-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{title}</h3>
          
          {/* Message */}
          <p className="text-sm text-gray-500 text-center mb-6">{message}</p>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${styles.confirm}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickLogSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'symptom' | 'nutrition' | 'medication') => void;
}

const QuickLogSelector: React.FC<QuickLogSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Log</h3>
          <p className="text-sm text-gray-600">What would you like to log?</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => onSelect('symptom')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
      <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">😷</span>
        </div>
              <div>
                <div className="font-medium text-gray-900">Symptom</div>
                <div className="text-sm text-gray-600">Log how you're feeling</div>
        </div>
      </div>
          </button>
          
      <button
            onClick={() => onSelect('nutrition')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🥗</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Nutrition</div>
                <div className="text-sm text-gray-600">Track your meals</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onSelect('medication')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💊</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Medication</div>
                <div className="text-sm text-gray-600">Record your doses</div>
              </div>
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 p-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface ModuleSubheaderProps {
  onQuickLog: () => void;
  onAISummary: () => void;
  onTextSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onHighContrastToggle: () => void;
  onShare: () => void;
  onPrint: () => void;
}

const ModuleSubheader: React.FC<ModuleSubheaderProps> = ({
  onQuickLog,
  onAISummary,
  onTextSizeChange,
  onHighContrastToggle,
  onShare,
  onPrint
}) => {
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);

  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    setTextSize(size);
    onTextSizeChange(size);
    setShowOverflowMenu(false);
  };

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast);
    onHighContrastToggle();
    setShowOverflowMenu(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and subtext */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Care Companion</h1>
          <p className="text-sm text-gray-600">Fast logging, clear insights, easy coordination.</p>
        </div>
        
        {/* Right side - Buttons and overflow menu */}
        <div className="flex items-center space-x-3">
          {/* Quick Log Button */}
          <button
            onClick={onQuickLog}
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-h-[44px]"
          >
            <QuickLogIcon />
            <span className="hidden sm:inline">Quick Log</span>
          </button>

          {/* Overflow Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <OverflowIcon />
            </button>
            
            {showOverflowMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                {/* Text Size Options */}
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Text Size</div>
                  <div className="space-y-1">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleTextSizeChange(size)}
                        className={`w-full text-left px-2 py-1 rounded text-sm ${
                          textSize === size ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
      </button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                {/* High Contrast Toggle */}
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">High Contrast</div>
                  <button
                    onClick={handleHighContrastToggle}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      highContrast ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {highContrast ? 'On' : 'Off'}
                  </button>
                </div>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                {/* Share and Print */}
                <button
                  onClick={() => { onShare(); setShowOverflowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Share
                </button>
                <button
                  onClick={() => { onPrint(); setShowOverflowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Print
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  </div>
);
};



interface HomeDashboardProps {
  onNavigateToSymptomInsights?: (symptomName: string, severity: number, date: string) => void;
  onNavigateToAlerts?: () => void;
  onNavigateToLog?: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  onNavigateToSymptomInsights, 
  onNavigateToAlerts, 
  onNavigateToLog 
}) => {
  const [currentTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  const [showQuickLogSelector, setShowQuickLogSelector] = useState(false);
  const [showVisitPacketModal, setShowVisitPacketModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  
  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    variant: 'default',
    onConfirm: () => {}
  });

  // AI Summary state
  const [aiSummaryData, setAiSummaryData] = useState<string[]>([
    "Consistent medication schedule observed this week",
    "Nutrition entries logged 4 of 7 days",
    "Sleep-related notes available for review",
    "Mood tracking shows positive trends",
    "Hydration levels need improvement"
  ]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Loading and empty states
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(true);

  const greeting = `Good ${currentTime}, Jamie's Mom!`;

  // Demo state toggle function
  const toggleDemoState = () => {
    if (isLoading) {
      setIsLoading(false);
      setHasData(false);
    } else if (!hasData) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setHasData(true);
      }, 2000);
    } else {
      setIsLoading(true);
      setHasData(false);
      setTimeout(() => {
        setIsLoading(false);
        setHasData(false);
      }, 2000);
    }
  };

  // AI Summary functions
  const handleRegenerateSummary = async () => {
    setIsRegenerating(true);
    addToast({
      type: 'info',
      title: 'Regenerating Summary',
      message: 'AI is analyzing your data...',
      duration: 2000
    });
    
    // Simulate API call
    setTimeout(() => {
      setAiSummaryData([
        "Updated medication compliance at 92% this week",
        "Nutrition tracking improved to 6 of 7 days",
        "New sleep patterns detected",
        "Stress levels showing improvement",
        "Exercise consistency needs attention"
      ]);
      setIsRegenerating(false);
      addToast({
        type: 'success',
        title: 'Summary Updated',
        message: 'AI summary has been regenerated successfully.',
        duration: 3000
      });
    }, 3000);
  };

  const handleSaveToVisitPacket = () => {
    addToast({
      type: 'success',
      title: 'Saved to Visit Packet',
      message: 'Summary has been added to your draft visit packet.',
      duration: 3000
    });
  };

  const handleCopySummary = () => {
    const summaryText = aiSummaryData.join('\n');
    navigator.clipboard.writeText(summaryText);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'AI summary has been copied to your clipboard.',
      duration: 2000
    });
  };

  // Toast functions
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString()
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirm dialog functions
  const showConfirmDialog = (config: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      ...config,
      isOpen: true
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleQuickLog = () => {
    setShowQuickLogSelector(true);
  };

  const handleQuickLogSelect = (type: 'symptom' | 'nutrition' | 'medication') => {
    setShowQuickLogSelector(false);
    addToast({
      type: 'success',
      title: 'Log Created',
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} log has been created successfully.`,
      duration: 3000
    });
    // Handle navigation based on type
    switch (type) {
      case 'symptom':
        onNavigateToLog?.();
        break;
      case 'nutrition':
        onNavigateToLog?.();
        break;
      case 'medication':
        onNavigateToLog?.();
        break;
    }
  };



  const handleAISummary = () => {
    addToast({
      type: 'info',
      title: 'AI Summary',
      message: 'Navigating to AI Summary section...',
      duration: 2000
    });
    // Route to Home and scroll to AI Summary card
    // This will be implemented when we add the AI Summary section
    console.log('Navigate to AI Summary');
  };

  // Recent Activity routing function
  const handleActivityView = (activityType: string, activityText: string) => {
    // Show confirm dialog with activity details before routing
    showConfirmDialog({
      title: 'View Activity Details',
      message: `Are you sure you want to view the details for:\n\n"${activityText}"\n\nThis will navigate to the ${activityType} section in Log & Track > Journal.`,
      confirmText: 'View Details',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: () => {
        // Hide the confirm dialog
        hideConfirmDialog();
        
        // Show navigation toast
        switch (activityType) {
          case 'medication':
            addToast({
              type: 'success',
              title: 'Opening Medication Details',
              message: 'Navigating to Log & Track > Medication > Journal...',
              duration: 2000
            });
            // TODO: Route to Log & Track > Medication > Journal with activity ID
            console.log('Navigate to Medication Journal:', activityText);
            break;
          case 'nutrition':
            addToast({
              type: 'success',
              title: 'Opening Nutrition Details',
              message: 'Navigating to Log & Track > Nutrition > Journal...',
              duration: 2000
            });
            // TODO: Route to Log & Track > Nutrition > Journal with activity ID
            console.log('Navigate to Nutrition Journal:', activityText);
            break;
          case 'symptom':
            addToast({
              type: 'success',
              title: 'Opening Symptom Details',
              message: 'Navigating to Log & Track > Symptoms > Journal...',
              duration: 2000
            });
            // TODO: Route to Log & Track > Symptoms > Journal with activity ID
            console.log('Navigate to Symptoms Journal:', activityText);
            break;
          case 'share':
            addToast({
              type: 'success',
              title: 'Opening Share Details',
              message: 'Navigating to Care Team > Sharing History...',
              duration: 2000
            });
            // TODO: Route to Care Team > Sharing History with activity ID
            console.log('Navigate to Sharing History:', activityText);
            break;
          default:
            addToast({
              type: 'success',
              title: 'Opening Details',
              message: 'Navigating to Log & Track > Journal...',
              duration: 2000
            });
            // TODO: Route to Log & Track > Journal with activity ID
            console.log('Navigate to Journal:', activityText);
        }
      }
    });
  };

  // View All Activities routing function
  const handleViewAllActivities = () => {
    showConfirmDialog({
      title: 'View All Activities',
      message: 'Are you sure you want to view all activities?\n\nThis will navigate to the Log & Track > Journal section where you can see your complete activity history with filters and search options.',
      confirmText: 'View All',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: () => {
        // Hide the confirm dialog
        hideConfirmDialog();
        
        // Show navigation toast
        addToast({
          type: 'success',
          title: 'View All Activities',
          message: 'Navigating to Log & Track > Journal section...',
          duration: 2000
        });
        // TODO: Route to Log & Track > Journal (full activity view with filters)
        console.log('Navigate to full Journal view');
      }
    });
  };

  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    addToast({
      type: 'success',
      title: 'Text Size Changed',
      message: `Text size has been set to ${size}.`,
      duration: 2000
    });
    // Implement text size change logic
    console.log('Text size changed to:', size);
  };

  const handleHighContrastToggle = () => {
    addToast({
      type: 'info',
      title: 'High Contrast',
      message: 'High contrast mode has been toggled.',
      duration: 2000
    });
    // Implement high contrast toggle logic
    console.log('High contrast toggled');
  };

  const handleShare = () => {
    showConfirmDialog({
      title: 'Share Page',
      message: 'Are you sure you want to share this page? This will create a shareable link.',
      confirmText: 'Share',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: () => {
        hideConfirmDialog();
        addToast({
          type: 'success',
          title: 'Shared Successfully',
          message: 'Page has been shared successfully.',
          duration: 3000
        });
        // Implement share functionality
        console.log('Share current page');
      }
    });
  };

  const handlePrint = () => {
    showConfirmDialog({
      title: 'Print Page',
      message: 'Are you sure you want to print this page? This will open the print dialog.',
      confirmText: 'Print',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: () => {
        hideConfirmDialog();
        addToast({
          type: 'success',
          title: 'Print Dialog Opened',
          message: 'Print dialog has been opened.',
          duration: 2000
        });
        // Implement print functionality
        window.print();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <SkipToMainContent />
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={hideConfirmDialog}
      />

      {/* Module Subheader */}
      <ModuleSubheader
        onQuickLog={handleQuickLog}
        onAISummary={handleAISummary}
        onTextSizeChange={handleTextSizeChange}
        onHighContrastToggle={handleHighContrastToggle}
        onShare={handleShare}
        onPrint={handlePrint}
      />
      
      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Left side - Welcome message and subtext */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Welcome back, Jamie's Mom
              </h2>
              <p className="text-lg text-gray-700">
                Here's what's new and what you can do next.
              </p>
        </div>

            {/* Right side - All three buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              {/* Quick Log Button */}
              <button
                onClick={handleQuickLog}
                className="inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium min-h-[44px] text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
                <span>Quick Log</span>
              </button>

              {/* Generate Visit Packet Button */}
              <button
                onClick={() => setShowVisitPacketModal(true)}
                className="inline-flex items-center justify-center space-x-2 bg-white text-indigo-700 border border-indigo-300 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium min-h-[44px] text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Generate Visit Packet</span>
              </button>

              {/* Demo State Toggle Button */}
              <button
                onClick={toggleDemoState}
                className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium min-h-[44px] text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Demo States</span>
              </button>
            </div>
              </div>
            </div>

        {/* AI Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI Summary (last 7 days)</h3>
              <p className="text-sm text-gray-600">Intelligent insights from your care logs</p>
          </div>
        </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : !hasData ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h4>
              <p className="text-gray-600 mb-4">Connect your logs to see insights. Try logging a symptom, meal, or medication.</p>
              <button
                onClick={handleQuickLog}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Logging
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-600">Consistent medication schedule observed</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-600">Nutrition entries logged 4 of 7 days</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-600">Sleep-related notes available</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-600">Mood tracking shows improvement trend</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-600">Exercise routine maintained 3 times this week</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRegenerateSummary}
                  disabled={isRegenerating}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRegenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveToVisitPacket}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Save to Visit Packet</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* This Week at a Glance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Logging Streak Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">3/7</div>
                <div className="text-sm text-gray-600">days</div>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Logging Streak</h4>
            <p className="text-gray-600 text-sm mb-4">You've logged 3 of 7 days.</p>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Log Today',
                  message: 'Opening today\'s log form...',
                  duration: 2000
                });
                handleQuickLog();
              }}
              className="w-full px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Log today
            </button>
          </div>

          {/* Upcoming Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">items</div>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Items</h4>
            <p className="text-gray-600 text-sm mb-4">2 refills due; 1 school form expiring</p>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'View Tasks',
                  message: 'Opening tasks view...',
                  duration: 2000
                });
              }}
              className="w-full px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              View tasks
            </button>
          </div>

          {/* Journal Highlights Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">entries</div>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Journal Highlights</h4>
            <p className="text-gray-600 text-sm mb-4">12 entries added this week</p>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'View Journal',
                  message: 'Opening journal view...',
                  duration: 2000
                });
                onNavigateToLog?.();
              }}
              className="w-full px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              View Journal
            </button>
          </div>
        </div>

        {/* Quick Log Strip */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Symptom Button */}
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Coming Soon',
                  message: 'Symptom logging form will be available in Phase 3',
                  duration: 3000
                });
              }}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Coming soon - Symptom logging form"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <SymptomIcon className="text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Symptom</h4>
                <p className="text-sm text-gray-600">Log how you're feeling</p>
              </div>
            </button>

            {/* Nutrition Button */}
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Coming Soon',
                  message: 'Nutrition logging form will be available in Phase 3',
                  duration: 3000
                });
              }}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              title="Coming soon - Nutrition logging form"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <NutritionIcon className="text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Nutrition</h4>
                <p className="text-sm text-gray-600">Track your meals</p>
              </div>
            </button>

            {/* Medication Button */}
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Coming Soon',
                  message: 'Medication logging form will be available in Phase 3',
                  duration: 3000
                });
              }}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Coming soon - Medication logging form"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <MedicationIcon className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Medication</h4>
                <p className="text-sm text-gray-600">Record your doses</p>
              </div>
            </button>
          </div>
        </div>

        {/* Care Prep Panel */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Care Prep</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visit Summary Tile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">30 days</div>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Visit Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">Generate a comprehensive 30-day overview for your next healthcare visit</p>
                <button 
                    onClick={() => setShowVisitPacketModal(true)}
                    className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                    Open Summary <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
              </div>
            </div>
          </div>
          
            {/* Share with Care Team Tile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">3 teams</div>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Share with Care Team</h4>
                  <p className="text-sm text-gray-600 mb-4">Select care team members and generate shareable reports</p>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Open Sharing <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Shortcuts Panel */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Refills & Authorizations */}
            <button
              onClick={() => {
                setComingSoonFeature('Refills & Authorizations');
                setShowComingSoonModal(true);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">2 due soon</div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Refills & Authorizations</h4>
              <p className="text-sm text-gray-600">Manage medication refills and insurance authorizations</p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Enteral Mixing Guide */}
            <button
              onClick={() => {
                setComingSoonFeature('Enteral Mixing Guide');
                setShowComingSoonModal(true);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-md hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">5 recipes</div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enteral Mixing Guide</h4>
              <p className="text-sm text-gray-600">Step-by-step enteral nutrition mixing instructions</p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* School Packet */}
            <button
              onClick={() => {
                setComingSoonFeature('School Packet');
                setShowComingSoonModal(true);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-md hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">1 packet</div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">School Packet</h4>
              <p className="text-sm text-gray-600">Download comprehensive school care information</p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Care Team Contacts */}
            <button
              onClick={() => {
                setComingSoonFeature('Care Team Contacts');
                setShowComingSoonModal(true);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-md hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="absolute top-4 right-4 text-sm font-medium text-gray-900">8 contacts</div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Care Team Contacts</h4>
              <p className="text-sm text-gray-600">Access your complete care team directory</p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button
              onClick={handleViewAllActivities}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              View All Activities
            </button>
          </div>

          <div className="space-y-4">
            {[
              { type: 'medication', text: 'Logged Medication: Amoxicillin 5 mL at 7:00 AM', time: '2 hours ago', color: 'blue' },
              { type: 'nutrition', text: 'Added Meal: Oatmeal and milk', time: '4 hours ago', color: 'green' },
              { type: 'share', text: 'Shared Visit Packet with Neurology', time: '1 day ago', color: 'purple' },
              { type: 'symptom', text: 'Logged Symptom: Headache (mild)', time: '1 day ago', color: 'red' },
              { type: 'medication', text: 'Scheduled Refill: Iron supplement', time: '2 days ago', color: 'blue' },
              { type: 'nutrition', text: 'Updated Nutrition Plan', time: '3 days ago', color: 'green' },
              { type: 'share', text: 'Sent Update to School Nurse', time: '4 days ago', color: 'purple' },
              { type: 'symptom', text: 'Logged Symptom: Fatigue (moderate)', time: '5 days ago', color: 'red' },
              { type: 'medication', text: 'Completed Medication Review', time: '1 week ago', color: 'blue' },
              { type: 'nutrition', text: 'Added Recipe to Library', time: '1 week ago', color: 'green' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  {activity.type === 'medication' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  )}
                  {activity.type === 'nutrition' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  )}
                  {activity.type === 'symptom' && (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {activity.type === 'share' && (
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <button
                  onClick={() => handleActivityView(activity.type, activity.text)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Supportive Footer */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">You're doing great!</h3>
            <p className="text-gray-700 mb-6">Small steps every day make care easier.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Coming Soon',
                    message: 'Tips section will be available in Phase 3',
                    duration: 3000
                  });
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Get tips
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Give feedback
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Log Selector Modal */}
      <QuickLogSelector
        isOpen={showQuickLogSelector}
        onClose={() => setShowQuickLogSelector(false)}
        onSelect={handleQuickLogSelect}
      />

      {/* Visit Packet Modal */}
      {showVisitPacketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Visit Packet</h3>
                <p className="text-sm text-gray-600 mb-6">AI is compiling your 30-day overview...</p>
                <button
                  onClick={() => setShowVisitPacketModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share with Care Team</h3>
              <div className="space-y-3 mb-6">
                {[
                  { name: 'Neurology', checked: true },
                  { name: 'School Nurse', checked: false },
                  { name: 'Therapist', checked: true },
                  { name: 'Primary Care', checked: false },
                  { name: 'Specialist', checked: false }
                ].map((provider, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={provider.checked}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">{provider.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowShareModal(false);
                    addToast({
                      type: 'success',
                      title: 'Shared Successfully',
                      message: 'Updates have been shared with your care team.',
                      duration: 3000
                    });
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Give Feedback</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your experience?</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        addToast({
                          type: 'success',
                          title: 'Thank You!',
                          message: `You rated us ${star} stars. Your feedback helps us improve.`,
                          duration: 3000
                        });
                        setShowFeedbackModal(false);
                      }}
                      className="text-2xl text-gray-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional comments (optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    addToast({
                      type: 'success',
                      title: 'Feedback Submitted',
                      message: 'Thank you for your feedback!',
                      duration: 3000
                    });
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Coming Soon!</h3>
              <p className="text-gray-600 text-center mb-6">
                The <span className="font-semibold">{comingSoonFeature}</span> feature is currently in development and will be available soon.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">What to expect:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {comingSoonFeature === 'Refills & Authorizations' && (
                    <>
                      <li>• Track medication refill due dates</li>
                      <li>• Manage insurance authorizations</li>
                      <li>• Automated refill reminders</li>
                    </>
                  )}
                  {comingSoonFeature === 'Enteral Mixing Guide' && (
                    <>
                      <li>• Step-by-step mixing instructions</li>
                      <li>• Recipe library with measurements</li>
                      <li>• Video tutorials and tips</li>
                    </>
                  )}
                  {comingSoonFeature === 'School Packet' && (
                    <>
                      <li>• Comprehensive care information</li>
                      <li>• Emergency contact details</li>
                      <li>• Medication and dietary requirements</li>
                    </>
                  )}
                  {comingSoonFeature === 'Care Team Contacts' && (
                    <>
                      <li>• Complete care team directory</li>
                      <li>• Direct messaging capabilities</li>
                      <li>• Appointment scheduling integration</li>
                    </>
                  )}
                </ul>
              </div>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard; 