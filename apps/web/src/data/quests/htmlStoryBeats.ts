import type { StoryBeat } from './types'

/** Story reactions for every HTML Village chapter (tag → scene). */
export const HTML_STORY_BEATS: Record<string, StoryBeat[]> = {
  'html-b01': [
    { when: 'p', scene: 'speechBubble', line: 'First words hit the air — the village hears you.' },
  ],
  'html-b02': [
    { when: 'div', scene: 'boxRise', line: 'A crate rises from the dirt — containers hold the world together.' },
    { when: 'nested-p', scene: 'speechBubble', line: 'Words inside the box. Nesting = power.' },
  ],
  'html-b03': [
    { when: 'h1', scene: 'signDrop', line: 'The village sign drops — that headline owns the sky.' },
    { when: 'p', scene: 'speechBubble', line: 'Details follow the title. Story + substance.' },
  ],
  'html-b04': [
    { when: 'h1', scene: 'signDrop', line: 'Main title stands tall.' },
    { when: 'h2', scene: 'sectionLights', line: 'A section door unlocks — h2 marks a new zone.' },
    { when: 'h3', scene: 'sectionLights', line: 'Subsection lights. Hierarchy looks pro.' },
    { when: 'p', scene: 'speechBubble', line: 'Paragraph fills the section with real words.' },
  ],
  'html-b05': [
    { when: 'ul', scene: 'listBoard', line: 'Quest board appears — every <li> is a mission pin.' },
  ],
  'html-b06': [
    { when: 'ol', scene: 'orderedBoard', line: 'Step stones light up 1…2…3 — ordered lists guide the path.' },
  ],
  'html-b07': [
    { when: 'strong', scene: 'emphasisFlash', line: 'STRONG hits like a critical — weight on the words.' },
    { when: 'em', scene: 'emphasisFlash', line: 'em tilts the tone — soft emphasis, big vibe.' },
  ],
  'html-b08': [
    { when: 'span', scene: 'spanGlow', line: 'Spotlight on just those words — span is a laser, not a room.' },
  ],
  'html-b09': [
    { when: 'a', scene: 'portalOpen', line: 'Portal rips open — your link connects this village to the net.' },
  ],
  'html-b10': [
    { when: 'img', scene: 'portraitIn', line: 'A mural hangs — the page finally has a face.' },
  ],
  'html-b11': [
    { when: 'br', scene: 'speechBubble', line: 'Line break — the scroll splits into two clean breaths.' },
    { when: 'hr', scene: 'sectionLights', line: 'A divider cuts the path — scenes stay readable.' },
  ],
  'html-b12': [
    { when: 'comment', scene: 'spanGlow', line: 'Secret note sealed — only builders can see comments.' },
    { when: 'p', scene: 'speechBubble', line: 'Visible text still shows for the world.' },
  ],
  'html-b13': [
    { when: 'id', scene: 'signDrop', line: 'Unique name carved — id is a one-of-a-kind key.' },
    { when: 'class', scene: 'boxRise', line: 'Class badge stamped — reusable groups for style later.' },
  ],
  'html-b14': [
    { when: 'bq', scene: 'speechBubble', line: 'A quote echoes across the square.' },
    { when: 'cite', scene: 'sectionLights', line: 'Source credited — respect the original voice.' },
  ],
  'html-b15': [
    { when: 'code', scene: 'spanGlow', line: 'Code glyphs spark — you speak developer.' },
    { when: 'pre', scene: 'listBoard', line: 'Preformatted block drops — spacing stays sacred.' },
  ],
  'html-b-boss': [
    { when: 'h1', scene: 'signDrop', line: 'Boss arena: title claimed.' },
    { when: 'ul', scene: 'listBoard', line: 'Inventory board locked in.' },
    { when: 'a', scene: 'portalOpen', line: 'Exit portal armed.' },
    { when: 'img', scene: 'portraitIn', line: 'Banner portrait raised.' },
    { when: 'p', scene: 'speechBubble', line: 'Your bio speaks. Beginner boss is shaking.' },
  ],

  'html-i01': [
    { when: 'header', scene: 'signDrop', line: 'Header banner unfurls across the skyline.' },
    { when: 'main', scene: 'boxRise', line: 'Main stage rises — this is where the story lives.' },
  ],
  'html-i02': [
    { when: 'nav', scene: 'portalOpen', line: 'Nav paths open — travelers can roam.' },
    { when: 'footer', scene: 'sectionLights', line: 'Footer anchors the realm. Solid ground.' },
  ],
  'html-i03': [
    { when: 'section', scene: 'sectionLights', line: 'A whole district forms — section energy.' },
    { when: 'article', scene: 'boxRise', line: 'Article stands alone — a complete story unit.' },
  ],
  'html-i04': [
    { when: 'aside', scene: 'listBoard', line: 'Side alley opens — related tips live here.' },
  ],
  'html-i05': [
    { when: 'figimg', scene: 'portraitIn', line: 'Figure framed — image + meaning together.' },
    { when: 'figcap', scene: 'speechBubble', line: 'Caption tells the tale under the art.' },
  ],
  'html-i06': [
    { when: 'form', scene: 'boxRise', line: 'Registry desk appears — forms collect destiny.' },
    { when: 'input', scene: 'spanGlow', line: 'Input field sparks — type something in.' },
  ],
  'html-i07': [
    { when: 'label', scene: 'signDrop', line: 'Label plaque mounted — users know what to fill.' },
    { when: 'submit', scene: 'portalOpen', line: 'Submit gate ready — send it.' },
  ],
  'html-i08': [
    { when: 'email', scene: 'spanGlow', line: 'Email field tuned — browsers help validate.' },
    { when: 'pass', scene: 'boxRise', line: 'Password vault seals — secrets stay masked.' },
  ],
  'html-i09': [
    { when: 'ta', scene: 'speechBubble', line: 'Long message scroll unrolls — textarea territory.' },
    { when: 'select', scene: 'listBoard', line: 'Dropdown chest opens — choose your fate.' },
  ],
  'html-i10': [
    { when: 'cb', scene: 'listBoard', line: 'Checkmarks rain — multi-select unlocked.' },
    { when: 'radio', scene: 'orderedBoard', line: 'Radio stones align — only one path chosen.' },
  ],
  'html-i11': [
    { when: 'fs', scene: 'boxRise', line: 'Fieldset rim seals a group of controls.' },
  ],
  'html-i12': [
    { when: 'rows', scene: 'listBoard', line: 'Table grid materializes — data has a battlefield.' },
    { when: 'td', scene: 'spanGlow', line: 'Cells fill — numbers find homes.' },
  ],
  'html-i13': [
    { when: 'thead', scene: 'signDrop', line: 'Column headers crown the table.' },
    { when: 'tbody', scene: 'boxRise', line: 'Body rows march in formation.' },
  ],
  'html-i14': [
    { when: 'video', scene: 'portraitIn', line: 'Cinema screen drops — video controls ready.' },
    { when: 'audio', scene: 'emphasisFlash', line: 'Sound waves pulse — audio joins the fight.' },
  ],
  'html-i15': [
    { when: 'details', scene: 'boxRise', line: 'Mystery chest — summary opens the secret.' },
  ],
  'html-i-boss': [
    { when: 'header', scene: 'signDrop', line: 'Landing banner claimed.' },
    { when: 'nav', scene: 'portalOpen', line: 'Navigation routes online.' },
    { when: 'form', scene: 'boxRise', line: 'Lead form desk deployed.' },
    { when: 'main', scene: 'sectionLights', line: 'Main content district humming.' },
  ],

  'html-e01': [
    { when: 'html', scene: 'boxRise', line: 'Root of the document — html wraps reality.' },
    { when: 'body', scene: 'speechBubble', line: 'Body awakens — visible world online.' },
  ],
  'html-e02': [
    { when: 'head', scene: 'spanGlow', line: 'Head chamber opens — metadata lives here.' },
    { when: 'title', scene: 'signDrop', line: 'Tab title carved into the browser sky.' },
  ],
  'html-e03': [
    { when: 'lang', scene: 'emphasisFlash', line: 'Language flag raised — screen readers salute.' },
  ],
  'html-e04': [
    { when: 'desc', scene: 'speechBubble', line: 'Meta description whispered to search engines.' },
  ],
  'html-e05': [
    { when: 'vp', scene: 'portalOpen', line: 'Viewport calibrated — phones stop crying.' },
  ],
  'html-e06': [
    { when: 'charset', scene: 'spanGlow', line: 'UTF-8 crystal set — emoji & languages safe.' },
  ],
  'html-e07': [
    { when: 'forid', scene: 'signDrop', line: 'Label linked to input — accessibility combo.' },
  ],
  'html-e08': [
    { when: 'req', scene: 'emphasisFlash', line: 'Required seal — empty submits blocked.' },
    { when: 'ph', scene: 'speechBubble', line: 'Placeholder hint glows inside the field.' },
  ],
  'html-e09': [
    { when: 'aria', scene: 'spanGlow', line: 'ARIA voice attached — assistive tech hears you.' },
  ],
  'html-e10': [
    { when: 'role', scene: 'sectionLights', line: 'Role landmark claimed — extra clarity unlocked.' },
  ],
  'html-e11': [
    { when: 'source', scene: 'portalOpen', line: 'Picture sources branch — responsive art path.' },
    { when: 'img', scene: 'portraitIn', line: 'Fallback image locks the frame.' },
  ],
  'html-e12': [
    { when: 'time', scene: 'signDrop', line: 'Time crystal set — machines read the date.' },
    { when: 'addr', scene: 'listBoard', line: 'Address plate mounted for contact.' },
  ],
  'html-e13': [
    { when: 'progress', scene: 'orderedBoard', line: 'Progress bar surges — the quest meter lives in HTML.' },
    { when: 'meter', scene: 'emphasisFlash', line: 'Meter needle swings — measurements native.' },
  ],
  'html-e14': [
    { when: 'dl', scene: 'listBoard', line: 'Datalist suggestions rain from the sky.' },
  ],
  'html-e15': [
    { when: 'ogt', scene: 'signDrop', line: 'Open Graph title — share previews go hard.' },
    { when: 'ogd', scene: 'speechBubble', line: 'OG description primed for the feed.' },
  ],
  'html-village-boss': [
    { when: 'html', scene: 'boxRise', line: 'Production shell online.' },
    { when: 'header', scene: 'signDrop', line: 'Expert banner raised.' },
    { when: 'nav', scene: 'portalOpen', line: 'Nav routes humming.' },
    { when: 'a11y', scene: 'spanGlow', line: 'Accessibility lock engaged.' },
    { when: 'media', scene: 'portraitIn', line: 'Media mural secured.' },
    { when: 'adv', scene: 'emphasisFlash', line: 'Advanced HTML flourish — village conquered.' },
  ],
}

export function storyBeatsFor(questId: string): StoryBeat[] | undefined {
  return HTML_STORY_BEATS[questId]
}
