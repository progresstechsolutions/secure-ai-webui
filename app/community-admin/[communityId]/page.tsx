"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Plus,
  BarChart3,
  Activity,
  Eye,
  Heart,
  UserPlus,
  Crown,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { useUserCommunities } from "@/hooks/use-api";

// Utility function for admin check
function isUserAdminOfCommunity(user: { userKey?: string; username?: string; name?: string; email?: string }, community: any): boolean {
  console.log("Admin check - user:", user);
  console.log("Admin check - community:", community);
  
  if (!user || !community) {
    console.log("Admin check failed - missing user or community");
    return false;
  }
  
  // Check if user is in admins array
  if (community.admins && Array.isArray(community.admins)) {
    const isAdmin = community.admins.some((admin: any) => 
      admin.name?.toLowerCase() === user.username?.toLowerCase() ||
      admin.email?.toLowerCase() === user.username?.toLowerCase() ||
      admin.name?.toLowerCase() === user.name?.toLowerCase() ||
      admin.email?.toLowerCase() === user.email?.toLowerCase()
    );
    if (isAdmin) {
      console.log("Admin check (admins array) - result:", true);
      return true;
    }
  }
  
  // Check if user is the creator
  if (community.createdBy && (user.username || user.name || user.email)) {
    const isCreator = community.createdBy.name?.toLowerCase() === user.username?.toLowerCase() ||
                     community.createdBy.email?.toLowerCase() === user.username?.toLowerCase() ||
                     community.createdBy.name?.toLowerCase() === user.name?.toLowerCase() ||
                     community.createdBy.email?.toLowerCase() === user.email?.toLowerCase();
    console.log("Admin check (createdBy) - result:", isCreator);
    return isCreator;
  }

  // Check userRole if available
  if (community.userRole) {
    const isAdminRole = community.userRole === 'admin' || community.userRole === 'creator';
    console.log("Admin check (userRole) - result:", isAdminRole);
    return isAdminRole;
  }
  
  console.log("Admin check failed - no matching admin criteria");
  return false;
}

export default function CommunityAdminPage() {
  const { communityId } = useParams();
  const router = useRouter();
  
  // State hooks - must be called before any conditional returns
  const [community, setCommunity] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    totalMembers: 0,
    totalViews: 0,
    totalReactions: 0,
    weeklyGrowth: 0,
    activeMembers: 0,
    recentActivity: [] as Array<{action: string, user: string, time: string}>
  });

  // Fetch communities from API - must be called before conditional returns
  const { communities, loading: communitiesLoading, error: communitiesError } = useUserCommunities();

  // All useCallback hooks must be defined before conditional returns
  const calculateMetrics = useCallback((community: any) => {
    // Mock metrics calculation - in real app, this would come from your database
    const creatorName = community?.createdBy?.name || community?.createdBy?.email || "Admin";
    const memberNames = community.members?.map((m: any) => m.name || m.email) || [];
    const adminNames = community.admins?.map((a: any) => a.name || a.email) || [];
    const creatorNameFromCommunity = community.createdBy?.name || community.createdBy?.email;
    const allMembers = [...new Set([...memberNames, ...adminNames, creatorNameFromCommunity].filter(Boolean))];
    
    const mockMetrics = {
      totalPosts: community.posts || Math.floor(Math.random() * 50) + 10,
      totalMembers: community.memberCount || allMembers.length + Math.floor(Math.random() * 20),
      totalViews: Math.floor(Math.random() * 1000) + 200,
      totalReactions: Math.floor(Math.random() * 200) + 50,
      weeklyGrowth: Math.floor(Math.random() * 20) - 5, // Can be negative
      activeMembers: Math.floor(allMembers.length * 0.7),
      recentActivity: [
        { action: "New member joined", user: "user123", time: "2 hours ago" },
        { action: "New post created", user: creatorName, time: "5 hours ago" },
        { action: "Comment added", user: "member456", time: "1 day ago" },
        { action: "Post liked", user: "visitor789", time: "2 days ago" },
      ]
    };
    setMetrics(mockMetrics);
  }, []); // Empty dependency array since we're using parameters

  const handleSave = useCallback(async () => {
    try {
      // TODO: Implement community update API call
      // For now, just update local state
      setCommunity({ ...community, ...editData });
      setEditMode(false);
      // Show success message
      console.log("Community updated successfully");
    } catch (error) {
      console.error("Failed to update community:", error);
      setError("Failed to update community. Please try again.");
    }
  }, [community, editData]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this community? This cannot be undone.")) return;
    
    try {
      // TODO: Implement community delete API call
      // For now, just redirect
      console.log("Community would be deleted");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete community:", error);
      setError("Failed to delete community. Please try again.");
    }
  }, [router]);

  // Mock member management - TODO: Implement proper API calls
  const handleAddMember = useCallback(async () => {
    const newMember = prompt("Enter username to add as member:");
    if (newMember && !members.includes(newMember)) {
      try {
        // TODO: Implement add member API call
        const updatedMembers = [...members, newMember];
        setMembers(updatedMembers);
        console.log("Member added successfully");
      } catch (error) {
        console.error("Failed to add member:", error);
        setError("Failed to add member. Please try again.");
      }
    }
  }, [members]);

  const handleRemoveMember = useCallback(async (username: string) => {
    if (!confirm(`Remove ${username} from community?`)) return;
    
    try {
      // TODO: Implement remove member API call
      const updatedMembers = members.filter((m) => m !== username);
      setMembers(updatedMembers);
      console.log("Member removed successfully");
    } catch (error) {
      console.error("Failed to remove member:", error);
      setError("Failed to remove member. Please try again.");
    }
  }, [members]);

  // Set user data once on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the SAME mock user data that the API client uses
        // This ensures the user data matches the community creator data
        const mockUser = {
          id: "66b1e5c8f1d2a3b4c5d6e7f8",
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "/placeholder-user.jpg",
          username: "john.doe@example.com" // Add username for admin check
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error("Error setting user data:", error);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []); // Empty dependency array - only run once on mount

  // Handle community data when communities or user data changes
  useEffect(() => {
    if (!user) return; // Wait for user data
    
    // Find community from API data
    if (communities && communities.length > 0) {
      const found = communities.find((c: any) => c._id === communityId || c.id === communityId);
      if (found) {
        setCommunity(found);
        setEditData(found);
        // Set members from the community data
        const memberNames = found.members?.map((m: any) => m.name || m.email) || [];
        const adminNames = found.admins?.map((a: any) => a.name || a.email) || [];
        const creatorName = found.createdBy?.name || found.createdBy?.email;
        const allMembers = [...new Set([...memberNames, ...adminNames, creatorName].filter(Boolean))];
        setMembers(allMembers);
        setIsAdmin(isUserAdminOfCommunity(user, found));
        calculateMetrics(found);
        setLoading(false);
      } else {
        setError("Community not found or access denied.");
        setLoading(false);
      }
    } else if (!communitiesLoading && communitiesError) {
      setError("Failed to load communities. Please try again.");
      setLoading(false);
    }
  }, [communityId, communities, communitiesLoading, communitiesError, user]); // Add user to dependencies

  // Conditional returns after all hooks are defined
  if (loading || communitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading admin dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!community || !user) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The community you're looking for doesn't exist or you don't have access to it.</p>
            <div className="mt-4">
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not an admin of this community.</p>
            <div className="mt-4">
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" prefetch legacyBehavior>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  asChild
                >
                  <a className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                   
                  </a>
                </Button>
              </Link>
              
              {/* Community Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-800 leading-none">{community.title}</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Community Administration</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 font-medium px-3 py-1.5 shadow-sm"
              >
                <Crown className="h-3 w-3 mr-1.5" />
                Administrator
              </Badge>
              
          
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Members</p>
                  <p className="text-3xl font-bold">{metrics.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                <span className="text-blue-100 text-sm">+{metrics.weeklyGrowth}% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Posts</p>
                  <p className="text-3xl font-bold">{metrics.totalPosts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Activity className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-100 text-sm">{metrics.activeMembers} active members</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Views</p>
                  <p className="text-3xl font-bold">{metrics.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <BarChart3 className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-100 text-sm">Engagement growing</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Total Reactions</p>
                  <p className="text-3xl font-bold">{metrics.totalReactions}</p>
                </div>
                <Heart className="h-8 w-8 text-rose-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-rose-200 mr-1" />
                <span className="text-rose-100 text-sm">Great engagement!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Community Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Community Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{community.title}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{community.description || "No description available"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {community.location?.region}{community.location?.state ? `, ${community.location.state}` : ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {community.tags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        )) || <span className="text-sm text-gray-500">No tags</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {new Date(community.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Community Members</span>
                    <Badge variant="secondary">{members.length}</Badge>
                  </CardTitle>
                  <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member}</p>
                          {(community.createdBy?.name === member || community.createdBy?.email === member || 
                            community.admins?.some((admin: any) => admin.name === member || admin.email === member)) && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              <Crown className="h-3 w-3 mr-1" />
                              {community.createdBy?.name === member || community.createdBy?.email === member ? 'Creator' : 'Admin'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!(community.createdBy?.name === member || community.createdBy?.email === member || 
                          community.admins?.some((admin: any) => admin.name === member || admin.email === member)) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Community Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
                        <Input
                          placeholder="Community Name"
                          value={editData.title}
                          onChange={e => setEditData({ ...editData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                        <Input
                          placeholder="community-slug"
                          value={editData.slug}
                          onChange={e => setEditData({ ...editData, slug: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea
                        placeholder="Community description..."
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          placeholder="Region"
                          value={editData.location?.region || ''}
                          onChange={e => setEditData({ 
                            ...editData, 
                            location: { ...editData.location, region: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="State (optional)"
                          value={editData.location?.state || ''}
                          onChange={e => setEditData({ 
                            ...editData, 
                            location: { ...editData.location, state: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <Input
                        placeholder="Comma-separated tags"
                        value={editData.tags?.join(', ') || ''}
                        onChange={e => setEditData({ 
                          ...editData, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="text-sm text-gray-900">{community.title}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Slug</label>
                            <p className="text-sm text-gray-900">{community.slug}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-sm text-gray-900">{community.description || "No description"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <p className="text-sm text-gray-900">
                              {community.location?.region}{community.location?.state ? `, ${community.location.state}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tags</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {community.tags?.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              )) || <span className="text-sm text-gray-500">No tags</span>}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Privacy</label>
                            <p className="text-sm text-gray-900">{community.isPrivate ? 'Private' : 'Public'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-6 border-t">
                      <Button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Community
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Growth Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekly Growth</span>
                      <span className={`text-sm font-semibold ${metrics.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.weeklyGrowth >= 0 ? '+' : ''}{metrics.weeklyGrowth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Member Retention</span>
                      <span className="text-sm font-semibold text-blue-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Post Engagement</span>
                      <span className="text-sm font-semibold text-purple-600">12.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activity Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Posts this week</span>
                      <span className="text-sm font-semibold">{Math.floor(metrics.totalPosts * 0.3)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Comments this week</span>
                      <span className="text-sm font-semibold">{Math.floor(metrics.totalReactions * 0.4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active users today</span>
                      <span className="text-sm font-semibold">{metrics.activeMembers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Community Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Health</span>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-green-700">Engagement Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-blue-700">Member Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">78%</div>
                      <div className="text-sm text-purple-700">Content Quality</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 