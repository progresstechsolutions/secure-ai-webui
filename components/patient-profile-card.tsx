"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Edit, Calendar, Heart, Pill, AlertTriangle, Phone, Save, X, Plus, Trash2 } from "lucide-react"

// Sample patient data
const initialPatientData = {
  demographics: {
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1995-03-15",
    gender: "female",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Main St, Anytown, ST 12345",
  },
  diagnoses: [
    { id: 1, condition: "PCOS", diagnosedDate: "2022-01-15", status: "active" },
    { id: 2, condition: "Iron Deficiency Anemia", diagnosedDate: "2023-06-20", status: "active" },
  ],
  medications: [
    { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescriber: "Dr. Smith" },
    { id: 2, name: "Birth Control", dosage: "1 tablet", frequency: "Daily", prescriber: "Dr. Johnson" },
  ],
  supplements: [
    { id: 1, name: "Iron", dosage: "65mg", frequency: "Daily with Vitamin C" },
    { id: 2, name: "Vitamin D3", dosage: "2000 IU", frequency: "Daily" },
    { id: 3, name: "B12", dosage: "1000mcg", frequency: "Weekly" },
  ],
  allergies: [
    { id: 1, allergen: "Shellfish", severity: "severe", reaction: "Anaphylaxis" },
    { id: 2, allergen: "Penicillin", severity: "moderate", reaction: "Rash" },
  ],
  emergencyContacts: [
    { id: 1, name: "John Johnson", relationship: "Spouse", phone: "(555) 987-6543", isPrimary: true },
    { id: 2, name: "Mary Johnson", relationship: "Mother", phone: "(555) 456-7890", isPrimary: false },
  ],
}

export function PatientProfileCard() {
  const [patientData, setPatientData] = React.useState(initialPatientData)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState(initialPatientData)
  const [lastUpdated] = React.useState(new Date("2024-01-15T10:30:00"))

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSave = () => {
    setPatientData(editData)
    setIsEditing(false)
    // Here you would typically save to a backend
    console.log("Saving patient data:", editData)
  }

  const handleCancel = () => {
    setEditData(patientData)
    setIsEditing(false)
  }

  const addItem = (section: string) => {
    const newId = Date.now()
    setEditData((prev) => ({
      ...prev,
      [section]: [
        ...(prev[section as keyof typeof prev] as any[]),
        section === "diagnoses"
          ? { id: newId, condition: "", diagnosedDate: "", status: "active" }
          : section === "medications"
            ? { id: newId, name: "", dosage: "", frequency: "", prescriber: "" }
            : section === "supplements"
              ? { id: newId, name: "", dosage: "", frequency: "" }
              : section === "allergies"
                ? { id: newId, allergen: "", severity: "mild", reaction: "" }
                : section === "emergencyContacts"
                  ? { id: newId, name: "", relationship: "", phone: "", isPrimary: false }
                  : {},
      ],
    }))
  }

  const removeItem = (section: string, id: number) => {
    setEditData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).filter((item) => item.id !== id),
    }))
  }

  const updateItem = (section: string, id: number, field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      case "mild":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Patient Profile
            </CardTitle>
            <CardDescription>Current patient information and medical details</CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Last updated:</p>
            <p>
              {lastUpdated.toLocaleDateString()} at{" "}
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">
                {patientData.demographics.firstName} {patientData.demographics.lastName}
              </h3>
              <p className="text-muted-foreground">
                Age {calculateAge(patientData.demographics.dateOfBirth)} • {patientData.demographics.gender}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patientData.demographics.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  DOB: {new Date(patientData.demographics.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Active Diagnoses
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {patientData.diagnoses
                  .filter((d) => d.status === "active")
                  .map((diagnosis) => (
                    <Badge key={diagnosis.id} variant="outline">
                      {diagnosis.condition}
                    </Badge>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {patientData.allergies.map((allergy) => (
                  <Badge key={allergy.id} className={getSeverityColor(allergy.severity)}>
                    {allergy.allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Current Medications */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Pill className="h-4 w-4 text-blue-500" />
            Current Medications & Supplements
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {patientData.medications.map((med) => (
              <div key={med.id} className="p-3 border rounded-lg">
                <div className="font-medium">{med.name}</div>
                <div className="text-sm text-muted-foreground">
                  {med.dosage} • {med.frequency}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Prescribed by {med.prescriber}</div>
              </div>
            ))}
            {patientData.supplements.map((supp) => (
              <div key={supp.id} className="p-3 border rounded-lg bg-muted/30">
                <div className="font-medium">{supp.name}</div>
                <div className="text-sm text-muted-foreground">
                  {supp.dosage} • {supp.frequency}
                </div>
                <Badge variant="outline" className="text-xs mt-1">
                  Supplement
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Button */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 text-base font-medium" size="lg">
              <Edit className="h-5 w-5 mr-2" />
              Edit Patient Info
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit Patient Information</DialogTitle>
              <DialogDescription>
                Update patient demographics, medical history, and contact information
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Demographics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Demographics</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editData.demographics.firstName}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, firstName: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editData.demographics.lastName}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, lastName: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={editData.demographics.dateOfBirth}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, dateOfBirth: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={editData.demographics.gender}
                        onValueChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, gender: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editData.demographics.phone}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, phone: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.demographics.email}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            demographics: { ...prev.demographics, email: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editData.demographics.address}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, address: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Diagnoses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Diagnoses</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem("diagnoses")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {editData.diagnoses.map((diagnosis, index) => (
                    <div key={diagnosis.id} className="grid gap-3 md:grid-cols-4 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Input
                          value={diagnosis.condition}
                          onChange={(e) => updateItem("diagnoses", diagnosis.id, "condition", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Diagnosed Date</Label>
                        <Input
                          type="date"
                          value={diagnosis.diagnosedDate}
                          onChange={(e) => updateItem("diagnoses", diagnosis.id, "diagnosedDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={diagnosis.status}
                          onValueChange={(value) => updateItem("diagnoses", diagnosis.id, "status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="chronic">Chronic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem("diagnoses", diagnosis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Medications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Medications</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem("medications")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {editData.medications.map((medication) => (
                    <div key={medication.id} className="grid gap-3 md:grid-cols-5 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Medication</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateItem("medications", medication.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={medication.dosage}
                          onChange={(e) => updateItem("medications", medication.id, "dosage", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input
                          value={medication.frequency}
                          onChange={(e) => updateItem("medications", medication.id, "frequency", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prescriber</Label>
                        <Input
                          value={medication.prescriber}
                          onChange={(e) => updateItem("medications", medication.id, "prescriber", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem("medications", medication.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Supplements */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Supplements</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem("supplements")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {editData.supplements.map((supplement) => (
                    <div key={supplement.id} className="grid gap-3 md:grid-cols-4 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Supplement</Label>
                        <Input
                          value={supplement.name}
                          onChange={(e) => updateItem("supplements", supplement.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={supplement.dosage}
                          onChange={(e) => updateItem("supplements", supplement.id, "dosage", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input
                          value={supplement.frequency}
                          onChange={(e) => updateItem("supplements", supplement.id, "frequency", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem("supplements", supplement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Allergies */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Allergies</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem("allergies")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {editData.allergies.map((allergy) => (
                    <div key={allergy.id} className="grid gap-3 md:grid-cols-4 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Allergen</Label>
                        <Input
                          value={allergy.allergen}
                          onChange={(e) => updateItem("allergies", allergy.id, "allergen", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Severity</Label>
                        <Select
                          value={allergy.severity}
                          onValueChange={(value) => updateItem("allergies", allergy.id, "severity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Reaction</Label>
                        <Input
                          value={allergy.reaction}
                          onChange={(e) => updateItem("allergies", allergy.id, "reaction", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem("allergies", allergy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Contacts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">Emergency Contacts</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem("emergencyContacts")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {editData.emergencyContacts.map((contact) => (
                    <div key={contact.id} className="grid gap-3 md:grid-cols-5 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateItem("emergencyContacts", contact.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input
                          value={contact.relationship}
                          onChange={(e) => updateItem("emergencyContacts", contact.id, "relationship", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateItem("emergencyContacts", contact.id, "phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Contact</Label>
                        <Select
                          value={contact.isPrimary ? "yes" : "no"}
                          onValueChange={(value) =>
                            updateItem("emergencyContacts", contact.id, "isPrimary", value === "yes")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem("emergencyContacts", contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
