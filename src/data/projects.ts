// Content for the projects gallery, taken from the resume and your notes. The
// gallery loops, so order is just "what comes next": the first entry is the
// one shown when the page opens, with the last one to its left.

import minecraftIcon from '../assets/Project Icons/minecraft-cutout.webp'
import youtubeIcon from '../assets/Project Icons/youtube.webp'

export type Project = {
  title: string
  /** Icon shown in the gallery; without one, a tile with initials shows. */
  icon?: string
  /** Colour of that fallback tile. */
  tint: string
  dates: string
  /** Tools and languages, shown as small tags. */
  stack: string[]
  /** One big number to lead with, if there is one. */
  highlight?: string
  points: string[]
  /** Optional link (repo, demo, channel). */
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    title: 'Minecraft Maps',
    icon: minecraftIcon,
    tint: '#3f7a3a',
    dates: 'Jun. 2020 – Present',
    stack: ['Minecraft'],
    highlight: '50,000+ downloads',
    points: ['Published Minecraft puzzle maps with 50,000+ downloads'],
  },
  {
    title: 'YouTube: Minecraft',
    icon: youtubeIcon,
    tint: '#b3261e',
    dates: 'dates TBD',
    stack: ['YouTube'],
    highlight: '15,000 views',
    points: ['Minecraft YouTube channel with 15,000 views'],
  },
  {
    title: 'Minecraft Servers',
    icon: minecraftIcon,
    tint: '#2f4f6f',
    dates: 'Jun. 2020 – Present',
    stack: ['Skript', 'Ubuntu 20.04'],
    highlight: '200+ speedruns hosted',
    points: [
      'Hosted a low-latency Minecraft server for competitive speedrunning on Ubuntu 20.04, with over 200 runs held',
      'Custom coded several servers in Skript and maintained an active player base',
    ],
  },
  {
    title: 'Minecraft Chat Bot',
    icon: minecraftIcon,
    tint: '#5b3f8c',
    dates: 'Jun. 2020 – Present',
    stack: ['JavaScript', 'Mineflayer.js', 'Discord'],
    points: [
      'Developed a multiplayer Minecraft problem-solving chat bot in JavaScript using the Mineflayer SDK',
    ],
  },
  {
    title: 'Desktop Bots',
    tint: '#3a3a3a',
    dates: 'Jun. 2024 – Apr. 2025',
    stack: ['Python', 'pyautogui'],
    points: ['Programmed various automation bots for websites, messaging apps and games with Python'],
  },
  {
    title: 'Web Games',
    tint: '#c26a12',
    dates: 'Jun. 2023 – Jun. 2025',
    stack: ['JavaScript', 'HTML', 'CSS'],
    highlight: '3 games',
    points: [
      'Built and hosted a movie trivia site, a whack-a-mole game, and Do-o (a Wordle-inspired word guessing game)',
    ],
  },
]
