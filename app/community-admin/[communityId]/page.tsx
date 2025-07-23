"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Utility function for admin check
function isUserAdminOfCommunity(user: { userKey?: string; username?: string }, community: any): boolean {
  if (!user || !community) return false;
  if (community.adminKey && user.userKey) {
    return community.adminKey === user.userKey;
  }
  if (community.admin && user.username) {
    return community.admin.toLowerCase() === user.username.toLowerCase();
  }
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let userObj = storedUser ? JSON.parse(storedUser) : null;
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    // Merge userKey from user_data if available
    if (userData.userKey && userObj) userObj.userKey = userData.userKey;
    if (storedUser) setUser(userObj);
    const stored = localStorage.getItem("user_communities");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((c: any) => c.id === communityId);
      setCommunity(found);
      setEditData(found);
      setMembers(found?.members || [found?.admin].filter(Boolean));
      setIsAdmin(isUserAdminOfCommunity(userObj, found));
    }
  }, [communityId]);

  if (!community) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not the admin of this community.</p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
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
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel: {community.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editMode ? (
            <div className="space-y-4">
              <Input
                placeholder="Community Name"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={editData.slug}
                onChange={e => setEditData({ ...editData, slug: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
              />
              <Input
                placeholder="Badge Color"
                value={editData.color}
                onChange={e => setEditData({ ...editData, color: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div><strong>Description:</strong> {community.description}</div>
              <div><strong>Slug:</strong> {community.slug}</div>
              <div><strong>Color:</strong> {community.color}</div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setEditMode(true)} variant="outline">Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          )}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Members</h4>
            <ul className="mb-2">
              {members.map((m) => (
                <li key={m} className="flex items-center justify-between border-b py-1">
                  <span>{m}</span>
                  {m !== community.admin && (
                    <Button size="sm" variant="outline" onClick={() => handleRemoveMember(m)}>Remove</Button>
                  )}
                </li>
              ))}
            </ul>
            <Button size="sm" onClick={handleAddMember} className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">Add Member</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 