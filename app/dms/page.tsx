"use client";

import { useRouter } from "next/navigation";
import { DMInbox } from "@/components/dm-conversation";

export default function DMsPage() {
  const router = useRouter();
  return (
    <DMInbox onBack={() => router.back()} />
  );
} 