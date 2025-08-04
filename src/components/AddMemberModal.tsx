import React, { useState } from 'react';

// Icon components
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (memberData: {
    name: string;
    role: string;
    type: 'doctor' | 'specialist' | 'family' | 'therapist';
    contactMethod: 'email' | 'phone';
    contactInfo: string;
    message: string;
    permissions: string[];
  }) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'family' as 'doctor' | 'specialist' | 'family' | 'therapist',
    contactMethod: 'email' as 'email' | 'phone',
    contactInfo: '',
    message: '',
    permissions: [] as string[]
  });

  const [currentStep, setCurrentStep] = useState(1);

  const roleTypes = [
    { value: 'family', label: 'Parent', color: 'bg-purple-100 text-purple-800' },
    { value: 'doctor', label: 'Doctor', color: 'bg-blue-100 text-blue-800' },
    { value: 'therapist', label: 'Therapist', color: 'bg-orange-100 text-orange-800' },
    { value: 'specialist', label: 'Other', color: 'bg-green-100 text-green-800' }
  ];

  const availablePermissions = {
    doctor: ['View symptoms', 'View nutrition plan', 'Send messages', 'Edit care plan'],
    specialist: ['View nutrition plan', 'Edit meal plans', 'Send messages'],
    family: ['View symptoms', 'View nutrition plan', 'Send messages'],
    therapist: ['View symptoms', 'Send messages', 'View care plan']
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset permissions when type changes
    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        permissions: []
      }));
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.name && formData.role && formData.contactInfo) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    if (formData.permissions.length > 0) {
      onInvite(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        role: '',
        type: 'family',
        contactMethod: 'email',
        contactInfo: '',
        message: '',
        permissions: []
      });
      setCurrentStep(1);
    }
  };

  const isStep1Valid = formData.name && formData.role && formData.contactInfo;
  const isStep2Valid = formData.permissions.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-2 h-0.5 ${
              currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Neurologist, Parent, Dietitian"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.type === type.value
                        ? `${type.color} border-current`
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Method
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInputChange('contactMethod', 'email')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.contactMethod === 'email'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <EmailIcon />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleInputChange('contactMethod', 'phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.contactMethod === 'phone'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <PhoneIcon />
                  <span>Phone</span>
                </button>
              </div>
            </div>

                         <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 {formData.contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
               </label>
               <input
                 type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                 value={formData.contactInfo}
                 onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                 placeholder={formData.contactMethod === 'email' ? 'Enter email address' : 'Enter phone number'}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Optional Message
               </label>
               <textarea
                 value={formData.message}
                 onChange={(e) => handleInputChange('message', e.target.value)}
                 placeholder={`Hi ${formData.name || '[Name]'}, I'd like to add you to Jamie's care team...`}
                 rows={3}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
               />
               <p className="text-xs text-gray-500 mt-1">
                 This message will be included in the invitation.
               </p>
             </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Next: Set Permissions
            </button>
          </div>
        )}

                 {/* Step 2: Permissions */}
         {currentStep === 2 && (
           <div className="p-4 space-y-4">
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">Set Permissions</h3>
               <p className="text-sm text-gray-600 mb-4">
                 Choose what {formData.name} can access and do in Jamie's care plan.
               </p>
             </div>

             {/* Invitation Preview */}
             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
               <h4 className="text-sm font-medium text-gray-900 mb-2">Invitation Preview</h4>
               <div className="text-sm text-gray-600 space-y-1">
                 <p><strong>To:</strong> {formData.contactInfo}</p>
                 <p><strong>Role:</strong> {formData.role} ({roleTypes.find(t => t.value === formData.type)?.label})</p>
                 {formData.message && (
                   <div>
                     <p><strong>Message:</strong></p>
                     <p className="italic">{formData.message}</p>
                   </div>
                 )}
               </div>
             </div>

            <div className="space-y-3">
              {availablePermissions[formData.type].map(permission => (
                <label key={permission} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-900">{permission}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isStep2Valid}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Invite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMemberModal; 