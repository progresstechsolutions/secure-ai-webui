import React, { useState, useEffect } from 'react';
import { VisitPacketDrawer, DeleteConfirmDialog } from './shared/SharedModals';

// Icon components
const SymptomIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const NutritionIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const MedicationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const ExportIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SelectIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ViewIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MoreIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

interface JournalEntry {
  id: string;
  type: 'symptom' | 'nutrition' | 'medication';
  title: string;
  timestamp: string;
  caregiver?: string;
  badges: string[];
  details: any;
  tags?: string[];
  setting?: string;
}

interface JournalProps {
  onExport?: () => void;
}

const Journal: React.FC<JournalProps> = ({ onExport }) => {
  // State for filters and UI
  const [filterType, setFilterType] = useState<'all' | 'symptom' | 'nutrition' | 'medication'>('all');
  const [filterTime, setFilterTime] = useState<'today' | '7days' | '30days' | 'custom'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showFilterBar, setShowFilterBar] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEntryDetail, setShowEntryDetail] = useState<string | null>(null);
  const [showVisitPacketDrawer, setShowVisitPacketDrawer] = useState(false);
  const [visitPacketEntries, setVisitPacketEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in real app this would come from API/database
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      type: 'symptom',
      title: 'Seizure (3 min)',
      timestamp: '2024-01-15T14:30:00Z',
      caregiver: 'Mom',
      badges: ['Severity 2/5', 'Bristol 3'],
      tags: ['therapy day', 'loud environment'],
      details: {
        symptomType: 'Seizure',
        duration: '3 minutes',
        severity: 2,
        notes: 'Brief focal seizure during therapy session'
      }
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Meal: Pasta + Milk',
      timestamp: '2024-01-15T12:00:00Z',
      caregiver: 'Dad',
      badges: ['Medium portion', 'Regular texture'],
      setting: 'home',
      details: {
        intakeType: 'Meal/Snack',
        foods: ['Pasta', 'Milk'],
        portionSize: 'Medium',
        texture: 'Regular',
        setting: 'Home'
      }
    },
    {
      id: '3',
      type: 'medication',
      title: 'Medication: Amoxicillin 5 mL',
      timestamp: '2024-01-15T08:00:00Z',
      caregiver: 'Mom',
      badges: ['AM dose', 'Current bottle'],
      details: {
        medicationName: 'Amoxicillin',
        doseTaken: '5 mL',
        scheduledWindow: 'AM',
        actualTime: '08:00'
      }
    }
  ]);

  // Available tags for filtering
  const availableTags = ['therapy day', 'illness', 'travel', 'loud environment', 'school day', 'menses', 'home', 'school', 'therapy'];

  // Filter entries based on current filters
  const filteredEntries = entries.filter(entry => {
    // Type filter
    if (filterType !== 'all' && entry.type !== filterType) return false;
    
    // Search query
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !entry.details.notes?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Tags filter
    if (selectedTags.length > 0) {
      const entryTags = [...(entry.tags || []), ...(entry.setting ? [entry.setting] : [])];
      if (!selectedTags.some(tag => entryTags.includes(tag))) return false;
    }
    
    return true;
  });

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle entry selection for multi-select
  const handleEntrySelect = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  // Handle bulk actions
  const handleBulkExport = () => {
    setShowExportModal(true);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleBulkAddToVisitPacket = () => {
    const selectedEntryData = entries.filter(entry => selectedEntries.includes(entry.id));
    setVisitPacketEntries(selectedEntryData);
    setShowVisitPacketDrawer(true);
  };

  // Handle entry deletion
  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    setSelectedEntries(prev => prev.filter(id => id !== entryId));
    setShowDeleteConfirm(false);
  };

  // Handle bulk delete
  const handleBulkDeleteConfirm = () => {
    setEntries(prev => prev.filter(entry => !selectedEntries.includes(entry.id)));
    setSelectedEntries([]);
    setIsMultiSelect(false);
    setShowDeleteConfirm(false);
  };

  // Handle visit packet clear
  const handleVisitPacketClear = () => {
    setVisitPacketEntries([]);
  };

  // Get icon for entry type
  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'symptom': return <SymptomIcon />;
      case 'nutrition': return <NutritionIcon />;
      case 'medication': return <MedicationIcon />;
      default: return null;
    }
  };

  // Get color classes for entry type
  const getEntryColor = (type: string) => {
    switch (type) {
      case 'symptom': return 'text-red-600 bg-red-50 border-red-200';
      case 'nutrition': return 'text-green-600 bg-green-50 border-green-200';
      case 'medication': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Journal Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Journal</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-1"
            >
              <ExportIcon />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setIsMultiSelect(!isMultiSelect)}
              className={`px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-1 ${
                isMultiSelect 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SelectIcon />
              <span className="hidden sm:inline">Select</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowFilterBar(!showFilterBar)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 sm:hidden"
          >
            <FilterIcon />
            <span>Filters</span>
            {showFilterBar ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
        
        {showFilterBar && (
          <div className="space-y-3">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              {['all', 'symptom', 'nutrition', 'medication'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    filterType === type
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Time Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Time:</span>
              {['today', '7days', '30days', 'custom'].map(time => (
                <button
                  key={time}
                  onClick={() => setFilterTime(time as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    filterTime === time
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time === '7days' ? '7 days' : time === '30days' ? '30 days' : time.charAt(0).toUpperCase() + time.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Tags:</span>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {isMultiSelect && selectedEntries.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-900">
              {selectedEntries.length} entry{selectedEntries.length !== 1 ? 'ies' : 'y'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkExport}
                className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200"
              >
                Export
              </button>
              <button
                onClick={handleBulkAddToVisitPacket}
                className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200"
              >
                Add to Visit Packet
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="px-4 py-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedEntries.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-600 mb-6">Start with Quick Log to capture your care data.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                Log Symptom
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                Log Nutrition
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Log Medication
              </button>
            </div>
          </div>
        ) : (
          // Entries list
          <div className="space-y-4">
            {sortedEntries.map(entry => (
              <div
                key={entry.id}
                className={`bg-white rounded-lg border ${getEntryColor(entry.type)} p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Checkbox for multi-select */}
                    {isMultiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => handleEntrySelect(entry.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    )}
                    
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getEntryIcon(entry.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{entry.title}</h3>
                        <span className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        {entry.caregiver && (
                          <span className="text-xs text-gray-600">{entry.caregiver}</span>
                        )}
                        {entry.badges.map((badge, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setShowEntryDetail(entry.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="View details"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="More options"
                    >
                      <MoreIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Scope */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Scope</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Date range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Types to include</label>
                    <div className="space-y-2">
                      {['Symptom', 'Nutrition', 'Medication'].map(type => (
                        <label key={type} className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                          <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                      <span className="ml-2 text-sm text-gray-700">Include notes</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Format */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Format</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">PDF (summary)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">CSV (raw fields)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement actual export
                  console.log('Exporting data...');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Generate Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete entry?"
        message="This can't be undone."
      />

      {/* Entry Detail Modal */}
      {showEntryDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Entry Details</h2>
              <button
                onClick={() => setShowEntryDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                const entry = entries.find(e => e.id === showEntryDetail);
                if (!entry) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getEntryIcon(entry.type)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                        <p className="text-sm text-gray-600">{formatTimestamp(entry.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(entry.details).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                          <dd className="text-sm text-gray-900 mt-1">{String(value)}</dd>
                        </div>
                      ))}
                    </div>
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-700 mb-2">Tags</dt>
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Duplicate
              </button>
              <button 
                onClick={() => {
                  const entry = entries.find(e => e.id === showEntryDetail);
                  if (entry) {
                    setVisitPacketEntries(prev => [...prev, entry]);
                    setShowVisitPacketDrawer(true);
                  }
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Add to Visit Packet
              </button>
              <button
                onClick={() => handleDeleteEntry(showEntryDetail)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Visit Packet Drawer */}
       <VisitPacketDrawer
         isOpen={showVisitPacketDrawer}
         onClose={() => setShowVisitPacketDrawer(false)}
         entries={visitPacketEntries}
         onClear={handleVisitPacketClear}
       />
     </div>
   );
 };

export default Journal;
