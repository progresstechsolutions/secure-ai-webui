export interface QueuedAction {
  id: string
  type: "create" | "update" | "delete"
  entity: "child" | "checklist" | "appointment" | "reminder" | "preference"
  data: any
  timestamp: number
  retryCount: number
}

export interface OfflineState {
  isOnline: boolean
  queue: QueuedAction[]
  syncing: boolean
  lastSync: number | null
}

class OfflineManager {
  private state: OfflineState = {
    isOnline: navigator.onLine,
    queue: [],
    syncing: false,
    lastSync: null,
  }

  private listeners: ((state: OfflineState) => void)[] = []
  private retryTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.loadQueue()
    this.setupEventListeners()
  }

  private setupEventListeners() {
    window.addEventListener("online", this.handleOnline.bind(this))
    window.addEventListener("offline", this.handleOffline.bind(this))
  }

  private handleOnline() {
    this.state.isOnline = true
    this.notifyListeners()
    this.processQueue()
  }

  private handleOffline() {
    this.state.isOnline = false
    this.notifyListeners()
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem("milestone_offline_queue")
      if (stored) {
        this.state.queue = JSON.parse(stored)
      }
    } catch (error) {
      console.error("[v0] Failed to load offline queue:", error)
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem("milestone_offline_queue", JSON.stringify(this.state.queue))
    } catch (error) {
      console.error("[v0] Failed to save offline queue:", error)
    }
  }

  public queueAction(action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">) {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    }

    this.state.queue.push(queuedAction)
    this.saveQueue()
    this.notifyListeners()

    // Try to process immediately if online
    if (this.state.isOnline) {
      this.processQueue()
    }
  }

  private async processQueue() {
    if (this.state.syncing || this.state.queue.length === 0 || !this.state.isOnline) {
      return
    }

    this.state.syncing = true
    this.notifyListeners()

    const processedActions: string[] = []

    for (const action of this.state.queue) {
      try {
        await this.executeAction(action)
        processedActions.push(action.id)
      } catch (error) {
        console.error("[v0] Failed to execute queued action:", error)

        // Increment retry count
        action.retryCount++

        // Remove action if max retries exceeded
        if (action.retryCount >= 3) {
          processedActions.push(action.id)
          this.showRetryFailedToast(action)
        }
      }
    }

    // Remove processed actions from queue
    this.state.queue = this.state.queue.filter((action) => !processedActions.includes(action.id))
    this.saveQueue()

    this.state.syncing = false
    this.state.lastSync = Date.now()
    this.notifyListeners()

    // Schedule retry for remaining actions
    if (this.state.queue.length > 0) {
      this.scheduleRetry()
    }
  }

  private async executeAction(action: QueuedAction): Promise<void> {
    // Simulate API call - in real implementation, this would call actual API endpoints
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% failure rate for testing
        if (Math.random() < 0.1) {
          reject(new Error("Simulated API failure"))
        } else {
          resolve()
        }
      }, 500)
    })
  }

  private scheduleRetry() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    this.retryTimeout = setTimeout(() => {
      this.processQueue()
    }, 30000) // Retry after 30 seconds
  }

  private showRetryFailedToast(action: QueuedAction) {
    // This would integrate with your toast system
    console.warn("[v0] Action failed after max retries:", action)
  }

  public subscribe(listener: (state: OfflineState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener({ ...this.state }))
  }

  public getState(): OfflineState {
    return { ...this.state }
  }

  public clearQueue() {
    this.state.queue = []
    this.saveQueue()
    this.notifyListeners()
  }
}

export const offlineManager = new OfflineManager()
