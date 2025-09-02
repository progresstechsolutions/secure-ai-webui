"use client";

import React, { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Plus, Send } from "lucide-react";

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://localhost:8000";

// Helper: convert local messages → OpenAI/vLLM format (plain strings)
function toOpenAIChat(messages: ChatMessage[]) {
  return messages.map(({ role, content }) => ({ role, content }));
}

// Helper: fetch with timeout
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ms = 60_000
) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export function SearchBar() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isSearchPage = pathname === "/search";

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles(Array.from(e.target.files));
  };

  const handleVoiceInput = () => {
    const AnyWindow = window as any;
    const SpeechRecognition =
      AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      alert("Voice recognition error.");
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // Roll back a dangling user turn if a request fails
  const rollbackLastUser = () =>
    setChatHistory((prev) =>
      prev.length && prev[prev.length - 1].role === "user" ? prev.slice(0, -1) : prev
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || (!searchQuery.trim() && uploadedFiles.length === 0)) return;

    setLoading(true);

    // Prepare next user message and enforce alternation (no user→user)
    const nextUserMsg: ChatMessage = { role: "user", content: searchQuery.trim() };
    let updatedHistory: ChatMessage[];

    if (chatHistory.length && chatHistory[chatHistory.length - 1].role === "user") {
      // Merge/replace last user message instead of appending a second in a row
      updatedHistory = [...chatHistory.slice(0, -1), nextUserMsg];
    } else {
      updatedHistory = [...chatHistory, nextUserMsg];
    }

    setChatHistory(updatedHistory);
    setSearchQuery("");

    // --- FILE UPLOAD FLOW ---
    if (uploadedFiles.length > 0) {
      try {
        const formData = new FormData();
        uploadedFiles.forEach((file) => formData.append("files", file));
        formData.append("messages", JSON.stringify(toOpenAIChat(updatedHistory)));

        const res = await fetchWithTimeout(`${API_BASE}/upload-and-ask`, { method: "POST", body: formData }, 60_000);
        const text = await res.text();

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid response format from server");
        }

        if (!res.ok) {
          const errorMsg = data.detail || data.error || data.message || "Upload failed";
          setChatHistory((prev) => [...prev, { role: "assistant", content: errorMsg }]);
          return;
        }

        const answer: string | undefined = data.answer;
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: answer || "Upload successful, but no answer returned." },
        ]);
      } catch (err: any) {
        rollbackLastUser();
        const msg =
          err?.name === "AbortError"
            ? "Request timed out after 60 seconds. Please try again."
            : err?.message || "Error uploading file";
        setChatHistory((prev) => [...prev, { role: "assistant", content: msg }]);
      } finally {
        setLoading(false);
        setUploadedFiles([]);
      }
      return;
    }

    // --- CHAT ONLY FLOW (non-streaming) ---
    try {
      const payload = { messages: toOpenAIChat(updatedHistory) };

      const res = await fetchWithTimeout(
        `${API_BASE}/generate-structured-response`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        60_000
      );

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response format from server");
      }

      if (!res.ok) {
        const errorMsg = data.detail || data.error || data.message || "Query failed";
        setChatHistory((prev) => [...prev, { role: "assistant", content: errorMsg }]);
        return;
      }

      const responseText: string | undefined = data.output || data.answer;
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: responseText || "Query successful, but no answer returned." },
      ]);
    } catch (err: any) {
      rollbackLastUser();
      const msg =
        err?.name === "AbortError"
          ? "Request timed out after 60 seconds. Please try again."
          : err?.message?.includes("fetch")
          ? "Network error - please check if the backend is running"
          : err?.message || "Error during query";
      setChatHistory((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-3 sm:px-4 md:px-4 lg:px-6 z-50">
      {!isSearchPage && (
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Genetic counseling
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Symptom analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Research insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Care planning
          </Button>
        </div>
      )}

      {/* Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-2 text-xs text-gray-600">📎 {uploadedFiles.length} file(s) selected</div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="ml-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Input
            type="text"
            placeholder="Ask Caregene about your health questions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent px-4 py-3 text-xs leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400 placeholder:text-xs min-h-[48px]"
            disabled={loading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            className={`mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600 ${isRecording ? "bg-primary/10" : ""}`}
            disabled={loading || isRecording}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {(searchQuery.trim() || uploadedFiles.length > 0) && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          multiple
        />
      </form>
    </div>
  );
}
