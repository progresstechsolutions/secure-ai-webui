"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog"
import { Badge } from "../../ui/badge"
import { Progress } from "../../ui/progress"
import { 
  Camera, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Upload,
  X,
  Crop,
  RefreshCw,
  Plus,
  Download
} from "lucide-react"
import { cn } from "../../../lib/utils"

// OpenCV.js will be imported dynamically
declare global {
  interface Window {
    cv: any
  }
}

interface DocumentCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (pdfFile: File, documentName: string) => void
}

interface CapturedPage {
  id: string
  originalImage: string
  processedImage?: string
  isProcessing: boolean
  processingError?: string
  manualCorners?: { x: number; y: number }[]
}

interface Corner {
  x: number
  y: number
  isDragging?: boolean
}

type CaptureMode = "camera" | "processing" | "preview" | "manual-crop" | "multi-page" | "complete"

export function DocumentCaptureModal({ 
  isOpen, 
  onClose, 
  onComplete 
}: DocumentCaptureModalProps) {
  const [captureMode, setCaptureMode] = useState<CaptureMode>("camera")
  const [pages, setPages] = useState<CapturedPage[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [documentName, setDocumentName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manualCorners, setManualCorners] = useState<Corner[]>([])
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedCornerIndex, setDraggedCornerIndex] = useState<number | null>(null)
  const [opencvLoaded, setOpencvLoaded] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processingCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const cropContainerRef = useRef<HTMLDivElement>(null)

  // Get current page
  const currentPage = pages[currentPageIndex]

  // Load OpenCV.js
  useEffect(() => {
    const loadOpenCV = async () => {
      try {
        // Check if OpenCV is already loaded
        if (window.cv) {
          console.log('OpenCV.js already loaded')
          setOpencvLoaded(true)
          return
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="opencv.js"]')
        if (existingScript) {
          console.log('OpenCV.js script already exists, waiting for load...')
          return
        }

        // Load OpenCV.js from CDN
        const script = document.createElement('script')
        script.src = 'https://docs.opencv.org/4.8.0/opencv.js'
        script.async = true
        script.onload = () => {
          console.log('OpenCV.js loaded successfully')
          setOpencvLoaded(true)
        }
        script.onerror = () => {
          console.error('Failed to load OpenCV.js')
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Error loading OpenCV.js:', error)
      }
    }

    if (!opencvLoaded) {
      loadOpenCV()
    }
  }, [opencvLoaded])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

  const getCameraConstraints = useCallback(() => {
    const baseConstraints = {
      video: {
        facingMode: 'environment', // Use back camera for documents
        width: { ideal: 1920, max: 3840 },
        height: { ideal: 1080, max: 2160 },
        frameRate: { ideal: 30, max: 60 }
      }
    }

    // Mobile-specific optimizations
    if (isMobile) {
      return {
        video: {
          ...baseConstraints.video,
          width: { ideal: 1280, max: 1920 }, // Lower resolution for mobile
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 24, max: 30 } // Lower frame rate for battery
        }
      }
    }

    return baseConstraints
  }, [isMobile])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const constraints = getCameraConstraints()
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCaptureMode("camera")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Unable to access camera. Please check permissions and try again.")
    }
  }, [getCameraConstraints])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && captureMode === "camera") {
      startCamera()
    }
    
    return () => {
      stopCamera()
    }
  }, [isOpen, captureMode, startCamera, stopCamera])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Set canvas size to video dimensions
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0)
        
        // Get image data
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        
        // Create new page
        const newPage: CapturedPage = {
          id: Date.now().toString(),
          originalImage: imageData,
          isProcessing: true
        }
        
        setPages(prev => [...prev, newPage])
        setCurrentPageIndex(pages.length)
        setCaptureMode("processing")
        
        // Stop camera
        stopCamera()
        
        // Start processing
        processImage(newPage.id, imageData)
      }
    }
  }, [pages.length, stopCamera])

  // Advanced image processing with OpenCV.js
  const processImageWithOpenCV = useCallback(async (imageData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('processImageWithOpenCV called with imageData length:', imageData.length)
      
      if (!window.cv) {
        console.error('OpenCV.js not loaded in processImageWithOpenCV')
        reject(new Error('OpenCV.js not loaded'))
        return
      }
      
      console.log('OpenCV.js is available, starting processing...')

      const img = new Image()
      img.onload = () => {
        try {
          // Create canvas for processing
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          
          // Convert to OpenCV Mat
          const src = window.cv.matFromImageData(imageData)
          
          // Convert to grayscale
          const gray = new window.cv.Mat()
          window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY)
          
          // Apply Gaussian blur to reduce noise
          const blurred = new window.cv.Mat()
          window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0)
          
          // Apply adaptive threshold for better contrast
          const thresh = new window.cv.Mat()
          window.cv.adaptiveThreshold(
            blurred, 
            thresh, 
            255, 
            window.cv.ADAPTIVE_THRESH_GAUSSIAN_C, 
            window.cv.THRESH_BINARY, 
            11, 
            2
          )
          
          // Find contours
          const contours = new window.cv.MatVector()
          const hierarchy = new window.cv.Mat()
          window.cv.findContours(
            thresh, 
            contours, 
            hierarchy, 
            window.cv.RETR_EXTERNAL, 
            window.cv.CHAIN_APPROX_SIMPLE
          )
          
          // Find the largest contour (likely the document)
          let maxArea = 0
          let maxContourIndex = -1
          
          console.log('Found', contours.size(), 'contours')
          
          for (let i = 0; i < contours.size(); i++) {
            const area = window.cv.contourArea(contours.get(i))
            console.log(`Contour ${i}: area = ${area}`)
            if (area > maxArea) {
              maxArea = area
              maxContourIndex = i
            }
          }
          
          console.log('Largest contour area:', maxArea, 'index:', maxContourIndex)
          
          // Lower the threshold significantly and check if contour is roughly rectangular
          if (maxContourIndex >= 0 && maxArea > 100) {
            const contour = contours.get(maxContourIndex)
            
            // Try different epsilon values for better approximation
            const arcLength = window.cv.arcLength(contour, true)
            console.log('Contour arc length:', arcLength)
            
            // Try multiple epsilon values to find the best approximation
            let bestApprox = null
            let bestEpsilon = 0
            
            for (let epsilonFactor = 0.01; epsilonFactor <= 0.1; epsilonFactor += 0.01) {
              const epsilon = epsilonFactor * arcLength
              const approx = new window.cv.Mat()
              window.cv.approxPolyDP(contour, approx, epsilon, true)
              
              console.log(`Epsilon ${epsilonFactor}: ${approx.rows} points`)
              
              // Prefer 4 points, but accept 3-6 points for more flexibility
              if (approx.rows >= 3 && approx.rows <= 6) {
                bestApprox = approx
                bestEpsilon = epsilonFactor
                if (approx.rows === 4) break // Perfect rectangle found
              } else {
                approx.delete()
              }
            }
            
            if (bestApprox && bestApprox.rows >= 3) {
              console.log(`Using approximation with ${bestApprox.rows} points (epsilon factor: ${bestEpsilon})`)
              
              // If we have 4 points, we have a rectangle
              if (bestApprox.rows === 4) {
                console.log('Found 4 corners, applying perspective correction')
                // Get the corners and apply perspective correction
                const corners = []
                for (let i = 0; i < 4; i++) {
                  corners.push({
                    x: bestApprox.data32S[i * 2],
                    y: bestApprox.data32S[i * 2 + 1]
                  })
                }
                
                // Sort corners: top-left, top-right, bottom-right, bottom-left
                corners.sort((a, b) => a.y - b.y)
                const top = corners.slice(0, 2).sort((a, b) => a.x - b.x)
                const bottom = corners.slice(2, 4).sort((a, b) => a.x - b.x)
                const sortedCorners = [...top, ...bottom.reverse()]
                
                // Calculate perspective transform
                const srcPoints = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [
                  sortedCorners[0].x, sortedCorners[0].y,
                  sortedCorners[1].x, sortedCorners[1].y,
                  sortedCorners[2].x, sortedCorners[2].y,
                  sortedCorners[3].x, sortedCorners[3].y
                ])
                
                const width = Math.max(
                  Math.hypot(sortedCorners[1].x - sortedCorners[0].x, sortedCorners[1].y - sortedCorners[0].y),
                  Math.hypot(sortedCorners[2].x - sortedCorners[3].x, sortedCorners[2].y - sortedCorners[3].y)
                )
                const height = Math.max(
                  Math.hypot(sortedCorners[3].x - sortedCorners[0].x, sortedCorners[3].y - sortedCorners[0].y),
                  Math.hypot(sortedCorners[2].x - sortedCorners[1].x, sortedCorners[2].y - sortedCorners[1].y)
                )
                
                const dstPoints = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [
                  0, 0,
                  width, 0,
                  width, height,
                  0, height
                ])
                
                const transformMatrix = window.cv.getPerspectiveTransform(srcPoints, dstPoints)
                const warped = new window.cv.Mat()
                window.cv.warpPerspective(gray, warped, transformMatrix, new window.cv.Size(width, height))
                
                                 // Convert back to canvas
                 const processedCanvas = document.createElement('canvas')
                 processedCanvas.width = width
                 processedCanvas.height = height
                 const processedCtx = processedCanvas.getContext('2d')
                 if (processedCtx) {
                   // Convert grayscale to RGBA for canvas
                   const rgbaData = new Uint8ClampedArray(width * height * 4)
                   const warpedData = warped.data
                   console.log('Warped data length:', warpedData.length, 'Expected RGBA length:', width * height * 4)
                   
                   // Ensure we don't exceed the warped data length
                   const maxIndex = Math.min(warpedData.length, width * height)
                   for (let i = 0; i < maxIndex; i++) {
                     const grayValue = warpedData[i]
                     const rgbaIndex = i * 4
                     rgbaData[rgbaIndex] = grayValue     // R
                     rgbaData[rgbaIndex + 1] = grayValue // G
                     rgbaData[rgbaIndex + 2] = grayValue // B
                     rgbaData[rgbaIndex + 3] = 255       // A
                   }
                   
                   const processedImageData = new ImageData(rgbaData, width, height)
                   processedCtx.putImageData(processedImageData, 0, 0)
                   const processedImage = processedCanvas.toDataURL('image/jpeg', 0.9)
                  
                  console.log('Perspective correction completed successfully')
                  
                  // Clean up OpenCV objects
                  src.delete()
                  gray.delete()
                  blurred.delete()
                  thresh.delete()
                  contours.delete()
                  hierarchy.delete()
                  bestApprox.delete()
                  srcPoints.delete()
                  dstPoints.delete()
                  transformMatrix.delete()
                  warped.delete()
                  
                  resolve(processedImage)
                  return
                }
              }
            }
            if (bestApprox) bestApprox.delete()
          }
          
                     // If no good contour found, just return enhanced grayscale
           console.log('No good contour found, returning enhanced grayscale')
           const processedCanvas = document.createElement('canvas')
           processedCanvas.width = canvas.width
           processedCanvas.height = canvas.height
           const processedCtx = processedCanvas.getContext('2d')
           if (processedCtx) {
             // Convert grayscale to RGBA for canvas
             const rgbaData = new Uint8ClampedArray(canvas.width * canvas.height * 4)
             const grayData = gray.data
             console.log('Gray data length:', grayData.length, 'Expected RGBA length:', canvas.width * canvas.height * 4)
             
             // Ensure we don't exceed the gray data length
             const maxIndex = Math.min(grayData.length, canvas.width * canvas.height)
             for (let i = 0; i < maxIndex; i++) {
               const grayValue = grayData[i]
               const rgbaIndex = i * 4
               rgbaData[rgbaIndex] = grayValue     // R
               rgbaData[rgbaIndex + 1] = grayValue // G
               rgbaData[rgbaIndex + 2] = grayValue // B
               rgbaData[rgbaIndex + 3] = 255       // A
             }
             
             const processedImageData = new ImageData(rgbaData, canvas.width, canvas.height)
             processedCtx.putImageData(processedImageData, 0, 0)
             const processedImage = processedCanvas.toDataURL('image/jpeg', 0.9)
            
            console.log('Enhanced grayscale processing completed')
            
            // Clean up OpenCV objects
            src.delete()
            gray.delete()
            blurred.delete()
            thresh.delete()
            contours.delete()
            hierarchy.delete()
            
            resolve(processedImage)
          }
          
        } catch (error) {
          console.error('OpenCV processing error:', error)
          reject(error)
        }
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = imageData
    })
  }, [])

  const processImage = useCallback(async (pageId: string, imageData: string) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      console.log('Starting image processing for page:', pageId)
      console.log('OpenCV loaded:', opencvLoaded)
      console.log('Window.cv available:', !!window.cv)
      
      setProcessingProgress(20)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProcessingProgress(40)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProcessingProgress(60)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProcessingProgress(80)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProcessingProgress(100)
      await new Promise(resolve => setTimeout(resolve, 200))
      
             // Use OpenCV.js processing if available, otherwise fallback
       let processedImage = imageData
       
       if (window.cv) {
         console.log('Attempting OpenCV processing...')
         try {
           processedImage = await processImageWithOpenCV(imageData)
           console.log('OpenCV processing completed successfully')
         } catch (error) {
           console.error('OpenCV processing failed, using original:', error)
           // Keep original image if OpenCV processing fails
         }
       } else {
         console.log('OpenCV not available, using original image')
       }
      
      console.log('Final processed image length:', processedImage.length)
      
      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, processedImage, isProcessing: false }
          : page
      ))
      
      setCaptureMode("preview")
      
    } catch (error) {
      console.error("Processing error:", error)
      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, isProcessing: false, processingError: "Processing failed" }
          : page
      ))
      setCaptureMode("preview")
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }, [opencvLoaded, processImageWithOpenCV])

  const retakePhoto = useCallback(() => {
    setPages(prev => prev.filter((_, index) => index !== currentPageIndex))
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
    setCaptureMode("camera")
    startCamera()
  }, [currentPageIndex, startCamera])

  const addAnotherPage = useCallback(() => {
    setCaptureMode("camera")
    startCamera()
  }, [startCamera])

  const finishCapture = useCallback(() => {
    if (pages.length === 0) return
    
    setShowNameInput(true)
    setCaptureMode("complete")
  }, [pages.length])

  const handleManualCrop = useCallback(() => {
    setCaptureMode("manual-crop")
    // Use setTimeout to ensure the container is rendered
    setTimeout(() => {
      if (currentPage && cropContainerRef.current) {
        const container = cropContainerRef.current.getBoundingClientRect()
        const width = container.width
        const height = container.height
        console.log("Container dimensions:", width, height)
        setImageDimensions({ width, height })
        
        // Create default crop box (80% of container size, centered)
        const margin = 0.1 // 10% margin
        const defaultCorners: Corner[] = [
          { x: width * margin, y: height * margin }, // Top-left
          { x: width * (1 - margin), y: height * margin }, // Top-right
          { x: width * (1 - margin), y: height * (1 - margin) }, // Bottom-right
          { x: width * margin, y: height * (1 - margin) } // Bottom-left
        ]
        console.log("Default corners:", defaultCorners)
        setManualCorners(defaultCorners)
      } else {
        console.log("Missing currentPage or cropContainerRef:", { currentPage: !!currentPage, cropContainerRef: !!cropContainerRef.current })
      }
    }, 100) // Small delay to ensure rendering
  }, [currentPage])

  // Manual crop drag handling
  const handleCornerMouseDown = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDraggedCornerIndex(index)
  }, [])

  const handleCornerMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || draggedCornerIndex === null || !cropContainerRef.current || !currentPage) return

    e.preventDefault()
    
    const container = cropContainerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    // Calculate position relative to container
    const x = Math.max(0, Math.min(container.width, clientX - container.left))
    const y = Math.max(0, Math.min(container.height, clientY - container.top))
    
    // Store display coordinates directly (easier to work with)
    setManualCorners(prev => {
      const newCorners = [...prev]
      newCorners[draggedCornerIndex] = { x, y }
      return newCorners
    })
  }, [isDragging, draggedCornerIndex, currentPage])

  const handleCornerMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedCornerIndex(null)
  }, [])

  // Add/remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleCornerMouseMove(e)
      const handleMouseUp = () => handleCornerMouseUp()
      const handleTouchMove = (e: TouchEvent) => handleCornerMouseMove(e)
      const handleTouchEnd = () => handleCornerMouseUp()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleCornerMouseMove, handleCornerMouseUp])

  const applyManualCrop = useCallback(() => {
    if (!currentPage || manualCorners.length !== 4) return

    // Create a canvas to perform the cropping
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    // Load the original image
    const img = new Image()
    img.onload = () => {
      // Get the container dimensions for coordinate conversion
      const container = cropContainerRef.current?.getBoundingClientRect()
      if (!container) return

      // Convert display coordinates to image coordinates
      const imageAspectRatio = img.width / img.height
      const containerAspectRatio = container.width / container.height
      
      let imageWidth, imageHeight, offsetX, offsetY
      
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container
        imageWidth = container.width
        imageHeight = container.width / imageAspectRatio
        offsetX = 0
        offsetY = (container.height - imageHeight) / 2
      } else {
        // Image is taller than container
        imageWidth = container.height * imageAspectRatio
        imageHeight = container.height
        offsetX = (container.width - imageWidth) / 2
        offsetY = 0
      }

      // Convert display coordinates to image coordinates
      const cropCorners = manualCorners.map(corner => ({
        x: ((corner.x - offsetX) / imageWidth) * img.width,
        y: ((corner.y - offsetY) / imageHeight) * img.height
      }))

      // Calculate the bounding box of the crop area
      const minX = Math.min(...cropCorners.map(c => c.x))
      const maxX = Math.max(...cropCorners.map(c => c.x))
      const minY = Math.min(...cropCorners.map(c => c.y))
      const maxY = Math.max(...cropCorners.map(c => c.y))

      // Set canvas size to crop dimensions
      const cropWidth = maxX - minX
      const cropHeight = maxY - minY
      canvas.width = cropWidth
      canvas.height = cropHeight

      // For now, do a simple rectangular crop
      // TODO: Implement perspective correction in later phase
      ctx.drawImage(
        img,
        minX, minY, cropWidth, cropHeight,  // Source rectangle
        0, 0, cropWidth, cropHeight          // Destination rectangle
      )

      // Convert canvas to data URL
      const croppedImageData = canvas.toDataURL('image/jpeg', 0.9)

      // Update the page with the cropped image
      setPages(prev => prev.map(page => 
        page.id === currentPage.id 
          ? { 
              ...page, 
              processedImage: croppedImageData,
              manualCorners: manualCorners.map(c => ({ x: c.x, y: c.y }))
            }
          : page
      ))
      
      setCaptureMode("preview")
    }
    
    img.src = currentPage.originalImage
  }, [currentPage, manualCorners])

  const handleComplete = useCallback(async () => {
    if (pages.length === 0) return
    
    try {
      // TODO: Generate PDF from all pages
      const pdfFile = new File([], "document.pdf", { type: "application/pdf" })
      const finalName = documentName || `Document_${new Date().toISOString().split('T')[0]}`
      
      onComplete(pdfFile, finalName)
      onClose()
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }, [pages, documentName, onComplete, onClose])

  const handleClose = useCallback(() => {
    stopCamera()
    setPages([])
    setCurrentPageIndex(0)
    setCaptureMode("camera")
    setDocumentName("")
    setShowNameInput(false)
    setCameraError(null)
    onClose()
  }, [stopCamera, onClose])

  return (
         <Dialog open={isOpen} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Document
          </DialogTitle>
          <DialogDescription>
            Take photos of your document pages. Each page will be processed for optimal quality.
          </DialogDescription>
        </DialogHeader>

                 <div className="flex-1 overflow-y-auto">
                     {/* Camera Feed */}
           {captureMode === "camera" && (
             <div className={cn(
               "relative bg-black rounded-lg overflow-hidden",
               isMobile ? "aspect-[4/5]" : "aspect-video" // 75% taller on mobile (4:5 vs 16:9)
             )}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Camera Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top Info */}
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {pages.length + 1} of {pages.length + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-center items-center gap-4">
                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>

                {/* Camera Error */}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center text-white p-4">
                      <p className="text-sm mb-2">{cameraError}</p>
                      <Button onClick={startCamera} variant="outline" size="sm">
                        Retry Camera
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Processing */}
          {captureMode === "processing" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Image</h3>
                             <p className="text-sm text-muted-foreground mb-4">
                 {opencvLoaded ? "Processing with OpenCV.js..." : "Enhancing document quality..."}
               </p>
              <Progress value={processingProgress} className="w-64" />
              <p className="text-xs text-muted-foreground mt-2">
                {processingProgress}% complete
              </p>
            </div>
          )}

          {/* Preview */}
          {captureMode === "preview" && currentPage && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentPage.processedImage || currentPage.originalImage}
                  alt="Processed document"
                  className="w-full h-full object-contain"
                />
                
                {currentPage.processingError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                    <div className="text-center text-red-600 p-4">
                      <p className="text-sm">Processing failed</p>
                      <p className="text-xs">You can still use manual cropping</p>
                    </div>
                  </div>
                )}
              </div>

                             {/* Action Buttons */}
               <div className={cn(
                 "flex gap-2",
                 isMobile 
                   ? "flex-wrap justify-center" 
                   : "justify-center"
               )}>
                 <Button
                   onClick={retakePhoto}
                   variant="outline"
                   size={isMobile ? "sm" : "sm"}
                   className={cn(
                     "flex items-center",
                     isMobile ? "flex-1 min-w-[80px] text-xs" : ""
                   )}
                 >
                   <RotateCcw className={cn("h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
                   <span className={isMobile ? "text-xs" : ""}>Retake</span>
                 </Button>
                 
                 <Button
                   onClick={handleManualCrop}
                   variant="outline"
                   size={isMobile ? "sm" : "sm"}
                   className={cn(
                     "flex items-center",
                     isMobile ? "flex-1 min-w-[80px] text-xs" : ""
                   )}
                 >
                   <Crop className={cn("h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
                   <span className={isMobile ? "text-xs" : ""}>Crop</span>
                 </Button>
                 
                 <Button
                   onClick={addAnotherPage}
                   variant="outline"
                   size={isMobile ? "sm" : "sm"}
                   className={cn(
                     "flex items-center",
                     isMobile ? "flex-1 min-w-[80px] text-xs" : ""
                   )}
                 >
                   <Plus className={cn("h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
                   <span className={isMobile ? "text-xs" : ""}>Add</span>
                 </Button>
                 
                 <Button
                   onClick={finishCapture}
                   size={isMobile ? "sm" : "sm"}
                   className={cn(
                     "flex items-center",
                     isMobile ? "flex-1 min-w-[80px] text-xs" : ""
                   )}
                 >
                   <Check className={cn("h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
                   <span className={isMobile ? "text-xs" : ""}>Done</span>
                 </Button>
               </div>

              {/* Page Navigation */}
              {pages.length > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                    variant="ghost"
                    size="sm"
                    disabled={currentPageIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPageIndex + 1} of {pages.length}
                  </span>
                  
                  <Button
                    onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
                    variant="ghost"
                    size="sm"
                    disabled={currentPageIndex === pages.length - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

                     {/* Manual Crop */}
           {captureMode === "manual-crop" && currentPage && (
             <div className="space-y-4">
               <div className="text-center">
                 <h3 className="text-lg font-semibold mb-2">Manual Crop</h3>
                 <p className="text-sm text-muted-foreground">
                   Drag the corner points to adjust the document boundaries
                 </p>
               </div>
               
               {/* Interactive Crop Interface */}
               <div 
                 ref={cropContainerRef}
                 className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
                 style={{ userSelect: 'none' }}
               >
                 <img
                   src={currentPage.originalImage}
                   alt="Original document"
                   className="w-full h-full object-contain"
                 />
                 
                                                     {/* Crop Box Overlay */}
                  {(() => { console.log("Manual corners length:", manualCorners.length, "Corners:", manualCorners); return null; })()}
                  {manualCorners.length === 4 && (
                    <>
                      {console.log("Rendering crop box with corners:", manualCorners)}
                      {/* Crop Box Lines */}
                                           <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ userSelect: 'none' }}
                        viewBox={`0 0 100 100`}
                        preserveAspectRatio="none"
                      >
                       <defs>
                         <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                           <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                         </pattern>
                       </defs>
                       
                                               {/* Grid Pattern */}
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        {/* Test rectangle to see if SVG is rendering */}
                        <rect x="10" y="10" width="80" height="80" fill="rgba(255,0,0,0.3)" stroke="red" strokeWidth="2" />
                       
                       {/* Crop Box */}
                       <polygon
                         points={manualCorners.map(corner => {
                           const scaleX = imageDimensions.width > 0 ? 100 / imageDimensions.width : 1
                           const scaleY = imageDimensions.height > 0 ? 100 / imageDimensions.height : 1
                           return `${corner.x * scaleX},${corner.y * scaleY}`
                         }).join(' ')}
                         fill="none"
                         stroke="white"
                         strokeWidth="2"
                         strokeDasharray="5,5"
                       />
                       
                       {/* Corner Points */}
                       {manualCorners.map((corner, index) => {
                         const scaleX = imageDimensions.width > 0 ? 100 / imageDimensions.width : 1
                         const scaleY = imageDimensions.height > 0 ? 100 / imageDimensions.height : 1
                         return (
                           <circle
                             key={index}
                             cx={`${corner.x * scaleX}`}
                             cy={`${corner.y * scaleY}`}
                             r="2"
                             fill="white"
                             stroke="#3b82f6"
                             strokeWidth="1"
                             className="cursor-move"
                             style={{ pointerEvents: 'auto' }}
                           />
                         )
                       })}
                     </svg>
                     
                                           {/* Draggable Corner Handles */}
                      {manualCorners.map((corner, index) => {
                        return (
                          <div
                            key={index}
                            className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-move shadow-lg"
                            style={{
                              left: `${corner.x}px`,
                              top: `${corner.y}px`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                            onMouseDown={(e) => handleCornerMouseDown(index, e)}
                            onTouchStart={(e) => handleCornerMouseDown(index, e)}
                          />
                        )
                      })}
                   </>
                 )}
               </div>

                               <div className="flex justify-center gap-2 pb-4">
                  <Button
                    onClick={() => setCaptureMode("preview")}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyManualCrop}
                    size="sm"
                  >
                    Apply Crop
                  </Button>
                </div>
             </div>
           )}

          {/* Complete */}
          {captureMode === "complete" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Document Ready</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {pages.length} page{pages.length !== 1 ? 's' : ''} captured
                </p>
              </div>

              {/* Document Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Page Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    className="relative aspect-square bg-gray-100 rounded overflow-hidden"
                  >
                    <img
                      src={page.processedImage || page.originalImage}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => setCaptureMode("camera")}
                  variant="outline"
                  size="sm"
                >
                  Add More Pages
                </Button>
                <Button
                  onClick={handleComplete}
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={processingCanvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
} 