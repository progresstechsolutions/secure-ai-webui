export interface EncryptedData {
  data: string // Base64 encoded encrypted data
  iv: string // Initialization vector
  salt: string // Salt for key derivation
  timestamp: number
}

export interface PrivacySettings {
  enableEncryption: boolean
  useOnDeviceStorage: boolean
  autoDeleteAfterDays?: number
  requireBiometric?: boolean
  shareWithHealthcareProviders: boolean
  anonymizeExports: boolean
}

export class PrivacyEncryptionService {
  private static readonly ALGORITHM = "AES-GCM"
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12
  private static readonly SALT_LENGTH = 16
  private static readonly ITERATIONS = 100000

  private static masterKey: CryptoKey | null = null
  private static isInitialized = false

  // Initialize the encryption service
  static async initialize(userPassphrase?: string): Promise<boolean> {
    try {
      if (typeof window === "undefined" || !window.crypto?.subtle) {
        console.warn("Web Crypto API not available - encryption disabled")
        return false
      }

      // Generate or derive master key
      if (userPassphrase) {
        this.masterKey = await this.deriveKeyFromPassphrase(userPassphrase)
      } else {
        // Check if we have a stored key
        const storedKey = await this.getStoredKey()
        if (storedKey) {
          this.masterKey = storedKey
        } else {
          // Generate new key and store it
          this.masterKey = await this.generateMasterKey()
          await this.storeKey(this.masterKey)
        }
      }

      this.isInitialized = true
      return true
    } catch (error) {
      console.error("Failed to initialize encryption:", error)
      return false
    }
  }

  // Generate a new master key
  private static async generateMasterKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true, // extractable
      ["encrypt", "decrypt"],
    )
  }

  // Derive key from user passphrase
  private static async deriveKeyFromPassphrase(passphrase: string, salt?: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passphraseKey = await window.crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, [
      "deriveKey",
    ])

    const actualSalt = salt || window.crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))

    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: actualSalt,
        iterations: this.ITERATIONS,
        hash: "SHA-256",
      },
      passphraseKey,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      false, // not extractable
      ["encrypt", "decrypt"],
    )
  }

  // Store master key in IndexedDB (encrypted with device-specific data)
  private static async storeKey(key: CryptoKey): Promise<void> {
    try {
      const exported = await window.crypto.subtle.exportKey("raw", key)
      const keyData = new Uint8Array(exported)

      // Store in IndexedDB with additional device binding
      const request = indexedDB.open("CaregeneSecurity", 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys")
        }
      }

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          const transaction = db.transaction(["keys"], "readwrite")
          const store = transaction.objectStore("keys")

          store.put(
            {
              keyData: Array.from(keyData),
              timestamp: Date.now(),
              deviceFingerprint: this.getDeviceFingerprint(),
            },
            "masterKey",
          )

          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to store key:", error)
      throw error
    }
  }

  // Retrieve stored master key
  private static async getStoredKey(): Promise<CryptoKey | null> {
    try {
      const request = indexedDB.open("CaregeneSecurity", 1)

      return new Promise((resolve, reject) => {
        request.onsuccess = async (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          if (!db.objectStoreNames.contains("keys")) {
            resolve(null)
            return
          }

          const transaction = db.transaction(["keys"], "readonly")
          const store = transaction.objectStore("keys")
          const getRequest = store.get("masterKey")

          getRequest.onsuccess = async () => {
            const result = getRequest.result
            if (!result) {
              resolve(null)
              return
            }

            // Verify device fingerprint
            if (result.deviceFingerprint !== this.getDeviceFingerprint()) {
              console.warn("Device fingerprint mismatch - key invalid")
              resolve(null)
              return
            }

            try {
              const keyData = new Uint8Array(result.keyData)
              const key = await window.crypto.subtle.importKey("raw", keyData, this.ALGORITHM, true, [
                "encrypt",
                "decrypt",
              ])
              resolve(key)
            } catch (error) {
              console.error("Failed to import stored key:", error)
              resolve(null)
            }
          }

          getRequest.onerror = () => resolve(null)
        }
        request.onerror = () => resolve(null)
      })
    } catch (error) {
      console.error("Failed to retrieve stored key:", error)
      return null
    }
  }

  // Generate device fingerprint for additional security
  private static getDeviceFingerprint(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    ctx?.fillText("Caregene", 10, 10)

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join("|")

    return btoa(fingerprint).slice(0, 32)
  }

  // Encrypt sensitive data
  static async encryptData(data: string): Promise<EncryptedData> {
    if (!this.isInitialized || !this.masterKey) {
      throw new Error("Encryption service not initialized")
    }

    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)

      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
      const salt = window.crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        this.masterKey,
        dataBuffer,
      )

      return {
        data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv)),
        salt: btoa(String.fromCharCode(...salt)),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("Encryption failed:", error)
      throw new Error("Failed to encrypt data")
    }
  }

  // Decrypt sensitive data
  static async decryptData(encryptedData: EncryptedData): Promise<string> {
    if (!this.isInitialized || !this.masterKey) {
      throw new Error("Encryption service not initialized")
    }

    try {
      const data = new Uint8Array(
        atob(encryptedData.data)
          .split("")
          .map((c) => c.charCodeAt(0)),
      )
      const iv = new Uint8Array(
        atob(encryptedData.iv)
          .split("")
          .map((c) => c.charCodeAt(0)),
      )

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        this.masterKey,
        data,
      )

      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error("Decryption failed:", error)
      throw new Error("Failed to decrypt data")
    }
  }

  // Encrypt journal entry
  static async encryptJournalEntry(entry: any): Promise<any> {
    const sensitiveFields = ["summary", "free_notes", "transcript", "symptoms", "meds"]
    const encryptedEntry = { ...entry }

    for (const field of sensitiveFields) {
      if (entry[field]) {
        const dataToEncrypt = typeof entry[field] === "string" ? entry[field] : JSON.stringify(entry[field])

        encryptedEntry[field] = await this.encryptData(dataToEncrypt)
      }
    }

    encryptedEntry._encrypted = true
    return encryptedEntry
  }

  // Decrypt journal entry
  static async decryptJournalEntry(encryptedEntry: any): Promise<any> {
    if (!encryptedEntry._encrypted) {
      return encryptedEntry // Not encrypted
    }

    const sensitiveFields = ["summary", "free_notes", "transcript", "symptoms", "meds"]
    const decryptedEntry = { ...encryptedEntry }

    for (const field of sensitiveFields) {
      if (encryptedEntry[field] && typeof encryptedEntry[field] === "object") {
        try {
          const decryptedData = await this.decryptData(encryptedEntry[field])

          // Try to parse as JSON for arrays, otherwise keep as string
          try {
            decryptedEntry[field] = JSON.parse(decryptedData)
          } catch {
            decryptedEntry[field] = decryptedData
          }
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error)
          decryptedEntry[field] = "[Decryption Error]"
        }
      }
    }

    delete decryptedEntry._encrypted
    return decryptedEntry
  }

  // Anonymize data for export
  static anonymizeForExport(entry: any): any {
    const anonymized = { ...entry }

    // Remove or hash identifying information
    delete anonymized.id
    delete anonymized.attachments
    delete anonymized.images

    // Replace specific medication names with categories
    if (anonymized.meds) {
      anonymized.meds = anonymized.meds.map((med: string) => {
        // Simple categorization - in real app, use medical database
        if (med.toLowerCase().includes("pain")) return "Pain Medication"
        if (med.toLowerCase().includes("anti")) return "Anti-inflammatory"
        return "Medication"
      })
    }

    // Generalize symptoms
    if (anonymized.symptoms) {
      anonymized.symptoms = anonymized.symptoms.map((symptom: string) => {
        // Keep general categories but remove specific details
        return symptom.split(" ")[0] // Keep first word only
      })
    }

    // Hash or remove free text that might contain identifying info
    if (anonymized.free_notes) {
      anonymized.free_notes = "[Anonymized Notes]"
    }

    if (anonymized.summary) {
      // Keep structure but remove specific details
      anonymized.summary = anonymized.summary.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[Name]")
    }

    return anonymized
  }

  // Secure delete (overwrite memory)
  static secureDelete(data: any): void {
    if (typeof data === "string") {
      // Overwrite string memory (limited effectiveness in JS)
      for (let i = 0; i < data.length; i++) {
        data = data.substring(0, i) + "0" + data.substring(i + 1)
      }
    } else if (typeof data === "object") {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.secureDelete(data[key])
          delete data[key]
        }
      }
    }
  }

  // Check if encryption is available and enabled
  static isEncryptionAvailable(): boolean {
    return typeof window !== "undefined" && !!window.crypto?.subtle && this.isInitialized
  }

  // Get privacy settings
  static getPrivacySettings(): PrivacySettings {
    const stored = localStorage.getItem("caregene-privacy-settings")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Failed to parse privacy settings:", error)
      }
    }

    // Default privacy settings
    return {
      enableEncryption: true,
      useOnDeviceStorage: true,
      autoDeleteAfterDays: 365,
      requireBiometric: false,
      shareWithHealthcareProviders: false,
      anonymizeExports: true,
    }
  }

  // Update privacy settings
  static updatePrivacySettings(settings: Partial<PrivacySettings>): void {
    const current = this.getPrivacySettings()
    const updated = { ...current, ...settings }
    localStorage.setItem("caregene-privacy-settings", JSON.stringify(updated))
  }

  // Clear all stored data (for privacy compliance)
  static async clearAllData(): Promise<void> {
    try {
      // Clear IndexedDB
      const deleteDB = indexedDB.deleteDatabase("CaregeneSecurity")
      await new Promise((resolve, reject) => {
        deleteDB.onsuccess = () => resolve(void 0)
        deleteDB.onerror = () => reject(deleteDB.error)
      })

      // Clear localStorage
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("caregene-"))
      keys.forEach((key) => localStorage.removeItem(key))

      // Clear sessionStorage
      const sessionKeys = Object.keys(sessionStorage).filter((key) => key.startsWith("caregene-"))
      sessionKeys.forEach((key) => sessionStorage.removeItem(key))

      // Reset service state
      this.masterKey = null
      this.isInitialized = false

      console.log("All Caregene data cleared")
    } catch (error) {
      console.error("Failed to clear all data:", error)
      throw error
    }
  }

  // Validate data integrity
  static async validateDataIntegrity(encryptedData: EncryptedData): Promise<boolean> {
    try {
      // Check if data can be decrypted
      await this.decryptData(encryptedData)

      // Check timestamp is reasonable (not too old or in future)
      const now = Date.now()
      const age = now - encryptedData.timestamp
      const maxAge = 365 * 24 * 60 * 60 * 1000 // 1 year

      return age >= 0 && age <= maxAge
    } catch (error) {
      return false
    }
  }

  // Generate privacy report
  static generatePrivacyReport(): {
    encryptionEnabled: boolean
    dataLocation: "device" | "cloud" | "mixed"
    retentionPeriod: number
    anonymizationEnabled: boolean
    lastSecurityCheck: Date
  } {
    const settings = this.getPrivacySettings()

    return {
      encryptionEnabled: this.isEncryptionAvailable() && settings.enableEncryption,
      dataLocation: settings.useOnDeviceStorage ? "device" : "cloud",
      retentionPeriod: settings.autoDeleteAfterDays || 365,
      anonymizationEnabled: settings.anonymizeExports,
      lastSecurityCheck: new Date(),
    }
  }
}

// On-device search index for privacy
export class PrivateSearchIndex {
  private static index: Map<string, Set<string>> = new Map()
  private static initialized = false

  // Build search index from decrypted entries
  static async buildIndex(entries: any[]): Promise<void> {
    this.index.clear()

    for (const entry of entries) {
      const decrypted = await PrivacyEncryptionService.decryptJournalEntry(entry)
      this.indexEntry(entry.id, decrypted)
    }

    this.initialized = true
  }

  // Index a single entry
  private static indexEntry(entryId: string, entry: any): void {
    const searchableText = [
      entry.summary || "",
      entry.free_notes || "",
      ...(entry.symptoms || []),
      ...(entry.meds || []),
      entry.event_type || "",
    ]
      .join(" ")
      .toLowerCase()

    const words = searchableText.split(/\s+/).filter((word) => word.length > 2)

    words.forEach((word) => {
      if (!this.index.has(word)) {
        this.index.set(word, new Set())
      }
      this.index.get(word)!.add(entryId)
    })
  }

  // Search the private index
  static search(query: string): Set<string> {
    if (!this.initialized) {
      return new Set()
    }

    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
    let results: Set<string> | null = null

    queryWords.forEach((word) => {
      const wordResults = this.index.get(word) || new Set()

      if (results === null) {
        results = new Set(wordResults)
      } else {
        // Intersection of results
        results = new Set([...results].filter((id) => wordResults.has(id)))
      }
    })

    return results || new Set()
  }

  // Clear the index
  static clearIndex(): void {
    this.index.clear()
    this.initialized = false
  }
}
