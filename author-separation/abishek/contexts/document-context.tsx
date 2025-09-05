"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Folder {
  id: string
  name: string
  childId: string
  color?: string
  icon?: string
  createdAt: Date
  documentCount: number
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: "vaccination" | "prescription" | "lab-result" | "visit-summary" | "insurance" | "other"
  tags: string[]
  childId: string
  folderId: string | null // null = unassigned
  url: string
  content?: string
  aiSummary?: string
  keyHighlights?: string[]
  deletedAt?: Date // When document was moved to deleted folder
  originalFolderId?: string | null // Original folder before deletion
}

interface DocumentContextType {
  documents: Document[]
  folders: Folder[]
  addDocument: (document: Omit<Document, "id" | "uploadDate">) => Document
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  softDeleteDocument: (id: string) => void
  recoverDocument: (id: string, targetFolderId: string | null) => void
  getDocumentsByChild: (childId: string) => Document[]
  getDocumentsByFolder: (folderId: string | null, childId?: string) => Document[]
  getDeletedDocuments: (childId: string) => Document[]
  addFolder: (folder: Omit<Folder, "id" | "createdAt" | "documentCount">) => Folder
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  getFoldersByChild: (childId: string) => Folder[]
  moveDocumentToFolder: (documentId: string, folderId: string | null) => void
  getUnassignedDocuments: (childId: string) => Document[]
  getSuggestedFolders: (document: Document) => Folder[]
  cleanupExpiredDocuments: () => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "Emma_Vaccination_Record_2023.pdf",
      type: "application/pdf",
      size: 1.2 * 1024 * 1024,
      uploadDate: new Date("2023-10-26"),
      category: "vaccination",
      tags: ["Vaccination", "Immunization", "2023"],
      childId: "child-1",
      folderId: null,
      url: "/placeholder.svg?height=800&width=600&text=PDF+Document",
      content:
        "This is a sample vaccination record for Emma Johnson. The document shows all required immunizations are up to date according to CDC guidelines. Recent vaccinations include: Flu shot (October 2023), MMR booster (September 2023), and COVID-19 vaccine (August 2023). Next scheduled vaccination: Annual flu shot due October 2024. No adverse reactions reported. All vaccines administered at Pediatric Health Center by Dr. Sarah Johnson, MD.",
      aiSummary:
        "This document summarizes Emma Johnson's vaccination records for the year 2023, including routine immunizations and booster shots.",
      keyHighlights: ["Flu shot administered Oct 2023", "Measles booster due Jan 2024"],
    },
    {
      id: "doc-2",
      name: "Liam_Lab_Results_Blood_Panel.jpg",
      type: "image/jpeg",
      size: 0.8 * 1024 * 1024,
      uploadDate: new Date("2023-11-10"),
      category: "lab-result",
      tags: ["Lab Result", "Blood Test", "Liam"],
      childId: "child-2",
      folderId: null,
      url: "/placeholder.svg?height=600&width=800&text=Lab+Results+Image",
      aiSummary:
        "This image contains Liam Johnson's recent blood panel results, showing normal ranges for most markers. A slight elevation in iron levels was noted.",
      keyHighlights: ["Iron levels slightly elevated", "Cholesterol within normal range"],
    },
    {
      id: "doc-3",
      name: "Emma_Prescription_Antibiotics.doc",
      type: "application/msword",
      size: 0.3 * 1024 * 1024,
      uploadDate: new Date("2023-12-01"),
      category: "prescription",
      tags: ["Prescription", "Antibiotics", "Emma"],
      childId: "child-1",
      folderId: null,
      url: "/placeholder.svg?height=600&width=800&text=Document",
      content:
        "PRESCRIPTION\n\nPatient: Emma Johnson\nDOB: 03/15/2015\nDate: December 1, 2023\n\nRx: Amoxicillin 250mg\nSig: Take 1 capsule by mouth three times daily with food\nQuantity: 21 capsules\nRefills: 0\n\nDiagnosis: Bacterial sinusitis\n\nInstructions:\n- Take with food to reduce stomach upset\n- Complete the full 7-day course even if symptoms improve\n- Contact office if no improvement in 48-72 hours\n- Common side effects may include nausea, diarrhea, or rash\n\nPrescribed by: Dr. Michael Chen, MD\nPediatric Associates\nPhone: (555) 123-4567",
      aiSummary:
        "Prescription for Emma Johnson for a 7-day course of Amoxicillin, prescribed for a bacterial infection. Dosage instructions are provided.",
      keyHighlights: ["Amoxicillin 250mg, 3 times daily", "Complete full course of medication"],
    },
    {
      id: "doc-4",
      name: "Emma_Growth_Chart_2023.pdf",
      type: "application/pdf",
      size: 0.5 * 1024 * 1024,
      uploadDate: new Date("2023-09-15"),
      category: "visit-summary",
      tags: ["Growth", "Chart", "Emma"],
      childId: "child-1",
      folderId: null,
      url: "/placeholder.svg?height=800&width=600&text=Growth+Chart+PDF",
      content:
        "PEDIATRIC GROWTH CHART\n\nPatient: Emma Johnson\nDOB: March 15, 2015\nAge: 8 years, 6 months\n\nHeight Measurements:\nJan 2023: 48 inches (50th percentile)\nMar 2023: 48.5 inches (50th percentile)\nJun 2023: 49.2 inches (52nd percentile)\nSep 2023: 50.1 inches (53rd percentile)\n\nWeight Measurements:\nJan 2023: 52 lbs (48th percentile)\nMar 2023: 54 lbs (50th percentile)\nJun 2023: 56 lbs (51st percentile)\nSep 2023: 58 lbs (52nd percentile)\n\nAssessment: Emma is showing consistent, healthy growth patterns. Height and weight are tracking appropriately for her age group, maintaining steady percentiles. No concerns noted.\n\nNext appointment: March 2024 for annual check-up.",
      aiSummary:
        "Emma Johnson's growth chart for 2023, showing consistent growth in height and weight, tracking along the 50th percentile.",
      keyHighlights: ["Consistent growth", "50th percentile for age"],
    },
  ])

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "all-documents",
      name: "All Documents",
      childId: "child-1",
      color: "gray",
      icon: "grid",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "folder-1",
      name: "Medical Records",
      childId: "child-1",
      color: "blue",
      icon: "file-medical",
      createdAt: new Date("2023-10-01"),
      documentCount: 2,
    },
    {
      id: "folder-2", 
      name: "Vaccinations",
      childId: "child-1",
      color: "green",
      icon: "syringe",
      createdAt: new Date("2023-10-15"),
      documentCount: 1,
    },
    {
      id: "folder-3",
      name: "Lab Results",
      childId: "child-2", 
      color: "purple",
      icon: "flask",
      createdAt: new Date("2023-11-01"),
      documentCount: 1,
    },
    {
      id: "folder-4",
      name: "Medications",
      childId: "child-1",
      color: "orange",
      icon: "pill",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "folder-5",
      name: "Lab Results & Tests",
      childId: "child-1",
      color: "indigo",
      icon: "beaker",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "folder-6",
      name: "Appointments & Visits",
      childId: "child-1",
      color: "teal",
      icon: "hospital",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "folder-7",
      name: "Insurance & Billing",
      childId: "child-1",
      color: "yellow",
      icon: "credit-card",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "folder-8",
      name: "School Documents",
      childId: "child-1",
      color: "pink",
      icon: "book",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
    {
      id: "deleted-folder",
      name: "Deleted",
      childId: "child-1",
      color: "red",
      icon: "trash-2",
      createdAt: new Date("2023-10-01"),
      documentCount: 0,
    },
  ])

  const addDocument = (document: Omit<Document, "id" | "uploadDate">) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date(),
    }
    setDocuments((prev) => [...prev, newDocument])
    
    // Update folder document count if document is assigned to a folder
    if (newDocument.folderId) {
      setFolders((prev) => 
        prev.map((folder) => 
          folder.id === newDocument.folderId 
            ? { ...folder, documentCount: folder.documentCount + 1 }
            : folder
        )
      )
    }
    
    return newDocument
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
  }

  const deleteDocument = (id: string) => {
    const documentToDelete = documents.find(doc => doc.id === id)
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    
    // Update folder document count if document was in a folder
    if (documentToDelete?.folderId) {
      setFolders((prev) => 
        prev.map((folder) => 
          folder.id === documentToDelete.folderId 
            ? { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
            : folder
        )
      )
    }
  }

  const softDeleteDocument = (id: string) => {
    const documentToDelete = documents.find(doc => doc.id === id)
    if (!documentToDelete) return
    
    setDocuments((prev) => 
      prev.map((doc) => 
        doc.id === id 
          ? { 
              ...doc, 
              deletedAt: new Date(), 
              originalFolderId: doc.folderId,
              folderId: "deleted-folder" // Move to deleted folder
            } 
          : doc
      )
    )
    
    // Update folder document counts
    setFolders((prev) => 
      prev.map((folder) => {
        if (folder.id === "deleted-folder") {
          // Increment deleted folder count
          return { ...folder, documentCount: folder.documentCount + 1 }
        } else if (documentToDelete.folderId && folder.id === documentToDelete.folderId) {
          // Decrement original folder count
          return { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
        }
        return folder
      })
    )
  }

  const recoverDocument = (id: string, targetFolderId: string | null) => {
    const documentToRecover = documents.find(doc => doc.id === id)
    if (!documentToRecover) return
    
    // Check if original folder still exists, if not use targetFolderId or unassigned
    let finalFolderId = targetFolderId
    if (!targetFolderId && documentToRecover.originalFolderId) {
      const originalFolderExists = folders.find(folder => folder.id === documentToRecover.originalFolderId)
      finalFolderId = originalFolderExists ? documentToRecover.originalFolderId : null
    }
    
    setDocuments((prev) => 
      prev.map((doc) => {
        if (doc.id === id) {
          const recoveredDoc = { 
            ...doc, 
            deletedAt: undefined, 
            originalFolderId: undefined,
            folderId: finalFolderId 
          }
          return recoveredDoc
        }
        return doc
      })
    )
    
    // Update folder document counts
    setFolders((prev) => 
      prev.map((folder) => {
        if (folder.id === "deleted-folder") {
          // Decrement deleted folder count
          return { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
        } else if (finalFolderId && folder.id === finalFolderId) {
          // Increment target folder count
          return { ...folder, documentCount: folder.documentCount + 1 }
        }
        return folder
      })
    )
  }

  const getDocumentsByChild = (childId: string) => {
    return documents.filter((doc) => doc.childId === childId)
  }

  const getDocumentsByFolder = (folderId: string | null, childId?: string) => {
    if (folderId === "all-documents") {
      // For "All Documents" folder, return all non-deleted documents for the specified child
      return documents.filter((doc) => doc.childId === childId && doc.deletedAt === undefined)
    }
    return documents.filter((doc) => doc.folderId === folderId && doc.deletedAt === undefined)
  }

  const getDeletedDocuments = (childId: string) => {
    return documents.filter((doc) => doc.childId === childId && doc.deletedAt !== undefined)
  }

  const addFolder = (folder: Omit<Folder, "id" | "createdAt" | "documentCount">) => {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      documentCount: 0,
    }
    setFolders((prev) => [...prev, newFolder])
    return newFolder
  }

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    // Prevent updates to special folders
    if (id === "all-documents" || id === "deleted-folder") {
      return
    }
    
    setFolders((prev) => prev.map((folder) => (folder.id === id ? { ...folder, ...updates } : folder)))
  }

  const deleteFolder = (id: string) => {
    // Prevent deletion of special folders
    if (id === "all-documents" || id === "deleted-folder") {
      return
    }
    
    // Move all documents in this folder to unassigned
    setDocuments((prev) => 
      prev.map((doc) => doc.folderId === id ? { ...doc, folderId: null } : doc)
    )
    // Remove the folder
    setFolders((prev) => prev.filter((folder) => folder.id !== id))
  }

  const getFoldersByChild = (childId: string) => {
    const childFolders = folders.filter((folder) => folder.childId === childId)
    
    // Update "All Documents" folder count dynamically
    const allDocumentsCount = documents.filter(
      (doc) => doc.childId === childId && doc.deletedAt === undefined
    ).length
    
    const updatedFolders = childFolders.map((folder) => {
      if (folder.id === "all-documents") {
        return { ...folder, documentCount: allDocumentsCount }
      }
      return folder
    })
    
    // Sort folders: "All Documents" first, "Deleted" last
    return updatedFolders.sort((a, b) => {
      // "All Documents" folder must ALWAYS be first, no matter what
      if (a.id === "all-documents") return -1
      if (b.id === "all-documents") return 1
      
      // "Deleted" folder must ALWAYS be last
      if (a.id === "deleted-folder") return 1
      if (b.id === "deleted-folder") return -1
      
      // All other folders maintain their relative order
      return 0
    })
  }

  const moveDocumentToFolder = (documentId: string, folderId: string | null) => {
    const document = documents.find(doc => doc.id === documentId)
    if (!document) return
    
    const oldFolderId = document.folderId
    const newFolderId = folderId
    
    // Update document
    setDocuments((prev) => 
      prev.map((doc) => doc.id === documentId ? { ...doc, folderId } : doc)
    )
    
    // Update folder document counts
    setFolders((prev) => 
      prev.map((folder) => {
        if (folder.id === oldFolderId) {
          return { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
        }
        if (folder.id === newFolderId) {
          return { ...folder, documentCount: folder.documentCount + 1 }
        }
        return folder
      })
    )
  }

  const getUnassignedDocuments = (childId: string) => {
    return documents.filter((doc) => doc.childId === childId && doc.folderId === null && doc.deletedAt === undefined)
  }

  const getSuggestedFolders = (document: Document): Folder[] => {
    const childFolders = getFoldersByChild(document.childId)
    
    // Simple suggestion logic based on document category and tags
    const suggestions = childFolders.filter((folder) => {
      const folderName = folder.name.toLowerCase()
      const docCategory = document.category.toLowerCase()
      const docTags = document.tags.map(tag => tag.toLowerCase())
      
      // Check if folder name matches document category
      if (folderName.includes(docCategory) || docCategory.includes(folderName)) {
        return true
      }
      
      // Check if folder name matches any document tags
      if (docTags.some(tag => folderName.includes(tag) || tag.includes(folderName))) {
        return true
      }
      
      return false
    })
    
    return suggestions.slice(0, 3) // Return top 3 suggestions
  }

  const cleanupExpiredDocuments = () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    setDocuments((prev) => 
      prev.filter((doc) => {
        if (doc.deletedAt && new Date(doc.deletedAt) < thirtyDaysAgo) {
          return false // Remove the document permanently
        }
        return true // Keep the document
      })
    )
  }

  // Run cleanup daily
  useEffect(() => {
    const runCleanup = () => {
      cleanupExpiredDocuments()
    }

    // Run cleanup on mount
    runCleanup()

    // Set up daily cleanup interval
    const interval = setInterval(runCleanup, 24 * 60 * 60 * 1000) // 24 hours

    return () => clearInterval(interval)
  }, [])

  const value = {
    documents,
    folders,
    addDocument,
    updateDocument,
    deleteDocument,
    softDeleteDocument,
    recoverDocument,
    getDocumentsByChild,
    getDocumentsByFolder,
    getDeletedDocuments,
    addFolder,
    updateFolder,
    deleteFolder,
    getFoldersByChild,
    moveDocumentToFolder,
    getUnassignedDocuments,
    getSuggestedFolders,
    cleanupExpiredDocuments,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}
