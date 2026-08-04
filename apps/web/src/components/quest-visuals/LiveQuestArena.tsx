import { CleanPreview } from './CleanPreview'

type Props = {
  html: string
  previewSrcDoc: string
}

export function LiveQuestArena({ html, previewSrcDoc }: Props) {
  return (
    <div className="live-arena-stack">
      <CleanPreview html={html} previewSrcDoc={previewSrcDoc} showBlueprint />
    </div>
  )
}
