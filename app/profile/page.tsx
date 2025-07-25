"use client";

import { UserProfile } from "@/components/user-profile";
import { useRouter } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  
  const handleLogout = () => {
    // Redirect to home page after logout
    router.push("/");
  };
  
  return (
    <UserProfile 
      user={{}} 
      onBack={() => router.back()} 
      onLogout={handleLogout}
    />
  );
} 