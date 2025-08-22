"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Badge } from "../../ui/badge"
import { Camera, RotateCcw, Check, ArrowLeft, ArrowRight, FileText, Upload } from "lucide-react"
import { cn } from "../../../lib/utils"

interface DocumentCameraCaptureProps {
  isOpen: boolean
  onClose: () => void
  onDocumentComplete: (files: File[], documentName: string) => void
}

interface ProcessedPage {
  id: string
  imageData: string
  processedImageData: string
  corners?: { x: number, y: number }[]
  debugImage?: string
}

interface Corner {
  x: number
  y: number
  isDragging?: boolean
}

export function DocumentCameraCapture({ 
  isOpen, 
  onClose, 
  onDocumentComplete 
}: DocumentCameraCaptureProps) {
  const [captureMode, setCaptureMode] = useState<"camera" | "review" | "processing" | "adjust" | "complete">("camera")
  const [pages, setPages] = useState<ProcessedPage[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [corners, setCorners] = useState<Corner[]>([])
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processingCanvasRef = useRef<HTMLCanvasElement>(null)

  const handleCameraCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera for documents
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCaptureMode("camera")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }, [])

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && captureMode === "camera") {
      handleCameraCapture()
    }
  }, [isOpen, captureMode, handleCameraCapture])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        processDocumentImage(imageData)
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }
  }

  const processDocumentImage = (imageData: string) => {
    setIsProcessing(true)
    setCaptureMode("processing")

    const img = new Image()
    img.onload = () => {
      const canvas = processingCanvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      canvas.width = img.width
      canvas.height = img.height
      setImageDimensions({ width: img.width, height: img.height })
      
      // Draw the original image
      ctx.drawImage(img, 0, 0)
      
      // Get image data for processing
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      
      // Step 1: Convert to grayscale
      const grayscaleData = convertToGrayscale(data, canvas.width, canvas.height)
      
      // Step 2: Apply Gaussian blur for noise reduction
      const blurredData = applyGaussianBlur(grayscaleData, canvas.width, canvas.height)
      
      // Step 3: Apply Canny edge detection
      const edgeData = applyCannyEdgeDetection(blurredData, canvas.width, canvas.height)
      
      // Debug edge detection
      const edgeStats = {
        totalPixels: edgeData.length / 4,
        whitePixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] === 255).length,
        nonZeroPixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] > 0).length
      }
      console.log('Edge detection stats:', edgeStats)
      
      // Step 4: Find document corners
      const detectedCorners = findDocumentCorners(edgeData, canvas.width, canvas.height)
      
      // Additional debugging for corner detection
      console.log('Edge detection completed')
      console.log('Edge data sample:', edgeData.slice(0, 20))
      console.log('Detected corners count:', detectedCorners.length)
      
      // Initialize corners for manual adjustment
      console.log('=== DEBUG INFO ===')
      console.log('Image dimensions:', canvas.width, 'x', canvas.height)
      console.log('Detected corners:', detectedCorners.length, detectedCorners)
      console.log('Edge data stats:', {
        totalPixels: edgeData.length / 4,
        whitePixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] === 255).length,
        nonZeroPixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] > 0).length
      })
      
      // TEMPORARY: Show debug info on screen for iPhone testing
      const debugInfo = {
        imageDimensions: `${canvas.width} x ${canvas.height}`,
        corners: detectedCorners.length,
        edgeStats: {
          totalPixels: edgeData.length / 4,
          whitePixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] === 255).length,
          nonZeroPixels: Array.from(edgeData).filter((_, i) => i % 4 === 0 && edgeData[i] > 0).length
        }
      }
      console.log('DEBUG INFO:', debugInfo)
      
      // Validate corners before setting them
      const validCorners = detectedCorners.filter(c => 
        !isNaN(c.x) && !isNaN(c.y) && 
        c.x >= 0 && c.x <= canvas.width && 
        c.y >= 0 && c.y <= canvas.height
      )
      
      console.log('Original corners:', detectedCorners)
      console.log('Valid corners:', validCorners)
      
      // Ensure we have exactly 4 corners
      let finalCorners = validCorners
      if (validCorners.length !== 4) {
        console.log('Invalid number of corners, using default corners')
        finalCorners = [
          { x: canvas.width * 0.1, y: canvas.height * 0.1 },
          { x: canvas.width * 0.9, y: canvas.height * 0.1 },
          { x: canvas.width * 0.9, y: canvas.height * 0.9 },
          { x: canvas.width * 0.1, y: canvas.height * 0.9 }
        ]
      }
      
      // Step 5: Create debug image
      const debugImage = createDebugImage(img, edgeData, finalCorners, canvas.width, canvas.height)
      
      setCorners(finalCorners.map(corner => ({ x: corner.x, y: corner.y })))
      
      // Step 6: Apply automatic perspective correction
      console.log('Starting automatic correction...')
      
      applyAutomaticCorrection(img, finalCorners, canvas.width, canvas.height).then(processedImageData => {
        console.log('Processing complete, result length:', processedImageData.length)
        
        // Add to pages with processed image
        const newPage: ProcessedPage = {
          id: `page-${Date.now()}-${Math.random()}`,
          imageData,
          processedImageData: processedImageData, // Use actual processed image
          corners: detectedCorners,
          debugImage
        }
        
        setPages(prev => [...prev, newPage])
        setCurrentPageIndex(pages.length)
        setCaptureMode("review")
      }).catch(error => {
        console.error('Processing error:', error)
        // Fallback to original image
        const newPage: ProcessedPage = {
          id: `page-${Date.now()}-${Math.random()}`,
          imageData,
          processedImageData: imageData,
          corners: detectedCorners,
          debugImage
        }
        
        setPages(prev => [...prev, newPage])
        setCurrentPageIndex(pages.length)
        setCaptureMode("review")
      })
    }
    
    img.src = imageData
  }

  // Convert image to grayscale
  const convertToGrayscale = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    const grayscaleData = new Uint8ClampedArray(data.length)
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      grayscaleData[i] = gray
      grayscaleData[i + 1] = gray
      grayscaleData[i + 2] = gray
      grayscaleData[i + 3] = data[i + 3]
    }
    
    return grayscaleData
  }

  // Apply Gaussian blur for noise reduction
  const applyGaussianBlur = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    const kernel = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ]
    const kernelSum = 16
    
    const blurredData = new Uint8ClampedArray(data.length)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        let sum = 0
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIdx = ((y + ky) * width + (x + kx)) * 4
            sum += data[pixelIdx] * kernel[ky + 1][kx + 1]
          }
        }
        
        const blurredValue = Math.round(sum / kernelSum)
        blurredData[idx] = blurredValue
        blurredData[idx + 1] = blurredValue
        blurredData[idx + 2] = blurredValue
        blurredData[idx + 3] = 255
      }
    }
    
    return blurredData
  }

  // Apply Canny edge detection
  const applyCannyEdgeDetection = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    // Step 1: Calculate gradients using Sobel operators
    const gradients = new Array(width * height)
    const directions = new Array(width * height)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x
        const pixelIdx = idx * 4
        
        // Sobel kernels
        const gx = 
          data[pixelIdx - width * 4 - 4] + 2 * data[pixelIdx - 4] + data[pixelIdx + width * 4 - 4] -
          data[pixelIdx - width * 4 + 4] - 2 * data[pixelIdx + 4] - data[pixelIdx + width * 4 + 4]
        
        const gy = 
          data[pixelIdx - width * 4 - 4] + 2 * data[pixelIdx - width * 4] + data[pixelIdx - width * 4 + 4] -
          data[pixelIdx + width * 4 - 4] - 2 * data[pixelIdx + width * 4] - data[pixelIdx + width * 4 + 4]
        
        const magnitude = Math.sqrt(gx * gx + gy * gy)
        const direction = Math.atan2(gy, gx)
        
        gradients[idx] = magnitude
        directions[idx] = direction
      }
    }
    
         // Step 2: Non-maximum suppression
     const suppressed = new Uint8ClampedArray(data.length)
     const highThreshold = 30 // Lower threshold for more sensitive detection
     const lowThreshold = 10  // Lower threshold for more sensitive detection
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x
        const pixelIdx = idx * 4
        const magnitude = gradients[idx]
        const direction = directions[idx]
        
        // Quantize direction to 0, 45, 90, or 135 degrees
        let quantizedDir = Math.round(direction / (Math.PI / 4)) % 4
        if (quantizedDir < 0) quantizedDir += 4
        
        let neighbor1 = 0, neighbor2 = 0
        
        switch (quantizedDir) {
          case 0: // 0 degrees
            neighbor1 = gradients[idx + 1]
            neighbor2 = gradients[idx - 1]
            break
          case 1: // 45 degrees
            neighbor1 = gradients[idx + width + 1]
            neighbor2 = gradients[idx - width - 1]
            break
          case 2: // 90 degrees
            neighbor1 = gradients[idx + width]
            neighbor2 = gradients[idx - width]
            break
          case 3: // 135 degrees
            neighbor1 = gradients[idx + width - 1]
            neighbor2 = gradients[idx - width + 1]
            break
        }
        
        // Suppress if not local maximum
        if (magnitude >= neighbor1 && magnitude >= neighbor2) {
          const value = magnitude > highThreshold ? 255 : (magnitude > lowThreshold ? 128 : 0)
          suppressed[pixelIdx] = value
          suppressed[pixelIdx + 1] = value
          suppressed[pixelIdx + 2] = value
          suppressed[pixelIdx + 3] = 255
        }
      }
    }
    
    // Step 3: Edge tracking by hysteresis
    const result = new Uint8ClampedArray(data.length)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x
        const pixelIdx = idx * 4
        
        if (suppressed[pixelIdx] === 255) {
          // Strong edge - keep it
          result[pixelIdx] = 255
          result[pixelIdx + 1] = 255
          result[pixelIdx + 2] = 255
          result[pixelIdx + 3] = 255
        } else if (suppressed[pixelIdx] === 128) {
          // Weak edge - check if connected to strong edge
          let hasStrongNeighbor = false
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const neighborIdx = ((y + dy) * width + (x + dx)) * 4
              if (suppressed[neighborIdx] === 255) {
                hasStrongNeighbor = true
                break
              }
            }
            if (hasStrongNeighbor) break
          }
          
          if (hasStrongNeighbor) {
            result[pixelIdx] = 255
            result[pixelIdx + 1] = 255
            result[pixelIdx + 2] = 255
            result[pixelIdx + 3] = 255
          }
        }
      }
    }
    
    return result
  }

  // Find document corners using contour detection
  const findDocumentCorners = (edgeData: Uint8ClampedArray, width: number, height: number) => {
    // Find the largest contour (assumed to be the document)
    const contours = findContours(edgeData, width, height)
    
    console.log('Found contours:', contours.length)
    
    if (contours.length === 0) {
      console.log('No contours found, using default corners')
      // If no contours found, use default corners
      return [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.9 },
        { x: width * 0.1, y: height * 0.9 }
      ]
    }
    
    const largestContour = contours.reduce((largest, contour) => 
      contour.length > largest.length ? contour : largest, contours[0]
    )
    
    console.log('Largest contour length:', largestContour.length)
    
    // Approximate the contour to get corners
    const corners = approximateCorners(largestContour, width, height)
    
    console.log('Approximated corners:', corners.length)
    
    // Final validation: ensure corners form a reasonable rectangle
    const minDistance = Math.min(width, height) * 0.05 // Reduced to 5% of image size
    let validCorners = true
    
    for (let i = 0; i < corners.length; i++) {
      for (let j = i + 1; j < corners.length; j++) {
        const distance = Math.sqrt(
          (corners[i].x - corners[j].x) ** 2 + 
          (corners[i].y - corners[j].y) ** 2
        )
        if (distance < minDistance) {
          validCorners = false
          break
        }
      }
      if (!validCorners) break
    }
    
    if (!validCorners) {
      console.log('Final validation failed, using default corners')
      return [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.9 },
        { x: width * 0.1, y: height * 0.9 }
      ]
    }
    
    return corners
  }

  // Create debug image showing edges and detected corners
  const createDebugImage = (img: HTMLImageElement, edgeData: Uint8ClampedArray, corners: { x: number, y: number }[], width: number, height: number): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = width
    canvas.height = height
    
    // Draw original image with transparency
    ctx.globalAlpha = 0.7
    ctx.drawImage(img, 0, 0)
    ctx.globalAlpha = 1.0
    
    // Draw edges in red
    const edgeImageData = ctx.createImageData(width, height)
    edgeImageData.data.set(edgeData)
    ctx.putImageData(edgeImageData, 0, 0)
    
    // Draw detected corners
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 3
    ctx.fillStyle = '#00ff00'
    
    corners.forEach((corner, index) => {
      ctx.beginPath()
      ctx.arc(corner.x, corner.y, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw corner number
      ctx.fillStyle = '#ffffff'
      ctx.font = '16px Arial'
      ctx.fillText(`${index + 1}`, corner.x + 12, corner.y + 4)
      ctx.fillStyle = '#00ff00'
    })
    
    // Draw bounding box
    ctx.strokeStyle = '#ffff00'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(
      Math.min(...corners.map(c => c.x)),
      Math.min(...corners.map(c => c.y)),
      Math.max(...corners.map(c => c.x)) - Math.min(...corners.map(c => c.x)),
      Math.max(...corners.map(c => c.y)) - Math.min(...corners.map(c => c.y))
    )
    ctx.setLineDash([])
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  // Find contours in binary image
  const findContours = (binaryData: Uint8ClampedArray, width: number, height: number) => {
    const visited = new Set<string>()
    const contours: number[][] = []
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const key = `${x},${y}`
        
                                  if (binaryData[idx] === 255 && !visited.has(key)) {
           const contour = traceContour(binaryData, width, height, x, y, visited)
           console.log('Contour found with length:', contour.length)
           if (contour.length > 10) { // Even lower minimum contour size for better detection
             contours.push(contour)
           }
         }
      }
    }
    
    return contours
  }

  // Trace a single contour
  const traceContour = (binaryData: Uint8ClampedArray, width: number, height: number, startX: number, startY: number, visited: Set<string>) => {
    const contour: number[] = []
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    
    let x = startX
    let y = startY
    
    do {
      contour.push(x, y)
      visited.add(`${x},${y}`)
      
      let found = false
      for (const [dx, dy] of directions) {
        const nx = x + dx
        const ny = y + dy
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = (ny * width + nx) * 4
          if (binaryData[idx] === 255 && !visited.has(`${nx},${ny}`)) {
            x = nx
            y = ny
            found = true
            break
          }
        }
      }
      
      if (!found) break
    } while (x !== startX || y !== startY)
    
    return contour
  }

  // Approximate corners from contour
  const approximateCorners = (contour: number[], width: number, height: number) => {
    if (contour.length < 8) {
      // Fallback to default corners if contour is too small
      return [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.9 },
        { x: width * 0.1, y: height * 0.9 }
      ]
    }
    
    // Find the four points furthest from the center
    const centerX = width / 2
    const centerY = height / 2
    const distances = contour.map((x, i) => {
      if (i % 2 === 0) {
        const y = contour[i + 1]
        return { x, y, distance: Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) }
      }
      return null
    }).filter(Boolean)
    
    // Sort by distance and take the four furthest points
    distances.sort((a, b) => b!.distance - a!.distance)
    const corners = distances.slice(0, 4).map(p => ({ x: p!.x, y: p!.y }))
    
    // Ensure we have exactly 4 corners
    while (corners.length < 4) {
      corners.push({ x: width * 0.5, y: height * 0.5 })
    }
    
    // Validate and clamp corner coordinates
    const validatedCorners = corners.map(corner => ({
      x: Math.max(0, Math.min(width, corner.x)),
      y: Math.max(0, Math.min(height, corner.y))
    }))
    
    // Check if corners are too close together (indicating poor detection)
    const minDistance = Math.min(width, height) * 0.03 // Reduced to 3% of image size
    let cornersTooClose = false
    
    for (let i = 0; i < validatedCorners.length; i++) {
      for (let j = i + 1; j < validatedCorners.length; j++) {
        const distance = Math.sqrt(
          (validatedCorners[i].x - validatedCorners[j].x) ** 2 + 
          (validatedCorners[i].y - validatedCorners[j].y) ** 2
        )
        if (distance < minDistance) {
          cornersTooClose = true
          break
        }
      }
      if (cornersTooClose) break
    }
    
    // If corners are too close, use default corners
    if (cornersTooClose) {
      console.log('Corners too close together, using default corners')
      return [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.9 },
        { x: width * 0.1, y: height * 0.9 }
      ]
    }
    
    // Sort corners in clockwise order starting from top-left
    validatedCorners.sort((a, b) => {
      if (a.y < centerY && b.y >= centerY) return -1
      if (a.y >= centerY && b.y < centerY) return 1
      return a.x - b.x
    })
    
    console.log('Validated corners:', validatedCorners)
    return validatedCorners
  }



  // Manual corner adjustment handlers
  const handleCornerMouseDown = (index: number) => {
    setCorners(prev => prev.map((corner, i) => 
      i === index ? { ...corner, isDragging: true } : corner
    ))
  }

  const handleCornerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    
    // Convert to image coordinates
    const imageX = (x / rect.width) * imageDimensions.width
    const imageY = (y / rect.height) * imageDimensions.height
    
    setCorners(prev => prev.map(corner => 
      corner.isDragging ? { x: imageX, y: imageY, isDragging: true } : corner
    ))
  }

  const handleCornerMouseUp = () => {
    setCorners(prev => prev.map(corner => ({ ...corner, isDragging: false })))
  }

       // Apply automatic perspective correction
  const applyAutomaticCorrection = async (img: HTMLImageElement, corners: { x: number, y: number }[], width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = processingCanvasRef.current
      if (!canvas) {
        resolve(img.src) // Fallback to original image
        return
      }
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(img.src) // Fallback to original image
        return
      }
      
      // Validate corners - if they're invalid, return original image
      const validCorners = corners.filter(c => 
        !isNaN(c.x) && !isNaN(c.y) && 
        c.x >= 0 && c.x <= width && 
        c.y >= 0 && c.y <= height
      )
      
      if (validCorners.length !== 4) {
        console.log('Invalid corners detected, using original image')
        resolve(img.src)
        return
      }
      
      // Calculate destination corners (rectangle)
      const minX = Math.min(...validCorners.map(c => c.x))
      const maxX = Math.max(...validCorners.map(c => c.x))
      const minY = Math.min(...validCorners.map(c => c.y))
      const maxY = Math.max(...validCorners.map(c => c.y))
      
      const docWidth = maxX - minX
      const docHeight = maxY - minY
      
             // Ensure minimum size (at least 20% of image dimensions)
       const minWidth = width * 0.2
       const minHeight = height * 0.2
       if (docWidth < minWidth || docHeight < minHeight) {
         console.log('Document too small, using original image')
         console.log(`Required: ${minWidth}x${minHeight}, Got: ${docWidth}x${docHeight}`)
         resolve(img.src)
         return
       }
      
      // Set canvas size to document size
      canvas.width = docWidth
      canvas.height = docHeight
      
      // Define destination corners (perfect rectangle)
      const destCorners = [
        { x: 0, y: 0 },
        { x: docWidth, y: 0 },
        { x: docWidth, y: docHeight },
        { x: 0, y: docHeight }
      ]
      
      try {
        // Use a simpler approach: calculate the bounding box and apply basic transformation
        const minX = Math.min(...validCorners.map(c => c.x))
        const maxX = Math.max(...validCorners.map(c => c.x))
        const minY = Math.min(...validCorners.map(c => c.y))
        const maxY = Math.max(...validCorners.map(c => c.y))
        
        // Calculate the center of the document
        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2
        
        // Calculate the average distance from center to corners
        const avgDistance = validCorners.reduce((sum, corner) => {
          return sum + Math.sqrt((corner.x - centerX) ** 2 + (corner.y - centerY) ** 2)
        }, 0) / validCorners.length
        
        // Use a simple scaling approach instead of complex homography
        const scaleX = docWidth / (maxX - minX)
        const scaleY = docHeight / (maxY - minY)
        
        // Validate scaling factors
        if (!isFinite(scaleX) || !isFinite(scaleY) || scaleX <= 0 || scaleY <= 0) {
          console.log('Invalid scaling factors, using original image')
          resolve(img.src)
          return
        }
        
        ctx.save()
        ctx.translate(-minX * scaleX, -minY * scaleY)
        ctx.scale(scaleX, scaleY)
        ctx.drawImage(img, 0, 0)
        ctx.restore()
        
        // Enhance the corrected image
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        
        // Enhance contrast and brightness
        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128))     // Red
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.3 + 128)) // Green
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.3 + 128)) // Blue
          
          // Slight brightness adjustment
          data[i] = Math.min(255, data[i] + 10)
          data[i + 1] = Math.min(255, data[i + 1] + 10)
          data[i + 2] = Math.min(255, data[i + 2] + 10)
        }
        
        ctx.putImageData(imgData, 0, 0)
        
        const processedImageData = canvas.toDataURL('image/jpeg', 0.8)
        console.log('Processed image data length:', processedImageData.length)
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height)
        console.log('Document bounds:', { minX, maxX, minY, maxY, docWidth, docHeight })
        resolve(processedImageData)
      } catch (error) {
        console.error('Error in perspective correction:', error)
        console.log('Falling back to original image')
        resolve(img.src) // Fallback to original image
      }
    })
  }

  // Apply perspective correction manually
  const applyPerspectiveCorrection = () => {
    if (corners.length !== 4) return
    
    const img = new Image()
    img.onload = () => {
      const canvas = processingCanvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Calculate destination corners (rectangle)
      const minX = Math.min(...corners.map(c => c.x))
      const maxX = Math.max(...corners.map(c => c.x))
      const minY = Math.min(...corners.map(c => c.y))
      const maxY = Math.max(...corners.map(c => c.y))
      
      const docWidth = maxX - minX
      const docHeight = maxY - minY
      
      // Set canvas size to document size
      canvas.width = docWidth
      canvas.height = docHeight
      
      // Define destination corners (perfect rectangle)
      const destCorners = [
        { x: 0, y: 0 },
        { x: docWidth, y: 0 },
        { x: docWidth, y: docHeight },
        { x: 0, y: docHeight }
      ]
      
      // Calculate homography matrix
      const matrix = calculateHomographyMatrix(corners, destCorners)
      
      // Apply perspective transform using the full homography matrix
      ctx.save()
      ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
      ctx.drawImage(img, 0, 0)
      ctx.restore()
      
      // Enhance the corrected image
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      
      // Enhance contrast and brightness
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128))     // Red
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.3 + 128)) // Green
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.3 + 128)) // Blue
        
        // Slight brightness adjustment
        data[i] = Math.min(255, data[i] + 10)
        data[i + 1] = Math.min(255, data[i + 1] + 10)
        data[i + 2] = Math.min(255, data[i + 2] + 10)
      }
      
      ctx.putImageData(imgData, 0, 0)
      
      const processedImageData = canvas.toDataURL('image/jpeg', 0.8)
      
      // Update the current page with processed image
      setPages(prev => prev.map((page, i) => 
        i === currentPageIndex ? { ...page, processedImageData } : page
      ))
      
      setCaptureMode("review")
    }
    
    img.src = pages[currentPageIndex].imageData
  }

  // Calculate homography matrix for perspective correction
  const calculateHomographyMatrix = (src: { x: number, y: number }[], dest: { x: number, y: number }[]) => {
    // More accurate perspective transform calculation
    const A = []
    const b = []
    
    for (let i = 0; i < 4; i++) {
      const x = src[i].x
      const y = src[i].y
      const u = dest[i].x
      const v = dest[i].y
      
      A.push([x, y, 1, 0, 0, 0, -u*x, -u*y])
      A.push([0, 0, 0, x, y, 1, -v*x, -v*y])
      b.push(u)
      b.push(v)
    }
    
    // Solve the system using least squares
    const matrix = solveLinearSystem(A, b)
    
    return [
      matrix[0], matrix[1], matrix[2],
      matrix[3], matrix[4], matrix[5],
      matrix[6], matrix[7]
    ]
  }

  // Solve linear system using Gaussian elimination
  const solveLinearSystem = (A: number[][], b: number[]) => {
    const n = A.length
    const augmented = A.map((row, i) => [...row, b[i]])
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = j
        }
      }
      
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]
      
      for (let j = i + 1; j < n; j++) {
        const factor = augmented[j][i] / augmented[i][i]
        for (let k = i; k <= n; k++) {
          augmented[j][k] -= factor * augmented[i][k]
        }
      }
    }
    
    // Back substitution
    const x = new Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0
      for (let j = i + 1; j < n; j++) {
        sum += augmented[i][j] * x[j]
      }
      x[i] = (augmented[i][n] - sum) / augmented[i][i]
    }
    
    return x
  }

  const retakePhoto = () => {
    setPages(prev => prev.slice(0, -1))
    setCurrentPageIndex(Math.max(0, pages.length - 2))
    setCaptureMode("camera")
    handleCameraCapture()
  }

  const addAnotherPage = () => {
    setCaptureMode("camera")
    handleCameraCapture()
  }

  const finishCapture = () => {
    if (pages.length === 0) return
    
    if (!documentName.trim()) {
      setShowNameInput(true)
      return
    }
    
    generateFiles()
  }

  const generateFiles = async () => {
    try {
      // Convert processed images to files
      const files: File[] = []
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        
        // Convert data URL to blob
        const response = await fetch(page.processedImageData)
        const blob = await response.blob()
        
        // Create file with appropriate name
        const fileName = pages.length === 1 
          ? `${documentName}.jpg`
          : `${documentName}_page_${i + 1}.jpg`
        
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        files.push(file)
      }
      
      onDocumentComplete(files, documentName)
      onClose()
    } catch (error) {
      console.error("Error generating files:", error)
      alert("Error generating files. Please try again.")
    }
  }

  const handleClose = () => {
    // Stop camera stream if active
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setCaptureMode("camera")
    setPages([])
    setCurrentPageIndex(0)
    setDocumentName("")
    setShowNameInput(false)
    onClose()
  }

  return (
         <Dialog open={isOpen} onOpenChange={handleClose}>
       <DialogContent className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle>Capture Document</DialogTitle>
        </DialogHeader>

        {captureMode === "camera" && (
          <div className="space-y-4">
            <div className="relative">
                             <video
                 ref={videoRef}
                 autoPlay
                 playsInline
                 className="w-full h-96 sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-lg object-cover"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-72 h-96 sm:w-80 sm:h-[400px] md:w-96 md:h-[500px] lg:w-[500px] lg:h-[600px] xl:w-[600px] xl:h-[700px] border-2 border-white rounded-lg opacity-50"></div>
               </div>
            </div>
            
                         <div className="text-center space-y-3">
               <p className="text-sm text-muted-foreground px-2">
                 Position your document within the frame. For best results:
               </p>
               <ul className="text-xs text-muted-foreground space-y-1 px-4">
                 <li>• Use a dark background (table, desk, etc.) for contrast</li>
                 <li>• Ensure good lighting on the document</li>
                 <li>• Keep the entire document visible in the frame</li>
                 <li>• Hold the camera steady and parallel to the document</li>
               </ul>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Page
                </Button>
                <Button 
                  onClick={handleClose} 
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {captureMode === "processing" && (
          <div className="space-y-4 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p>Processing document...</p>
            <p className="text-sm text-muted-foreground px-4">
              Detecting document edges and finding corners for perspective correction
            </p>
          </div>
        )}

        {captureMode === "adjust" && pages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Adjust Document Corners</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDebugMode(!debugMode)}
                  className="text-xs"
                >
                  {debugMode ? "Hide Debug" : "Show Debug"}
                </Button>
              </div>
            </div>
            
                         <div className="relative">
                                <img
                   src={debugMode ? pages[currentPageIndex].debugImage : pages[currentPageIndex].imageData}
                   alt="Adjust corners"
                   className="w-full h-96 sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-lg border object-contain"
                   onMouseMove={handleCornerMouseMove}
                   onMouseUp={handleCornerMouseUp}
                   onTouchMove={(e) => {
                     const touch = e.touches[0]
                     const rect = e.currentTarget.getBoundingClientRect()
                     const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left))
                     const y = Math.max(0, Math.min(rect.height, touch.clientY - rect.top))
                     
                     setCorners(prev => prev.map(corner => 
                       corner.isDragging ? { x, y, isDragging: true } : corner
                     ))
                   }}
                   onTouchEnd={handleCornerMouseUp}
                 />
               
                               {/* Bounding box outline */}
                {corners.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg
                      className="w-full h-full"
                      viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {corners.length === 4 ? (
                        <polygon
                          points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}`}
                          fill="none"
                          stroke="#00ff00"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                        />
                      ) : (
                        // Draw individual lines connecting corners if we don't have exactly 4
                        corners.map((corner, index) => {
                          const nextCorner = corners[(index + 1) % corners.length]
                          return (
                            <line
                              key={index}
                              x1={corner.x}
                              y1={corner.y}
                              x2={nextCorner.x}
                              y2={nextCorner.y}
                              stroke="#00ff00"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                            />
                          )
                        })
                      )}
                    </svg>
                  </div>
                )}
               
                                {/* Draggable corner markers */}
                 {corners.map((corner, index) => (
                   <div
                     key={index}
                     className="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full cursor-move transform -translate-x-3 -translate-y-3 shadow-lg hover:bg-green-400 transition-colors"
                     style={{ 
                       left: `${(corner.x / imageDimensions.width) * 100}%`, 
                       top: `${(corner.y / imageDimensions.height) * 100}%` 
                     }}
                     onMouseDown={() => handleCornerMouseDown(index)}
                     onTouchStart={() => handleCornerMouseDown(index)}
                   >
                     <span className="absolute -top-8 -left-2 text-xs bg-white px-1 rounded text-black font-bold">
                       {index + 1}
                     </span>
                   </div>
                 ))}
             </div>
            
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {debugMode 
                  ? "Debug view: Red lines show detected edges, green circles are corners"
                  : "Drag the green corner markers to adjust the document boundaries"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={applyPerspectiveCorrection} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Apply Correction
                </Button>
                <Button onClick={retakePhoto} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              </div>
            </div>
          </div>
        )}

        {captureMode === "review" && pages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Review Processed Page</h3>
              <Badge variant="secondary">
                {pages.length} page{pages.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Automatic processing complete. How does this look?
                </p>
                
                                 {/* TEMPORARY: Debug info display for iPhone testing */}
                 <div className="bg-gray-100 p-3 rounded text-xs text-left">
                   <p className="font-bold">Debug Info:</p>
                   <p>Image: {pages[currentPageIndex]?.corners?.length || 0} corners detected</p>
                   <p>Processing: {pages[currentPageIndex]?.processedImageData?.length > 1000 ? 'Success' : 'Failed'}</p>
                   <p>Data URL length: {pages[currentPageIndex]?.processedImageData?.length || 0}</p>
                   <p>Original vs Processed: {pages[currentPageIndex]?.imageData === pages[currentPageIndex]?.processedImageData ? 'Same (No Processing)' : 'Different (Processed)'}</p>
                   <p>Corner positions: {pages[currentPageIndex]?.corners?.map(c => `(${Math.round(c.x)},${Math.round(c.y)})`).join(', ') || 'None'}</p>
                 </div>
              </div>
             
            <div className="relative">
              <img
                src={pages[currentPageIndex].processedImageData}
                alt={`Page ${currentPageIndex + 1}`}
                className="w-full h-96 sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-lg border object-cover"
              />
               
               {pages.length > 1 && (
                 <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                     disabled={currentPageIndex === 0}
                     className="bg-white/80"
                   >
                     <ArrowLeft className="h-4 w-4" />
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
                     disabled={currentPageIndex === pages.length - 1}
                     className="bg-white/80"
                   >
                     <ArrowRight className="h-4 w-4" />
                   </Button>
                 </div>
               )}
             </div>
             
             <div className="flex flex-col sm:flex-row gap-2 justify-center">
               <Button onClick={retakePhoto} variant="outline" className="flex-1">
                 <RotateCcw className="h-4 w-4 mr-2" />
                 Retake
               </Button>
               <Button 
                 onClick={() => setCaptureMode("adjust")} 
                 variant="outline" 
                 className="flex-1"
               >
                 <Check className="h-4 w-4 mr-2" />
                 Adjust Manually
               </Button>
               <Button onClick={addAnotherPage} className="flex-1">
                 <Camera className="h-4 w-4 mr-2" />
                 Add Another Page
               </Button>
               <Button onClick={finishCapture} className="bg-green-600 hover:bg-green-700 flex-1">
                 <Check className="h-4 w-4 mr-2" />
                 Continue
               </Button>
             </div>
           </div>
         )}

        {showNameInput && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Name</label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name..."
                className="w-full p-2 border rounded-md"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button onClick={() => setShowNameInput(false)} variant="outline" className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button onClick={generateFiles} disabled={!documentName.trim()} className="flex-1 sm:flex-none">
                <Upload className="h-4 w-4 mr-2" />
                Generate Files
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={processingCanvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}