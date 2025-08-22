import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, ArrowRight, ArrowLeft, Check, X, Search } from "lucide-react";

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; bio: string; description: string; conditions: string[] }) => void;
  availableConditions: string[];
}

const steps = [
  { title: "Name", description: "Choose a memorable name for your community" },
  { title: "Bio", description: "Write a short, engaging summary" },
  { title: "Description", description: "Describe your community's purpose and goals" },
  { title: "Conditions", description: "Select related health conditions" }
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, onClose, onCreate, availableConditions }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionSearch, setConditionSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleNext = () => {
    setError("");
    if (step === 0 && !name.trim()) return setError("Community name is required.");
    if (step === 1 && !bio.trim()) return setError("Bio is required.");
    if (step === 2 && !description.trim()) return setError("Description is required.");
    if (step === 3 && conditions.length === 0) return setError("Select at least one condition.");
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setSuccess(true);
      setTimeout(() => {
        const newCommunity = { name, bio, description, conditions };
        // Do NOT write to localStorage here. Let parent handle it.
        onCreate(newCommunity);
        setSuccess(false);
        setStep(0);
        setName("");
        setBio("");
        setDescription("");
        setConditions([]);
        onClose();
      }, 1000);
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
    setName("");
    setBio("");
    setDescription("");
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
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={60}
                  className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">{name.length}/60 characters</p>
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
                  Short Bio <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., A supportive space for families and individuals"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={100}
                  className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/100 characters</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-green-800">✨ Summarize your community's purpose in one welcoming sentence</p>
              </div>
            </div>
          )}

          {step === 2 && (
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
              disabled={success}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg flex-1 sm:flex-none"
              size="sm"
            >
              {step === steps.length - 1 ? (
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