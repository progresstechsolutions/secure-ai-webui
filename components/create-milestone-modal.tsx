import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { User, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateMilestoneModalProps {
  onClose: () => void
  onMilestoneCreated: (data: { title: string; description: string; image?: string }) => void
  onBack?: () => void
  onCancel?: () => void
}

export function CreateMilestoneModal(props: CreateMilestoneModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.")
      return
    }
    props.onMilestoneCreated({
      title,
      description,
      image: image || undefined,
    })
    setTitle("")
    setDescription("")
    setImage("")
    setError("")
  }

  const onBack = props.onBack || props.onCancel || router.back

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              {(typeof onBack === 'function' || typeof props?.onBack === 'function' || typeof props?.onCancel === 'function') && (
                <Button variant="ghost" size="sm" onClick={onBack || props?.onBack || props?.onCancel || router.back} className="mr-2">
                  <ArrowLeft className="h-5 w-5 mr-1" /> Back
                </Button>
              )}
              <CardTitle className="text-2xl font-bold mb-2">Create Milestone</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              <Input placeholder="Image URL (optional)" value={image} onChange={e => setImage(e.target.value)} />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex items-center justify-end border-t pt-4 mt-2 space-x-3">
                <Button variant="outline" size="sm" onClick={props.onCancel}>Cancel</Button>
                <Button variant="default" size="sm" onClick={handleSubmit}>Create</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 