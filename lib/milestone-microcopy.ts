// Centralized microcopy for milestone feature
// Tone: reassuring, clear, non-alarmist
// Reading level: ~6th grade
// Languages: EN/ES

export interface MilestoneMicrocopy {
  ageBanners: {
    betweenAges: string
    correctedAgeTooltip: string
    prematureNote: string
  }
  checklist: {
    finishSuccess: string
    canUpdateAnytime: string
    allAnswered: string
    saveIndicator: string
    progressLabel: string
  }
  flags: {
    considerDiscussing: string
    keyMilestone: string
    noWorries: string
  }
  privacy: {
    dataStaysLocal: string
    notDiagnostic: string
    informationalOnly: string
  }
  actions: {
    bookmark: string
    remindMe: string
    tryNow: string
    addToVisit: string
    exportSummary: string
  }
  tips: {
    positiveEncouragement: string
    timeEstimate: string
    tryWithChild: string
  }
  appointments: {
    upcomingVisit: string
    discussItems: string
    reminderSet: string
  }
  empty: {
    noChildren: string
    addFirstChild: string
    noTips: string
    noAppointments: string
  }
  validation: {
    dateWarning: string
    duplicateChild: string
    requiredField: string
  }
}

export const milestoneMicrocopy: Record<"en" | "es", MilestoneMicrocopy> = {
  en: {
    ageBanners: {
      betweenAges: "We use the earlier age checklist until the next milestone age.",
      correctedAgeTooltip: "Adjusted for prematurity - this helps track development more accurately",
      prematureNote: "Born early? We adjust milestones based on due date for better tracking.",
    },
    checklist: {
      finishSuccess: "Great job! You've completed this checklist.",
      canUpdateAnytime: "You can update this anytime",
      allAnswered: "All items answered - ready to finish!",
      saveIndicator: "Changes saved",
      progressLabel: "Progress",
    },
    flags: {
      considerDiscussing: "Consider discussing at your next visit",
      keyMilestone: "This is an important milestone to track",
      noWorries: "Every child develops at their own pace",
    },
    privacy: {
      dataStaysLocal: "Your entries stay private on this device",
      notDiagnostic: "Informational only - not for medical diagnosis",
      informationalOnly:
        "This information is for tracking purposes only and should not replace professional medical advice",
    },
    actions: {
      bookmark: "Save for later",
      remindMe: "Set reminder",
      tryNow: "Try this activity",
      addToVisit: "Add to visit notes",
      exportSummary: "Share with doctor",
    },
    tips: {
      positiveEncouragement: "You're doing great! Here are some fun activities to try.",
      timeEstimate: "5-10 minutes",
      tryWithChild: "Perfect activity to try with your child today",
    },
    appointments: {
      upcomingVisit: "Coming up soon",
      discussItems: "Items to discuss",
      reminderSet: "Reminder set successfully",
    },
    empty: {
      noChildren: "Add your first child to get started with milestone tracking",
      addFirstChild: "Add your child",
      noTips: "No tips available for this age yet",
      noAppointments: "No upcoming appointments scheduled",
    },
    validation: {
      dateWarning: "Changing this date will affect milestone age calculations",
      duplicateChild: "A child with this name and similar birth date already exists",
      requiredField: "This field is required",
    },
  },
  es: {
    ageBanners: {
      betweenAges: "Usamos la lista de la edad anterior hasta la próxima edad de hito.",
      correctedAgeTooltip: "Ajustado por prematuridad - esto ayuda a seguir el desarrollo con más precisión",
      prematureNote: "¿Nació temprano? Ajustamos los hitos basados en la fecha de parto para mejor seguimiento.",
    },
    checklist: {
      finishSuccess: "¡Excelente trabajo! Has completado esta lista.",
      canUpdateAnytime: "Puedes actualizar esto en cualquier momento",
      allAnswered: "Todos los elementos respondidos - ¡listo para terminar!",
      saveIndicator: "Cambios guardados",
      progressLabel: "Progreso",
    },
    flags: {
      considerDiscussing: "Considera discutir en tu próxima visita",
      keyMilestone: "Este es un hito importante para seguir",
      noWorries: "Cada niño se desarrolla a su propio ritmo",
    },
    privacy: {
      dataStaysLocal: "Tus entradas permanecen privadas en este dispositivo",
      notDiagnostic: "Solo informativo - no para diagnóstico médico",
      informationalOnly: "Esta información es solo para seguimiento y no debe reemplazar el consejo médico profesional",
    },
    actions: {
      bookmark: "Guardar para después",
      remindMe: "Establecer recordatorio",
      tryNow: "Probar esta actividad",
      addToVisit: "Agregar a notas de visita",
      exportSummary: "Compartir con doctor",
    },
    tips: {
      positiveEncouragement: "¡Lo estás haciendo genial! Aquí tienes algunas actividades divertidas para probar.",
      timeEstimate: "5-10 minutos",
      tryWithChild: "Actividad perfecta para probar con tu hijo hoy",
    },
    appointments: {
      upcomingVisit: "Próximamente",
      discussItems: "Elementos a discutir",
      reminderSet: "Recordatorio establecido exitosamente",
    },
    empty: {
      noChildren: "Agrega tu primer hijo para comenzar con el seguimiento de hitos",
      addFirstChild: "Agregar tu hijo",
      noTips: "No hay consejos disponibles para esta edad aún",
      noAppointments: "No hay citas próximas programadas",
    },
    validation: {
      dateWarning: "Cambiar esta fecha afectará los cálculos de edad de hitos",
      duplicateChild: "Ya existe un niño con este nombre y fecha de nacimiento similar",
      requiredField: "Este campo es requerido",
    },
  },
}

// Hook to get current language microcopy
export function useMilestoneMicrocopy(language: "en" | "es" = "en"): MilestoneMicrocopy {
  return milestoneMicrocopy[language]
}

// Helper function to get specific microcopy string
export function getMicrocopyString(language: "en" | "es", category: keyof MilestoneMicrocopy, key: string): string {
  const copy = milestoneMicrocopy[language]
  const categoryStrings = copy[category] as Record<string, string>
  return categoryStrings[key] || key
}
