"use client";

import { MilestoneFeed } from "@/components/milestone-feed";
import { useRouter } from "next/navigation";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MilestonesPage() {
  const router = useRouter();
  return (
    <MilestoneFeed user={{ username: "Unknown User", condition: "Unknown Condition" }} onBack={() => router.back()} />
  );
} 