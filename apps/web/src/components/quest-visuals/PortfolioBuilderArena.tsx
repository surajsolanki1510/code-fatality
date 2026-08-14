import { useEffect, useRef } from 'react'
import { DEFAULT_AVATAR, usePortfolioStore } from '../../store/portfolioStore'

type Props = {
  previewSrcDoc: string
}

/** The canvas is the player's HTML + CSS — scroll position survives live updates. */
export function PortfolioBuilderArena({ previewSrcDoc }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const scrollRef = useRef({ x: 0, y: 0 })
  const profile = usePortfolioStore()

  const onPhoto = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => profile.setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const onLoad = () => {
      const win = iframe.contentWindow
      if (!win) return
      try {
        win.scrollTo(scrollRef.current.x, scrollRef.current.y)
        const onScroll = () => {
          scrollRef.current = { x: win.scrollX, y: win.scrollY }
        }
        win.addEventListener('scroll', onScroll, { passive: true })
      } catch {
        /* sandboxed / cross-origin guard */
      }
    }

    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [previewSrcDoc])

  return (
    <div className="pf-site">
      <div className="pf-site__tools">
        <button type="button" className="pf-site__photo" onClick={() => fileRef.current?.click()}>
          <img src={profile.photoDataUrl ?? DEFAULT_AVATAR} alt="" />
          <span>{profile.photoDataUrl ? 'Change photo' : 'Upload photo'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
        <p>Your real site — HTML + CSS below. Use {'{{PHOTO}}'} in img src. Scroll stays put while you type.</p>
      </div>
      <iframe
        ref={iframeRef}
        title="Your portfolio website"
        srcDoc={previewSrcDoc}
        sandbox=""
        className="pf-site__page"
      />
    </div>
  )
}
