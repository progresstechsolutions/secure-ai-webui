"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, RotateCcw, Move, RotateCw, X } from "lucide-react"

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarChange: (avatarUrl: string) => void
  currentAvatar?: string
  childName?: string
}

interface CropArea {
  x: number
  y: number
  size: number
  scale: number
}

type CameraMode = "select" | "camera" | "capture" | "crop"

export function AvatarUploadModal({ 
  isOpen, 
  onClose, 
  onAvatarChange, 
  currentAvatar, 
  childName = "Child" 
}: AvatarUploadModalProps) {
  const [mode, setMode] = useState<CameraMode>("select")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, size: 200, scale: 1 })
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment' | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const cropRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode("select")
      setCapturedImage(null)
      setCropArea({ x: 0, y: 0, size: 200, scale: 1 })
      setIsCameraLoading(false)
      setCameraError(null)
             setFacingMode(null)
    }
  }, [isOpen])

  // Cleanup camera stream when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCapturedImage(result)
        setMode("crop")
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = useCallback(async (facing: 'user' | 'environment' | null = null) => {
    console.log("🚀 startCamera called with facing:", facing)
    setIsCameraLoading(true)
    setCameraError(null)
    
    // Stop existing stream
    if (streamRef.current) {
      console.log("🛑 Stopping existing stream")
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    try {
      console.log("📹 Requesting camera access...")
      // Simple camera access - no complex constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: facing ? { facingMode: facing } : true 
      })
      
      console.log("✅ Camera stream obtained:", stream)
      console.log("📊 Stream tracks:", stream.getTracks().map(t => ({ kind: t.kind, label: t.label })))
      
      streamRef.current = stream
      
      // Switch to camera mode first so video element exists
      console.log("🎬 Switching to camera mode to ensure video element exists")
      setMode("camera")
      
      // Wait for video element to be rendered
      setTimeout(() => {
        if (videoRef.current) {
          const video = videoRef.current
          console.log("🎥 Setting video srcObject")
          video.srcObject = stream
          
          // Comprehensive event handling
          const handleLoadedMetadata = () => {
            console.log("✅ Video loaded metadata")
            console.log("📏 Video dimensions:", video.videoWidth, "x", video.videoHeight)
            setIsCameraLoading(false)
          }
          
          const handleCanPlay = () => {
            console.log("✅ Video can play")
            setIsCameraLoading(false)
          }
          
          const handleError = (e: Event) => {
            console.error("❌ Video error:", e)
            console.error("❌ Video error details:", video.error)
            setCameraError("Failed to start camera stream.")
            setIsCameraLoading(false)
          }
          
          const handleStalled = () => {
            console.log("⚠️ Video stalled")
          }
          
          const handleWaiting = () => {
            console.log("⏳ Video waiting")
          }
          
          const handlePlaying = () => {
            console.log("▶️ Video playing")
          }
          
          video.onloadedmetadata = handleLoadedMetadata
          video.oncanplay = handleCanPlay
          video.onerror = handleError
          video.onstalled = handleStalled
          video.onwaiting = handleWaiting
          video.onplaying = handlePlaying
          
          console.log("🎬 Attempting to play video...")
          // Ensure video plays
          try {
            video.play().then(() => {
              console.log("✅ Video play successful")
            }).catch((playError) => {
              console.error("❌ Play error:", playError)
              // Still try to show camera mode even if play fails
              setIsCameraLoading(false)
            })
          } catch (playError) {
            console.error("❌ Play error:", playError)
            setIsCameraLoading(false)
          }
          
          // Check video state after a short delay
          setTimeout(() => {
            console.log("🔍 Video state check:")
            console.log("  - readyState:", video.readyState)
            console.log("  - paused:", video.paused)
            console.log("  - ended:", video.ended)
            console.log("  - currentTime:", video.currentTime)
            console.log("  - videoWidth:", video.videoWidth)
            console.log("  - videoHeight:", video.videoHeight)
            
            if (video.readyState >= 2 && isCameraLoading) {
              console.log("✅ Video is ready but still loading - forcing camera mode")
              setIsCameraLoading(false)
            }
          }, 1000)
        } else {
          console.error("❌ videoRef.current is still null after timeout")
          setCameraError("Failed to initialize video element.")
          setIsCameraLoading(false)
        }
      }, 100) // Small delay to ensure React has rendered the video element
    } catch (error) {
      console.error("❌ Error accessing camera:", error)
      setCameraError("Unable to access camera. Please check permissions and try again.")
      setIsCameraLoading(false)
    }
  }, [isCameraLoading])

  const switchCamera = useCallback(() => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    startCamera(newFacingMode)
  }, [facingMode, startCamera])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(imageData)
        setMode("capture")
        
        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setCropArea({ x: 0, y: 0, size: 200, scale: 1 })
    startCamera(facingMode)
  }, [facingMode, startCamera])

  const handleCrop = useCallback(() => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        const img = imageRef.current
        const cropSize = cropArea.size
        
        // Set canvas size for the final cropped image
        canvas.width = 200
        canvas.height = 200
        
        // Calculate source coordinates for cropping
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height
        
        const sourceX = cropArea.x * scaleX
        const sourceY = cropArea.y * scaleY
        const sourceWidth = cropSize * scaleX
        const sourceHeight = cropSize * scaleY
        
        // Create circular crop
        ctx.save()
        ctx.beginPath()
        ctx.arc(100, 100, 100, 0, 2 * Math.PI)
        ctx.clip()
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, 200, 200
        )
        
        ctx.restore()
        
        // Compress the final image
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob)
            onAvatarChange(croppedImageUrl)
            onClose()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }, [cropArea, onAvatarChange, onClose])

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (cropRef.current) {
      setIsDragging(true)
      const rect = cropRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      setDragStart({
        x: clientX - rect.left - cropArea.x,
        y: clientY - rect.top - cropArea.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging && cropRef.current) {
      const rect = cropRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const newX = clientX - rect.left - dragStart.x
      const newY = clientY - rect.top - dragStart.y
      
      // Constrain to image bounds
      const maxX = 400 - cropArea.size
      const maxY = 400 - cropArea.size
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, size: 200, scale: 1 })
  }

  const handleClose = () => {
    // Stop camera stream if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setMode("select")
    setCapturedImage(null)
    setCropArea({ x: 0, y: 0, size: 200, scale: 1 })
    setIsCameraLoading(false)
    setCameraError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a photo from your device or take a new picture using your camera.
          </DialogDescription>
        </DialogHeader>

        {mode === "select" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentAvatar} alt={childName} />
                <AvatarFallback>{childName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload from Device
              </Button>
              
                                             <Button 
                  onClick={() => startCamera()} 
                  className="w-full"
                  variant="outline"
                  disabled={isCameraLoading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isCameraLoading ? "Initializing Camera..." : "Take Photo"}
                </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {mode === "camera" && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 rounded-lg bg-black"
                style={{ transform: 'scaleX(-1)' }} // Mirror the camera
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-full opacity-50"></div>
              </div>
              
              {/* Camera controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={switchCamera}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button 
                onClick={() => setMode("select")} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {mode === "capture" && capturedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setMode("crop")} className="flex-1">
                <Move className="h-4 w-4 mr-2" />
                Crop Photo
              </Button>
              <Button onClick={retakePhoto} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </div>
          </div>
        )}

                          {mode === "crop" && capturedImage && (
           <div className="space-y-4">
             <div className="relative overflow-hidden rounded-lg border bg-black" ref={cropRef}>
                               <img
                  ref={imageRef}
                  src={capturedImage}
                  alt="Crop preview"
                  className="max-w-full max-h-96 object-contain"
                  onLoad={() => {
                    // Reset crop area when image loads
                    setCropArea({ x: 0, y: 0, size: 200, scale: 1 })
                  }}
                />
              
              {/* Dark overlay outside crop area */}
              <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none">
                                 <div
                   className="absolute bg-transparent"
                   style={{
                     left: cropArea.x,
                     top: cropArea.y,
                     width: cropArea.size,
                     height: cropArea.size,
                     borderRadius: '50%',
                     boxShadow: 'inset 0 0 0 9999px rgba(0, 0, 0, 0.5)'
                   }}
                 />
              </div>
              
                             {/* Crop overlay */}
                               <div
                  className="absolute border-2 border-white shadow-lg cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.size,
                    height: cropArea.size,
                    borderRadius: '50%'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                >
                 <div className="absolute inset-0 border-2 border-dashed border-white opacity-50"></div>
                 {/* Corner indicators */}
                 <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-white"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-white"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white"></div>
               </div>
            </div>

            

            <div className="flex gap-2">
              <Button onClick={handleCrop} className="flex-1">
                <Move className="h-4 w-4 mr-2" />
                Use Photo
              </Button>
              <Button 
                onClick={retakePhoto} 
                variant="outline"
              >
                Retake
              </Button>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{cameraError}</p>
            <p className="text-xs text-red-600 mt-1">
              Please allow camera permissions in your browser settings and try again.
            </p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
} 