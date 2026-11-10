import { useEffect, useSyncExternalStore } from 'react'

export type Route = 'home' | 'about' | 'projects' | 'experience'

/** The clean URL shown for each page, e.g. yoursite.com/about. */
const paths: Record<Route, string> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  experience: '/experience',
}

/** Fired whenever navigate() changes the page, so useRoute() re-renders. */
const NAVIGATE_EVENT = 'navigate'

/**
 * Go to a page. Call it from a click handler, e.g.
 * `onClick={() => navigate('about')}`. It updates the address bar without
 * reloading, and adds a history entry so the browser back button works.
 */
export function navigate(route: Route) {
  if (route === currentRoute()) return
  window.history.pushState(null, '', paths[route])
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}

function currentRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const match = (Object.keys(paths) as Route[]).find((r) => paths[r] === path)
  return match ?? 'home'
}

function subscribe(onChange: () => void) {
  // navigate() fires NAVIGATE_EVENT; the back/forward buttons fire popstate.
  window.addEventListener(NAVIGATE_EVENT, onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    window.removeEventListener(NAVIGATE_EVENT, onChange)
    window.removeEventListener('popstate', onChange)
  }
}

/** The page currently showing; re-renders the caller whenever it changes. */
export function useRoute(): Route {
  const route = useSyncExternalStore(subscribe, currentRoute)

  useEffect(() => {
    // Lets CSS pick the background photo for each page (see index.css).
    document.body.dataset.page = route
    window.scrollTo(0, 0)
  }, [route])

  return route
}
