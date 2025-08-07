"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle
} from "lucide-react";

// Utility function for admin check
function isUserAdminOfCommunity(user: { userKey?: string; username?: string }, community: any): boolean {
  console.log("Admin check - user:", user);
  console.log("Admin check - community:", community);
  
  if (!user || !community) {
    console.log("Admin check failed - missing user or community");
    return false;
  }
  
  if (community.adminKey && user.userKey) {
    const result = community.adminKey === user.userKey;
    console.log("Admin check (userKey) - result:", result);
    return result;
  }
  
  if (community.admin && user.username) {
    const result = community.admin.toLowerCase() === user.username.toLowerCase();
    console.log("Admin check (username) - community.admin:", community.admin, "user.username:", user.username, "result:", result);
    return result;
  }
  
  console.log("Admin check failed - no matching admin criteria");
  return false;
}

export default function CommunityAdminPage() {
  const { communityId } = useParams();
  const router = useRouter();
  const [community, setCommunity] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    totalMembers: 0,
    totalViews: 0,
    totalReactions: 0,
    weeklyGrowth: 0,
    activeMembers: 0,
    recentActivity: [] as Array<{action: string, user: string, time: string}>
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let userObj = storedUser ? JSON.parse(storedUser) : null;
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    // Merge userKey and username from user_data if available
    if (userData.userKey && userObj) userObj.userKey = userData.userKey;
    if (userData.username && userObj) userObj.username = userData.username;
    if (storedUser) setUser(userObj);

    const stored = localStorage.getItem("user_communities");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((c: any) => c.id === communityId);
      // Auto-fix empty admin field if user created this community
      if (found && (!found.admin || found.admin === "") && userData.username) {
        const fixedCommunity = { ...found, admin: userData.username };
        const updatedAll = all.map((c: any) => c.id === communityId ? fixedCommunity : c);
        localStorage.setItem("user_communities", JSON.stringify(updatedAll));
        setCommunity(fixedCommunity);
        setEditData(fixedCommunity);
        setMembers(fixedCommunity?.members || [fixedCommunity?.admin].filter(Boolean));
        setIsAdmin(isUserAdminOfCommunity(userObj, fixedCommunity));
      } else {
        setCommunity(found);
        setEditData(found);
        setMembers(found?.members || [found?.admin].filter(Boolean));
        setIsAdmin(isUserAdminOfCommunity(userObj, found));
      }
      // Calculate metrics (mock data for demo)
      calculateMetrics(found);
    }
  }, [communityId]);

  const calculateMetrics = (community: any) => {
    // Mock metrics calculation - in real app, this would come from your database
    const mockMetrics = {
      totalPosts: Math.floor(Math.random() * 50) + 10,
      totalMembers: members.length + Math.floor(Math.random() * 20),
      totalViews: Math.floor(Math.random() * 1000) + 200,
      totalReactions: Math.floor(Math.random() * 200) + 50,
      weeklyGrowth: Math.floor(Math.random() * 20) - 5, // Can be negative
      activeMembers: Math.floor(members.length * 0.7),
      recentActivity: [
        { action: "New member joined", user: "user123", time: "2 hours ago" },
        { action: "New post created", user: community?.admin, time: "5 hours ago" },
        { action: "Comment added", user: "member456", time: "1 day ago" },
        { action: "Post liked", user: "visitor789", time: "2 days ago" },
      ]
    };
    setMetrics(mockMetrics);
  };

  if (!community || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading admin dashboard...</span>
      </div>
    )
  }

  if (!isAdmin) {
    // Check if this might be a community with empty admin that belongs to current user
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const canClaimAdmin = community && (!community.admin || community.admin === "") && userData.username;
    
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not the admin of this community.</p>
            {canClaimAdmin && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  This community appears to have been created by you but has an empty admin field. 
                  Would you like to claim admin access?
                </p>
                <Button 
                  onClick={() => {
                    const stored = localStorage.getItem("user_communities");
                    if (stored) {
                      const all = JSON.parse(stored);
                      const updatedAll = all.map((c: any) => 
                        c.id === communityId ? { ...c, admin: userData.username } : c
                      );
                      localStorage.setItem("user_communities", JSON.stringify(updatedAll));
                      window.location.reload(); // Reload to re-check admin status
                    }
                  }}
                  className="mr-2"
                >
                  Claim Admin Access
                </Button>
              </div>
            )}
            <div className="mt-4">
              <Button onClick={() => router.push("/")}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    const stored = localStorage.getItem("user_communities");
    if (stored) {
      let all = JSON.parse(stored);
      all = all.map((c: any) => (c.id === community.id ? { ...c, ...editData } : c));
      localStorage.setItem("user_communities", JSON.stringify(all));
      setCommunity({ ...community, ...editData });
      setEditMode(false);
    }
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this community? This cannot be undone.")) return;
    const stored = localStorage.getItem("user_communities");
    if (stored) {
      const all = JSON.parse(stored);
      const updated = all.filter((c: any) => c.id !== community.id);
      localStorage.setItem("user_communities", JSON.stringify(updated));
      router.push("/");
    }
  };

  // Mock member management
  const handleAddMember = () => {
    const newMember = prompt("Enter username to add as member:");
    if (newMember && !members.includes(newMember)) {
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      // Persist to localStorage
      const stored = localStorage.getItem("user_communities");
      if (stored) {
        let all = JSON.parse(stored);
        all = all.map((c: any) =>
          c.id === community.id ? { ...c, members: updatedMembers } : c
        );
        localStorage.setItem("user_communities", JSON.stringify(all));
      }
    }
  };
  const handleRemoveMember = (username: string) => {
    if (!confirm(`Remove ${username} from community?`)) return;
    const updatedMembers = members.filter((m) => m !== username);
    setMembers(updatedMembers);
    const stored = localStorage.getItem("user_communities");
    if (stored) {
      let all = JSON.parse(stored);
      all = all.map((c: any) =>
        c.id === community.id ? { ...c, members: updatedMembers } : c
      );
      localStorage.setItem("user_communities", JSON.stringify(all));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" prefetch legacyBehavior>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                  <a>← Back to Home</a>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-amber-500" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{community.name}</h1>
                  <p className="text-sm text-gray-500">Community Admin Dashboard</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Crown className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>
      </div>

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
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{community.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Slug</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{community.slug}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{community.description || "No description available"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Badge Color</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${community.color}`}></div>
                        <span className="text-sm text-gray-900">{community.color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {new Date().toLocaleDateString()} {/* Mock date */}
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
                          {member === community.admin && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      {member !== community.admin && (
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
                          value={editData.name}
                          onChange={e => setEditData({ ...editData, name: e.target.value })}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
                      <Input
                        placeholder="bg-blue-500 text-white"
                        value={editData.color}
                        onChange={e => setEditData({ ...editData, color: e.target.value })}
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
                            <p className="text-sm text-gray-900">{community.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Slug</label>
                            <p className="text-sm text-gray-900">{community.slug}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-sm text-gray-900">{community.description || "No description"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Badge Color</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-4 h-4 rounded ${community.color}`}></div>
                            <p className="text-sm text-gray-900">{community.color}</p>
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