import family from '../assets/Ski Journey Photos/family.webp'
import sillyYoungMe from '../assets/Ski Journey Photos/sillyYoungMe.webp'
import learningToSki from '../assets/Ski Journey Photos/learning to ski.webp'
import firstBigMountain from '../assets/Ski Journey Photos/firstTimeBigMountain.webp'
import CSIALevel2 from '../assets/Ski Journey Photos/csia level 2.webp'
import vendrediSkiPoweroutage from '../assets/Ski Journey Photos/vendredi ski hike up power outage.webp'
import vendrediSkiAlexander from '../assets/Ski Journey Photos/Vendredi Ski.webp'
import fortuneFreestyle from '../assets/Ski Journey Photos/fortune freestyle club.webp'
import firstBacky from '../assets/Ski Journey Photos/first backflips 0.0.webp'
import swissSkiInstruction from '../assets/Ski Journey Photos/skiInstructingSwizterland.webp'
import swissWaterfallSkiing from '../assets/Ski Journey Photos/skiing next to a waterfall.webp'
import havingFun from '../assets/Ski Journey Photos/baby me ski.webp'
import campfortuneInstructor from '../assets/Ski Journey Photos/skiInstructorLevel1.webp'

export type JourneyStop = {
  photo: string
  /** Which part of the photo stays in the square crop (CSS object-position). */
  focus?: string
  /** Big handwritten line under the photo. Keep it short (one line). */
  caption: string
  /** Smaller line under it, e.g. an age or a year. */
  subcaption?: string
}

export const journey: JourneyStop[] = [
  {
    photo: family,
    focus: '62% 50%',
    caption: 'an addict is born',
    subcaption: 'age 2 · feat. my sister',
  },
  {
    photo: learningToSki,
    focus: '45% 55%',
    caption: 'me learning to ski!',
    subcaption: 'age 3 · mt. packenham, ontario',
  },
  {
    photo: havingFun,
    focus: '45% 55%',
    caption: ':D happy i learned',
    subcaption: 'age 4 · mt. packenham, ontario',
  },
  {
    photo: sillyYoungMe,
    focus: '50% 30%',
    caption: 'the annual family ski trip :P',
    subcaption: 'age 7 · whiteface, new hampshire',
  },
  {
    photo: firstBigMountain,
    focus: '40% 50%',
    caption: 'a big mountain!',
    subcaption: 'age 11 · sunshine village, banff',
  },
  {
    photo: fortuneFreestyle,
    focus: '60% 70%',
    caption: 'joined the fortune freestyle club, and discovered what i really loved about skiing',
    subcaption: 'age 13 · camp fortune, quebec',
  },
  {
    photo: vendrediSkiPoweroutage,
    focus: '60% 70%',
    caption: 'school ski trips! hiking up during a power outage',
    subcaption: 'age 15 · camp fortune, quebec',
  },
  {
    photo: campfortuneInstructor,
    focus: '60% 70%',
    caption: 'became an instructor with my best friend on the hill i grew up on!',
    subcaption: 'age 15 · camp fortune, quebec',
  },
  {
    photo: vendrediSkiAlexander,
    focus: '60% 70%',
    caption: 'more school trips, fondest memories of my life',
    subcaption: 'age 16 · camp fortune, quebec',
  },
  {
    photo: CSIALevel2,
    focus: '40% 50%',
    caption: 'passed my exam and became a level 2 ski instructor',
    subcaption: 'age 17 · camp fortune, quebec',
  },
  {
    photo: swissSkiInstruction,
    focus: '40% 50%',
    caption: 'took a gap year to ski instruct in swizterland!',
    subcaption: 'age 18 · crans-montana, switzerland',
  },
  {
    photo: firstBacky,
    focus: '20% 30%',
    caption: 'first backflips',
    subcaption: 'age 18 · crans-montana, switzerland',
  },
  {
    photo: swissWaterfallSkiing,
    focus: '20% 30%',
    caption: 'skiing the backcountry beside a waterfall, absolutely magical',
    subcaption: 'age 18 · crans-montana, switzerland',
  },
]
