"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function IntakeLoggingCard() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("food")
  const [foodItems, setFoodItems] = React.useState<string[]>([])
  const [newFood, setNewFood] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const quickAddItems = {
    food: ["Apple", "Banana", "Chicken Breast", "Rice", "Broccoli", "Salmon"],
    supplements: ["Vitamin D", "B12", "Iron", "Calcium", "Omega-3", "Probiotics"],
    medications: ["Ibuprofen", "Acetaminophen", "Prescription Med A", "Prescription Med B"],
    symptoms: ["Headache", "Nausea", "Fatigue", "Bloating", "Joint Pain", "Mood Changes"],
  }

  const addItem = (item: string) => {
    if (activeTab === "food") {
      setFoodItems([...foodItems, item])
    }
  }

  const addNewFood = () => {
    if (newFood.trim()) {
      setFoodItems([...foodItems, newFood.trim()])
      setNewFood("")
    }
  }

  const removeItem = (index: number) => {
    if (activeTab === "food") {
      setFoodItems(foodItems.filter((_, i) => i !== index))
    }
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Daily Intake & Symptoms Log
                </CardTitle>
                <CardDescription>Track your food, supplements, medications, and symptoms</CardDescription>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4" role="tablist">
                <TabsTrigger value="food" className="text-sm" role="tab" aria-controls="food-panel" id="food-tab">
                  🍎 Food
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="text-sm"
                  role="tab"
                  aria-controls="supplements-panel"
                  id="supplements-tab"
                >
                  💊 Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="medications"
                  className="text-sm"
                  role="tab"
                  aria-controls="medications-panel"
                  id="medications-tab"
                >
                  🏥 Medications
                </TabsTrigger>
                <TabsTrigger
                  value="symptoms"
                  className="text-sm"
                  role="tab"
                  aria-controls="symptoms-panel"
                  id="symptoms-tab"
                >
                  🤒 Symptoms
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="food"
                className="space-y-4"
                role="tabpanel"
                id="food-panel"
                aria-labelledby="food-tab"
              >
                <div className="space-y-3">
                  <Label htmlFor="food-input" className="text-base font-medium">
                    Add Food Item
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="food-input"
                      placeholder="Enter food item..."
                      value={newFood}
                      onChange={(e) => setNewFood(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addNewFood()}
                      className="flex-1"
                      aria-describedby="food-help"
                    />
                    <Button onClick={addNewFood} size="sm" aria-label="Add food item">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p id="food-help" className="text-sm text-muted-foreground">
                    Press Enter or click + to add
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Quick Add</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddItems.food.map((item) => (
                      <Button key={item} variant="outline" size="sm" onClick={() => addItem(item)} className="text-sm">
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>

                {foodItems.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Today's Food Log</Label>
                    <div className="flex flex-wrap gap-2">
                      {foodItems.map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => removeItem(index)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => (e.key === "Enter" || e.key === " ") && removeItem(index)}
                          aria-label={`Remove ${item} from log`}
                        >
                          {item} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="supplements"
                className="space-y-4"
                role="tabpanel"
                id="supplements-panel"
                aria-labelledby="supplements-tab"
              >
                <div className="space-y-3">
                  <Label className="text-base font-medium">Quick Add Supplements</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddItems.supplements.map((item) => (
                      <Button key={item} variant="outline" size="sm" onClick={() => addItem(item)} className="text-sm">
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="medications"
                className="space-y-4"
                role="tabpanel"
                id="medications-panel"
                aria-labelledby="medications-tab"
              >
                <div className="space-y-3">
                  <Label className="text-base font-medium">Quick Add Medications</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddItems.medications.map((item) => (
                      <Button key={item} variant="outline" size="sm" onClick={() => addItem(item)} className="text-sm">
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="symptoms"
                className="space-y-4"
                role="tabpanel"
                id="symptoms-panel"
                aria-labelledby="symptoms-tab"
              >
                <div className="space-y-3">
                  <Label className="text-base font-medium">Quick Add Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddItems.symptoms.map((item) => (
                      <Button key={item} variant="outline" size="sm" onClick={() => addItem(item)} className="text-sm">
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about your day..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
                aria-describedby="notes-help"
              />
              <p id="notes-help" className="text-sm text-muted-foreground">
                Optional: Add context about your symptoms, mood, or other observations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-12 text-base font-medium" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Save Today's Log
              </Button>
              <Button variant="outline" className="h-12 text-base bg-transparent" size="lg">
                <Download className="h-5 w-5 mr-2" />
                Export Log
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
