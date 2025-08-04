import React, { useState } from 'react';
import AddMemberModal from './AddMemberModal';
import ShareModal from './ShareModal';
import EditPermissionsModal from './EditPermissionsModal';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

interface CareTeamScreenProps {
  onBack: () => void;
}

const CareTeamScreen: React.FC<CareTeamScreenProps> = ({ onBack }) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    {
      id: '1',
      author: 'Dad',
      message: 'Jamie had a good day today. No seizures reported.',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: 'Dr. Sarah Smith',
      message: 'Reviewed the latest symptom logs. The new medication seems to be working well.',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      author: 'Jane Doe',
      message: 'Updated nutrition plan to include more iron-rich foods based on recent blood work.',
      timestamp: '3 days ago'
    }
  ]);

  const careTeamMembers: CareTeamMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      role: 'Neurologist',
      type: 'doctor',
      avatar: 'SS',
      status: 'online',
      lastContact: '2 days ago',
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'dr.smith@hospital.com'
      },
      permissions: ['View symptoms', 'View nutrition plan', 'Send messages']
    },
    {
      id: '2',
      name: 'Jane Doe',
      role: 'Registered Dietitian',
      type: 'specialist',
      avatar: 'JD',
      status: 'offline',
      lastContact: '1 week ago',
      contactInfo: {
        phone: '(555) 234-5678',
        email: 'jane.doe@nutrition.com'
      },
      permissions: ['View nutrition plan', 'Edit meal plans', 'Send messages']
    },
    {
      id: '3',
      name: 'Dad',
      role: 'Parent',
      type: 'family',
      avatar: 'D',
      status: 'online',
      lastContact: 'Today',
      contactInfo: {
        phone: '(555) 345-6789'
      },
      permissions: ['View all data', 'Edit care plan', 'Manage team']
    },
    {
      id: '4',
      name: 'Aunt Maria',
      role: 'Family Member',
      type: 'family',
      avatar: 'AM',
      status: 'invited',
      lastContact: '3 days ago',
      contactInfo: {
        phone: '(555) 456-7890'
      },
      permissions: ['View symptoms', 'View nutrition plan']
    }
  ];

  const getRoleColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'specialist': return 'bg-green-100 text-green-800 border-green-200';
      case 'family': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'therapist': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvatarColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-blue-500';
      case 'specialist': return 'bg-green-500';
      case 'family': return 'bg-purple-500';
      case 'therapist': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-300';
      case 'invited': return 'bg-yellow-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'invited': return 'Invited';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const handleMessageMember = (memberId: string) => {
    console.log('Message member:', memberId);
    // TODO: Implement messaging functionality
  };

  const handleShareData = (memberId: string) => {
    console.log('Share data with member:', memberId);
    // TODO: Implement data sharing functionality
  };

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  const handleInviteMember = (memberData: {
    name: string;
    role: string;
    type: 'doctor' | 'specialist' | 'family' | 'therapist';
    contactMethod: 'email' | 'phone';
    contactInfo: string;
    message: string;
    permissions: string[];
  }) => {
    console.log('Inviting new member:', memberData);
    // TODO: Implement actual invite functionality
    // For now, just log the data
  };

  const handleShareReport = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        author: 'Dad', // In a real app, this would be the current user
        message: newNote.trim(),
        timestamp: 'Just now'
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleEditPermissions = (memberId: string) => {
    setSelectedMember(memberId);
    setIsEditPermissionsModalOpen(true);
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      // In a real app, this would make an API call
      console.log('Removing member:', memberId);
      // For demo purposes, we'll just log it
    }
  };

  const handleCloseEditPermissionsModal = () => {
    setIsEditPermissionsModalOpen(false);
    setSelectedMember(null);
  };

  const handleUpdatePermissions = (memberId: string, newPermissions: string[]) => {
    console.log('Updating permissions for member:', memberId, 'New permissions:', newPermissions);
    // In a real app, this would make an API call to update permissions
    setIsEditPermissionsModalOpen(false);
    setSelectedMember(null);
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
            <h1 className="text-lg font-semibold text-gray-900">Care Team</h1>
            <p className="text-sm text-gray-600">Connect and collaborate with Jamie's care network.</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <button 
              onClick={handleAddMember}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              <PlusIcon />
              <span>Add Team Member</span>
            </button>
            <button 
              onClick={handleShareReport}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              <ShareIcon />
              <span>Share Report</span>
            </button>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members ({careTeamMembers.length})</h2>
          
          {isLoading ? (
            // Loading State
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : careTeamMembers.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No care team members yet</h3>
              <p className="text-gray-600 mb-6">Add your first collaborator to get started!</p>
              <button
                onClick={handleAddMember}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Team Member
              </button>
            </div>
          ) : (
            careTeamMembers.map(member => (
              <div 
                key={member.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(member.type)}`}>
                      {member.avatar}
                    </div>
                    <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 ml-auto ${getStatusColor(member.status)}`}></div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        
                        <div className="flex items-center mt-2 space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.type)}`}>
                            {member.type.charAt(0).toUpperCase() + member.type.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'online' ? 'bg-green-100 text-green-800' :
                            member.status === 'offline' ? 'bg-gray-100 text-gray-800' :
                            member.status === 'invited' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {getStatusText(member.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last contact: {member.lastContact}
                          </span>
                        </div>

                        {/* Permissions */}
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.map((permission, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleMessageMember(member.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Send message"
                        >
                          <MessageIcon />
                        </button>
                        <button
                          onClick={() => handleShareData(member.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Share data"
                        >
                          <ShareIcon />
                        </button>
                        <button
                          onClick={() => handleEditPermissions(member.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit permissions"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove from team"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        {member.contactInfo.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <PhoneIcon />
                            <span className="ml-1">{member.contactInfo.phone}</span>
                          </div>
                        )}
                        {member.contactInfo.email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <EmailIcon />
                            <span className="ml-1">{member.contactInfo.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Dr. Smith reviewed Jamie's latest symptom logs</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Nutrition plan updated by Jane Doe</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Dad shared new symptom observation</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Board */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Notes</h2>
          
          {/* Add Note Form */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Leave a note for the team..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
              >
                Post
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.message}</p>
                  </div>
                  {note.author === 'Dad' && (
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={handleCloseAddMemberModal}
        onInvite={handleInviteMember}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
      />

      {/* Edit Permissions Modal */}
      <EditPermissionsModal
        isOpen={isEditPermissionsModalOpen}
        onClose={handleCloseEditPermissionsModal}
        member={careTeamMembers.find(m => m.id === selectedMember)}
        onUpdatePermissions={handleUpdatePermissions}
      />
    </div>
  );
};

export default CareTeamScreen; 