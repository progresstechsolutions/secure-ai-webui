export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: number
}

class MilestoneAnalytics {
  private queue: AnalyticsEvent[] = []

  public track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      timestamp: Date.now(),
    }

    this.queue.push(analyticsEvent)
    this.flush()
  }

  private async flush() {
    if (this.queue.length === 0) return

    try {
      // In real implementation, this would send to your analytics service
      console.log("[v0] Analytics events:", this.queue)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100))

      this.queue = []
    } catch (error) {
      console.error("[v0] Failed to send analytics:", error)
      // Keep events in queue for retry
    }
  }

  // Milestone-specific tracking methods
  public trackPageView(page: string, childId?: string, ageKey?: string) {
    this.track("milestone_page_view", {
      page,
      childId,
      ageKey,
    })
  }

  public trackChecklistStart(childId: string, ageKey: string) {
    this.track("milestone_checklist_start", {
      childId,
      ageKey,
    })
  }

  public trackChecklistComplete(childId: string, ageKey: string, results: any) {
    this.track("milestone_checklist_complete", {
      childId,
      ageKey,
      totalItems: results.total,
      metItems: results.met,
      notYetItems: results.notYet,
      notSureItems: results.notSure,
    })
  }

  public trackExport(type: "pdf" | "json" | "clipboard", childId: string, ageKey?: string) {
    this.track("milestone_export", {
      type,
      childId,
      ageKey,
    })
  }

  public trackTipAction(action: "bookmark" | "remind" | "try", tipId: string, childId: string) {
    this.track("milestone_tip_action", {
      action,
      tipId,
      childId,
    })
  }

  public trackAppointmentCreate(childId: string, type: string) {
    this.track("milestone_appointment_create", {
      childId,
      type,
    })
  }
}

export const milestoneAnalytics = new MilestoneAnalytics()
