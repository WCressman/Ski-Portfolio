import { SkiSign, SkiSignPost } from '../skisign'
import { navigate } from '../router'

export function Home() {
  return (
    <>
      <header id="hero">
        <h1>just another waterloo cs undergrad</h1>
      </header>
      <section id="trails">
        <SkiSignPost>
          <SkiSign difficulty="green" onClick={() => navigate('about')}>the ski journey</SkiSign>
          <SkiSign difficulty="blue" onClick={() => navigate('projects')}>projects</SkiSign>
          <SkiSign difficulty="black" onClick={() => navigate('experience')}>work experience</SkiSign>
          <SkiSign difficulty="double-black">contact</SkiSign>
        </SkiSignPost>
      </section>
    </>
  )
}
