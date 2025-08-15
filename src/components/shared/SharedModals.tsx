import React from 'react';

// Icon components
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PhotoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VoiceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// AI Fill Fields Modal
interface AIFillFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFillFieldsModal: React.FC<AIFillFieldsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'text' | 'photo' | 'voice'>('text');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Use AI to fill fields (coming soon)</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'text'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TextIcon />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'photo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PhotoIcon />
              <span>Photo/Video</span>
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'voice'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <VoiceIcon />
              <span>Voice</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'text' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TextIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Paste text</h3>
                <p className="text-gray-600 mb-4">Paste your notes or observations to auto-fill form fields.</p>
                <textarea
                  placeholder="Paste your text here..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-2">Enable in Settings when available.</p>
              </div>
            )}

            {activeTab === 'photo' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhotoIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload photo/video</h3>
                <p className="text-gray-600 mb-4">Upload images or videos to extract information.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <PhotoIcon />
                  <p className="text-gray-500 mt-2">Drag and drop or click to upload</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Enable in Settings when available.</p>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <VoiceIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Record voice</h3>
                <p className="text-gray-600 mb-4">Record your observations to auto-fill form fields.</p>
                <button
                  className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto"
                  disabled
                >
                  <VoiceIcon />
                </button>
                <p className="text-xs text-gray-500 mt-2">Enable in Settings when available.</p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy:</strong> Your data is processed securely and never shared with third parties.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Visit Packet Drawer
interface VisitPacketEntry {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface VisitPacketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: VisitPacketEntry[];
  onClear: () => void;
}

export const VisitPacketDrawer: React.FC<VisitPacketDrawerProps> = ({ 
  isOpen, 
  onClose, 
  entries, 
  onClear 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
      <div className="bg-white w-full max-w-md h-full shadow-xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Visit Packet</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileIcon />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entries selected</h3>
              <p className="text-gray-600">Select entries from Journal to add to your visit packet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {entries.length} entry{entries.length !== 1 ? 'ies' : 'y'} selected
                </h3>
                <button
                  onClick={onClear}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{entry.title}</h4>
                      <p className="text-xs text-gray-600">{entry.type} • {entry.date}</p>
                    </div>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => {
                        // TODO: Remove individual entry
                        console.log('Remove entry:', entry.id);
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              onClick={() => {
                // TODO: Generate draft PDF
                console.log('Generate draft PDF');
              }}
            >
              <FileIcon />
              <span>Generate draft PDF</span>
            </button>
            <button
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              onClick={() => {
                // TODO: Share functionality
                console.log('Share visit packet');
              }}
            >
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirm Dialog
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete entry?", 
  message = "This can't be undone." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrashIcon />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
