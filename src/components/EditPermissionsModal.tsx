import React, { useState, useEffect } from 'react';

// Icon components
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  type: 'doctor' | 'specialist' | 'family' | 'therapist';
  avatar: string;
  status: 'online' | 'offline' | 'invited' | 'pending';
  lastContact: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  permissions: string[];
}

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: CareTeamMember | undefined;
  onUpdatePermissions: (memberId: string, newPermissions: string[]) => void;
}

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({ 
  isOpen, 
  onClose, 
  member, 
  onUpdatePermissions 
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (member) {
      setSelectedPermissions([...member.permissions]);
    }
  }, [member]);

  const allPermissions = [
    'View symptoms',
    'View nutrition plan',
    'View care plan',
    'Edit meal plans',
    'Send messages',
    'Edit care plan',
    'View all data',
    'Manage team'
  ];

  const permissionCategories = {
    'View Access': ['View symptoms', 'View nutrition plan', 'View care plan', 'View all data'],
    'Edit Access': ['Edit meal plans', 'Edit care plan'],
    'Communication': ['Send messages'],
    'Administration': ['Manage team']
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    if (member) {
      onUpdatePermissions(member.id, selectedPermissions);
    }
  };

  const handleSelectAll = () => {
    setSelectedPermissions([...allPermissions]);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <ShieldIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Permissions</h2>
              <p className="text-sm text-gray-600">{member.name} • {member.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Clear All
            </button>
          </div>

          {/* Permissions by Category */}
          <div className="space-y-4">
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-900 mb-3">{category}</h3>
                <div className="space-y-2">
                  {permissions.map(permission => (
                    <label
                      key={permission}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start space-x-2">
              <ShieldIcon />
              <div>
                <p className="text-sm font-medium text-blue-900">Privacy & Security</p>
                <p className="text-xs text-blue-700 mt-1">
                  Only grant permissions that are necessary for {member.name}'s role. 
                  All access is logged and can be revoked at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionsModal; 