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
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <QuickLogIcon />
            <span>Quick Log</span>
          </button>
          
          {/* AI Summary Button */}
          <button
            onClick={onAISummary}
            className="inline-flex items-center space-x-2 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <AISummaryIcon />
            <span>AI Summary</span>
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

interface QuickActionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'symptom' | 'nutrition' | 'medication') => void;
}

const QuickActionsBottomSheet: React.FC<QuickActionsBottomSheetProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Quick Actions</h3>
          <p className="text-sm text-gray-600 text-center mt-1">What would you like to log?</p>
        </div>
        
        {/* Action tiles */}
        <div className="px-6 pb-8 space-y-4">
          {/* Log Symptom */}
          <button
            onClick={() => onSelect('symptom')}
            className="w-full p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl hover:border-red-300 hover:from-red-100 hover:to-pink-100 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <SymptomIcon className="text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-gray-900">Log Symptom</div>
                <div className="text-sm text-gray-600 mt-1">Track how you're feeling</div>
              </div>
            </div>
          </button>
          
          {/* Log Nutrition */}
          <button
            onClick={() => onSelect('nutrition')}
            className="w-full p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:border-green-300 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <NutritionIcon className="text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-gray-900">Log Nutrition</div>
                <div className="text-sm text-gray-600 mt-1">Record your meals</div>
              </div>
            </div>
          </button>
          
          {/* Log Medication */}
          <button
            onClick={() => onSelect('medication')}
            className="w-full p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <MedicationIcon className="text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-gray-900">Log Medication</div>
                <div className="text-sm text-gray-600 mt-1">Track your doses</div>
              </div>
            </div>
          </button>
        </div>
        
        {/* Cancel button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full p-4 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
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
  const [showQuickActionsSheet, setShowQuickActionsSheet] = useState(false);
  
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

  const greeting = `Good ${currentTime}, Jamie's Mom!`;

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

  const handleQuickActionsSelect = (type: 'symptom' | 'nutrition' | 'medication') => {
    setShowQuickActionsSheet(false);
    addToast({
      type: 'info',
      title: 'Navigating',
      message: `Opening ${type} form in Log & Track...`,
      duration: 2000
    });
    // Route to relevant Quick Log form within Log & Track
    // This will be implemented in Phase 3
    console.log(`Navigate to ${type} form in Log & Track`);
    onNavigateToLog?.();
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
      
      {/* Content Area */}
      <div className="px-4 py-6">
        {/* Personalized Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>
        </div>

        {/* Jamie's Care Snapshot */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 shadow-sm mb-8" role="region" aria-label="Personalized care insights">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">Jamie's Care Snapshot</h3>
              <div className="space-y-2 text-sm text-indigo-800">
                <p>• Jamie has logged <span className="font-semibold text-indigo-900">headaches</span> 4 times in the last 2 months</p>
                <p>• <span className="font-semibold text-indigo-900">Iron intake</span> is below target this week</p>
                <p>• <span className="font-semibold text-indigo-900">Medication compliance</span> is at 85% this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* PMS-Specific Tip Carousel */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tips</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Do: Include leafy greens today</p>
                <p className="text-xs text-gray-600">Spinach and kale are rich in essential nutrients for PMS management</p>
                <button 
                  onClick={() => onNavigateToSymptomInsights?.('Fatigue', 3, 'Today')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                >
                  Why this recommendation? →
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 mt-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✗</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Don't: Skip hydration</p>
                <p className="text-xs text-gray-600">Aim for 8 glasses of water to support overall health</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => setShowQuickActionsSheet(true)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-label="Quick Actions"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Quick Log Selector Modal */}
      <QuickLogSelector
        isOpen={showQuickLogSelector}
        onClose={() => setShowQuickLogSelector(false)}
        onSelect={handleQuickLogSelect}
      />

      {/* Quick Actions Bottom Sheet */}
      <QuickActionsBottomSheet
        isOpen={showQuickActionsSheet}
        onClose={() => setShowQuickActionsSheet(false)}
        onSelect={handleQuickActionsSelect}
      />
    </div>
  );
};

export default HomeDashboard; 