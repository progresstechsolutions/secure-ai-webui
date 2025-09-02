"use client"

import { useState, useEffect } from "react"
import { offlineManager, type OfflineState } from "@/lib/offline-manager"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export function OfflineBanner() {
  const [offlineState, setOfflineState] = useState<OfflineState>(offlineManager.getState())

  useEffect(() => {
    const unsubscribe = offlineManager.subscribe(setOfflineState)
    return unsubscribe
  }, [])

  if (offlineState.isOnline && offlineState.queue.length === 0) {
    return null
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {offlineState.isOnline ? (
            <Wifi className="h-4 w-4 text-amber-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-amber-600" />
          )}

          <span className="text-sm text-amber-800">
            {!offlineState.isOnline
              ? "Working offline—changes will sync when connected"
              : offlineState.syncing
                ? "Syncing changes..."
                : offlineState.queue.length > 0
                  ? `${offlineState.queue.length} changes waiting to sync`
                  : "All changes synced"}
          </span>
        </div>

        {offlineState.syncing && <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />}
      </div>
    </div>
  )
}
