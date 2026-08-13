import { useRef } from 'react'
import { DEFAULT_AVATAR, usePortfolioStore } from '../../store/portfolioStore'

type Props = {
  previewSrcDoc: string
}

/** The canvas is the player's HTML + CSS — no fake preview chrome. */
export function PortfolioBuilderArena({ previewSrcDoc }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const profile = usePortfolioStore()

  const onPhoto = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => profile.setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="pf-site">
      <div className="pf-site__tools">
        <button type="button" className="pf-site__photo" onClick={() => fileRef.current?.click()}>
          <img src={profile.photoDataUrl ?? DEFAULT_AVATAR} alt="" />
          <span>{profile.photoDataUrl ? 'Change photo' : 'Upload photo'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
        <p>This page is your HTML + CSS — not a demo. Put {'{{PHOTO}}'} in your img src.</p>
      </div>
      <iframe title="Your portfolio website" srcDoc={previewSrcDoc} sandbox="" className="pf-site__page" />
    </div>
  )
}
