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
    dates: 'Sep. 2023 – Present',
    stack: ['Command Blocks', 'Playtesting', 'Publishing'],
    highlight: '50,000+ downloads',
    points: [
      'Published Minecraft puzzle maps with 50,000+ downloads',
      'Programmed 1000+ command blocks to mimic behaviour of desired features not already implemented in the game',
      'Iterated over playtester feedback to improve the quality of map experiences',
    ],
    link: { label: 'See the maps', href: 'https://www.minecraftmaps.com/user/Mento_Machine' },
  },
  {
    title: 'YouTube Channel',
    icon: youtubeIcon,
    tint: '#b3261e',
    dates: '2019 – Present',
    stack: ['Scripting', 'Editing'],
    highlight: '15,000 views',
    points: ['Gaming youtube channel'],
    link: { label: 'Visit the channel', href: 'https://www.youtube.com/@mentooo5709' },
  },
  {
    title: 'Minecraft Servers',
    icon: minecraftIcon,
    tint: '#2f4f6f',
    dates: 'Jun. 2020 – Jun. 2022',
    stack: ['Skript', 'Ubuntu 20.04'],
    highlight: '200+ speedruns hosted, 100+ users',
    points: [
      'Hosted a low-latency Minecraft server for competitive speedrunning on Ubuntu 20.04, with over 200 runs held',
      'Custom coded several servers in Skript and maintained an active player base',
    ],
  },
]
