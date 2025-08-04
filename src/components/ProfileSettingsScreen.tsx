import React, { useState } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v6a4 4 0 004 4h6a4 4 0 004-4V6a4 4 0 00-4-4H6a4 4 0 00-2.83 1.17z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const LoadingSpinnerIcon = () => (
  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface ProfileSettingsScreenProps {
  onBack: () => void;
}

const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [allowCareTeamExport, setAllowCareTeamExport] = useState(true);
  const [receiveAIInsights, setReceiveAIInsights] = useState(true);
  const [isAccessLogOpen, setIsAccessLogOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  
  // App Preferences state
  const [dailySummaryNotifications, setDailySummaryNotifications] = useState(true);
  const [urgentAlertNotifications, setUrgentAlertNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Account Management state
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [hasPatientInfo, setHasPatientInfo] = useState(true); // For empty state demo

  const patientInfo = {
    name: 'Jamie Smith',
    age: '8 years old',
    gender: 'Female',
    diagnosis: 'PMS (Phelan-McDermid Syndrome)',
    avatar: 'JS',
    dateOfBirth: 'March 15, 2016',
    primaryCaregiver: 'Dad (John Smith)',
    emergencyContact: 'Mom (Sarah Smith) - (555) 123-4567',
    otherDiagnoses: ['Epilepsy', 'Sleep disorder', 'GI issues']
  };

  const emergencyContacts = [
    {
      id: '1',
      name: 'Mom (Sarah Smith)',
      relationship: 'Mother',
      phone: '(555) 123-4567',
      email: 'sarah.smith@email.com',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dad (John Smith)',
      relationship: 'Father',
      phone: '(555) 234-5678',
      email: 'john.smith@email.com',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Aunt Maria',
      relationship: 'Aunt',
      phone: '(555) 345-6789',
      email: '',
      isPrimary: false
    }
  ];

  const primaryCareProvider = {
    name: 'Dr. Emily Johnson',
    specialty: 'Pediatrician',
    phone: '(555) 456-7890',
    email: 'dr.johnson@childrenshospital.com',
    clinic: 'Children\'s Medical Center'
  };

  const medicalInfo = {
    medications: ['Risperidone 0.5mg', 'Melatonin 3mg'],
    allergies: ['Peanuts', 'Latex'],
    conditions: ['Epilepsy', 'Sleep disorder', 'GI issues'],
    bloodType: 'O+',
    height: '4\'2"',
    weight: '45 lbs'
  };

  const accessLogs = [
    {
      id: '1',
      user: 'Dr. Emily Johnson',
      role: 'Primary Care Provider',
      action: 'Viewed symptom logs',
      timestamp: '2024-01-15T14:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'Children\'s Medical Center'
    },
    {
      id: '2',
      user: 'Sarah Smith (Mom)',
      role: 'Care Team Member',
      action: 'Exported nutrition report',
      timestamp: '2024-01-14T09:15:00Z',
      ipAddress: '192.168.1.101',
      location: 'Home Network'
    },
    {
      id: '3',
      user: 'John Smith (Dad)',
      role: 'Care Team Member',
      action: 'Updated medication list',
      timestamp: '2024-01-13T16:45:00Z',
      ipAddress: '192.168.1.102',
      location: 'Mobile Network'
    },
    {
      id: '4',
      user: 'Dr. Michael Chen',
      role: 'Specialist',
      action: 'Viewed medical history',
      timestamp: '2024-01-12T11:20:00Z',
      ipAddress: '10.0.0.50',
      location: 'Specialist Clinic'
    }
  ];

  const consentForms = [
    {
      id: '1',
      title: 'Data Sharing Consent',
      status: 'Active',
      lastUpdated: '2024-01-10',
      description: 'Consent to share data with care team members'
    },
    {
      id: '2',
      title: 'AI Insights Consent',
      status: 'Active',
      lastUpdated: '2024-01-08',
      description: 'Consent to receive AI-powered health insights'
    },
    {
      id: '3',
      title: 'Research Participation',
      status: 'Pending',
      lastUpdated: '2024-01-05',
      description: 'Consent to participate in research studies'
    }
  ];

  const accountInfo = {
    email: 'john.smith@email.com',
    phone: '(555) 234-5678',
    lastLogin: '2024-01-15T16:30:00Z',
    accountCreated: '2023-06-15T10:00:00Z',
    twoFactorEnabled: true,
    linkedAccounts: ['Google', 'Apple Health']
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // TODO: Navigate to edit profile screen
  };

  const handleManagePrivacy = () => {
    console.log('Manage privacy clicked');
    // TODO: Navigate to privacy settings
  };

  const handleNotificationSettings = () => {
    console.log('Notification settings clicked');
    // TODO: Navigate to notification settings
  };

  const handleDataExport = () => {
    console.log('Data export clicked');
    // TODO: Show data export options
  };

  const handleAccountSettings = () => {
    console.log('Account settings clicked');
    // TODO: Navigate to account settings
  };

  const handleHelpSupport = () => {
    console.log('Help & support clicked');
    // TODO: Navigate to help/support
  };

  const handleAboutApp = () => {
    console.log('About app clicked');
    // TODO: Show app information
  };

  const handleEditAvatar = () => {
    console.log('Edit avatar clicked');
    // TODO: Open avatar/photo picker
  };

  const handleAddDiagnosis = () => {
    console.log('Add diagnosis clicked');
    // TODO: Open diagnosis input modal
  };

  const handleRemoveDiagnosis = (diagnosis: string) => {
    console.log('Remove diagnosis:', diagnosis);
    // TODO: Remove diagnosis from list
  };

  const handleAddEmergencyContact = () => {
    console.log('Add emergency contact clicked');
    // TODO: Open emergency contact modal
  };

  const handleEditEmergencyContact = (contactId: string) => {
    console.log('Edit emergency contact:', contactId);
    // TODO: Open edit emergency contact modal
  };

  const handleAddAllergy = () => {
    console.log('Add allergy clicked');
    // TODO: Open allergy input modal
  };

  const handleRemoveAllergy = (allergy: string) => {
    console.log('Remove allergy:', allergy);
    // TODO: Remove allergy from list
  };

  const handleAddMedication = () => {
    console.log('Add medication clicked');
    // TODO: Open medication input modal
  };

  const handleEditMedication = (medication: string) => {
    console.log('Edit medication:', medication);
    // TODO: Open edit medication modal
  };

  const handleViewAccessLog = () => {
    setIsAccessLogOpen(!isAccessLogOpen);
  };

  const handleViewConsentForms = () => {
    setIsConsentModalOpen(true);
  };

  const handleCloseConsentModal = () => {
    setIsConsentModalOpen(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // App Preferences handlers
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  // Account Management handlers
  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Implement logout logic
    alert('Logout functionality would be implemented here');
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false);
  };

  const handleConfirmDeleteAccount = () => {
    console.log('Account deletion confirmed');
    // TODO: Implement account deletion logic
    alert('Account deletion would be implemented here');
    setIsDeleteAccountModalOpen(false);
  };

  const handleToggleEmptyState = () => {
    setHasPatientInfo(!hasPatientInfo);
  };

  const handleToggleLoading = () => {
    setIsLoading(!isLoading);
  };

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
            <h1 className="text-lg font-semibold text-gray-900">Profile & Settings</h1>
            <p className="text-sm text-gray-600">Manage Jamie's information and app preferences.</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinnerIcon />
              <p className="text-gray-600 mt-4">Loading profile information...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasPatientInfo && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patient Information Added Yet</h3>
              <p className="text-gray-600 mb-6">Tap 'Edit Info' to get started with Jamie's profile and health information.</p>
              <button
                onClick={handleToggleEmptyState}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Patient Information
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Only show when not loading and has patient info */}
        {!isLoading && hasPatientInfo && (
          <>
            {/* Patient Information Section */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
          </div>
          <div className="p-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {patientInfo.avatar}
                </div>
                <button
                  onClick={handleEditAvatar}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{patientInfo.name}</h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">{patientInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium text-gray-900">{patientInfo.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Diagnosis */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Primary Diagnosis
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  defaultValue={patientInfo.diagnosis}
                >
                  <option value="PMS (Phelan-McDermid Syndrome)">PMS (Phelan-McDermid Syndrome)</option>
                  <option value="Angelman Syndrome">Angelman Syndrome</option>
                  <option value="Prader-Willi Syndrome">Prader-Willi Syndrome</option>
                  <option value="Williams Syndrome">Williams Syndrome</option>
                  <option value="Down Syndrome">Down Syndrome</option>
                  <option value="Fragile X Syndrome">Fragile X Syndrome</option>
                  <option value="Rett Syndrome">Rett Syndrome</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Other Diagnoses */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Other Diagnoses & Comorbidities
                </label>
                <button
                  onClick={handleAddDiagnosis}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {patientInfo.otherDiagnoses.map((diagnosis, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-900">{diagnosis}</span>
                    <button
                      onClick={() => handleRemoveDiagnosis(diagnosis)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove diagnosis"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {patientInfo.otherDiagnoses.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No additional diagnoses added yet
                  </div>
                )}
              </div>
            </div>

            {/* Edit Info Button */}
            <div className="flex justify-end">
              <button
                onClick={handleEditProfile}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
              >
                Edit Info
              </button>
            </div>
          </div>
                 </div>

         {/* Emergency & Medical Details Section */}
         <div className="bg-white rounded-xl border border-gray-200">
           <div className="p-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900">Emergency & Medical Details</h3>
           </div>
           <div className="p-6 space-y-6">
             {/* Emergency Contacts */}
             <div>
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-sm font-medium text-gray-900">Emergency Contacts</h4>
                 <button
                   onClick={handleAddEmergencyContact}
                   className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   <span>Add Contact</span>
                 </button>
               </div>
               <div className="space-y-3">
                 {emergencyContacts.map((contact) => (
                   <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center space-x-2 mb-2">
                           <h5 className="text-sm font-medium text-gray-900">{contact.name}</h5>
                           {contact.isPrimary && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               Primary
                             </span>
                           )}
                           <span className="text-xs text-gray-500">({contact.relationship})</span>
                         </div>
                         <div className="space-y-1">
                           <div className="flex items-center space-x-2 text-sm text-gray-600">
                             <PhoneIcon />
                             <span>{contact.phone}</span>
                           </div>
                           {contact.email && (
                             <div className="flex items-center space-x-2 text-sm text-gray-600">
                               <EmailIcon />
                               <span>{contact.email}</span>
                             </div>
                           )}
                         </div>
                       </div>
                       <button
                         onClick={() => handleEditEmergencyContact(contact.id)}
                         className="ml-3 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                         title="Edit contact"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Primary Care Provider */}
             <div>
               <h4 className="text-sm font-medium text-gray-900 mb-3">Primary Care Provider</h4>
               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <h5 className="text-sm font-medium text-gray-900 mb-1">{primaryCareProvider.name}</h5>
                     <p className="text-xs text-gray-600 mb-2">{primaryCareProvider.specialty} • {primaryCareProvider.clinic}</p>
                     <div className="space-y-1">
                       <div className="flex items-center space-x-2 text-sm text-gray-600">
                         <PhoneIcon />
                         <span>{primaryCareProvider.phone}</span>
                       </div>
                       <div className="flex items-center space-x-2 text-sm text-gray-600">
                         <EmailIcon />
                         <span>{primaryCareProvider.email}</span>
                       </div>
                     </div>
                   </div>
                   <button
                     className="ml-3 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                     title="Edit provider"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                   </button>
                 </div>
               </div>
             </div>

             {/* Allergies & Medical Alerts */}
             <div>
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-sm font-medium text-gray-900">Allergies & Medical Alerts</h4>
                 <button
                   onClick={handleAddAllergy}
                   className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   <span>Add Allergy</span>
                 </button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {medicalInfo.allergies.map((allergy, index) => (
                   <div key={index} className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                     <AlertIcon />
                     <span className="text-sm text-red-700 font-medium">{allergy}</span>
                     <button
                       onClick={() => handleRemoveAllergy(allergy)}
                       className="text-red-500 hover:text-red-700 transition-colors"
                       title="Remove allergy"
                     >
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                     </button>
                   </div>
                 ))}
                 {medicalInfo.allergies.length === 0 && (
                   <div className="text-center py-4 text-gray-500 text-sm">
                     No allergies recorded
                   </div>
                 )}
               </div>
             </div>

             {/* Medications */}
             <div>
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-sm font-medium text-gray-900">Current Medications</h4>
                 <button
                   onClick={handleAddMedication}
                   className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   <span>Add Medication</span>
                 </button>
               </div>
               <div className="space-y-2">
                 {medicalInfo.medications.map((medication, index) => (
                   <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                     <div className="flex items-center space-x-2">
                       <PillIcon />
                       <span className="text-sm text-gray-900">{medication}</span>
                     </div>
                     <button
                       onClick={() => handleEditMedication(medication)}
                       className="text-gray-400 hover:text-indigo-600 transition-colors"
                       title="Edit medication"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </button>
                   </div>
                 ))}
                 {medicalInfo.medications.length === 0 && (
                   <div className="text-center py-4 text-gray-500 text-sm">
                     No medications recorded
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>

         {/* Data Security & Privacy Section */}
         <div className="bg-white rounded-xl border border-gray-200">
           <div className="p-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900">Data Security & Privacy</h3>
           </div>
           <div className="p-6 space-y-6">
             {/* Access Log */}
             <div>
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-sm font-medium text-gray-900">Access Log</h4>
                 <button
                   onClick={handleViewAccessLog}
                   className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-2"
                 >
                   <EyeIcon />
                   <span>See who accessed Jamie's data</span>
                   {isAccessLogOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                 </button>
               </div>
               
               {isAccessLogOpen && (
                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                   <div className="space-y-3">
                     {accessLogs.map((log) => (
                       <div key={log.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                         <div className="flex-1">
                           <div className="flex items-center space-x-2 mb-1">
                             <h5 className="text-sm font-medium text-gray-900">{log.user}</h5>
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                               {log.role}
                             </span>
                           </div>
                           <p className="text-sm text-gray-600 mb-1">{log.action}</p>
                           <div className="flex items-center space-x-4 text-xs text-gray-500">
                             <span>{formatTimestamp(log.timestamp)}</span>
                             <span>IP: {log.ipAddress}</span>
                             <span>{log.location}</span>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             {/* Data Sharing Preferences */}
             <div>
               <h4 className="text-sm font-medium text-gray-900 mb-4">Data Sharing Preferences</h4>
               <div className="space-y-4">
                 {/* Care Team Export Toggle */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <ShareIcon />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">Allow care team to export data</p>
                       <p className="text-xs text-gray-500">Let team members download reports and data</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={allowCareTeamExport}
                       onChange={(e) => setAllowCareTeamExport(e.target.checked)}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
                 </div>

                 {/* AI Insights Toggle */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                       <CogIcon />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">Receive AI-powered insights</p>
                       <p className="text-xs text-gray-500">Get personalized health recommendations</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={receiveAIInsights}
                       onChange={(e) => setReceiveAIInsights(e.target.checked)}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
                 </div>
               </div>
             </div>

             {/* Consent Management */}
             <div>
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-sm font-medium text-gray-900">Consent Management</h4>
                 <button
                   onClick={handleViewConsentForms}
                   className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-2"
                 >
                   <DocumentIcon />
                   <span>View/edit consent forms</span>
                 </button>
               </div>
               <div className="space-y-2">
                 {consentForms.map((consent) => (
                   <div key={consent.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                     <div className="flex-1">
                       <div className="flex items-center space-x-2 mb-1">
                         <h5 className="text-sm font-medium text-gray-900">{consent.title}</h5>
                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                           consent.status === 'Active' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {consent.status}
                         </span>
                       </div>
                       <p className="text-xs text-gray-600">{consent.description}</p>
                       <p className="text-xs text-gray-500">Last updated: {consent.lastUpdated}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>

         {/* App Preferences Section */}
         <div className="bg-white rounded-xl border border-gray-200">
           <div className="p-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900">App Preferences</h3>
           </div>
           <div className="p-6 space-y-6">
             {/* Notifications */}
             <div>
               <h4 className="text-sm font-medium text-gray-900 mb-4">Notifications</h4>
               <div className="space-y-4">
                 {/* Daily Summary Notifications */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <BellIcon />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">Daily summary notifications</p>
                       <p className="text-xs text-gray-500">Receive daily health summaries</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={dailySummaryNotifications}
                       onChange={(e) => setDailySummaryNotifications(e.target.checked)}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
                 </div>

                 {/* Urgent Alert Notifications */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                       <AlertIcon />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">Urgent alert notifications</p>
                       <p className="text-xs text-gray-500">Get immediate alerts for urgent issues</p>
                     </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={urgentAlertNotifications}
                       onChange={(e) => setUrgentAlertNotifications(e.target.checked)}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
                 </div>
               </div>
             </div>

             {/* Theme */}
             <div>
               <h4 className="text-sm font-medium text-gray-900 mb-4">Theme</h4>
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-900">Dark mode</p>
                     <p className="text-xs text-gray-500">Switch between light and dark themes</p>
                   </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input
                     type="checkbox"
                     checked={isDarkMode}
                     onChange={(e) => setIsDarkMode(e.target.checked)}
                     className="sr-only peer"
                   />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                 </label>
               </div>
             </div>

             {/* Language */}
             <div>
               <h4 className="text-sm font-medium text-gray-900 mb-4">Language</h4>
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                   </svg>
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-medium text-gray-900">Language preference</p>
                   <p className="text-xs text-gray-500">Choose your preferred language</p>
                 </div>
                 <div className="relative">
                   <select
                     value={selectedLanguage}
                     onChange={(e) => handleLanguageChange(e.target.value)}
                     className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   >
                     <option value="English">English</option>
                     <option value="Spanish">Spanish</option>
                     <option value="French">French</option>
                     <option value="German">German</option>
                     <option value="Chinese">Chinese</option>
                     <option value="Japanese">Japanese</option>
                     <option value="Korean">Korean</option>
                     <option value="Arabic">Arabic</option>
                   </select>
                   <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                     <ChevronDownIcon />
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* Medical Information */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Medications</h4>
                <div className="space-y-1">
                  {medicalInfo.medications.map((med, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      {med}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Allergies</h4>
                <div className="space-y-1">
                  {medicalInfo.allergies.map((allergy, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      {allergy}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500">Blood Type</p>
                <p className="text-sm font-medium text-gray-900">{medicalInfo.bloodType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Height</p>
                <p className="text-sm font-medium text-gray-900">{medicalInfo.height}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-medium text-gray-900">{medicalInfo.weight}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Conditions</p>
                <p className="text-sm font-medium text-gray-900">{medicalInfo.conditions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <button
              onClick={handleManagePrivacy}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShieldIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Privacy & Security</p>
                  <p className="text-xs text-gray-500">Manage data sharing and permissions</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            <button
              onClick={handleNotificationSettings}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BellIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Notification Settings</p>
                  <p className="text-xs text-gray-500">Customize alerts and reminders</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            <button
              onClick={handleDataExport}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CogIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Data Export</p>
                  <p className="text-xs text-gray-500">Download your data and reports</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            <button
              onClick={handleAccountSettings}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Account Settings</p>
                  <p className="text-xs text-gray-500">Manage your account and preferences</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Linked Account Info */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Linked Account</p>
                  <p className="text-xs text-gray-500">{accountInfo.email}</p>
                  <p className="text-xs text-gray-500">{accountInfo.phone}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Last login: {formatTimestamp(accountInfo.lastLogin)}</p>
                <p>Account created: {formatTimestamp(accountInfo.accountCreated)}</p>
                <p>Two-factor authentication: {accountInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>

            {/* Change Password */}
            <button
              onClick={handleChangePassword}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <KeyIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <LogoutIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Log Out</p>
                  <p className="text-xs text-gray-500">Sign out of your account</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrashIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-red-600">Delete Account</p>
                  <p className="text-xs text-gray-500">Permanently delete your account and data</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Demo Controls</h3>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleToggleEmptyState}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              {hasPatientInfo ? 'Show Empty State' : 'Show Patient Info'}
            </button>
            <button
              onClick={handleToggleLoading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </button>
          </div>
        </div>

        {/* Support & About */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Support & About</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <button
              onClick={handleHelpSupport}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HeartIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Help & Support</p>
                  <p className="text-xs text-gray-500">Get help and contact support</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            <button
              onClick={handleAboutApp}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CogIcon />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">About CareGene</p>
                  <p className="text-xs text-gray-500">Version 1.0.0 • Privacy Policy</p>
                </div>
              </div>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
          </>
        )}
      </main>

       {/* Change Password Modal */}
       {isChangePasswordModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-md w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                 <button
                   onClick={handleCloseChangePasswordModal}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
               <p className="text-sm text-gray-600 mt-2">Update your account password</p>
             </div>
             
             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                 <input
                   type="password"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="Enter current password"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                 <input
                   type="password"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="Enter new password"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                 <input
                   type="password"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="Confirm new password"
                 />
               </div>
               
               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleCloseChangePasswordModal}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Cancel
                 </button>
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                   Update Password
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Delete Account Modal */}
       {isDeleteAccountModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-md w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
                 <button
                   onClick={handleCloseDeleteAccountModal}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
               <p className="text-sm text-gray-600 mt-2">This action cannot be undone</p>
             </div>
             
             <div className="p-6 space-y-4">
               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                 <div className="flex items-start space-x-3">
                   <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                     <AlertIcon />
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-red-800">Warning</h3>
                     <p className="text-sm text-red-700 mt-1">
                       Deleting your account will permanently remove all data including:
                     </p>
                     <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                       <li>All patient information</li>
                       <li>Symptom logs and health data</li>
                       <li>Nutrition plans and recipes</li>
                       <li>Care team connections</li>
                       <li>Account settings and preferences</li>
                     </ul>
                   </div>
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Type "DELETE" to confirm</label>
                 <input
                   type="text"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                   placeholder="Type DELETE to confirm"
                 />
               </div>
               
               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleCloseDeleteAccountModal}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleConfirmDeleteAccount}
                   className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                 >
                   Delete Account
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Consent Forms Modal */}
       {isConsentModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-gray-900">Consent Forms</h2>
                 <button
                   onClick={handleCloseConsentModal}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
               <p className="text-sm text-gray-600 mt-2">Manage consent forms and permissions for Jamie's data</p>
             </div>
             
             <div className="p-6 space-y-4">
               {consentForms.map((consent) => (
                 <div key={consent.id} className="border border-gray-200 rounded-lg p-4">
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex-1">
                       <div className="flex items-center space-x-2 mb-2">
                         <h3 className="text-lg font-medium text-gray-900">{consent.title}</h3>
                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                           consent.status === 'Active' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {consent.status}
                         </span>
                       </div>
                       <p className="text-sm text-gray-600 mb-2">{consent.description}</p>
                       <p className="text-xs text-gray-500">Last updated: {consent.lastUpdated}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <div className="flex space-x-2">
                       <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">
                         View Details
                       </button>
                       <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm">
                         Edit
                       </button>
                     </div>
                     {consent.status === 'Pending' && (
                       <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm">
                         Approve
                       </button>
                     )}
                   </div>
                 </div>
               ))}
               
               <div className="mt-6 pt-4 border-t border-gray-200">
                 <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                   Add New Consent Form
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default ProfileSettingsScreen; 