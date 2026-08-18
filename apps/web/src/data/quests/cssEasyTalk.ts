import type { QuestDef, TagLesson } from './types'

/** One short plain-English line per CSS concept — fear-free. */
const PLAIN: Record<string, string> = {
  '<div class="studio">': 'This is a box that holds your whole page.',
  'body { background-color }': 'This paints the whole page background.',
  '<p class="tag">': 'A small line of text under the big title.',
  '.title { color }': 'This changes the color of your title text.',
  'font-size / font-weight': 'Size = how big. Weight = how bold.',
  'text-align / letter-spacing': 'text-align moves text left/center. letter-spacing spaces letters.',
  '<div class="card">': 'A card is a neat box for a group of stuff.',
  'padding / border / border-radius': 'Padding = space inside. Border = outline. Radius = round corners.',
  'box-shadow': 'A soft shadow so the card looks like it floats.',
  'max-width / margin: auto': 'max-width stops the card getting too wide. margin auto centers it.',
  '<div class="row"> + .tile': 'Put a few tiles in a row box — then CSS lines them up.',
  'display: flex / gap': 'Flex puts items in a line. Gap adds space between them.',
  'justify-content / align-items': 'These center (or space out) things inside a flex row.',
  'margin / padding / box-sizing': 'Margin = outside space. Padding = inside. border-box = widths stay sane.',
  'display: inline-block / none': 'inline-block = small box in a line. none = hide it.',
  'full glow-up': 'Build the page in HTML. Make it pretty in CSS. That’s it.',
  'display: grid': 'Grid is like a table of boxes — rows and columns.',
  'grid-template-columns': 'This says how many columns your grid has.',
  ':hover': 'Styles that show when the mouse sits on something.',
  transition: 'Makes color/size changes feel smooth, not jumpy.',
  'transform: scale / translate': 'Move or grow something visually (without breaking layout).',
  'linear-gradient': 'Blend two colors into a pretty background.',
  'position: relative / absolute': 'relative = anchor. absolute = stick a badge on that anchor.',
  'position: sticky / z-index': 'sticky keeps a header on screen while you scroll.',
  '::before / ::after': 'Extra sparkle you can add with CSS — no new HTML tags.',
  ':focus / :nth-child': 'focus = keyboard highlight. nth-child = style every other item.',
  'flex-wrap / flex': 'wrap = go to next line if tight. flex: 1 = share leftover space.',
  'finale combo': 'Put gradient + grid + hover + smooth transition together.',
  ':root { --token } / var()': 'Save a color once, reuse it everywhere with var().',
  '@keyframes / animation': 'Keyframes = the dance moves. Animation = play that dance.',
  'animation-duration / iteration / timing': 'How long, how many times, and how smooth the dance feels.',
  'transform: rotate + animation': 'Spin something by rotating it in a loop.',
  filter: 'Blur, glow, or mood filters — like Instagram for HTML.',
  'backdrop-filter': 'Blur what’s behind a see-through card (glass look).',
  '@media': 'Different styles for phone vs desktop.',
  'auto-fit / minmax': 'Grid that auto-fits cards to any screen size.',
  'overflow / scroll-snap': 'Horizontal scroll that snaps nicely to each card.',
  'cubic-bezier': 'Custom “bounce feel” for your motion.',
  'opacity / mix-blend-mode': 'opacity = see-through. blend = remix colors with the background.',
  'dynamic finale': 'Variables + motion + hover + responsive. Full glow toolkit.',
}

function plainPurpose(lesson: TagLesson): string {
  return PLAIN[lesson.tag] ?? lesson.purpose.split(/[.!]/)[0].trim() + '.'
}

function shortExample(example: string): string {
  return example.split('\n').slice(0, 5).join('\n')
}

function shortJob(brief?: string): string {
  if (!brief) return 'Follow the checklist. Keep it simple.'
  // Prefer the actionable first clause
  const cleaned = brief.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= 110) return cleaned
  const cut = cleaned.slice(0, 110)
  const at = cut.lastIndexOf(' ')
  return (at > 60 ? cut.slice(0, at) : cut) + '…'
}

/** Make CSS quests calm: short jobs, plain talk, tiny examples. */
export function makeCssEasy(quest: QuestDef): QuestDef {
  return {
    ...quest,
    hook: quest.hook.split(/[.!]/)[0].trim() + '.',
    missionBrief: shortJob(quest.missionBrief),
    lessonSummary: quest.lessonSummary.split(/[.!]/)[0].trim() + '.',
    realWorldWin: quest.realWorldWin
      ? quest.realWorldWin.split(/[.!]/)[0].trim() + '.'
      : quest.realWorldWin,
    tagLessons: quest.tagLessons.map((lesson) => ({
      tag: lesson.tag,
      purpose: plainPurpose(lesson),
      example: shortExample(lesson.example),
    })),
    winQuips: ['Yesss. That glow is crazy good.', 'POSTED. Main character energy.', 'Iconic. Next look?'],
    failQuips: ['Almost — check the checklist and try again.', 'Tiny miss. Peek the example and retry.', 'No stress — fix one goal, then post.'],
  }
}
