import type {
  AgeKey,
  Child,
  Checklist,
  ChecklistResponse,
  Tip,
  Appointment,
  ReminderPreference,
  ExportSummary,
} from "@/types/milestone"

// Age utilities
export const AGE_KEYS: AgeKey[] = ["2m", "4m", "6m", "9m", "12m", "15m", "18m", "2y", "30m", "3y", "4y", "5y"]

export function computeChronologicalAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)) // months
}

export function computeCorrectedAge(birthDate: string, dueDate?: string): number {
  const chronologicalAge = computeChronologicalAge(birthDate)

  if (!dueDate || chronologicalAge >= 24) {
    return chronologicalAge
  }

  const birth = new Date(birthDate)
  const due = new Date(dueDate)
  const prematureWeeks = Math.floor((due.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7))
  const correctionMonths = Math.floor(prematureWeeks / 4.33)

  return Math.max(0, chronologicalAge - correctionMonths)
}

export function mapToNearestAgeKey(ageInMonths: number): AgeKey {
  const ageKeyMonths: Record<AgeKey, number> = {
    "2m": 2,
    "4m": 4,
    "6m": 6,
    "9m": 9,
    "12m": 12,
    "15m": 15,
    "18m": 18,
    "2y": 24,
    "30m": 30,
    "3y": 36,
    "4y": 48,
    "5y": 60,
  }

  let nearestKey: AgeKey = "2m"
  let nearestDiff = Number.POSITIVE_INFINITY

  for (const [key, months] of Object.entries(ageKeyMonths)) {
    if (months <= ageInMonths) {
      const diff = ageInMonths - months
      if (diff < nearestDiff) {
        nearestDiff = diff
        nearestKey = key as AgeKey
      }
    }
  }

  return nearestKey
}

// In-memory store
class MilestoneStore {
  private children: Child[] = []
  private checklists: Checklist[] = []
  private checklistResponses: ChecklistResponse[] = []
  private tips: Tip[] = []
  private appointments: Appointment[] = []
  private reminderPrefs: ReminderPreference[] = []
  private initialized = false

  constructor() {
    this.initializeStore()
  }

  private async initializeStore() {
    try {
      this.loadFromStorage()
      if (this.children.length === 0) {
        this.seedData()
      }
      this.initialized = true
    } catch (error) {
      console.error("[v0] Error initializing milestone store:", error)
      this.resetToDefaults()
      this.initialized = true
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      console.warn("[v0] Store not initialized, resetting to defaults")
      this.resetToDefaults()
      this.initialized = true
    }

    // Ensure all arrays are properly initialized
    if (!Array.isArray(this.children)) this.children = []
    if (!Array.isArray(this.checklists)) this.checklists = []
    if (!Array.isArray(this.checklistResponses)) this.checklistResponses = []
    if (!Array.isArray(this.tips)) this.tips = []
    if (!Array.isArray(this.appointments)) this.appointments = []
    if (!Array.isArray(this.reminderPrefs)) this.reminderPrefs = []
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "milestone-store",
          JSON.stringify({
            children: this.children,
            checklists: this.checklists,
            checklistResponses: this.checklistResponses,
            tips: this.tips,
            appointments: this.appointments,
            reminderPrefs: this.reminderPrefs,
          }),
        )
      } catch (error) {
        console.error("[v0] Error saving to storage:", error)
      }
    }
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("milestone-store")
        if (stored) {
          const data = JSON.parse(stored)
          if (data && typeof data === "object") {
            this.children = Array.isArray(data.children) ? data.children : []
            this.checklists = Array.isArray(data.checklists) ? data.checklists : []
            this.checklistResponses = Array.isArray(data.checklistResponses) ? data.checklistResponses : []
            this.tips = Array.isArray(data.tips) ? data.tips : []
            this.appointments = Array.isArray(data.appointments) ? data.appointments : []
            this.reminderPrefs = Array.isArray(data.reminderPrefs) ? data.reminderPrefs : []
          } else {
            // Invalid data structure, reset to defaults
            this.resetToDefaults()
          }
        }
      } catch (error) {
        console.error("[v0] Error loading from storage:", error)
        this.resetToDefaults()
      }
    }
  }

  private resetToDefaults() {
    this.children = []
    this.checklists = []
    this.checklistResponses = []
    this.tips = []
    this.appointments = []
    this.reminderPrefs = []
  }

  private seedData() {
    // Seed demo children
    this.children = [
      {
        id: "child-1",
        firstName: "Emma",
        birthDate: "2023-06-15",
        sex: "F",
        photoUrl: "/adorable-baby-girl.png",
      },
      {
        id: "child-2",
        firstName: "Liam",
        birthDate: "2022-03-10",
        dueDate: "2022-04-01",
        sex: "M",
        photoUrl: "/happy-toddler.png",
      },
    ]

    this.checklists = [
      {
        ageKey: "2m",
        items: [
          {
            id: "social-2m-1",
            category: "social",
            label: "Calms down when spoken to or picked up",
            helpText: "Your baby should respond to comfort from caregivers",
            isKeyItem: true,
          },
          {
            id: "social-2m-2",
            category: "social",
            label: "Looks at your face",
            helpText: "Makes eye contact and shows interest in faces",
            isKeyItem: true,
          },
          {
            id: "language-2m-1",
            category: "language",
            label: "Makes sounds other than crying",
            helpText: "Coos, gurgles, or makes other vocalizations",
            isKeyItem: true,
          },
          {
            id: "language-2m-2",
            category: "language",
            label: "Reacts to loud sounds",
            helpText: "Startles or responds to sudden noises",
          },
          {
            id: "cognitive-2m-1",
            category: "cognitive",
            label: "Watches you as you move",
            helpText: "Follows you with their eyes",
          },
          {
            id: "cognitive-2m-2",
            category: "cognitive",
            label: "Acts bored if activity doesn't change",
            helpText: "Cries or fusses when the same activity continues too long",
          },
          {
            id: "movement-2m-1",
            category: "movement",
            label: "Can hold head up when on tummy",
            helpText: "Lifts head briefly during tummy time",
            isKeyItem: true,
          },
          {
            id: "movement-2m-2",
            category: "movement",
            label: "Moves both arms and both legs",
            helpText: "Shows coordinated movement of limbs",
          },
        ],
      },
      {
        ageKey: "4m",
        items: [
          {
            id: "social-4m-1",
            category: "social",
            label: "Smiles on their own to get your attention",
            helpText: "Initiates social interaction with smiling",
            isKeyItem: true,
          },
          {
            id: "social-4m-2",
            category: "social",
            label: "Chuckles when you try to make them laugh",
            helpText: "Responds to playful interactions with laughter",
          },
          {
            id: "language-4m-1",
            category: "language",
            label: "Makes sounds like 'oooo', 'aahh'",
            helpText: "Produces vowel-like sounds consistently",
            isKeyItem: true,
          },
          {
            id: "language-4m-2",
            category: "language",
            label: "Makes sounds back when you talk",
            helpText: "Engages in back-and-forth vocal play",
          },
          {
            id: "language-4m-3",
            category: "language",
            label: "Turns head toward the sound of your voice",
            helpText: "Shows recognition of familiar voices",
          },
          {
            id: "cognitive-4m-1",
            category: "cognitive",
            label: "If hungry, opens mouth when seeing breast or bottle",
            helpText: "Shows anticipation and understanding of feeding routine",
          },
          {
            id: "cognitive-4m-2",
            category: "cognitive",
            label: "Looks at their hands with interest",
            helpText: "Shows self-awareness and curiosity about body",
          },
          {
            id: "movement-4m-1",
            category: "movement",
            label: "Holds head steady without support when you are holding them",
            helpText: "Has developed sufficient neck strength",
            isKeyItem: true,
          },
          {
            id: "movement-4m-2",
            category: "movement",
            label: "Holds a toy when you put it in their hand",
            helpText: "Grasps objects placed in palm",
          },
          {
            id: "movement-4m-3",
            category: "movement",
            label: "Uses their arm to swing at toys",
            helpText: "Shows purposeful reaching movements",
          },
          {
            id: "movement-4m-4",
            category: "movement",
            label: "Brings hands to mouth",
            helpText: "Demonstrates hand-to-mouth coordination",
          },
          {
            id: "movement-4m-5",
            category: "movement",
            label: "When on tummy, pushes up to elbows",
            helpText: "Shows increased upper body strength",
          },
        ],
      },
      {
        ageKey: "6m",
        items: [
          {
            id: "social-6m-1",
            category: "social",
            label: "Knows familiar people",
            helpText: "Shows recognition of family members and regular caregivers",
            isKeyItem: true,
          },
          {
            id: "social-6m-2",
            category: "social",
            label: "Likes to look at themselves in a mirror",
            helpText: "Shows interest in their own reflection",
          },
          {
            id: "social-6m-3",
            category: "social",
            label: "Laughs",
            helpText: "Expresses joy through laughter",
          },
          {
            id: "language-6m-1",
            category: "language",
            label: "Takes turns making sounds with you",
            helpText: "Engages in vocal turn-taking conversations",
            isKeyItem: true,
          },
          {
            id: "language-6m-2",
            category: "language",
            label: "Blows 'raspberries' (sticks tongue out and blows)",
            helpText: "Makes playful sounds with tongue and lips",
          },
          {
            id: "language-6m-3",
            category: "language",
            label: "Makes squealing noises",
            helpText: "Produces high-pitched vocalizations",
          },
          {
            id: "cognitive-6m-1",
            category: "cognitive",
            label: "Puts things in their mouth to explore them",
            helpText: "Uses mouth as a way to learn about objects",
          },
          {
            id: "cognitive-6m-2",
            category: "cognitive",
            label: "Reaches to grab a toy they want",
            helpText: "Shows intentional reaching for desired objects",
          },
          {
            id: "cognitive-6m-3",
            category: "cognitive",
            label: "Closes lips to show they don't want more food",
            helpText: "Communicates preferences during feeding",
          },
          {
            id: "movement-6m-1",
            category: "movement",
            label: "Rolls from tummy to back",
            helpText: "Demonstrates rolling skills in one direction",
            isKeyItem: true,
          },
          {
            id: "movement-6m-2",
            category: "movement",
            label: "Pushes up with straight arms when on tummy",
            helpText: "Shows increased upper body strength and control",
          },
          {
            id: "movement-6m-3",
            category: "movement",
            label: "Leans on hands to support themselves when sitting",
            helpText: "Uses arms for support while learning to sit",
          },
        ],
      },
      {
        ageKey: "9m",
        items: [
          {
            id: "social-9m-1",
            category: "social",
            label: "Is shy, clingy, or fearful around strangers",
            helpText: "Shows appropriate wariness of unfamiliar people",
            isKeyItem: true,
          },
          {
            id: "social-9m-2",
            category: "social",
            label: "Shows several facial expressions, like happy, sad, angry, and surprised",
            helpText: "Displays a range of emotions through facial expressions",
          },
          {
            id: "social-9m-3",
            category: "social",
            label: "Looks when you call their name",
            helpText: "Responds to their name being called",
          },
          {
            id: "social-9m-4",
            category: "social",
            label: "Reacts when you leave (looks, reaches for you, or cries)",
            helpText: "Shows attachment and separation awareness",
          },
          {
            id: "social-9m-5",
            category: "social",
            label: "Smiles or laughs when you play peek-a-boo",
            helpText: "Enjoys and responds to social games",
          },
          {
            id: "language-9m-1",
            category: "language",
            label: "Makes a lot of different sounds like 'mamamama' and 'bababababa'",
            helpText: "Produces repetitive consonant-vowel combinations",
            isKeyItem: true,
          },
          {
            id: "language-9m-2",
            category: "language",
            label: "Lifts arms up to be picked up",
            helpText: "Uses gestures to communicate wants",
          },
          {
            id: "cognitive-9m-1",
            category: "cognitive",
            label: "Looks for objects when dropped out of sight (like a spoon or toy)",
            helpText: "Shows understanding that objects continue to exist when hidden",
            isKeyItem: true,
          },
          {
            id: "cognitive-9m-2",
            category: "cognitive",
            label: "Bangs two things together",
            helpText: "Explores cause and effect through object manipulation",
          },
          {
            id: "movement-9m-1",
            category: "movement",
            label: "Gets to a sitting position by themselves",
            helpText: "Can move into sitting position independently",
            isKeyItem: true,
          },
          {
            id: "movement-9m-2",
            category: "movement",
            label: "Moves things from one hand to the other hand",
            helpText: "Shows improved hand coordination and transfer skills",
          },
          {
            id: "movement-9m-3",
            category: "movement",
            label: "Uses fingers to 'rake' food towards themselves",
            helpText: "Uses raking grasp to gather small objects",
          },
          {
            id: "movement-9m-4",
            category: "movement",
            label: "Sits without support",
            helpText: "Maintains sitting position independently",
          },
        ],
      },
      {
        ageKey: "12m",
        items: [
          {
            id: "social-12m-1",
            category: "social",
            label: "Plays games with you, like pat-a-cake",
            helpText: "Participates in interactive social games",
            isKeyItem: true,
          },
          {
            id: "language-12m-1",
            category: "language",
            label: "Waves 'bye-bye'",
            helpText: "Uses gestures to communicate social conventions",
            isKeyItem: true,
          },
          {
            id: "language-12m-2",
            category: "language",
            label: "Calls a parent 'mama' or 'dada' or another special name",
            helpText: "Uses specific words to refer to parents",
          },
          {
            id: "language-12m-3",
            category: "language",
            label: "Understands 'no' (pauses briefly or stops when you say it)",
            helpText: "Shows comprehension of simple commands",
          },
          {
            id: "cognitive-12m-1",
            category: "cognitive",
            label: "Puts something in a container, like a block in a cup",
            helpText: "Shows understanding of spatial relationships",
            isKeyItem: true,
          },
          {
            id: "cognitive-12m-2",
            category: "cognitive",
            label: "Looks for things they see you hide, like a toy under a blanket",
            helpText: "Demonstrates object permanence understanding",
          },
          {
            id: "movement-12m-1",
            category: "movement",
            label: "Pulls up to stand",
            helpText: "Uses furniture or support to pull to standing position",
            isKeyItem: true,
          },
          {
            id: "movement-12m-2",
            category: "movement",
            label: "Walks, holding on to furniture",
            helpText: "Cruises along furniture while walking",
          },
          {
            id: "movement-12m-3",
            category: "movement",
            label: "Drinks from a cup without a lid, as you hold it",
            helpText: "Shows improved oral motor skills",
          },
          {
            id: "movement-12m-4",
            category: "movement",
            label: "Picks things up between thumb and pointer finger, like small bits of food",
            helpText: "Uses pincer grasp for small objects",
          },
        ],
      },
      {
        ageKey: "15m",
        items: [
          {
            id: "social-15m-1",
            category: "social",
            label: "Copies other children while playing, like taking toys out of a container when another child does",
            helpText: "Shows imitation skills and social learning",
            isKeyItem: true,
          },
          {
            id: "social-15m-2",
            category: "social",
            label: "Shows you an object they like",
            helpText: "Shares interests and seeks social connection",
          },
          {
            id: "social-15m-3",
            category: "social",
            label: "Claps when excited",
            helpText: "Expresses emotions through gestures",
          },
          {
            id: "social-15m-4",
            category: "social",
            label: "Hugs stuffed animals or other soft objects",
            helpText: "Shows affection and nurturing behaviors",
          },
          {
            id: "social-15m-5",
            category: "social",
            label: "Shows you affection (hugs, cuddles, or kisses you)",
            helpText: "Demonstrates attachment and affection",
          },
          {
            id: "language-15m-1",
            category: "language",
            label: "Tries to say one or two words besides 'mama' or 'dada', like 'ba' for ball or 'da' for dog",
            helpText: "Attempts to use words to label objects",
            isKeyItem: true,
          },
          {
            id: "language-15m-2",
            category: "language",
            label: "Looks at a familiar object when you name it",
            helpText: "Shows word comprehension and recognition",
          },
          {
            id: "language-15m-3",
            category: "language",
            label: "Follows directions given with both a gesture and words",
            helpText: "Understands simple commands with visual cues",
          },
          {
            id: "language-15m-4",
            category: "language",
            label: "Points to ask for something or to get help",
            helpText: "Uses pointing as a communication tool",
          },
          {
            id: "cognitive-15m-1",
            category: "cognitive",
            label: "Tries to use things the right way, like a phone, cup, or book",
            helpText: "Shows functional understanding of objects",
            isKeyItem: true,
          },
          {
            id: "cognitive-15m-2",
            category: "cognitive",
            label: "Stacks at least two small objects, like blocks",
            helpText: "Demonstrates spatial reasoning and coordination",
          },
          {
            id: "movement-15m-1",
            category: "movement",
            label: "Takes a few steps on their own",
            helpText: "Shows independent walking skills",
            isKeyItem: true,
          },
          {
            id: "movement-15m-2",
            category: "movement",
            label: "Uses fingers to feed themselves some food",
            helpText: "Shows improved fine motor skills for self-feeding",
          },
        ],
      },
      {
        ageKey: "18m",
        items: [
          {
            id: "social-18m-1",
            category: "social",
            label: "Moves away from you, but looks to make sure you are close by",
            helpText: "Shows independence while maintaining connection",
            isKeyItem: true,
          },
          {
            id: "social-18m-2",
            category: "social",
            label: "Points to show you something interesting",
            helpText: "Shares attention and interests with others",
          },
          {
            id: "social-18m-3",
            category: "social",
            label: "Puts hands out for you to wash them",
            helpText: "Participates in daily care routines",
          },
          {
            id: "social-18m-4",
            category: "social",
            label: "Looks at a few pages in a book with you",
            helpText: "Shows interest in shared reading activities",
          },
          {
            id: "social-18m-5",
            category: "social",
            label: "Helps you dress them by pushing arm through sleeve or lifting up foot",
            helpText: "Cooperates during dressing routines",
          },
          {
            id: "language-18m-1",
            category: "language",
            label: "Tries to say three or more words besides 'mama' or 'dada'",
            helpText: "Expanding vocabulary with multiple word attempts",
            isKeyItem: true,
          },
          {
            id: "language-18m-2",
            category: "language",
            label:
              "Follows one-step directions without any gestures, like giving you the toy when you say, 'Give it to me.'",
            helpText: "Understands verbal instructions without visual cues",
          },
          {
            id: "cognitive-18m-1",
            category: "cognitive",
            label: "Copies you doing chores, like sweeping with a broom",
            helpText: "Shows imitation and understanding of daily activities",
            isKeyItem: true,
          },
          {
            id: "cognitive-18m-2",
            category: "cognitive",
            label: "Plays with toys in a simple way, like pushing a toy car",
            helpText: "Uses toys appropriately for their intended purpose",
          },
          {
            id: "movement-18m-1",
            category: "movement",
            label: "Walks without holding on to anyone or anything",
            helpText: "Shows confident independent walking",
            isKeyItem: true,
          },
          {
            id: "movement-18m-2",
            category: "movement",
            label: "Scribbles",
            helpText: "Makes marks with crayons or other writing tools",
          },
          {
            id: "movement-18m-3",
            category: "movement",
            label: "Drinks from a cup without a lid and may spill sometimes",
            helpText: "Shows improved drinking skills with some spilling",
          },
          {
            id: "movement-18m-4",
            category: "movement",
            label: "Feeds themselves with fingers",
            helpText: "Self-feeds using finger foods effectively",
          },
          {
            id: "movement-18m-5",
            category: "movement",
            label: "Tries to use a spoon",
            helpText: "Attempts to use utensils for eating",
          },
          {
            id: "movement-18m-6",
            category: "movement",
            label: "Climbs on and off a couch or chair without help",
            helpText: "Shows climbing and spatial navigation skills",
          },
        ],
      },
      {
        ageKey: "2y",
        items: [
          {
            id: "social-2y-1",
            category: "social",
            label: "Notices when others are hurt or upset, like pausing or looking sad when someone is crying",
            helpText: "Shows empathy and emotional awareness",
            isKeyItem: true,
          },
          {
            id: "social-2y-2",
            category: "social",
            label: "Looks at your face to see how to react in a new situation",
            helpText: "Uses social referencing to guide behavior",
            isKeyItem: true,
          },
          {
            id: "language-2y-1",
            category: "language",
            label: "Points to things in a book when asked, like 'Where is the bear?'",
            helpText: "Shows comprehension and can identify objects in pictures",
            isKeyItem: true,
          },
          {
            id: "language-2y-2",
            category: "language",
            label: "Says at least two words together, like 'More milk'",
            helpText: "Combines words to create simple phrases",
            isKeyItem: true,
          },
          {
            id: "language-2y-3",
            category: "language",
            label: "Points to at least two body parts when asked to show them",
            helpText: "Demonstrates body awareness and vocabulary",
            isKeyItem: true,
          },
          {
            id: "language-2y-4",
            category: "language",
            label: "Uses more gestures than just waving and pointing, like blowing a kiss or nodding yes",
            helpText: "Expands gestural communication repertoire",
            isKeyItem: true,
          },
          {
            id: "cognitive-2y-1",
            category: "cognitive",
            label:
              "Holds something in one hand while using the other hand; for example, holding a container and taking the lid off",
            helpText: "Shows bilateral coordination and problem-solving",
            isKeyItem: true,
          },
          {
            id: "cognitive-2y-2",
            category: "cognitive",
            label: "Tries to use switches, knobs, or buttons on a toy",
            helpText: "Explores cause and effect relationships",
            isKeyItem: true,
          },
          {
            id: "cognitive-2y-3",
            category: "cognitive",
            label: "Plays with more than one toy at the same time, like putting toy food on a toy plate",
            helpText: "Demonstrates symbolic play and creativity",
            isKeyItem: true,
          },
          {
            id: "movement-2y-1",
            category: "movement",
            label: "Kicks a ball",
            helpText: "Shows gross motor coordination and balance",
            isKeyItem: true,
          },
          {
            id: "movement-2y-2",
            category: "movement",
            label: "Runs",
            helpText: "Demonstrates advanced gross motor skills",
            isKeyItem: true,
          },
          {
            id: "movement-2y-3",
            category: "movement",
            label: "Walks (not climbs) up a few stairs with or without help",
            helpText: "Shows stair navigation abilities",
            isKeyItem: true,
          },
          {
            id: "movement-2y-4",
            category: "movement",
            label: "Eats with a spoon",
            helpText: "Uses utensils effectively for self-feeding",
            isKeyItem: true,
          },
        ],
      },
      {
        ageKey: "30m",
        items: [
          {
            id: "social-30m-1",
            category: "social",
            label: "Plays next to other children and sometimes plays with them",
            helpText: "Engages in parallel and beginning cooperative play",
            isKeyItem: true,
          },
          {
            id: "social-30m-2",
            category: "social",
            label: "Shows defiant behavior (does what they have been told not to do)",
            helpText: "Shows normal developmental assertion of independence",
          },
          {
            id: "social-30m-3",
            category: "social",
            label: "Shows affection for friends without being reminded",
            helpText: "Demonstrates spontaneous social connection",
          },
          {
            id: "language-30m-1",
            category: "language",
            label: "Says about 50 words",
            helpText: "Has developed substantial vocabulary",
            isKeyItem: true,
          },
          {
            id: "language-30m-2",
            category: "language",
            label: "Says two or more words, with one action word, like 'Doggie run'",
            helpText: "Combines nouns and verbs in phrases",
            isKeyItem: true,
          },
          {
            id: "language-30m-3",
            category: "language",
            label: "Names things in a book when you point and ask, 'What is this?'",
            helpText: "Shows vocabulary knowledge and comprehension",
          },
          {
            id: "language-30m-4",
            category: "language",
            label: "Says words like 'I,' 'me,' or 'we'",
            helpText: "Uses pronouns to refer to self and others",
          },
          {
            id: "cognitive-30m-1",
            category: "cognitive",
            label: "Uses things to pretend, like feeding a doll with a toy bottle",
            helpText: "Engages in symbolic and pretend play",
            isKeyItem: true,
          },
          {
            id: "cognitive-30m-2",
            category: "cognitive",
            label: "Shows simple problem-solving skills, like standing on a small stool to reach something",
            helpText: "Demonstrates logical thinking and planning",
          },
          {
            id: "cognitive-30m-3",
            category: "cognitive",
            label: "Follows two-step instructions like 'Put the toy down and close the door'",
            helpText: "Shows improved attention and memory skills",
          },
          {
            id: "cognitive-30m-4",
            category: "cognitive",
            label:
              "Shows they know at least one color, like pointing to a red crayon when you ask, 'Which one is red?'",
            helpText: "Demonstrates color recognition and vocabulary",
          },
          {
            id: "movement-30m-1",
            category: "movement",
            label: "Uses hands to twist things, like turning doorknobs or unscrewing lids",
            helpText: "Shows advanced fine motor coordination",
            isKeyItem: true,
          },
          {
            id: "movement-30m-2",
            category: "movement",
            label: "Takes some clothes off by themselves, like loose pants or an open jacket",
            helpText: "Demonstrates self-care and independence skills",
          },
          {
            id: "movement-30m-3",
            category: "movement",
            label: "Jumps off the ground with both feet",
            helpText: "Shows gross motor coordination and strength",
          },
          {
            id: "movement-30m-4",
            category: "movement",
            label: "Turns book pages, one at a time",
            helpText: "Uses fine motor skills for functional activities",
          },
        ],
      },
      {
        ageKey: "3y",
        items: [
          {
            id: "social-3y-1",
            category: "social",
            label: "Calms down within 10 minutes after you leave them, like at a childcare drop off",
            helpText: "Shows emotional regulation and adaptation skills",
            isKeyItem: true,
          },
          {
            id: "social-3y-2",
            category: "social",
            label: "Notices other children and joins them to play",
            helpText: "Initiates social interaction with peers",
            isKeyItem: true,
          },
          {
            id: "language-3y-1",
            category: "language",
            label: "Talks with you in conversation using at least two back-and-forth exchanges",
            helpText: "Engages in reciprocal conversation",
            isKeyItem: true,
          },
          {
            id: "language-3y-2",
            category: "language",
            label: "Asks 'who,' 'what,' 'where,' or 'why' questions, like 'Where is mommy/daddy?'",
            helpText: "Uses question words to gather information",
            isKeyItem: true,
          },
          {
            id: "language-3y-3",
            category: "language",
            label:
              "Says what action is happening in a picture or book when asked, like 'running,' 'eating,' or 'playing'",
            helpText: "Identifies and names actions in pictures",
            isKeyItem: true,
          },
          {
            id: "language-3y-4",
            category: "language",
            label: "Says first name, when asked",
            helpText: "Shows self-identification and name recognition",
            isKeyItem: true,
          },
          {
            id: "language-3y-5",
            category: "language",
            label: "Talks well enough that others can understand, most of the time",
            helpText: "Has clear speech that is mostly intelligible",
            isKeyItem: true,
          },
          {
            id: "cognitive-3y-1",
            category: "cognitive",
            label: "Draws a circle, when you show them how",
            helpText: "Can copy simple shapes with demonstration",
            isKeyItem: true,
          },
          {
            id: "cognitive-3y-2",
            category: "cognitive",
            label: "Avoids touching hot objects, like a stove, when you warn them",
            helpText: "Shows safety awareness and follows warnings",
            isKeyItem: true,
          },
          {
            id: "movement-3y-1",
            category: "movement",
            label: "Strings items together, like large beads or macaroni",
            helpText: "Shows fine motor coordination and sequencing",
            isKeyItem: true,
          },
          {
            id: "movement-3y-2",
            category: "movement",
            label: "Puts on some clothes by themselves, like loose pants or a jacket",
            helpText: "Demonstrates self-care independence",
            isKeyItem: true,
          },
          {
            id: "movement-3y-3",
            category: "movement",
            label: "Uses a fork",
            helpText: "Shows advanced utensil use for eating",
            isKeyItem: true,
          },
        ],
      },
      {
        ageKey: "4y",
        items: [
          {
            id: "social-4y-1",
            category: "social",
            label: "Pretends to be something else during play (teacher, superhero, dog)",
            helpText: "Engages in imaginative role-playing",
            isKeyItem: true,
          },
          {
            id: "social-4y-2",
            category: "social",
            label: "Asks to go play with children if none are around, like 'Can I play with Alex?'",
            helpText: "Seeks out social interaction with peers",
            isKeyItem: true,
          },
          {
            id: "social-4y-3",
            category: "social",
            label: "Comforts others who are hurt or sad, like hugging a crying friend",
            helpText: "Shows empathy and prosocial behavior",
            isKeyItem: true,
          },
          {
            id: "social-4y-4",
            category: "social",
            label: "Avoids danger, like not jumping from tall heights at the playground",
            helpText: "Shows safety awareness and good judgment",
            isKeyItem: true,
          },
          {
            id: "social-4y-5",
            category: "social",
            label: "Likes to be a 'helper'",
            helpText: "Shows desire to contribute and assist others",
            isKeyItem: true,
          },
          {
            id: "social-4y-6",
            category: "social",
            label: "Changes behavior based on where they are (place of worship, library, playground)",
            helpText: "Adapts behavior to different social contexts",
            isKeyItem: true,
          },
          {
            id: "language-4y-1",
            category: "language",
            label: "Says sentences with four or more words",
            helpText: "Uses complex sentence structures",
            isKeyItem: true,
          },
          {
            id: "language-4y-2",
            category: "language",
            label: "Says some words from a song, story, or nursery rhyme",
            helpText: "Shows memory for familiar texts and songs",
            isKeyItem: true,
          },
          {
            id: "language-4y-3",
            category: "language",
            label: "Talks about at least one thing that happened during the day, like 'I played soccer'",
            helpText: "Recalls and shares daily experiences",
            isKeyItem: true,
          },
          {
            id: "language-4y-4",
            category: "language",
            label: "Answers simple questions like 'What is a coat for?' or 'What is a crayon for?'",
            helpText: "Shows understanding of object functions",
            isKeyItem: true,
          },
          {
            id: "cognitive-4y-1",
            category: "cognitive",
            label: "Names a few colors of items",
            helpText: "Identifies and names multiple colors",
            isKeyItem: true,
          },
          {
            id: "cognitive-4y-2",
            category: "cognitive",
            label: "Tells what comes next in a well-known story",
            helpText: "Shows story comprehension and prediction skills",
            isKeyItem: true,
          },
          {
            id: "cognitive-4y-3",
            category: "cognitive",
            label: "Draws a person with 3 or more body parts",
            helpText: "Shows body awareness and drawing skills",
            isKeyItem: true,
          },
          {
            id: "movement-4y-1",
            category: "movement",
            label: "Catches a large ball most of the time",
            helpText: "Shows hand-eye coordination and timing",
            isKeyItem: true,
          },
          {
            id: "movement-4y-2",
            category: "movement",
            label: "Serves themselves food or pours water, with adult supervision",
            helpText: "Demonstrates self-help skills with guidance",
            isKeyItem: true,
          },
          {
            id: "movement-4y-3",
            category: "movement",
            label: "Unbuttons some buttons",
            helpText: "Shows fine motor skills for clothing management",
            isKeyItem: true,
          },
          {
            id: "movement-4y-4",
            category: "movement",
            label: "Holds crayons or pencils between fingers and thumb (not a fist)",
            helpText: "Uses mature pencil grasp for writing/drawing",
            isKeyItem: true,
          },
        ],
      },
      {
        ageKey: "5y",
        items: [
          {
            id: "social-5y-1",
            category: "social",
            label: "Follows rules or takes turns when playing games with other children",
            helpText: "Shows understanding of game rules and fair play",
            isKeyItem: true,
          },
          {
            id: "social-5y-2",
            category: "social",
            label: "Sings, dances, or acts for you",
            helpText: "Performs and seeks attention through entertainment",
            isKeyItem: true,
          },
          {
            id: "social-5y-3",
            category: "social",
            label: "Does simple chores at home, like matching socks or clearing the table",
            helpText: "Takes responsibility for household tasks",
            isKeyItem: true,
          },
          {
            id: "language-5y-1",
            category: "language",
            label: "Tells a story they heard or made up with at least two events",
            helpText: "Constructs narratives with sequence and detail",
            isKeyItem: true,
          },
          {
            id: "language-5y-2",
            category: "language",
            label: "Answers simple questions about a book or story after you read or tell it to them",
            helpText: "Shows reading comprehension and recall",
            isKeyItem: true,
          },
          {
            id: "language-5y-3",
            category: "language",
            label: "Keeps a conversation going with more than three back-and-forth exchanges",
            helpText: "Engages in extended conversational exchanges",
            isKeyItem: true,
          },
          {
            id: "language-5y-4",
            category: "language",
            label: "Uses or recognizes simple rhymes (bat-cat, ball-tall)",
            helpText: "Shows phonological awareness and sound patterns",
            isKeyItem: true,
          },
          {
            id: "cognitive-5y-1",
            category: "cognitive",
            label: "Counts to 10",
            helpText: "Shows number sequence knowledge",
            isKeyItem: true,
          },
          {
            id: "cognitive-5y-2",
            category: "cognitive",
            label: "Names some letters when you point to them",
            helpText: "Shows letter recognition skills",
            isKeyItem: true,
          },
          {
            id: "cognitive-5y-3",
            category: "cognitive",
            label: "Uses words about time, like 'yesterday,' 'tomorrow,' 'morning,' or 'night'",
            helpText: "Shows temporal concept understanding",
            isKeyItem: true,
          },
          {
            id: "movement-5y-1",
            category: "movement",
            label: "Buttons some buttons",
            helpText: "Shows fine motor skills for self-care",
            isKeyItem: true,
          },
          {
            id: "movement-5y-2",
            category: "movement",
            label: "Hops on one foot",
            helpText: "Shows balance and gross motor coordination",
            isKeyItem: true,
          },
        ],
      },
    ]

    this.appointments = [
      {
        id: "appointment-1",
        childId: "child-1",
        type: "well visit",
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        location: "Pediatric Associates",
        notes: "18-month well-child visit - discuss walking, talking milestones",
        reminderSettings: {
          push: true,
          email: false,
          reminderTimes: [24, 2], // 24 hours and 2 hours before
        },
        checklistItems: ["social-18m-1", "language-18m-2", "movement-18m-1"],
      },
      {
        id: "appointment-2",
        childId: "child-1",
        type: "vaccine",
        dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        location: "Pediatric Associates",
        notes: "MMR and Varicella vaccines",
        reminderSettings: {
          push: true,
          email: true,
          reminderTimes: [24, 2],
        },
        checklistItems: [],
      },
      {
        id: "appointment-3",
        childId: "child-2",
        type: "screening",
        dateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        location: "Children's Hospital",
        notes: "Autism screening at 30 months - recommended by CDC guidelines",
        reminderSettings: {
          push: true,
          email: true,
          reminderTimes: [24, 2],
        },
        checklistItems: ["social-30m-1", "language-30m-3", "cognitive-30m-2"],
      },
    ]

    // Seed tips
    this.tips = [
      {
        id: "tip-1",
        ageKey: "6m",
        title: "Encourage Tummy Time",
        body: "Place your baby on their tummy for short periods while awake. This helps strengthen neck and shoulder muscles needed for sitting and crawling.",
      },
      {
        id: "tip-2",
        ageKey: "12m",
        title: "Read Together Daily",
        body: "Reading to your child helps develop language skills. Point to pictures and name objects to build vocabulary.",
      },
      {
        id: "tip-3",
        ageKey: "2y",
        title: "Practice Taking Turns",
        body: "Simple games like rolling a ball back and forth teach turn-taking and social skills that are important for playing with others.",
      },
    ]

    // Seed reminder preferences
    this.reminderPrefs = [
      {
        childId: "child-1",
        channels: { push: true, email: true },
        checklistReminders: true,
        appointmentReminders: true,
        tipNudges: true,
      },
      {
        childId: "child-2",
        channels: { push: true },
        checklistReminders: true,
        appointmentReminders: true,
        tipNudges: false,
      },
    ]

    this.checklistResponses = []

    // Create initial empty responses for each child and available checklist
    this.children.forEach((child) => {
      this.checklists.forEach((checklist) => {
        const response: ChecklistResponse = {
          childId: child.id,
          ageKey: checklist.ageKey,
          answers: {},
          completedAt: null,
          notes: {},
        }
        this.checklistResponses.push(response)
      })
    })

    this.saveToStorage()
  }

  // Child management
  getChildren(): Child[] {
    this.ensureInitialized()
    return Array.isArray(this.children) ? [...this.children] : []
  }

  createChild(child: Omit<Child, "id">): Child {
    try {
      this.ensureInitialized()

      const newChild: Child = {
        ...child,
        id: `child-${Date.now()}`,
      }

      // Ensure children is an array before pushing
      if (!Array.isArray(this.children)) {
        this.children = []
      }

      this.children.push(newChild)

      this.checklists.forEach((checklist) => {
        const response: ChecklistResponse = {
          childId: newChild.id,
          ageKey: checklist.ageKey,
          answers: {},
          completedAt: null,
          notes: {},
        }
        this.checklistResponses.push(response)
      })

      this.saveToStorage()
      return newChild
    } catch (error) {
      console.error("[v0] Error creating child:", error)
      throw error
    }
  }

  updateChild(id: string, updates: Partial<Child>): Child | null {
    this.ensureInitialized()

    const index = this.children.findIndex((c) => c.id === id)
    if (index === -1) return null

    this.children[index] = { ...this.children[index], ...updates }
    this.saveToStorage()
    return this.children[index]
  }

  deleteChild(id: string): boolean {
    this.ensureInitialized()

    const index = this.children.findIndex((c) => c.id === id)
    if (index === -1) return false

    this.children.splice(index, 1)
    // Clean up related data
    this.checklistResponses = this.checklistResponses.filter((r) => r.childId !== id)
    this.appointments = this.appointments.filter((a) => a.childId !== id)
    this.reminderPrefs = this.reminderPrefs.filter((p) => p.childId !== id)
    this.saveToStorage()
    return true
  }

  // Checklist management
  getChecklist(ageKey: AgeKey): Checklist | null {
    return this.checklists.find((c) => c.ageKey === ageKey) || null
  }

  saveChecklistResponse(response: ChecklistResponse): void {
    const index = this.checklistResponses.findIndex(
      (r) => r.childId === response.childId && r.ageKey === response.ageKey,
    )

    if (index >= 0) {
      this.checklistResponses[index] = response
    } else {
      this.checklistResponses.push(response)
    }
    this.saveToStorage()
  }

  // Tips management
  getTips(ageKey?: AgeKey): Tip[] {
    if (ageKey) {
      return this.tips.filter((t) => t.ageKey === ageKey)
    }
    return [...this.tips]
  }

  toggleBookmarkTip(tipId: string): boolean {
    const tip = this.tips.find((t) => t.id === tipId)
    if (!tip) return false

    tip.bookmarked = !tip.bookmarked
    this.saveToStorage()
    return tip.bookmarked
  }

  // Appointment management
  getAppointments(childId?: string): Appointment[] {
    if (childId) {
      return this.appointments.filter((a) => a.childId === childId)
    }
    return [...this.appointments]
  }

  createAppointment(appointment: Omit<Appointment, "id">): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
    }
    this.appointments.push(newAppointment)
    this.saveToStorage()
    return newAppointment
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const index = this.appointments.findIndex((a) => a.id === id)
    if (index === -1) return null

    this.appointments[index] = { ...this.appointments[index], ...updates }
    this.saveToStorage()
    return this.appointments[index]
  }

  deleteAppointment(id: string): boolean {
    const index = this.appointments.findIndex((a) => a.id === id)
    if (index === -1) return false

    this.appointments.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Reminder preferences
  getReminderPrefs(childId: string): ReminderPreference | null {
    return this.reminderPrefs.find((p) => p.childId === childId) || null
  }

  saveReminderPrefs(prefs: ReminderPreference): void {
    const index = this.reminderPrefs.findIndex((p) => p.childId === prefs.childId)

    if (index >= 0) {
      this.reminderPrefs[index] = prefs
    } else {
      this.reminderPrefs.push(prefs)
    }
    this.saveToStorage()
  }

  // Export summary
  generateSummary(childId: string, ageKey: AgeKey): ExportSummary | null {
    const child = this.children.find((c) => c.id === childId)
    const response = this.checklistResponses.find((r) => r.childId === childId && r.ageKey === ageKey)
    const checklist = this.getChecklist(ageKey)

    if (!child || !checklist) return null

    const met: string[] = []
    const notYet: string[] = []
    const notSure: string[] = []

    checklist.items.forEach((item) => {
      const answer = response?.answers[item.id]
      switch (answer) {
        case "yes":
          met.push(item.label)
          break
        case "not_yet":
          notYet.push(item.label)
          break
        case "not_sure":
          notSure.push(item.label)
          break
      }
    })

    return {
      child,
      ageKey,
      met,
      notYet,
      notSure,
      notes: response?.notes,
      generatedAt: new Date().toISOString(),
    }
  }

  // Additional functions
  getChild(childId: string): Child | null {
    this.ensureInitialized()
    return this.getChildren().find((child) => child.id === childId) || null
  }

  getChecklistResponses(childId: string): ChecklistResponse[] {
    this.ensureInitialized()
    return this.checklistResponses.filter((response) => response.childId === childId)
  }

  getAgeKeyForChild(childId: string): AgeKey | null {
    this.ensureInitialized()
    const child = this.getChild(childId)
    if (!child) return null

    const correctedAge = computeCorrectedAge(child.birthDate, child.dueDate)
    return mapToNearestAgeKey(correctedAge)
  }

  calculateAge(
    birthDate: string,
    dueDate?: string,
  ): { chronologicalAge: number; correctedAge: number; ageKey: AgeKey } {
    this.ensureInitialized()
    const chronologicalAge = computeChronologicalAge(birthDate)
    const correctedAge = computeCorrectedAge(birthDate, dueDate)
    const ageKey = mapToNearestAgeKey(correctedAge)

    return {
      chronologicalAge,
      correctedAge,
      ageKey,
    }
  }
}

// Export singleton instance
export const milestoneStore = new MilestoneStore()

export function getChildrenWrapper(): Child[] {
  return milestoneStore.getChildren()
}

export function createChildWrapper(child: Omit<Child, "id">): Child {
  return milestoneStore.createChild(child)
}

export function updateChildWrapper(id: string, updates: Partial<Child>): Child | null {
  return milestoneStore.updateChild(id, updates)
}

export function deleteChildWrapper(id: string): boolean {
  return milestoneStore.deleteChild(id)
}

export function getChecklistWrapper(ageKey: AgeKey): Checklist | null {
  return milestoneStore.getChecklist(ageKey)
}

export function saveChecklistResponseWrapper(response: ChecklistResponse): void {
  return milestoneStore.saveChecklistResponse(response)
}

export function getTipsWrapper(ageKey?: AgeKey): Tip[] {
  return milestoneStore.getTips(ageKey)
}

export function toggleBookmarkTipWrapper(tipId: string): boolean {
  return milestoneStore.toggleBookmarkTip(tipId)
}

export function getAppointmentsWrapper(childId?: string): Appointment[] {
  return milestoneStore.getAppointments(childId)
}

export function createAppointmentWrapper(appointment: Omit<Appointment, "id">): Appointment {
  return milestoneStore.createAppointment(appointment)
}

export function updateAppointmentWrapper(id: string, updates: Partial<Appointment>): Appointment | null {
  return milestoneStore.updateAppointment(id, updates)
}

export function deleteAppointmentWrapper(id: string): boolean {
  return milestoneStore.deleteAppointment(id)
}

export function getReminderPrefsWrapper(childId: string): ReminderPreference | null {
  return milestoneStore.getReminderPrefs(childId)
}

export function saveReminderPrefsWrapper(prefs: ReminderPreference): void {
  return milestoneStore.saveReminderPrefs(prefs)
}

export function generateSummaryWrapper(childId: string, ageKey: AgeKey): ExportSummary | null {
  return milestoneStore.generateSummary(childId, ageKey)
}

export function getChildWrapper(childId: string): Child | null {
  return milestoneStore.getChild(childId)
}

export function getChecklistResponsesWrapper(childId: string): ChecklistResponse[] {
  return milestoneStore.getChecklistResponses(childId)
}

export function getAgeKeyForChildWrapper(childId: string): AgeKey | null {
  return milestoneStore.getAgeKeyForChild(childId)
}

export function calculateAge(
  birthDate: string,
  dueDate?: string,
): { chronologicalAge: number; correctedAge: number; ageKey: AgeKey } {
  return milestoneStore.calculateAge(birthDate, dueDate)
}

export const addChild = createChildWrapper
export const getChecklist = getChecklistWrapper
export const getChildren = getChildrenWrapper
export const createChild = createChildWrapper
export const updateChild = updateChildWrapper
export const deleteChild = deleteChildWrapper
export const saveChecklistResponse = saveChecklistResponseWrapper
export const getTips = getTipsWrapper
export const toggleBookmarkTip = toggleBookmarkTipWrapper
export const getAppointments = getAppointmentsWrapper
export const createAppointment = createAppointmentWrapper
export const updateAppointment = updateAppointmentWrapper
export const deleteAppointment = deleteAppointmentWrapper
export const getReminderPrefs = getReminderPrefsWrapper
export const saveReminderPrefs = saveReminderPrefsWrapper
export const generateSummary = generateSummaryWrapper
export const getChild = getChildWrapper
export const getChecklistResponses = getChecklistResponsesWrapper
export const getAgeKeyForChild = getAgeKeyForChildWrapper
