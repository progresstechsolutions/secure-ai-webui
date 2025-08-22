"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import {
  Users,
  Shield,
  Settings,
  Crown,
  UserPlus,
  UserMinus,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Heart,
  Flag,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  MapPin,
  Mail,
  Bell
} from "lucide-react"

interface CommunityMember {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  lastActive: string
  role: 'member' | 'moderator' | 'admin'
  status: 'active' | 'pending' | 'banned'
  postCount: number
  commentCount: number
  reactionCount: number
  reportCount: number
  verificationStatus: 'unverified' | 'pending' | 'verified'
  healthConditions: string[]
  location: { region: string; state?: string }
}

interface MembershipRequest {
  id: string
  userName: string
  userEmail: string
  userAvatar?: string
  requestDate: string
  reason: string
  healthConditions: string[]
  location: { region: string; state?: string }
  status: 'pending' | 'approved' | 'rejected'
}

interface CommunityRule {
  id: string
  title: string
  description: string
  isActive: boolean
  order: number
}

interface CommunityStats {
  totalMembers: number
  activeMembers: number
  pendingRequests: number
  totalPosts: number
  totalComments: number
  todayActivity: number
  weeklyGrowth: number
  engagementRate: number
}

interface CommunityAdminProps {
  communityId: string
  communityName: string
  currentUser: {
    id: string
    name: string
    email: string
    role: 'member' | 'moderator' | 'admin'
  }
}

// Mock data
const mockMembers: CommunityMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "/placeholder-user.jpg",
    joinDate: "2024-01-15",
    lastActive: "2024-07-29T10:30:00Z",
    role: "moderator",
    status: "active",
    postCount: 45,
    commentCount: 123,
    reactionCount: 456,
    reportCount: 0,
    verificationStatus: "verified",
    healthConditions: ["Autism Spectrum Disorder"],
    location: { region: "United States", state: "California" }
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    joinDate: "2024-02-20",
    lastActive: "2024-07-28T15:45:00Z",
    role: "member",
    status: "active",
    postCount: 12,
    commentCount: 34,
    reactionCount: 89,
    reportCount: 0,
    verificationStatus: "pending",
    healthConditions: ["Autism Spectrum Disorder"],
    location: { region: "United States", state: "California" }
  }
]

const mockRequests: MembershipRequest[] = [
  {
    id: "req1",
    userName: "Jennifer Lopez",
    userEmail: "jennifer.l@email.com",
    requestDate: "2024-07-28",
    reason: "My daughter was recently diagnosed with autism and I'm looking for support from other parents in California.",
    healthConditions: ["Autism Spectrum Disorder"],
    location: { region: "United States", state: "California" },
    status: "pending"
  }
]

const mockRules: CommunityRule[] = [
  {
    id: "1",
    title: "Be respectful and supportive",
    description: "Treat all members with kindness and respect. We're all here to support each other.",
    isActive: true,
    order: 1
  },
  {
    id: "2",
    title: "No medical advice",
    description: "Do not provide specific medical advice. Always encourage consulting with healthcare professionals.",
    isActive: true,
    order: 2
  },
  {
    id: "3",
    title: "Verify parent status for parent-specific discussions",
    description: "For posts marked as parent-only, we may require verification of parent status.",
    isActive: true,
    order: 3
  }
]

const mockStats: CommunityStats = {
  totalMembers: 234,
  activeMembers: 189,
  pendingRequests: 3,
  totalPosts: 456,
  totalComments: 1234,
  todayActivity: 23,
  weeklyGrowth: 8.5,
  engagementRate: 74.2
}

export function CommunityAdmin({ communityId, communityName, currentUser }: CommunityAdminProps) {
  const [members, setMembers] = useState<CommunityMember[]>(mockMembers)
  const [requests, setRequests] = useState<MembershipRequest[]>(mockRequests)
  const [rules, setRules] = useState<CommunityRule[]>(mockRules)
  const [stats] = useState<CommunityStats>(mockStats)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [editingRule, setEditingRule] = useState<CommunityRule | null>(null)
  const [newRule, setNewRule] = useState({ title: "", description: "" })

  // Community settings
  const [communitySettings, setCommunitySettings] = useState({
    isPrivate: false,
    requireApproval: true,
    allowAnonymous: true,
    autoModeration: true,
    membershipOpen: true,
    verificationRequired: false
  })

  if (currentUser.role === 'member') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access community administration.</p>
        </div>
      </div>
    )
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleMemberAction = (memberId: string, action: 'promote' | 'demote' | 'ban' | 'remove' | 'verify') => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        switch (action) {
          case 'promote':
            return { ...member, role: member.role === 'member' ? 'moderator' as const : member.role }
          case 'demote':
            return { ...member, role: member.role === 'moderator' ? 'member' as const : member.role }
          case 'ban':
            return { ...member, status: 'banned' as const }
          case 'verify':
            return { ...member, verificationStatus: 'verified' as const }
          default:
            return member
        }
      }
      return member
    }))

    if (action === 'remove') {
      setMembers(members.filter(member => member.id !== memberId))
    }
  }

  const handleMembershipRequest = (requestId: string, action: 'approve' | 'reject') => {
    const request = requests.find(r => r.id === requestId)
    if (request && action === 'approve') {
      const newMember: CommunityMember = {
        id: `member_${Date.now()}`,
        name: request.userName,
        email: request.userEmail,
        avatar: request.userAvatar,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        role: 'member',
        status: 'active',
        postCount: 0,
        commentCount: 0,
        reactionCount: 0,
        reportCount: 0,
        verificationStatus: 'unverified',
        healthConditions: request.healthConditions,
        location: request.location
      }
      setMembers([...members, newMember])
    }

    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
        : req
    ))
  }

  const handleAddRule = () => {
    if (newRule.title && newRule.description) {
      const rule: CommunityRule = {
        id: `rule_${Date.now()}`,
        title: newRule.title,
        description: newRule.description,
        isActive: true,
        order: rules.length + 1
      }
      setRules([...rules, rule])
      setNewRule({ title: "", description: "" })
      setShowRuleModal(false)
    }
  }

  const handleEditRule = (rule: CommunityRule) => {
    setEditingRule(rule)
    setNewRule({ title: rule.title, description: rule.description })
    setShowRuleModal(true)
  }

  const handleUpdateRule = () => {
    if (editingRule && newRule.title && newRule.description) {
      setRules(rules.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, title: newRule.title, description: newRule.description }
          : rule
      ))
      setEditingRule(null)
      setNewRule({ title: "", description: "" })
      setShowRuleModal(false)
    }
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{communityName} Administration</h1>
          <p className="text-gray-600">Manage community members, settings, and content</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Crown className="h-3 w-3 mr-1" />
            {currentUser.role}
          </Badge>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.weeklyGrowth}% this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                <p className="text-gray-500 text-sm">
                  {Math.round((stats.activeMembers / stats.totalMembers) * 100)}% active
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                <p className="text-orange-600 text-sm">
                  Require review
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}%</p>
                <p className="text-blue-600 text-sm">
                  {stats.todayActivity} actions today
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Members</CardTitle>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="member">Members</SelectItem>
                      <SelectItem value="moderator">Moderators</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          {member.role === 'moderator' && <Shield className="h-4 w-4 text-blue-500" />}
                          {member.verificationStatus === 'verified' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {member.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{member.email}</span>
                          <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                          <span>Last active {new Date(member.lastActive).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>{member.postCount} posts</span>
                          <span>{member.commentCount} comments</span>
                          <span>{member.reactionCount} reactions</span>
                          {member.healthConditions.length > 0 && (
                            <span>Conditions: {member.healthConditions.slice(0, 2).join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {member.verificationStatus === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMemberAction(member.id, 'verify')}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      
                      {member.role === 'member' && currentUser.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMemberAction(member.id, 'promote')}
                          className="text-blue-600"
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          Promote
                        </Button>
                      )}
                      
                      {member.role === 'moderator' && currentUser.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMemberAction(member.id, 'demote')}
                          className="text-yellow-600"
                        >
                          Demote
                        </Button>
                      )}
                      
                      {member.status === 'active' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ban Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to ban {member.name} from this community?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleMemberAction(member.id, 'ban')}>
                                Ban Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => r.status === 'pending').map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{request.userName}</h3>
                          <Badge variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {request.location.state ? `${request.location.state}, ${request.location.region}` : request.location.region}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{request.userEmail}</p>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Health Conditions:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.healthConditions.map(condition => (
                              <Badge key={condition} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Reason for joining:</p>
                          <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                        </div>
                        
                        <p className="text-xs text-gray-400">
                          Requested {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMembershipRequest(request.id, 'reject')}
                          className="text-red-600 border-red-200"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMembershipRequest(request.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {requests.filter(r => r.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No pending membership requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Rules</CardTitle>
                
                <Dialog open={showRuleModal} onOpenChange={setShowRuleModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
                      <DialogDescription>
                        Create clear guidelines for community behavior
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Rule Title</Label>
                        <Input
                          value={newRule.title}
                          onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter rule title"
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newRule.description}
                          onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Explain the rule in detail"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => {
                          setShowRuleModal(false)
                          setEditingRule(null)
                          setNewRule({ title: "", description: "" })
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={editingRule ? handleUpdateRule : handleAddRule}>
                          {editingRule ? 'Update Rule' : 'Add Rule'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
                          <h3 className="font-medium text-gray-900">{rule.title}</h3>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRule(rule.id)}
                        >
                          {rule.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this rule? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Privacy & Access</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="private">Private Community</Label>
                      <p className="text-sm text-gray-500">Only members can see posts and members</p>
                    </div>
                    <Switch
                      id="private"
                      checked={communitySettings.isPrivate}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, isPrivate: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="approval">Require Approval</Label>
                      <p className="text-sm text-gray-500">New members need moderator approval</p>
                    </div>
                    <Switch
                      id="approval"
                      checked={communitySettings.requireApproval}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, requireApproval: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="verification">Verification Required</Label>
                      <p className="text-sm text-gray-500">Require identity verification for sensitive topics</p>
                    </div>
                    <Switch
                      id="verification"
                      checked={communitySettings.verificationRequired}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, verificationRequired: checked }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Content & Moderation</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="anonymous">Anonymous Posting</Label>
                      <p className="text-sm text-gray-500">Allow anonymous posts and comments</p>
                    </div>
                    <Switch
                      id="anonymous"
                      checked={communitySettings.allowAnonymous}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, allowAnonymous: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="automod">Auto-Moderation</Label>
                      <p className="text-sm text-gray-500">Automatically filter inappropriate content</p>
                    </div>
                    <Switch
                      id="automod"
                      checked={communitySettings.autoModeration}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, autoModeration: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="membership">Open Membership</Label>
                      <p className="text-sm text-gray-500">Allow new member requests</p>
                    </div>
                    <Switch
                      id="membership"
                      checked={communitySettings.membershipOpen}
                      onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, membershipOpen: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
