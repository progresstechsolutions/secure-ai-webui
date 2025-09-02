"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  Plus,
  Stethoscope,
  Syringe,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  MapPin,
  Phone,
  FileText,
  Eye,
  Info,
} from "lucide-react"
import {
  getChild,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getChecklistResponses,
} from "@/lib/milestone-data-layer"
import type { Child, Appointment, ChecklistResponse } from "@/types/milestone"

interface AppointmentsRemindersProps {
  childId: string
}

const getGuidelineSuggestions = (ageInMonths: number) => {
  const suggestions = []

  if (ageInMonths >= 18 && ageInMonths < 24) {
    suggestions.push({
      type: "screening",
      title: "Autism Screening Recommended",
      description: "Consider M-CHAT screening at 18-month visit",
      priority: "high",
    })
  }

  if (ageInMonths >= 24 && ageInMonths < 36) {
    suggestions.push({
      type: "screening",
      title: "Lead Screening",
      description: "Blood lead test recommended between 12-24 months",
      priority: "medium",
    })
  }

  if (ageInMonths >= 36 && ageInMonths < 48) {
    suggestions.push({
      type: "screening",
      title: "Vision & Hearing Check",
      description: "Comprehensive vision and hearing screening",
      priority: "medium",
    })
  }

  return suggestions
}

export function AppointmentsReminders({ childId }: AppointmentsRemindersProps) {
  const [child, setChild] = useState<Child | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [checklistResponses, setChecklistResponses] = useState<ChecklistResponse[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    provider: "",
    location: "",
    address: "",
    phone: "",
    notes: "",
    checklistItems: [] as string[],
    reminders: {
      push24h: true,
      push2h: true,
      email24h: false,
      email2h: false,
    },
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("[v0] Loading appointments data for childId:", childId)
        const childData = await getChild(childId)
        console.log("[v0] Child data loaded:", childData)
        const appointmentsData = await getAppointments(childId)
        const responsesData = await getChecklistResponses(childId)

        setChild(childData)
        setAppointments(appointmentsData)
        setChecklistResponses(responsesData)
      } catch (error) {
        console.error("[v0] Failed to load appointments data:", error)
      }
    }

    loadData()
  }, [childId])

  const getNotYetItems = () => {
    const recentResponses = checklistResponses
      .filter((response) => {
        const responseDate = new Date(response.completedAt)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return responseDate > threeMonthsAgo
      })
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    if (recentResponses.length === 0) return []

    const latestResponse = recentResponses[0]
    return latestResponse.responses
      .filter((r) => r.answer === "not_yet")
      .map((r) => ({
        id: r.itemId,
        label: r.itemId, // In real app, would lookup item label
        isKeyItem: Math.random() > 0.7, // Mock key item detection
      }))
  }

  const notYetItems = getNotYetItems()
  const keyNotYetItems = notYetItems.filter((item) => item.isKeyItem)

  const now = new Date()
  const upcomingAppointments = appointments
    .filter((apt) => new Date(`${apt.date} ${apt.time}`) > now)
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())

  const pastAppointments = appointments
    .filter((apt) => new Date(`${apt.date} ${apt.time}`) <= now)
    .sort((a, b) => new Date(`${b.date} ${a.time}`).getTime() - new Date(`${a.date} ${b.time}`).getTime())

  const handleSaveAppointment = async () => {
    try {
      const appointmentData = {
        ...formData,
        childId,
        id: isEditMode && selectedAppointment ? selectedAppointment.id : undefined,
      }

      if (isEditMode && selectedAppointment) {
        await updateAppointment(selectedAppointment.id, appointmentData)
      } else {
        await createAppointment(appointmentData)
      }

      // Reload appointments
      const updatedAppointments = await getAppointments(childId)
      setAppointments(updatedAppointments)

      setIsAddDialogOpen(false)
      setIsEditMode(false)
      setSelectedAppointment(null)
      setFormData({
        type: "",
        date: "",
        time: "",
        provider: "",
        location: "",
        address: "",
        phone: "",
        notes: "",
        checklistItems: [],
        reminders: {
          push24h: true,
          push2h: true,
          email24h: false,
          email2h: false,
        },
      })
    } catch (error) {
      console.error("Failed to save appointment:", error)
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      provider: appointment.provider || "",
      location: appointment.location || "",
      address: appointment.address || "",
      phone: appointment.phone || "",
      notes: appointment.notes || "",
      checklistItems: appointment.checklistItems || [],
      reminders: appointment.reminders || {
        push24h: true,
        push2h: true,
        email24h: false,
        email2h: false,
      },
    })
    setIsEditMode(true)
    setIsAddDialogOpen(true)
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId)
      const updatedAppointments = await getAppointments(childId)
      setAppointments(updatedAppointments)
    } catch (error) {
      console.error("Failed to delete appointment:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "well_visit":
        return <Stethoscope className="h-5 w-5" />
      case "vaccine":
        return <Syringe className="h-5 w-5" />
      case "screening":
        return <Eye className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "well_visit":
        return "bg-blue-100 text-blue-800"
      case "vaccine":
        return "bg-green-100 text-green-800"
      case "screening":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!child) {
    console.log("[v0] Child data not loaded yet, showing loading...")
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  const ageInMonths = child.birthDate
    ? Math.floor((new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0
  const guidelineSuggestions = getGuidelineSuggestions(ageInMonths)

  const AppointmentDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="min-h-[44px]">
          <Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update appointment details"
              : `Add a new appointment for ${child?.firstName || "your child"}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="col-span-3 min-h-[44px]">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="well_visit">Well Visit</SelectItem>
                <SelectItem value="vaccine">Vaccine</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              className="col-span-3 min-h-[44px]"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3 min-h-[44px]"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider
            </Label>
            <Input
              id="provider"
              placeholder="Dr. Smith"
              className="col-span-3 min-h-[44px]"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Clinic name"
              className="col-span-3 min-h-[44px]"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special notes..."
              className="col-span-3"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {notYetItems.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Items to Discuss</Label>
              <div className="col-span-3 space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Select milestone items to discuss at this appointment:
                </p>
                {notYetItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={formData.checklistItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            checklistItems: [...formData.checklistItems, item.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            checklistItems: formData.checklistItems.filter((id) => id !== item.id),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="text-sm">
                      {item.label}
                      {item.isKeyItem && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Key Item
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Reminders</Label>
            <div className="col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push24h" className="text-sm">
                  Push notification 24h before
                </Label>
                <Switch
                  id="push24h"
                  checked={formData.reminders.push24h}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, push24h: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push2h" className="text-sm">
                  Push notification 2h before
                </Label>
                <Switch
                  id="push2h"
                  checked={formData.reminders.push2h}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, push2h: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email24h" className="text-sm">
                  Email reminder 24h before
                </Label>
                <Switch
                  id="email24h"
                  checked={formData.reminders.email24h}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, email24h: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email2h" className="text-sm">
                  Email reminder 2h before
                </Label>
                <Switch
                  id="email2h"
                  checked={formData.reminders.email2h}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, email2h: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditMode(false)
              setSelectedAppointment(null)
            }}
            className="min-h-[44px]"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveAppointment} className="min-h-[44px]">
            {isEditMode ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AppointmentCard = ({ appointment, isPast = false }: { appointment: Appointment; isPast?: boolean }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPast ? "bg-muted" : "bg-primary/10"}`}
        >
          {getTypeIcon(appointment.type)}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">
              {appointment.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h4>
            {appointment.provider && <p className="text-sm text-muted-foreground">{appointment.provider}</p>}
          </div>
          <Badge className={getTypeColor(appointment.type)}>{appointment.type.replace("_", " ")}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(appointment.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {appointment.time}
          </div>
          {appointment.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {appointment.location}
            </div>
          )}
        </div>
        {appointment.notes && <p className="text-sm bg-muted p-2 rounded">{appointment.notes}</p>}
        {appointment.checklistItems && appointment.checklistItems.length > 0 && (
          <div className="text-sm">
            <p className="font-medium mb-1">Items to discuss:</p>
            <div className="flex flex-wrap gap-1">
              {appointment.checklistItems.map((itemId) => (
                <Badge key={itemId} variant="outline" className="text-xs">
                  {itemId}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditAppointment(appointment)}
            className="min-h-[44px]"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          {appointment.phone && (
            <Button variant="outline" size="sm" className="min-h-[44px] bg-transparent">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-destructive bg-transparent min-h-[44px]"
            onClick={() => handleDeleteAppointment(appointment.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName || "Child"} />
            <AvatarFallback>
              {child.firstName && child.firstName.length > 0 ? child.firstName.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Appointments & Reminders</h1>
            <p className="text-muted-foreground">
              {child.firstName || "Child"} • {Math.floor(ageInMonths / 12)} years {ageInMonths % 12} months
            </p>
          </div>
        </div>
        <AppointmentDialog />
      </div>

      {guidelineSuggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recommended for this age:</h3>
          <div className="flex flex-wrap gap-2">
            {guidelineSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm"
              >
                <Info className="h-4 w-4" />
                <span className="font-medium">{suggestion.title}</span>
                <span className="text-blue-600">• {suggestion.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {keyNotYetItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Consider discussing at your next visit</p>
                <p className="text-sm text-amber-700 mt-1">
                  {keyNotYetItems.length} key milestone{keyNotYetItems.length > 1 ? "s" : ""} not yet achieved
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100 min-h-[44px] bg-transparent"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      checklistItems: keyNotYetItems.map((item) => item.id),
                    })
                    setIsAddDialogOpen(true)
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Add to Visit Notes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
              <Badge variant="secondary">{upcomingAppointments.length}</Badge>
            </CardTitle>
            <CardDescription>Scheduled appointments and checkups</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming appointments scheduled</p>
                <p className="text-sm">Click "Add Appointment" to schedule one</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Past Appointments
                <Badge variant="outline">{pastAppointments.length}</Badge>
              </CardTitle>
              <CardDescription>Completed appointments and visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastAppointments.slice(0, 5).map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast={true} />
                ))}
                {pastAppointments.length > 5 && (
                  <Button variant="outline" className="w-full min-h-[44px] bg-transparent">
                    View All Past Appointments ({pastAppointments.length - 5} more)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
