import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Community as CommunityType } from "@/components/mock-community-data";
import { Users, Search } from "lucide-react";

interface JoinCommunityProps {
  userCommunities: CommunityType[];
  allCommunities: CommunityType[];
  onJoin: (community: CommunityType) => void;
}

export const JoinCommunity: React.FC<JoinCommunityProps> = ({ userCommunities, allCommunities, onJoin }) => {
  const [search, setSearch] = useState("");

  // Filter out already joined communities
  const availableCommunities = useMemo(() => {
    const joinedSlugs = new Set(userCommunities.map((c) => c.slug));
    return allCommunities.filter((c) => !joinedSlugs.has(c.slug));
  }, [userCommunities, allCommunities]);

  // Get featured communities (first 3) and search results
  const { featured, searchResults } = useMemo(() => {
    const featured = availableCommunities.slice(0, 3);
    
    let searchResults: CommunityType[] = [];
    if (search.trim()) {
      const q = search.toLowerCase();
      searchResults = availableCommunities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    
    return { featured, searchResults };
  }, [search, availableCommunities]);

  const displayCommunities = search.trim() ? searchResults : featured;

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          {search.trim() ? "Search Results" : "Featured Communities"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for more communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {displayCommunities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {search.trim() ? "No communities found matching your search." : "No communities available."}
          </div>
        ) : (
          <div className="space-y-3">
            {displayCommunities.map((community: CommunityType) => (
              <div
                key={community.id || community.slug}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: community.color?.includes("bg-") ? "#3b82f6" : community.color || "#3b82f6" }}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{community.name}</span>
                    
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => onJoin(community)}
                >
                  Join
                </Button>
              </div>
            ))}
           
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JoinCommunity; 