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
import { toast } from '@/hooks/use-toast';

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
    if (files.length + selectedFiles.length > 10) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 10 files per post.",
        variant: "destructive",
      });
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
    if (!selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities') {
      toast({
        title: "Community required",
        description: "Please select a community for your post.",
        variant: "destructive",
      });
      return;
    }

    // User must have either caption text OR media files (at least one)
    if (!caption.trim() && selectedFiles.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post.",
        variant: "destructive",
      });
      return;
    }

    try {
      let mediaUrls: string[] = [];
      
      // Upload files if any
      if (selectedFiles.length > 0) {
        const result = await uploadImages(selectedFiles);
        // Note: In a real app, you'd get the uploaded URLs from the response
        mediaUrls = selectedFiles.map((file, index) => 
          `/uploads/${file.type.startsWith('video/') ? 'videos' : 'images'}/placeholder-${index}.${file.type.split('/')[1]}`
        );
      }

      // Create post data
      const postData = {
        title: caption.slice(0, 100) || 'Untitled Post', // Use first part of caption as title
        content: caption,
        communityId: selectedCommunity,
        isAnonymous: isAnonymous,
        ...(mediaUrls.length > 0 && { 
          images: mediaUrls.filter((_, index) => mediaTypes[index] === 'image'),
          videos: mediaUrls.filter((_, index) => mediaTypes[index] === 'video')
        }),
      };

      const result = await createPost(postData);

      if (result?.data) {
        const selectedCommunityName = communitiesWithFallback.find((c) => c.id === selectedCommunity)?.name || communityName || 'Community';
        toast({
          title: "Post shared!",
          description: `Your post has been shared in ${selectedCommunityName}.`,
        });

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
    } catch (error) {
      toast({
        title: "Failed to share post",
        description: "Please try again later.",
        variant: "destructive",
      });
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
        className="max-w-xl max-h-[90vh] overflow-hidden p-0"
        onPointerDownOutside={() => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b relative">
          <DialogTitle className="text-xl font-semibold text-center">Create post</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new post to share with your community
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-3 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* User Info & Community Selection */}
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={isAnonymous ? "/placeholder-user.jpg" : currentUser.avatar} />
                <AvatarFallback>{isAnonymous ? "?" : currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{isAnonymous ? "Anonymous" : currentUser.name}</p>
                <div className="flex items-center gap-2">
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger className="flex-1 h-8 text-xs border-0 shadow-none p-1 bg-gray-100 rounded-md">
                      <div className="flex items-center gap-2 w-full">
                        {selectedCommunityData && (
                         
                            <span>{selectedCommunityData.name}</span>
                          
                        )}
                        {!selectedCommunityData && (
                          <span className="text-gray-500">Select a community</span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
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
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
                Post anonymously
              </label>
            </div>
          </div>

          {/* Caption Input - Smaller Size */}
          <div className="px-6 pb-4">
            <Textarea
              placeholder={`What's on your mind${isAnonymous ? '' : `, ${currentUser.name}`}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-0 shadow-none text-base placeholder:text-gray-400 resize-none min-h-[80px] p-0 focus-visible:ring-0"
              style={{ fontSize: '16px', lineHeight: '1.4' }}
            />
          </div>

          {/* Media Preview */}
          {mediaPreview.length > 0 && (
            <div className="px-6 pb-4">
              <Card className="border border-gray-200 rounded-lg overflow-hidden">
                <CardContent className="p-3">
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
                          className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons - Photos and Videos Only */}
          <div className="px-6 py-3 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Add photos and videos</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Image className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Photo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*";
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Video className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Video</span>
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!caption.trim() && selectedFiles.length === 0) || !selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities' || loadingCommunities}
              className="w-full h-10 text-white font-semibold"
              style={{ 
                backgroundColor: isLoading || (!caption.trim() && selectedFiles.length === 0) || !selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities' || loadingCommunities
                  ? '#E4E6EA' 
                  : '#1877F2',
                color: isLoading || (!caption.trim() && selectedFiles.length === 0) || !selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities' || loadingCommunities
                  ? '#BCC0C4' 
                  : 'white'
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {creating ? 'Sharing...' : 'Uploading...'}
                </div>
              ) : (
                'Share'
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
    </Dialog>
  );
}
