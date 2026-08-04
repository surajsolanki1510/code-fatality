import { useMemo } from 'react'

type Props = {
  html: string
  previewSrcDoc: string
  showBlueprint?: boolean
}

/** Clean preview — no chunky 3D house; focus on real page + tag chips */
export function CleanPreview({ html, previewSrcDoc, showBlueprint = true }: Props) {
  const activeTags = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const names = new Set<string>()
    doc.querySelectorAll('*').forEach((el) => {
      const n = el.tagName.toLowerCase()
      if (n !== 'html' && n !== 'body' && n !== 'parsererror') names.add(n)
    })
    return [...names]
  }, [html])

  return (
    <div className="clean-preview">
      {showBlueprint && activeTags.length > 0 && (
        <div className="clean-preview__chips">
          <span className="clean-preview__chips-label">Tags in your code</span>
          <div className="chip-row">
            {activeTags.map((tag) => (
              <span key={tag} className="tag-chip">
                &lt;{tag}&gt;
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="clean-preview__frame">
        <iframe title="Your page" sandbox="allow-same-origin" srcDoc={previewSrcDoc} />
      </div>
    </div>
  )
}
