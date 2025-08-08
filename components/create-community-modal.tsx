"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, ArrowLeft, Check, X, Search, MapPin, Loader2 } from "lucide-react";
import { useCreateCommunity } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (community: any) => void;
  availableConditions: string[];
}

const steps = [
  { title: "Title", description: "Choose a memorable title for your community" },
  { title: "Description", description: "Describe your community's purpose and goals" },
  { title: "Location", description: "Set your community's location" },
  { title: "Conditions", description: "Select related health conditions" }
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, onClose, onSuccess, availableConditions }) => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionSearch, setConditionSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Use the API hook
  const { createCommunity, loading } = useCreateCommunity();

  // Region and state options
  const regionOptions = ["United States", "Europe", "Asia", "South America", "Africa", "Australia", "Other"];
  const stateOptions = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming", "District of Columbia"
  ];

  const handleNext = async () => {
    setError("");
    if (step === 0 && !title.trim()) return setError("Community title is required.");
    if (step === 0 && title.trim().length < 3) return setError("Community title must be at least 3 characters long.");
    if (step === 0 && title.trim().length > 100) return setError("Community title must be less than 100 characters.");
    if (step === 1 && !description.trim()) return setError("Description is required.");
    if (step === 1 && description.trim().length < 10) return setError("Description must be at least 10 characters long.");
    if (step === 1 && description.trim().length > 500) return setError("Description must be less than 500 characters.");
    if (step === 2 && !region.trim()) return setError("Region is required.");
    if (step === 2 && region === "United States" && !state.trim()) return setError("State is required for US communities.");
    if (step === 3 && conditions.length === 0) return setError("Select at least one condition.");
    if (step === 3 && conditions.length > 10) return setError("You can select up to 10 conditions maximum.");
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Final step - create community
      try {
        // Add location to tags for searchability
        const locationTags = [region];
        if (state && region === "United States") {
          locationTags.push(state);
        }
        
        const communityData = {
          title,
          description,
          tags: [...conditions, ...locationTags], // Include location in tags
          location: {
            region,
            state
          }
        };

        console.log('Sending community data:', communityData); // Debug log

        const result = await createCommunity(communityData);
        
        if (result?.data) {
          toast({
            title: "Success!",
            description: "Community created successfully!",
          });

          setSuccess(true);
          setTimeout(() => {
            // Reset form
            setStep(0);
            setTitle("");
            setDescription("");
            setRegion("");
            setState("");
            setConditions([]);
            setSuccess(false);
            onClose();
            onSuccess?.(result.data); // Call success callback with created community
          }, 1000);
        } else {
          throw new Error("Failed to create community");
        }
      } catch (error: any) {
        console.error('Community creation error:', error);
        
        // More detailed error handling
        let errorMessage = "Failed to create community. Please try again.";
        
        if (error?.response?.status === 400) {
          // Validation error from backend
          const errorData = await error.response.json().catch(() => ({}));
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage = `Validation failed: ${errorData.details.join(', ')}`;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };
  const handleBack = () => {
    setError("");
    if (step > 0) setStep(step - 1);
  };
  const handleToggleCondition = (cond: string) => {
    setConditions((prev) => prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]);
  };
  const handleClose = () => {
    setStep(0);
    setTitle("");
    setDescription("");
    setRegion("");
    setState("");
    setConditions([]);
    setConditionSearch("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const filteredConditions = availableConditions.filter(condition =>
    condition.toLowerCase().includes(conditionSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="w-[95vw] max-w-xl mx-auto max-h-[95vh] md:max-h-[90vh] bg-white rounded-xl shadow-2xl border-0 flex flex-col">
        <DialogHeader className="pb-3 md:pb-4 space-y-2 flex-shrink-0">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Community
              </DialogTitle>
              <p className="text-gray-500 text-xs md:text-sm">Step {step + 1} of {steps.length}</p>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Create a new health community for support and connection
          </DialogDescription>
        </DialogHeader>

        {/* Compact Progress Bar */}
        <div className="mb-4 md:mb-6 flex-shrink-0">
          <div className="flex space-x-1">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">{steps[step].title}</p>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-1 pb-3 md:pb-4">
          {step === 0 && (
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <Input
                  autoFocus
                  placeholder="e.g., Autism Support Network"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={60}
                  className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/60 characters</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-blue-800">💡 Use a clear, descriptive name that includes your focus area</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Describe your community's purpose, goals, and who should join..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">{description.length} characters</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-purple-800">📝 Include your goals, who should join, and what support you'll provide</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={region}
                  onChange={e => {
                    setRegion(e.target.value);
                    if (e.target.value !== "United States") {
                      setState(""); // Clear state if not US
                    }
                  }}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm md:text-base focus:border-blue-300 focus:ring-blue-200 focus:outline-none bg-white"
                >
                  <option value="">Select a region</option>
                  {regionOptions.map(regionOption => (
                    <option key={regionOption} value={regionOption}>
                      {regionOption}
                    </option>
                  ))}
                </select>
              </div>
              
              {region === "United States" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm md:text-base focus:border-blue-300 focus:ring-blue-200 focus:outline-none bg-white"
                  >
                    <option value="">Select a state</option>
                    {stateOptions.map(stateOption => (
                      <option key={stateOption} value={stateOption}>
                        {stateOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-indigo-800">📍 This helps members find local communities and resources</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Related Conditions <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-2 md:mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                  <Input
                    placeholder="Search conditions..."
                    value={conditionSearch}
                    onChange={e => setConditionSearch(e.target.value)}
                    className="pl-8 md:pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-sm md:text-base"
                  />
                </div>
                <div className="max-h-28 md:max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 md:p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {filteredConditions.map(cond => (
                      <Badge
                        key={cond}
                        variant={conditions.includes(cond) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 text-xs ${
                          conditions.includes(cond) 
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" 
                            : "hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => handleToggleCondition(cond)}
                      >
                        {conditions.includes(cond) && <Check className="h-2 w-2 md:h-3 md:w-3 mr-1" />}
                        {cond}
                      </Badge>
                    ))}
                  </div>
                  {filteredConditions.length === 0 && (
                    <p className="text-gray-500 text-xs md:text-sm text-center py-2">
                      No conditions match your search
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {conditions.length} condition{conditions.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Privacy Setting */}
              <div className="border border-gray-200 rounded-lg p-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Private Community</div>
                    <div className="text-xs text-gray-500">
                      {isPrivate 
                        ? "Only invited members can join and see content" 
                        : "Anyone can discover and join your community"
                      }
                    </div>
                  </div>
                </label>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-amber-800">🎯 Choose conditions your community will focus on to help members find you</p>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-3 flex items-center space-x-2 mt-3 md:mt-4">
              <X className="h-3 w-3 md:h-4 md:w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-xs md:text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3 flex items-center space-x-2 mt-3 md:mt-4">
              <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-xs md:text-sm">Community created successfully!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 md:pt-4 border-t border-gray-200 flex-shrink-0 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 order-2 sm:order-1 w-full sm:w-auto"
            size="sm"
          >
            Cancel
          </Button>
          
          <div className="flex space-x-2 order-1 sm:order-2 w-full sm:w-auto">
            {step > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
                size="sm"
              >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={success || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg flex-1 sm:flex-none"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 animate-spin" />
                  Creating...
                </>
              ) : step === steps.length - 1 ? (
                <>
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Create
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 