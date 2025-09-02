export interface SyncConflict {
  id: string
  entity: string
  localData: any
  remoteData: any
  timestamp: number
}

export interface SyncState {
  conflicts: SyncConflict[]
  lastSync: number | null
  syncing: boolean
}

class SyncManager {
  private state: SyncState = {
    conflicts: [],
    lastSync: null,
    syncing: false,
  }

  private listeners: ((state: SyncState) => void)[] = []

  // Prepare for future multi-caregiver sync
  public async detectConflicts(localData: any, remoteData: any): Promise<SyncConflict[]> {
    const conflicts: SyncConflict[] = []

    // Compare timestamps and detect conflicts
    for (const [key, localValue] of Object.entries(localData)) {
      const remoteValue = remoteData[key]

      if (remoteValue && this.hasConflict(localValue, remoteValue)) {
        conflicts.push({
          id: key,
          entity: this.getEntityType(key),
          localData: localValue,
          remoteData: remoteValue,
          timestamp: Date.now(),
        })
      }
    }

    return conflicts
  }

  private hasConflict(local: any, remote: any): boolean {
    // Simple conflict detection - in real implementation, this would be more sophisticated
    if (!local.lastModified || !remote.lastModified) {
      return false
    }

    // Check if both were modified after last sync
    const lastSync = this.state.lastSync || 0
    return local.lastModified > lastSync && remote.lastModified > lastSync
  }

  private getEntityType(key: string): string {
    if (key.startsWith("child_")) return "child"
    if (key.startsWith("checklist_")) return "checklist"
    if (key.startsWith("appointment_")) return "appointment"
    return "unknown"
  }

  public resolveConflict(conflictId: string, resolution: "local" | "remote" | "merge") {
    const conflict = this.state.conflicts.find((c) => c.id === conflictId)
    if (!conflict) return

    // Apply resolution strategy
    switch (resolution) {
      case "local":
        // Keep local version (last-write-wins from local)
        break
      case "remote":
        // Accept remote version (last-write-wins from remote)
        break
      case "merge":
        // Future: implement merge strategy
        break
    }

    // Remove resolved conflict
    this.state.conflicts = this.state.conflicts.filter((c) => c.id !== conflictId)
    this.notifyListeners()
  }

  public subscribe(listener: (state: SyncState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener({ ...this.state }))
  }

  public getState(): SyncState {
    return { ...this.state }
  }
}

export const syncManager = new SyncManager()
