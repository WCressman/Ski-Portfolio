// Cloudflare Pages Function: wcressman.com/resume serves the resume PDF on
// its own, nothing from the site around it. The PDF is fetched from the
// GitHub Pages resume repo on each visit, so updating it there updates it here.
const PDF_URL = 'https://wcressman.github.io/Resume/William%20Cressman%20Resume.pdf'

export async function onRequest() {
  const res = await fetch(PDF_URL)
  if (!res.ok) return new Response('Resume unavailable', { status: 502 })

  return new Response(res.body, {
    headers: {
      'Content-Type': 'application/pdf',
      // Open in the browser's PDF viewer (not a download), with a nice name
      // if someone saves it.
      'Content-Disposition': 'inline; filename="William Cressman Resume.pdf"',
      // Cache for 5 minutes so updates on GitHub show up quickly.
      'Cache-Control': 'public, max-age=300',
    },
  })
}
