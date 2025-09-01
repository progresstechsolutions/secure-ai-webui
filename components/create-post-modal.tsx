"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Video, X, Loader2, Globe, Users } from 'lucide-react';
import { useCreatePost, useUploadImages, useUserCommunities } from '@/hooks/use-api';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  communityName?: string;
  onPostCreated?: (post: any) => void;
  currentUser?: { name: string; avatar?: string; };
}

export function CreatePostModal({ 
  open, 
  onOpenChange, 
  communityId, 
  communityName,
  onPostCreated,
  currentUser = { name: "You", avatar: "/placeholder-user.jpg" }
}: CreatePostModalProps) {
  const [caption, setCaption] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createPost, loading: creating } = useCreatePost();
  const { uploadImages, loading: uploading } = useUploadImages();
  const { communities: userCommunities, loading: loadingCommunities } = useUserCommunities();

  // Transform API data to match our interface
  const availableCommunities = useMemo(() => {
    return userCommunities.map(community => ({
      id: community._id,
      name: community.title,
      isPrivate: community.isPrivate
    }));
  }, [userCommunities]);

  // Get communities with fallback for the specific communityId
  const communitiesWithFallback = useMemo(() => {
    let communities = availableCommunities;

    // If communityId is provided but not in the list, add it
    if (communityId && communityName && !communities.find((c) => c.id === communityId)) {
      communities = [
        { id: communityId, name: communityName, isPrivate: false },
        ...communities
      ];
    }

    return communities;
  }, [availableCommunities, communityId, communityName]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 10) {;
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview URLs and track media types
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(prev => [...prev, e.target?.result as string]);
        setMediaTypes(prev => [...prev, file.type.startsWith('video/') ? 'video' : 'image']);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
    setMediaTypes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // User must select a community (mandatory)
    if (!selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities') {;
      return;
    }

    // User must have either caption text OR media files (at least one)
    if (!caption.trim() && selectedFiles.length === 0) {;
      return;
    }

    try {
      let mediaUrls: string[] = [];
      
      // Upload files if any
      if (selectedFiles.length > 0) {
        const result = await uploadImages(selectedFiles);
        if (result.error) {
          throw new Error(result.error);
        }
        // Use the actual uploaded URLs from the response
        mediaUrls = result.data?.images?.map(img => img.url) || [];
      }

      // Create post data
      const trimmedCaption = caption.trim();
      
      // Generate a proper title (minimum 5 chars for backend validation)
      let title = trimmedCaption.slice(0, 100) || 'Media Post';
      if (title.length < 5) {
        title = 'Media Post'; // Fallback that meets 5-char minimum
      }
      
      // Ensure content meets minimum 10 characters for backend validation
      let content = trimmedCaption;
      if (content.length < 10) {
        if (selectedFiles.length > 0) {
          content = content ? content + ' - shared via Caregene' : 'Check out this media - shared via Caregene';
        } else {
          content = content + ' - shared via Caregene'; // Add suffix to meet minimum
        }
      }
      
      const postData = {
        title: title,
        content: content,
        communityId: selectedCommunity,
        isAnonymous: isAnonymous,
        ...(mediaUrls.length > 0 && {
          images: mediaUrls.filter((_, index) => mediaTypes[index] === 'image'),
          videos: mediaUrls.filter((_, index) => mediaTypes[index] === 'video')
        }),
      };

      const result = await createPost(postData);

      if (result?.data) {
        const selectedCommunityName = communitiesWithFallback.find((c) => c.id === selectedCommunity)?.name || communityName || 'Community';;

        // Reset form
        setCaption('');
        setSelectedFiles([]);
        setMediaPreview([]);
        setMediaTypes([]);
        setIsAnonymous(false);
        setSelectedCommunity(''); // Reset community selection
        onOpenChange(false);
        
        // Call success callback
        onPostCreated?.(result.data);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {;
    }
  };

  const isLoading = creating || uploading || loadingCommunities;
  const selectedCommunityData = communitiesWithFallback.find((c) => c.id === selectedCommunity);

  // Set initial community selection when modal opens
  useEffect(() => {
    if (open && communityId && !selectedCommunity) {
      setSelectedCommunity(communityId);
    }
  }, [open, communityId, selectedCommunity]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100"
        onPointerDownOutside={() => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        {/* Header */}
        <DialogHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 relative bg-white/95 backdrop-blur-sm">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center text-gray-900">Create Story</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new post to share with your community
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 sm:right-4 top-3 h-8 w-8 p-0 hover:bg-gray-50 rounded-full transition-colors touch-manipulation"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full bg-white rounded-b-xl sm:rounded-b-2xl">
          {/* User Info & Community Selection */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              {/* Avatar with gradient styling */}
              <div className="flex-shrink-0">
                {isAnonymous ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">?</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-gray-900">{isAnonymous ? "Anonymous" : currentUser.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger className="flex-1 h-8 text-xs border border-gray-200 shadow-none p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors focus:border-blue-300 focus:ring-0">
                      <div className="flex items-center gap-2 w-full">
                        {selectedCommunityData && (
                          <>
                            {selectedCommunityData.isPrivate ? (
                              <Users className="h-3 w-3 text-gray-500" />
                            ) : (
                              <Globe className="h-3 w-3 text-gray-500" />
                            )}
                            <span className="text-gray-700 font-medium">{selectedCommunityData.name}</span>
                          </>
                        )}
                        {!selectedCommunityData && (
                          <span className="text-gray-500">Select a community</span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                      {loadingCommunities ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Loading communities...
                          </div>
                        </SelectItem>
                      ) : communitiesWithFallback.length === 0 ? (
                        <SelectItem value="no-communities" disabled>
                          No communities available
                        </SelectItem>
                      ) : (
                        communitiesWithFallback.map((community) => (
                          <SelectItem key={community.id} value={community.id} className="hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              {community.isPrivate ? (
                                <Users className="h-3 w-3 text-gray-500" />
                              ) : (
                                <Globe className="h-3 w-3 text-gray-500" />
                              )}
                              <span>{community.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer font-medium">
                Post anonymously
              </label>
            </div>
          </div>

          {/* Caption Input */}
          <div className="px-3 sm:px-6 pb-3 sm:pb-4">
            <Textarea
              placeholder={`What's on your mind${isAnonymous ? '' : `, ${currentUser.name}`}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-0 shadow-none text-sm sm:text-base placeholder:text-gray-400 resize-none min-h-[80px] sm:min-h-[100px] p-0 focus-visible:ring-0 text-gray-900"
              style={{ fontSize: '16px', lineHeight: '1.5' }}
            />
          </div>

          {/* Media Preview */}
          {mediaPreview.length > 0 && (
            <div className="px-3 sm:px-6 pb-3 sm:pb-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3">
                  <div className={`grid gap-2 ${
                    mediaPreview.length === 1 ? 'grid-cols-1' :
                    mediaPreview.length === 2 ? 'grid-cols-2' :
                    mediaPreview.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {mediaPreview.map((src, index) => (
                      <div key={index} className="relative group">
                        {mediaTypes[index] === 'video' ? (
                          <video
                            src={src}
                            className="w-full h-32 object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-900/80 touch-manipulation"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-800">Add to your story</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 sm:px-4 hover:bg-gray-100 active:bg-gray-200 rounded-lg flex items-center gap-2 transition-all duration-200 touch-manipulation border border-gray-200"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Image className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Photo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 sm:px-4 hover:bg-gray-100 active:bg-gray-200 rounded-lg flex items-center gap-2 transition-all duration-200 touch-manipulation border border-gray-200"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*";
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Video</span>
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!caption.trim() && selectedFiles.length === 0) || !selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities' || loadingCommunities}
              className="w-full h-10 sm:h-12 text-white font-semibold rounded-lg transition-all duration-200 touch-manipulation shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm sm:text-base">
                    {creating ? 'Sharing...' : uploading ? 'Uploading...' : 'Loading...'}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">Share Story</span>
              )}
            </Button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </DialogContent>
      
      {/* Mobile-optimized styles */}
      <style jsx global>{`
        /* Touch-friendly interactions */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Safe area support for devices with notches */
        .h-safe-area-inset-bottom {
          height: env(safe-area-inset-bottom);
        }
        
        /* Prevent zoom on input focus (iOS) */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Improved mobile tap targets */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Better focus states for accessibility */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </Dialog>
  );
}
