"use client";

import { PrivacySettings } from "@/components/privacy-settings";
import { useRouter } from "next/navigation";
import { Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  return (
    <PrivacySettings user={{}} onBack={() => router.back()} />
  );
} 