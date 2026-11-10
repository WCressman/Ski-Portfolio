// Content for the work experience page, taken from the resume. Each
// category's list is in order of importance: the first entry is the one shown
// when the category is opened.

import technicalWork from '../assets/TechnicalWork.jpeg'
import inCreek from '../assets/InCreek.jpg'
import cienaLogo from '../assets/ciena logo.webp'
import unLogo from '../assets/UN Logo.png'
import lyceeLogo from '../assets/Lycee Claudel Logo.webp'
import smsLogo from '../assets/SwissMountainSportsMark.webp'
import campFortuneLogo from '../assets/Camp Fortune Logo.svg'

export type Experience = {
  /** Big handwritten text on the front of the polaroid. */
  org: string
  role: string
  location: string
  dates: string
  /** Logo on the front of the polaroid; without one, initials show. */
  logo?: string
  /** Background behind the logo (or the initials). */
  tint: string
  /** Bullet points on the back of the polaroid. */
  points: string[]
}

export type CategoryId = 'technical' | 'ski'

export type Category = {
  id: CategoryId
  label: string
  /** Short line on the category polaroid. */
  blurb: string
  photo?: string
  /** Which part of the photo stays in the square crop (CSS object-position). */
  photoFocus?: string
  tint: string
  experiences: Experience[]
}

const lessons =
  'Taught lessons in English and French to clients of all ages and skill levels, on groomers, off-piste and in the terrain park'
const lessonTotal = 'Part of 500+ lessons taught across Swiss Mountain Sports and Camp Fortune'

export const categories: Category[] = [
  {
    id: 'technical',
    label: 'technical experience',
    blurb: 'programming, co-ops & tutoring',
    photo: technicalWork,
    photoFocus: '30% 35%',
    tint: '#1f2a3a',
    experiences: [
      {
        org: 'Ciena',
        role: 'Software Developer Intern',
        location: 'Kanata, Canada',
        dates: 'Jul. 2025 – Dec. 2025',
        logo: cienaLogo,
        tint: '#ffffff',
        points: [
          'Created a form-based GUI that generated deployment configs in real time, letting developers configure 100+ microservices, YANG models, protocol ports (REST, ZMQ) and Git metadata, replacing error-prone hand-editing',
          'Developed React-based devtools used by 30+ developers across multiple departments',
          'Integrated Bitbucket and Jenkins APIs into a React app for diagnostics on microservices',
          'Led monthly demos of new tooling to multiple engineering teams, using feedback to guide follow-up development',
        ],
      },
      {
        org: 'United Nations',
        role: 'Software Developer · Independent Contractor',
        location: 'Remote',
        dates: 'Jan. 2026 – Apr. 2026',
        logo: unLogo,
        tint: '#ffffff',
        points: [
          'Built an Excel parser for a UN statistician, reducing a 3-hour task to under a minute using Python (pandas and openpyxl)',
          'Refactored a “quality analyser” script using pysdmx, replacing raw XML manipulation',
        ],
      },
      {
        org: 'Lycée Claudel',
        role: 'Math & Computer Science Tutor',
        location: 'Ottawa, Canada',
        dates: 'Dec. 2024 – Present',
        logo: lyceeLogo,
        tint: '#ffffff',
        points: [
          'Weekly sessions tutoring high schoolers in fundamental concepts of both math and computer science',
        ],
      },
    ],
  },
  {
    id: 'ski',
    label: 'ski instructor',
    blurb: '3 winters of teaching',
    photo: inCreek,
    tint: '#2d4a36',
    experiences: [
      {
        org: 'Swiss Mountain Sports',
        role: 'Ski Instructor',
        location: 'Crans-Montana, Switzerland',
        dates: 'Dec. 2025 - Apr. 2026',
        logo: smsLogo,
        tint: '#000000',
        points: [lessons, lessonTotal],
      },
      {
        org: 'Camp Fortune',
        role: 'Ski Instructor',
        location: 'Chelsea, Canada',
        dates: 'Dec. 2023 - May. 2025',
        logo: campFortuneLogo,
        tint: '#ffffff',
        points: [lessons, lessonTotal],
      },
    ],
  },
]
