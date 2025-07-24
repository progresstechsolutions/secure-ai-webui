"use client";

import { UserProfile } from "@/components/user-profile";
import { useRouter } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  return (
    
     
        <UserProfile user={{}} onBack={() => router.back()} />
     
 
  );
} 