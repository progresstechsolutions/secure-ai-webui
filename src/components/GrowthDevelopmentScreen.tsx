import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface GrowthData {
  date: string;
  height: number;
  weight: number;
  notes: string;
}

interface DevelopmentMilestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  date?: string;
}

interface ChildProfile {
  name: string;
  age: string;
  condition: string;
  lastUpdated: string;
}

interface ProgressData {
  typicalProgress: number;
  pmsProgress: number;
  currentAge: number;
  targetAge: number;
}

interface MilestoneBadge {
  id: string;
  title: string;
  date: string;
  icon: string;
  category: 'physical' | 'cognitive' | 'social' | 'emotional';
}

interface DomainData {
  id: string;
  name: string;
  icon: string;
  strengths: string[];
  challenges: string[];
  progressData: {
    typical: number;
    pms: number;
    timeline: { date: string; typical: number; pms: number }[];
  };
  nextMilestones: {
    title: string;
    description: string;
    timeline: string;
    tips: string[];
  }[];
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  domain: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'therapy' | 'intervention' | 'assessment' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  evidence: string;
  actionUrl?: string;
}

interface NextStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'scheduled' | 'completed';
  type: 'assessment' | 'screening' | 'appointment' | 'follow-up';
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'infographic' | 'article';
  duration?: string;
  description: string;
  url: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'motor' | 'language' | 'social' | 'cognitive' | 'adaptive';
  targetDate: string;
  progress: number;
  status: 'active' | 'achieved' | 'paused';
  reminders: boolean;
  aiSuggested: boolean;
  createdAt: string;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  reason: string;
}

interface CommunityBenchmark {
  metric: string;
  average: number;
  range: string;
  sampleSize: number;
}

interface ClinicalReviewer {
  name: string;
  credentials: string;
  specialty: string;
  institution: string;
}

// AI/API Integration Interfaces
interface SurveyResponse {
  questionId: string;
  response: string | number;
  timestamp: Date;
}

interface MilestoneScore {
  domain: string;
  score: number;
  percentile: number;
  flagged: boolean;
  confidence: number;
}

interface NLPAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  flags: string[];
  suggestions: string[];
  confidence: number;
}

interface MediaAnalysis {
  type: 'video' | 'audio';
  duration: number;
  developmentalCues: string[];
  milestoneVerification: {
    milestone: string;
    confidence: number;
    verified: boolean;
  }[];
  feedback: string;
}

interface AIRecommendation {
  id: string;
  type: 'intervention' | 'assessment' | 'goal' | 'resource';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  evidence: string[];
}

interface ExportData {
  format: 'pdf' | 'csv';
  sections: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  includeMedia: boolean;
}

interface ClinicianInvite {
  email: string;
  permissions: string[];
  expiryDate: Date;
  secureLink: string;
}

interface GrowthDevelopmentScreenProps {
  onBack?: () => void;
  onNavigateToNutrition?: () => void;
  onNavigateToSymptomLogs?: () => void;
}

const GrowthDevelopmentScreen: React.FC<GrowthDevelopmentScreenProps> = ({ 
  onBack,
  onNavigateToNutrition,
  onNavigateToSymptomLogs
}) => {
  const [activeTab, setActiveTab] = useState('motor');
  const [isObservationPanelExpanded, setIsObservationPanelExpanded] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showContentLibrary, setShowContentLibrary] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // User flow tracking
  const [userFlowStep, setUserFlowStep] = useState<'overview' | 'domain' | 'update' | 'recommendations' | 'goals' | 'share' | 'feedback'>('overview');
  const [sessionStartTime] = useState(new Date());
  const [interactionCount, setInteractionCount] = useState(0);

  // AI/API Integration State
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [milestoneScores, setMilestoneScores] = useState<MilestoneScore[]>([]);
  const [nlpAnalysis, setNlpAnalysis] = useState<NLPAnalysis | null>(null);
  const [mediaAnalysis, setMediaAnalysis] = useState<MediaAnalysis | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [communityBenchmarks, setCommunityBenchmarks] = useState<CommunityBenchmark[]>([
    {
      metric: 'Language Development',
      average: 72,
      range: '65-85%',
      sampleSize: 847
    },
    {
      metric: 'Motor Skills',
      average: 68,
      range: '60-78%',
      sampleSize: 723
    },
    {
      metric: 'Social Interaction',
      average: 65,
      range: '58-75%',
      sampleSize: 612
    },
    {
      metric: 'Cognitive Development',
      average: 70,
      range: '63-80%',
      sampleSize: 534
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Responsive & Performance State
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lazyLoadedCharts, setLazyLoadedCharts] = useState(false);
  const [debouncedJournalEntry, setDebouncedJournalEntry] = useState('');

  // Mock child profile data
  const [childProfile] = useState<ChildProfile>({
    name: "Emma Johnson",
    age: "8 years, 3 months",
    condition: "Down Syndrome",
    lastUpdated: "2024-03-15"
  });

  // Progress data
  const [progressData] = useState<ProgressData>({
    typicalProgress: 75,
    pmsProgress: 68,
    currentAge: 8.25,
    targetAge: 9
  });

  // Recent milestone badges
  const [recentBadges] = useState<MilestoneBadge[]>([
    { id: '1', title: 'Climbed stairs!', date: '2024-03-14', icon: '🏃‍♀️', category: 'physical' },
    { id: '2', title: 'Read 3 words', date: '2024-03-12', icon: '📚', category: 'cognitive' },
    { id: '3', title: 'Shared toys', date: '2024-03-10', icon: '🤝', category: 'social' },
    { id: '4', title: 'Expressed feelings', date: '2024-03-08', icon: '😊', category: 'emotional' },
  ]);

  // Survey questions
  const [surveyQuestions] = useState<SurveyQuestion[]>([
    {
      id: '1',
      question: 'How well does Emma follow 2-step instructions?',
      type: 'scale',
      options: ['Not at all', 'Sometimes', 'Usually', 'Always'],
      domain: 'cognitive'
    },
    {
      id: '2',
      question: 'Does Emma initiate conversations with peers?',
      type: 'multiple-choice',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      domain: 'social'
    },
    {
      id: '3',
      question: 'Can Emma dress herself independently?',
      type: 'multiple-choice',
      options: ['Needs full help', 'Needs some help', 'Can do most', 'Fully independent'],
      domain: 'adaptive'
    },
    {
      id: '4',
      question: 'How would you rate Emma\'s current language development?',
      type: 'scale',
      options: ['Below average', 'Average', 'Above average'],
      domain: 'language'
    },
    {
      id: '5',
      question: 'Any specific observations about Emma\'s motor skills this week?',
      type: 'text',
      domain: 'motor'
    }
  ]);

  // Domain data
  const [domains] = useState<DomainData[]>([
    {
      id: 'motor',
      name: 'Motor',
      icon: '🏃‍♀️',
      strengths: ['Good balance', 'Can climb stairs', 'Fine motor coordination'],
      challenges: ['Running speed', 'Complex movements'],
      progressData: {
        typical: 72,
        pms: 65,
        timeline: [
          { date: '2024-01', typical: 68, pms: 60 },
          { date: '2024-02', typical: 70, pms: 62 },
          { date: '2024-03', typical: 72, pms: 65 }
        ]
      },
      nextMilestones: [
        {
          title: 'Jump with both feet',
          description: 'Able to jump off ground with both feet simultaneously',
          timeline: '2-3 months',
          tips: ['Practice on trampoline', 'Use visual cues', 'Celebrate small jumps']
        },
        {
          title: 'Ride a bike with training wheels',
          description: 'Maintain balance while pedaling with support',
          timeline: '4-6 months',
          tips: ['Start with balance bike', 'Practice in safe area', 'Use helmet']
        }
      ]
    },
    {
      id: 'language',
      name: 'Language',
      icon: '💬',
      strengths: ['Good vocabulary', 'Clear pronunciation', 'Follows directions'],
      challenges: ['Complex sentences', 'Abstract concepts'],
      progressData: {
        typical: 78,
        pms: 70,
        timeline: [
          { date: '2024-01', typical: 74, pms: 66 },
          { date: '2024-02', typical: 76, pms: 68 },
          { date: '2024-03', typical: 78, pms: 70 }
        ]
      },
      nextMilestones: [
        {
          title: 'Use compound sentences',
          description: 'Combine two simple sentences with connecting words',
          timeline: '1-2 months',
          tips: ['Model sentence structure', 'Use picture books', 'Ask open questions']
        },
        {
          title: 'Tell simple stories',
          description: 'Narrate events in sequence with beginning, middle, end',
          timeline: '3-4 months',
          tips: ['Use story prompts', 'Practice with familiar events', 'Record and replay']
        }
      ]
    },
    {
      id: 'social',
      name: 'Social',
      icon: '🤝',
      strengths: ['Friendly with adults', 'Shares toys', 'Shows empathy'],
      challenges: ['Peer interactions', 'Group activities'],
      progressData: {
        typical: 70,
        pms: 62,
        timeline: [
          { date: '2024-01', typical: 66, pms: 58 },
          { date: '2024-02', typical: 68, pms: 60 },
          { date: '2024-03', typical: 70, pms: 62 }
        ]
      },
      nextMilestones: [
        {
          title: 'Initiate play with peers',
          description: 'Approach other children and suggest play activities',
          timeline: '2-3 months',
          tips: ['Practice at home', 'Role-play scenarios', 'Start with familiar peers']
        },
        {
          title: 'Take turns in conversations',
          description: 'Listen and respond appropriately in group discussions',
          timeline: '3-4 months',
          tips: ['Use visual cues', 'Practice with family', 'Set conversation rules']
        }
      ]
    },
    {
      id: 'adaptive',
      name: 'Adaptive',
      icon: '🎯',
      strengths: ['Dresses independently', 'Follows routines', 'Self-care skills'],
      challenges: ['Time management', 'Problem-solving'],
      progressData: {
        typical: 75,
        pms: 68,
        timeline: [
          { date: '2024-01', typical: 71, pms: 64 },
          { date: '2024-02', typical: 73, pms: 66 },
          { date: '2024-03', typical: 75, pms: 68 }
        ]
      },
      nextMilestones: [
        {
          title: 'Use a calendar',
          description: 'Understand and track daily/weekly schedules',
          timeline: '1-2 months',
          tips: ['Start with visual calendar', 'Mark special events', 'Review daily']
        },
        {
          title: 'Complete multi-step tasks',
          description: 'Follow 3-4 step instructions independently',
          timeline: '2-3 months',
          tips: ['Break down tasks', 'Use checklists', 'Provide visual aids']
        }
      ]
    },
    {
      id: 'cognitive',
      name: 'Cognitive',
      icon: '🧠',
      strengths: ['Good memory', 'Pattern recognition', 'Visual learning'],
      challenges: ['Abstract thinking', 'Mathematical concepts'],
      progressData: {
        typical: 80,
        pms: 72,
        timeline: [
          { date: '2024-01', typical: 76, pms: 68 },
          { date: '2024-02', typical: 78, pms: 70 },
          { date: '2024-03', typical: 80, pms: 72 }
        ]
      },
      nextMilestones: [
        {
          title: 'Solve simple word problems',
          description: 'Understand and solve basic addition/subtraction problems',
          timeline: '2-3 months',
          tips: ['Use manipulatives', 'Draw pictures', 'Connect to real life']
        },
        {
          title: 'Make predictions',
          description: 'Predict outcomes based on patterns and observations',
          timeline: '3-4 months',
          tips: ['Ask "what if" questions', 'Use experiments', 'Discuss cause-effect']
        }
      ]
    }
  ]);

  const [growthData] = useState<GrowthData[]>([
    { date: '2024-01-15', height: 165, weight: 58, notes: 'Regular checkup' },
    { date: '2024-02-15', height: 166, weight: 59, notes: 'Good progress' },
    { date: '2024-03-15', height: 167, weight: 60, notes: 'Steady growth' },
  ]);

  const [milestones] = useState<DevelopmentMilestone[]>([
    { id: '1', title: 'Regular Exercise', description: 'Maintain 30 min daily activity', achieved: true, date: '2024-01-10' },
    { id: '2', title: 'Balanced Nutrition', description: 'Follow recommended meal plan', achieved: true, date: '2024-02-01' },
    { id: '3', title: 'Stress Management', description: 'Practice relaxation techniques', achieved: false },
    { id: '4', title: 'Sleep Quality', description: 'Maintain 7-8 hours sleep', achieved: false },
  ]);

  // Personalized recommendations
  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Consider AAC (Augmentative and Alternative Communication)',
      description: 'Based on Emma\'s language development, AAC tools could enhance communication. See local speech therapists for evaluation.',
      category: 'therapy',
      priority: 'high',
      evidence: 'Research shows AAC improves language development in children with Down Syndrome (McNaughton & Light, 2013)',
      actionUrl: '#'
    },
    {
      id: '2',
      title: 'Physical Therapy for Motor Skills',
      description: 'Targeted exercises to improve balance and coordination. Weekly sessions recommended.',
      category: 'intervention',
      priority: 'medium',
      evidence: 'Systematic review indicates PT improves motor function in children with Down Syndrome (Martin et al., 2019)',
      actionUrl: '#'
    },
    {
      id: '3',
      title: 'Social Skills Group',
      description: 'Peer interaction opportunities in structured environment. Helps develop social communication.',
      category: 'strategy',
      priority: 'medium',
      evidence: 'Group interventions show positive outcomes for social development (Roberts et al., 2020)',
      actionUrl: '#'
    }
  ]);

  // Next steps checklist
  const [nextSteps] = useState<NextStep[]>([
    {
      id: '1',
      title: 'Annual Developmental Assessment',
      description: 'Comprehensive evaluation with developmental pediatrician',
      dueDate: '2024-04-15',
      status: 'scheduled',
      type: 'assessment'
    },
    {
      id: '2',
      title: 'Vision Screening',
      description: 'Regular eye exam to monitor vision development',
      dueDate: '2024-05-01',
      status: 'pending',
      type: 'screening'
    },
    {
      id: '3',
      title: 'Speech Therapy Follow-up',
      description: 'Review progress and adjust goals',
      dueDate: '2024-03-25',
      status: 'scheduled',
      type: 'appointment'
    },
    {
      id: '4',
      title: 'Occupational Therapy Evaluation',
      description: 'Assess fine motor skills and daily living activities',
      dueDate: '2024-04-30',
      status: 'pending',
      type: 'assessment'
    }
  ]);

  // Content library items
  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Introduction to AAC for Children with Down Syndrome',
      type: 'video',
      duration: '8:45',
      description: 'Learn about different AAC options and how to implement them at home',
      url: '#'
    },
    {
      id: '2',
      title: 'Motor Development Milestones',
      type: 'infographic',
      description: 'Visual guide to typical and Down Syndrome-specific motor milestones',
      url: '#'
    },
    {
      id: '3',
      title: 'Building Social Skills at Home',
      type: 'video',
      duration: '12:30',
      description: 'Practical strategies for developing peer interaction skills',
      url: '#'
    },
    {
      id: '4',
      title: 'Speech and Language Development Guide',
      type: 'article',
      description: 'Comprehensive overview of language development stages and interventions',
      url: '#'
    }
  ]);

  // Active goals
  const [activeGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Balance and Coordination',
      description: 'Practice standing on one foot for 10 seconds and walking on a straight line',
      category: 'motor',
      targetDate: '2024-05-15',
      progress: 65,
      status: 'active',
      reminders: true,
      aiSuggested: false,
      createdAt: '2024-02-15'
    },
    {
      id: '2',
      title: 'Expand Vocabulary to 200 Words',
      description: 'Learn and use 20 new words in daily conversations',
      category: 'language',
      targetDate: '2024-06-01',
      progress: 45,
      status: 'active',
      reminders: true,
      aiSuggested: true,
      createdAt: '2024-03-01'
    },
    {
      id: '3',
      title: 'Initiate Play with Peers',
      description: 'Approach other children and suggest play activities at least 3 times per week',
      category: 'social',
      targetDate: '2024-04-30',
      progress: 30,
      status: 'active',
      reminders: true,
      aiSuggested: false,
      createdAt: '2024-02-20'
    }
  ]);

  // AI suggested goals
  const [aiSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      title: 'Use Compound Sentences',
      description: 'Combine two simple sentences with connecting words like "and", "but", "because"',
      category: 'language',
      reason: 'Based on Emma\'s current language development and age-appropriate milestones'
    },
    {
      id: '2',
      title: 'Complete 3-Step Instructions',
      description: 'Follow and complete instructions with 3 sequential steps independently',
      category: 'cognitive',
      reason: 'Aligns with Emma\'s cognitive development stage and daily routine needs'
    },
    {
      id: '3',
      title: 'Dress Independently',
      description: 'Put on and take off clothes without assistance, including buttons and zippers',
      category: 'adaptive',
      reason: 'Supports Emma\'s growing independence and self-care skills'
    },
    {
      id: '4',
      title: 'Share Toys and Take Turns',
      description: 'Engage in cooperative play, sharing toys and waiting for turns',
      category: 'social',
      reason: 'Builds on Emma\'s current social skills and peer interaction abilities'
    }
  ]);



  // Clinical reviewers
  const [clinicalReviewers] = useState<ClinicalReviewer[]>([
    {
      name: 'Dr. Sarah Johnson',
      credentials: 'MD, PhD',
      specialty: 'Developmental Pediatrics',
      institution: 'Children\'s Hospital of Philadelphia'
    },
    {
      name: 'Dr. Michael Chen',
      credentials: 'PhD, CCC-SLP',
      specialty: 'Speech-Language Pathology',
      institution: 'University of California, San Francisco'
    },
    {
      name: 'Dr. Emily Rodriguez',
      credentials: 'OTD, OTR/L',
      specialty: 'Occupational Therapy',
      institution: 'Boston Children\'s Hospital'
    },
    {
      name: 'Dr. David Thompson',
      credentials: 'PhD, BCBA-D',
      specialty: 'Applied Behavior Analysis',
      institution: 'Vanderbilt University'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cognitive': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'social': return 'bg-green-100 text-green-700 border-green-200';
      case 'emotional': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getGoalCategoryIcon = (category: string) => {
    switch (category) {
      case 'motor': return '🏃‍♀️';
      case 'language': return '💬';
      case 'social': return '🤝';
      case 'cognitive': return '🧠';
      case 'adaptive': return '🎯';
      default: return '📋';
    }
  };

  const getGoalCategoryColor = (category: string) => {
    switch (category) {
      case 'motor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'language': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'social': return 'bg-green-100 text-green-700 border-green-200';
      case 'cognitive': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'adaptive': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const activeDomain = domains.find(domain => domain.id === activeTab);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Analyze media content
      const analysis = await analyzeMediaUpload(file);
      setMediaAnalysis(analysis);
      
      // Generate updated recommendations
      if (milestoneScores.length > 0) {
        const recommendations = await generateAIRecommendations(milestoneScores, nlpAnalysis);
        setAiRecommendations(recommendations);
      }
    }
  };



  const handleJournalSubmit = async () => {
    if (journalEntry.trim()) {
      // Analyze journal entry with NLP
      const analysis = await analyzeJournalEntry(journalEntry);
      setNlpAnalysis(analysis);
      
      // Generate updated recommendations if we have milestone scores
      if (milestoneScores.length > 0) {
        const recommendations = await generateAIRecommendations(milestoneScores, analysis);
        setAiRecommendations(recommendations);
      }
      
      setJournalEntry('');
      setUserFlowStep('recommendations');
      setInteractionCount(prev => prev + 1);
    }
  };

  // User flow interaction handlers
  const handleDomainTabClick = (domainId: string) => {
    setActiveTab(domainId);
    setUserFlowStep('domain');
    setInteractionCount(prev => prev + 1);
  };

  const handleUpdateProgressClick = () => {
    setShowSurvey(true);
    setUserFlowStep('update');
    setInteractionCount(prev => prev + 1);
  };

  const handleSurveySubmit = async () => {
    // Process survey responses through AI
    const responses: SurveyResponse[] = surveyQuestions.map(q => ({
      questionId: q.id,
      response: 'sample response', // In real app, this would be actual user responses
      timestamp: new Date()
    }));
    
    const scores = await processSurveyResponses(responses);
    setMilestoneScores(scores);
    
    // Generate AI recommendations
    const recommendations = await generateAIRecommendations(scores, nlpAnalysis);
    setAiRecommendations(recommendations);
    
    setShowSurvey(false);
    setUserFlowStep('recommendations');
    setInteractionCount(prev => prev + 1);
  };

  const handleGoalAddClick = () => {
    setShowGoalModal(true);
    setUserFlowStep('goals');
    setInteractionCount(prev => prev + 1);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
    setUserFlowStep('share');
    setInteractionCount(prev => prev + 1);
  };

  const handleFeedbackSubmit = (isHelpful: boolean) => {
    setFeedbackSubmitted(true);
    setUserFlowStep('feedback');
    setInteractionCount(prev => prev + 1);
  };

  const handleTransparencyClick = () => {
    setShowTransparencyModal(true);
    setInteractionCount(prev => prev + 1);
  };

  // AI/API Service Functions
  const processSurveyResponses = async (responses: SurveyResponse[]): Promise<MilestoneScore[]> => {
    setIsProcessing(true);
    setProcessingMessage('Analyzing survey responses...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scores: MilestoneScore[] = responses.map(response => ({
      domain: surveyQuestions.find(q => q.id === response.questionId)?.domain || 'general',
      score: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
      percentile: Math.floor(Math.random() * 40) + 30, // Mock percentile 30-70
      flagged: Math.random() > 0.7, // 30% chance of flagging
      confidence: Math.random() * 0.3 + 0.7 // Confidence 70-100%
    }));
    
    setIsProcessing(false);
    setProcessingMessage('');
    return scores;
  };

  const analyzeJournalEntry = async (entry: string): Promise<NLPAnalysis> => {
    setIsProcessing(true);
    setProcessingMessage('Analyzing journal entry...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis: NLPAnalysis = {
      sentiment: entry.toLowerCase().includes('great') || entry.toLowerCase().includes('improved') ? 'positive' : 
                entry.toLowerCase().includes('struggle') || entry.toLowerCase().includes('difficult') ? 'negative' : 'neutral',
      keywords: entry.toLowerCase().split(' ').filter(word => word.length > 4).slice(0, 5),
      flags: entry.toLowerCase().includes('regression') ? ['Potential regression detected'] : [],
      suggestions: entry.toLowerCase().includes('speech') ? ['Consider speech therapy consultation'] : [],
      confidence: Math.random() * 0.3 + 0.7
    };
    
    setIsProcessing(false);
    setProcessingMessage('');
    return analysis;
  };

  const analyzeMediaUpload = async (file: File): Promise<MediaAnalysis> => {
    setIsProcessing(true);
    setProcessingMessage('Analyzing media content...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const analysis: MediaAnalysis = {
      type: file.type.startsWith('video') ? 'video' : 'audio',
      duration: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
      developmentalCues: [
        'Clear eye contact observed',
        'Vocalization patterns detected',
        'Motor coordination visible'
      ],
      milestoneVerification: [
        {
          milestone: 'Social interaction',
          confidence: 0.85,
          verified: true
        },
        {
          milestone: 'Language development',
          confidence: 0.72,
          verified: false
        }
      ],
      feedback: 'Good quality recording. Consider capturing more structured activities for better analysis.'
    };
    
    setIsProcessing(false);
    setProcessingMessage('');
    return analysis;
  };

  const generateAIRecommendations = async (scores: MilestoneScore[], analysis: NLPAnalysis | null): Promise<AIRecommendation[]> => {
    setIsProcessing(true);
    setProcessingMessage('Generating personalized recommendations...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const recommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'intervention',
        title: 'Speech Therapy Consultation',
        description: 'Based on language development scores, consider scheduling a speech therapy evaluation.',
        priority: 'high',
        confidence: 0.88,
        reasoning: 'Language scores are below expected range for age group',
        evidence: ['CDC Language Development Guidelines', 'PMS Research Database']
      },
      {
        id: '2',
        type: 'assessment',
        title: 'Occupational Therapy Screening',
        description: 'Motor skills assessment recommended for fine motor development.',
        priority: 'medium',
        confidence: 0.75,
        reasoning: 'Motor coordination patterns suggest need for evaluation',
        evidence: ['Developmental Milestone Database', 'Clinical Guidelines']
      }
    ];
    
    setIsProcessing(false);
    setProcessingMessage('');
    return recommendations;
  };

  const fetchCommunityBenchmarks = async (): Promise<CommunityBenchmark[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        metric: 'Language Development',
        average: 72,
        range: '65-85%',
        sampleSize: 847
      },
      {
        metric: 'Motor Skills',
        average: 68,
        range: '60-78%',
        sampleSize: 723
      },
      {
        metric: 'Social Interaction',
        average: 65,
        range: '58-75%',
        sampleSize: 612
      },
      {
        metric: 'Cognitive Development',
        average: 70,
        range: '63-80%',
        sampleSize: 534
      }
    ];
  };

  const exportReport = async (data: ExportData): Promise<string> => {
    setIsProcessing(true);
    setProcessingMessage('Generating report...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setProcessingMessage('');
    return `growth_development_report_${new Date().toISOString().split('T')[0]}.${data.format}`;
  };

  const inviteClinician = async (invite: ClinicianInvite): Promise<boolean> => {
    setIsProcessing(true);
    setProcessingMessage('Sending invitation...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setProcessingMessage('');
    return true;
  };

  // Responsive Behavior & Performance Hooks
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Initialize responsive state
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lazy load charts when component is visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setLazyLoadedCharts(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Debounce journal entry for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJournalEntry(journalEntry);
    }, 1000);

    return () => clearTimeout(timer);
  }, [journalEntry]);

  // Memoized responsive classes
  const responsiveClasses = useMemo(() => ({
    container: isMobile ? 'max-w-full px-4' : isTablet ? 'max-w-3xl mx-auto px-6' : 'max-w-4xl mx-auto px-8',
    grid: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3',
    tabs: isMobile ? 'flex-col space-y-2' : 'flex-row space-x-2',
    modal: isMobile ? 'w-full mx-4' : isTablet ? 'w-11/12 max-w-2xl' : 'w-3/4 max-w-4xl',
    stickyFooter: isMobile ? 'fixed bottom-0 left-0 right-0' : 'sticky bottom-0'
  }), [isMobile, isTablet, isDesktop]);

  // Performance optimized handlers
  const debouncedHandleJournalSubmit = useCallback(async () => {
    if (debouncedJournalEntry.trim()) {
      const analysis = await analyzeJournalEntry(debouncedJournalEntry);
      setNlpAnalysis(analysis);
      
      if (milestoneScores.length > 0) {
        const recommendations = await generateAIRecommendations(milestoneScores, analysis);
        setAiRecommendations(recommendations);
      }
      
      setJournalEntry('');
      setUserFlowStep('recommendations');
      setInteractionCount(prev => prev + 1);
    }
  }, [debouncedJournalEntry, milestoneScores]);

  // Lazy load components
  const LazyChart = useMemo(() => {
    if (!lazyLoadedCharts) {
      return () => (
        <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center">
          <span className="text-gray-500">Loading chart...</span>
        </div>
      );
    }
    return () => (
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg h-32 flex items-center justify-center">
        <span className="text-blue-600 font-medium">Progress Timeline Chart</span>
      </div>
    );
  }, [lazyLoadedCharts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 md:py-6">
      {/* Responsive Container */}
      <div className={responsiveClasses.container}>
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden"
             style={{ 
               maxHeight: isMobile ? 'calc(100vh - 2rem)' : 'calc(100vh - 4rem)',
               height: isMobile ? 'calc(100vh - 2rem)' : 'auto'
             }}>
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Processing</p>
                  <p className="text-xs text-gray-600">{processingMessage}</p>
                </div>
              </div>
            </div>
          )}



          {/* Scrollable Content Area - Now Includes Header */}
          <div className={`overflow-y-auto ${isMobile ? 'max-h-[calc(100vh-100px)]' : 'max-h-[calc(100vh-100px)]'} pb-8`}>
            {/* Enhanced Header - Now Scrollable */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">Growth & Development</h1>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="text-white hover:text-indigo-200 font-medium flex items-center space-x-2 transition-colors"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                )}
              </div>
              
              {/* User Flow Guidance */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">👀</span>
                    <span className="text-sm font-medium">
                      {userFlowStep === 'overview' && 'See Progress at a Glance'}
                      {userFlowStep === 'domain' && 'Drill Down by Domain'}
                      {userFlowStep === 'update' && 'Update Progress'}
                      {userFlowStep === 'recommendations' && 'Receive Recommendations'}
                      {userFlowStep === 'goals' && 'Set or Adjust Goals'}
                      {userFlowStep === 'share' && 'Share or Export'}
                      {userFlowStep === 'feedback' && 'Give Feedback'}
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    Step {interactionCount + 1} of your session
                  </div>
                </div>
              </div>
              
              {/* Child Profile Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
                  <div>
                    <div className="text-sm font-medium text-indigo-200">Child's Name</div>
                    <div className="text-lg font-semibold">{childProfile.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-200">Age</div>
                    <div className="text-lg font-semibold">{childProfile.age}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-200">Condition</div>
                    <div className="text-lg font-semibold">{childProfile.condition}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-200">Last Updated</div>
                    <div className="text-lg font-semibold">{childProfile.lastUpdated}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Progress Overview Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
                  Progress Overview
                </h2>
                
                {/* Dual Baseline Progress Bars */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Development Progress</h3>
                    <div className="relative group">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        ℹ️ Sources
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Benchmarked against CDC/WHO and PMS research (see sources)
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Typical Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Typical Development</span>
                        <span className="text-sm font-semibold text-blue-600">{progressData.typicalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressData.typicalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* PMS-Specific Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">PMS-Specific Development</span>
                        <span className="text-sm font-semibold text-purple-600">{progressData.pmsProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressData.pmsProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                      Age: {progressData.currentAge} years → Target: {progressData.targetAge} years
                    </span>
                  </div>
                </div>

                {/* Milestone Badges */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🏆</span>
                    Recent Achievements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentBadges.map((badge) => (
                      <div 
                        key={badge.id} 
                        className={`p-4 rounded-lg border-2 ${getCategoryColor(badge.category)} hover:scale-105 transition-transform cursor-pointer`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{badge.title}</div>
                            <div className="text-sm opacity-75">{badge.date}</div>
                          </div>
                          <div className="text-xs font-medium capitalize">
                            {badge.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Celebrate Wins Animation Trigger */}
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => {
                        setUserFlowStep('update');
                        setInteractionCount(prev => prev + 1);
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        userFlowStep === 'overview' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 animate-pulse' 
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                      }`}
                    >
                      🎉 Log New Achievement
                    </button>
                  </div>
                </div>
              </div>

              {/* Input & Observation Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-3"></span>
                  Input & Observation
                </h2>
                
                {/* Expandable Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Panel Header */}
                  <button
                    onClick={() => setIsObservationPanelExpanded(!isObservationPanelExpanded)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📝</span>
                      <span className="font-semibold text-gray-900">Add Observations & Updates</span>
                    </div>
                    <span className={`text-gray-500 transition-transform duration-200 ${isObservationPanelExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Panel Content */}
                  {isObservationPanelExpanded && (
                    <div className="px-6 pb-6 space-y-6">
                      {/* Adaptive Survey Button */}
                      <div className={`rounded-lg p-4 border transition-all duration-300 ${
                        userFlowStep === 'update' 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg' 
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                      }`}>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-xl mr-2">📊</span>
                          Quick Assessment
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Update Emma's progress with a short, dynamic survey (Vineland/M-CHAT style, 3-5 questions max per session).
                        </p>
                        <button
                          onClick={handleUpdateProgressClick}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Update Progress
                        </button>
                      </div>

                      {/* Journaling Prompt */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-xl mr-2">✍️</span>
                          Daily Observations
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">Anything new or different? (Optional)</p>
                        <textarea
                          value={journalEntry}
                          onChange={(e) => setJournalEntry(e.target.value)}
                          placeholder="Share your observations about Emma's development, behavior, or achievements..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                        />
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            AI/NLP analysis will provide insights and suggestions
                          </span>
                          <button
                            onClick={handleJournalSubmit}
                            disabled={!journalEntry.trim()}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Save Entry
                          </button>
                        </div>
                      </div>

                      {/* Media Upload */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-xl mr-2">📹</span>
                          Media Capture
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">Add a video or audio clip</p>
                        
                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                          <input
                            type="file"
                            accept="video/*,audio/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="media-upload"
                          />
                          <label htmlFor="media-upload" className="cursor-pointer">
                            <div className="space-y-2">
                              <span className="text-3xl">📁</span>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  MP4, MOV, MP3, WAV up to 50MB
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <strong>Privacy Notice:</strong> All media is encrypted and stored securely. 
                            Only authorized caregivers and healthcare providers can access this content.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Survey Modal */}
              {showSurvey && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className={`bg-white rounded-xl ${responsiveClasses.modal} max-h-[80vh] overflow-y-auto`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Quick Assessment</h3>
                        <button
                          onClick={() => setShowSurvey(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        {surveyQuestions.slice(0, 3).map((question, index) => (
                          <div key={question.id} className="space-y-3">
                            <h4 className="font-medium text-gray-900">
                              {index + 1}. {question.question}
                            </h4>
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name={question.id} className="text-blue-600" />
                                    <span className="text-gray-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {question.type === 'scale' && question.options && (
                              <div className="flex justify-between">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex flex-col items-center space-y-2 cursor-pointer">
                                    <input type="radio" name={question.id} className="text-blue-600" />
                                    <span className="text-xs text-gray-600 text-center">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {question.type === 'text' && (
                              <textarea
                                placeholder="Enter your observations..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button
                          onClick={() => setShowSurvey(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSurveySubmit}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Submit Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Domain Details Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
                  Domain Details
                </h2>
                
                {/* Tab Navigation */}
                <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
                  <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-wrap gap-2'}`}>
                    {domains.map((domain) => (
                      <button
                        key={domain.id}
                        onClick={() => handleDomainTabClick(domain.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          activeTab === domain.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : userFlowStep === 'domain'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-lg">{domain.icon}</span>
                        <span>{domain.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Domain Content */}
                {activeDomain && (
                  <div className="space-y-6">
                    {/* Spider Chart / Heatmap */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">{activeDomain.icon}</span>
                        {activeDomain.name} Development Snapshot
                      </h3>
                      
                      <div className={`grid ${responsiveClasses.grid} gap-6`}>
                        {/* Strengths */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Strengths
                          </h4>
                          <div className="space-y-2">
                            {activeDomain.strengths.map((strength, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-gray-700">{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Challenges */}
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                            Areas for Growth
                          </h4>
                          <div className="space-y-2">
                            {activeDomain.challenges.map((challenge, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-orange-500">→</span>
                                <span className="text-gray-700">{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Mini-Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h3>
                      <LazyChart />
                      <div className="space-y-4 mt-4">
                        {activeDomain.progressData.timeline.map((point, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-16 text-sm font-medium text-gray-600">{point.date}</div>
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Typical: {point.typical}%</span>
                                <span>PMS: {point.pms}%</span>
                              </div>
                              <div className="flex space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${point.typical}%` }}
                                  ></div>
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${point.pms}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What's Next Preview */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎯</span>
                        What's Next?
                      </h3>
                      
                      <div className="space-y-4">
                        {activeDomain.nextMilestones.map((milestone, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              </div>
                              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                {milestone.timeline}
                              </span>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Tips:</h5>
                              <ul className="space-y-1">
                                {milestone.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personalized Recommendations Section */}
              <div className={`transition-all duration-300 ${
                userFlowStep === 'recommendations' ? 'ring-2 ring-teal-300 rounded-xl p-2' : ''
              }`}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-3"></span>
                  Personalized Recommendations
                  {userFlowStep === 'recommendations' && (
                    <span className="ml-2 text-sm bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </h2>
                
                {/* AI Analysis Results */}
                {(nlpAnalysis || mediaAnalysis) && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🤖</span>
                      AI Analysis Results
                    </h3>
                    
                    {nlpAnalysis && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Journal Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Sentiment:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              nlpAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              nlpAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {nlpAnalysis.sentiment}
                            </span>
                          </div>
                          {nlpAnalysis.flags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Flags:</span>
                              <span className="text-sm text-red-600 font-medium">{nlpAnalysis.flags.join(', ')}</span>
                            </div>
                          )}
                          {nlpAnalysis.suggestions.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Suggestions:</span>
                              <span className="text-sm text-blue-600 font-medium">{nlpAnalysis.suggestions.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {mediaAnalysis && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Media Analysis</h4>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Duration:</span> {mediaAnalysis.duration}s
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Cues detected:</span> {mediaAnalysis.developmentalCues.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Feedback:</span> {mediaAnalysis.feedback}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                                  {/* Dynamic Suggestions */}
                  <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'} mb-6`}>
                  {(aiRecommendations.length > 0 ? aiRecommendations : recommendations).map((recommendation) => (
                    <div key={recommendation.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                            <div className="relative group">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                ℹ️
                              </button>
                              <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <strong>Evidence:</strong> {recommendation.evidence}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{recommendation.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority} priority
                        </span>
                      </div>
                                              <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 capitalize">
                            {'category' in recommendation ? recommendation.category : recommendation.type}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                            Learn More →
                          </button>
                        </div>
                    </div>
                  ))}
                </div>

                {/* Next Steps Checklist */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">📋</span>
                    Next Steps Checklist
                  </h3>
                  
                  <div className="space-y-3">
                    {nextSteps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.status === 'completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300'
                        }`}>
                          {step.status === 'completed' && '✓'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <p className="text-xs text-gray-500">Due: {step.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Library Link */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="text-xl mr-2">📚</span>
                        Learn About Therapies & Home Strategies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Access curated videos, infographics, and articles to support Emma's development
                      </p>
                    </div>
                    <button
                      onClick={() => setShowContentLibrary(true)}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Open Library
                    </button>
                  </div>
                </div>

                {/* Goals & Reminders Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      Goals & Reminders
                    </h3>
                    <button
                      onClick={handleGoalAddClick}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      + Add Goal
                    </button>
                  </div>

                  {/* Active Goals List */}
                  <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                    {activeGoals.map((goal) => (
                      <div key={goal.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getGoalCategoryIcon(goal.category)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGoalCategoryColor(goal.category)}`}>
                              {goal.category}
                            </span>
                          </div>
                          {goal.aiSuggested && (
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                              AI Suggested
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">{goal.title}</h4>
                        <p className="text-xs text-gray-600 mb-3">{goal.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-medium text-gray-900">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Due: {goal.targetDate}</span>
                          <div className="flex space-x-2">
                            <button className="text-xs text-indigo-600 hover:text-indigo-700">
                              Edit
                            </button>
                            <button className="text-xs text-green-600 hover:text-green-700">
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Library Modal */}
              {showContentLibrary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Content Library</h3>
                        <button
                          onClick={() => setShowContentLibrary(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentItems.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">
                                {item.type === 'video' && '🎥'}
                                {item.type === 'infographic' && '📊'}
                                {item.type === 'article' && '📄'}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                                  {item.duration && (
                                    <span className="text-xs text-gray-500">{item.duration}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* Feedback & Sharing Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full mr-3"></span>
                  Feedback & Sharing
                </h2>
                
                {/* Quick Feedback */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">💬</span>
                    Was this helpful?
                  </h3>
                  
                  {!feedbackSubmitted ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                          <span>👍</span>
                          <span>Yes, helpful</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          <span>👎</span>
                          <span>Not helpful</span>
                        </button>
                      </div>
                      <textarea
                        placeholder="Any additional comments or suggestions? (Optional)"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                      />
                      <button
                        onClick={() => handleFeedbackSubmit(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-green-600 text-lg">✅ Thank you for your feedback!</span>
                    </div>
                  )}
                </div>

                {/* Community Benchmark */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">👥</span>
                    Other parents with PMS at this age...
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {communityBenchmarks.map((benchmark) => (
                      <div key={benchmark.metric} className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-2">{benchmark.metric}</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-indigo-600">{benchmark.average}%</div>
                            <div className="text-sm text-gray-600">Average</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{benchmark.range}</div>
                            <div className="text-xs text-gray-500">Range</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Based on {benchmark.sampleSize} anonymous responses
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      All data is anonymized and aggregated for privacy
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Opt out of sharing
                    </button>
                  </div>
                </div>

                {/* Export/Share Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Export Report */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">📄</span>
                      Export Report
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate a comprehensive report for clinicians or IEP meetings
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={handleExportClick}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Export PDF Report
                      </button>
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Export CSV Data
                      </button>
                    </div>
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <strong>Privacy:</strong> You control what data is included in exports
                    </div>
                  </div>

                  {/* Invite Clinician */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">👨‍⚕️</span>
                      Invite Clinician
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Share Emma's progress securely with healthcare providers
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Provider's email address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Send Secure Invite
                      </button>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                      <strong>Secure:</strong> Providers access data through encrypted, time-limited links
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparency & Rigor Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3"></span>
                  Transparency & Rigor
                </h2>
                
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-xl mr-2">🔬</span>
                      How Recommendations Are Made
                    </h3>
                    <button
                      onClick={handleTransparencyClick}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      How this works →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">📚</div>
                      <h4 className="font-medium text-gray-900 mb-1">Evidence-Based</h4>
                      <p className="text-xs text-gray-600">Peer-reviewed research and clinical guidelines</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <h4 className="font-medium text-gray-900 mb-1">Expert Reviewed</h4>
                      <p className="text-xs text-gray-600">Validated by developmental specialists</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <h4 className="font-medium text-gray-900 mb-1">Personalized</h4>
                      <p className="text-xs text-gray-600">Tailored to Emma's specific needs and progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Modal */}
      {showTransparencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">How This Works</h3>
                <button
                  onClick={() => setShowTransparencyModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Our Process</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-600 font-bold">1.</span>
                      <div>
                        <p className="text-gray-900">We analyze Emma's development data against evidence-based milestones</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-600 font-bold">2.</span>
                      <div>
                        <p className="text-gray-900">AI algorithms identify patterns and suggest relevant interventions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-600 font-bold">3.</span>
                      <div>
                        <p className="text-gray-900">Recommendations are validated against clinical research and expert knowledge</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-emerald-600 font-bold">4.</span>
                      <div>
                        <p className="text-gray-900">Personalized suggestions are presented with clear explanations and evidence</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Clinical Reviewers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinicalReviewers.map((reviewer) => (
                      <div key={reviewer.name} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">{reviewer.name}</h5>
                        <p className="text-sm text-gray-600">{reviewer.credentials}</p>
                        <p className="text-sm text-gray-600">{reviewer.specialty}</p>
                        <p className="text-xs text-gray-500">{reviewer.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key References</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• American Academy of Pediatrics. (2022). Developmental Surveillance and Screening</p>
                    <p>• Centers for Disease Control and Prevention. (2023). Developmental Milestones</p>
                    <p>• Down Syndrome Medical Interest Group. (2021). Health Supervision Guidelines</p>
                    <p>• World Health Organization. (2022). Child Growth Standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Export Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Select Data to Include</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="text-indigo-600" />
                      <span className="text-gray-700">Growth measurements and trends</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="text-indigo-600" />
                      <span className="text-gray-700">Development milestones and progress</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="text-indigo-600" />
                      <span className="text-gray-700">Goals and achievements</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="text-indigo-600" />
                      <span className="text-gray-700">Personal observations and notes</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="text-indigo-600" />
                      <span className="text-gray-700">Recommendations and next steps</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl ${responsiveClasses.modal} max-h-[80vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Set a New Goal</h3>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* AI Suggestions */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">AI Suggested Goals</h4>
                    <button
                      onClick={() => setShowAISuggestions(!showAISuggestions)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      {showAISuggestions ? 'Hide' : 'Show'} Suggestions
                    </button>
                  </div>
                  
                  {showAISuggestions && (
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="bg-white rounded-lg p-3 border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 text-sm">{suggestion.title}</h5>
                              <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                              <p className="text-xs text-purple-600 mt-2 italic">"{suggestion.reason}"</p>
                            </div>
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium ml-2">
                              Use This
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Goal Form */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Create Custom Goal</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Improve balance and coordination"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Describe what you want to achieve..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="motor">Motor</option>
                        <option value="language">Language</option>
                        <option value="social">Social</option>
                        <option value="cognitive">Cognitive</option>
                        <option value="adaptive">Adaptive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                      <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="reminders" className="text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="reminders" className="text-sm text-gray-700">
                      Enable reminders for this goal
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthDevelopmentScreen; 