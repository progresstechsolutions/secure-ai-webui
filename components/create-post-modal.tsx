"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image, Link, Type, Loader2, X } from 'lucide-react';
import { useCreatePost, useUploadImages } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  communityName?: string;
  onPostCreated?: (post: any) => void;
}

type PostType = 'text' | 'image' | 'link';

export function CreatePostModal({ 
  open, 
  onOpenChange, 
  communityId = '', 
  communityName = 'Community',
  onPostCreated 
}: CreatePostModalProps) {
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const { createPost, loading: creating } = useCreatePost();
  const { uploadImages, loading: uploading } = useUploadImages();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images per post.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && postType !== 'link') {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (postType === 'link' && !linkUrl.trim()) {
      toast({
        title: "Link required",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (postType === 'image' && selectedImages.length > 0) {
        await uploadImages(selectedImages);
        // Note: In a real app, you'd get the uploaded URLs from the response
        // For now, we'll use placeholder URLs
        imageUrls = selectedImages.map((_, index) => `/uploads/images/placeholder-${index}.jpg`);
      }

      // Create post data
      const postData = {
        title,
        content,
        communityId,
        ...(postType === 'image' && { images: imageUrls }),
        ...(postType === 'link' && {
          link: {
            url: linkUrl,
            title: linkTitle || undefined,
            description: content || undefined,
          }
        }),
      };

      const result = await createPost(postData);

      if (result?.data) {
        toast({
          title: "Post created!",
          description: `Your post has been published in ${communityName}.`,
        });

        // Reset form
        setTitle('');
        setContent('');
        setLinkUrl('');
        setLinkTitle('');
        setSelectedImages([]);
        setImagePreview([]);
        setPostType('text');
        onOpenChange(false);
        
        // Call success callback with the created post
        onPostCreated?.(result.data);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const isLoading = creating || uploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post in {communityName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <div className="flex gap-2">
              <Button
                variant={postType === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPostType('text')}
              >
                <Type className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button
                variant={postType === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPostType('image')}
              >
                <Image className="h-4 w-4 mr-1" />
                Images
              </Button>
              <Button
                variant={postType === 'link' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPostType('link')}
              >
                <Link className="h-4 w-4 mr-1" />
                Link
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="What's your post about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Content */}
          {postType !== 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content {postType === 'text' && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                placeholder={postType === 'image' ? "Tell us about your images..." : "Share your thoughts..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
          )}

          {/* Link Fields */}
          {postType === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  type="url"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Title (Optional)
                </label>
                <Input
                  placeholder="Descriptive title for the link"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Describe what this link is about..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          {postType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (up to 5)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imagePreview.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating ? 'Publishing...' : uploading ? 'Uploading...' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
