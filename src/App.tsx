import './App.css'
import { useRoute, type Route } from './router'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Projects } from './pages/Projects'
import { Experience } from './pages/Experience'
import { Contact } from './pages/Contact'

const pages: Record<Route, () => React.JSX.Element> = {
  home: Home,
  about: About,
  projects: Projects,
  experience: Experience,
  contact: Contact,
}

function App() {
  const Page = pages[useRoute()]
  return <Page />
}

export default App
