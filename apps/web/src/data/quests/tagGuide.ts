import type { TagLesson } from './types'

/**
 * Super-simple HTML tag guide.
 * Written so a total beginner can understand on first read.
 */
export const TAG_GUIDE: Record<string, Omit<TagLesson, 'tag'> & { tag: string }> = {
  p: {
    tag: '<p>',
    purpose: 'This makes a normal line of text on the page. Like writing one short paragraph in a notebook.',
    why: 'So your words look clean and separate. Without it, text can stick together and look messy.',
    whenToUse: 'Anytime you want to write normal words: hello messages, bio, story, description.',
    attributes: [
      { name: 'class', meaning: 'A nickname so you can style this text later (optional).' },
      { name: 'id', meaning: 'A unique name for this one text block (optional).' },
    ],
    example: '<p>I am learning HTML.</p>',
    mistake: 'Do not write only <p>. Always finish with </p> and put words in the middle.',
  },
  div: {
    tag: '<div>',
    purpose: 'This is a box. You put other things inside the box so they stay together.',
    why: 'Websites need boxes to organize parts — like putting toys in one basket.',
    whenToUse: 'When you want to group things together in one area.',
    attributes: [
      { name: 'class', meaning: 'A nickname for the box, like class="card".' },
      { name: 'id', meaning: 'A unique name for this one box.' },
    ],
    example: '<div>\n  <p>This text is inside the box</p>\n</div>',
    mistake: 'Do not forget </div>. An open box with no end is incomplete.',
  },
  h1: {
    tag: '<h1>',
    purpose: 'This is the big title of the page. The biggest heading.',
    why: 'People look at the big title first to know what the page is about.',
    whenToUse: 'Use once near the top for the main title.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for styling.' }],
    example: '<h1>My Website</h1>',
    mistake: 'Do not leave it empty. Write a title and close with </h1>.',
  },
  h2: {
    tag: '<h2>',
    purpose: 'This is a section title. Smaller than h1, bigger than normal text.',
    why: 'It helps break a long page into clear parts, like chapter names.',
    whenToUse: 'For section names like About, Skills, Contact.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for styling.' }],
    example: '<h2>About Me</h2>',
    mistake: 'Do not skip writing words inside. Empty titles help nobody.',
  },
  h3: {
    tag: '<h3>',
    purpose: 'This is a smaller title under an h2 section.',
    why: 'It makes smaller topics easy to find inside a bigger section.',
    whenToUse: 'When one section has smaller parts inside it.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for styling.' }],
    example: '<h3>My Hobbies</h3>',
    mistake: 'Do not use h3 as your only page title. Start with h1 first.',
  },
  ul: {
    tag: '<ul>',
    purpose: 'This starts a bullet list (dots).',
    why: 'Lists are easier to read than one long sentence.',
    whenToUse: 'For things like skills, features, or shopping items where order does not matter.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for styling the list.' }],
    example: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>',
    mistake: 'Do not put words directly in ul. Put each item in <li>.</li>.',
  },
  ol: {
    tag: '<ol>',
    purpose: 'This starts a numbered list (1, 2, 3...).',
    why: 'Numbers show the correct order of steps.',
    whenToUse: 'For steps, recipes, or ranked lists.',
    attributes: [{ name: 'start', meaning: 'Optional. Which number to start from.' }],
    example: '<ol>\n  <li>Open the editor</li>\n  <li>Write code</li>\n</ol>',
    mistake: 'If order does not matter, use <ul> instead.',
  },
  li: {
    tag: '<li>',
    purpose: 'This is one item in a list.',
    why: 'Each point gets its own line, so reading is easy.',
    whenToUse: 'Always inside <ul> or <ol>.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for one item.' }],
    example: '<li>Learn every day</li>',
    mistake: 'Do not leave <li> empty. Write something and close with </li>.',
  },
  strong: {
    tag: '<strong>',
    purpose: 'This makes words look important (usually bold).',
    why: 'It tells people: “pay attention to this part.”',
    whenToUse: 'For key words inside a sentence.',
    attributes: [],
    example: '<p>Please <strong>save your work</strong>.</p>',
    mistake: 'Do not make the whole page strong. Only important words.',
  },
  em: {
    tag: '<em>',
    purpose: 'This adds soft stress to a word (usually italic).',
    why: 'It shows feeling or emphasis, like how we stress words when speaking.',
    whenToUse: 'When one word in a sentence needs extra stress.',
    attributes: [],
    example: '<p>I <em>really</em> love coding.</p>',
    mistake: 'Do not wrap huge paragraphs in em. Keep it small.',
  },
  span: {
    tag: '<span>',
    purpose: 'This wraps a small piece of text inside a line.',
    why: 'So you can style or mark just a few words, not the whole paragraph.',
    whenToUse: 'To highlight one word or short phrase inside text.',
    attributes: [
      { name: 'class', meaning: 'Nickname for styling those words.' },
      { name: 'id', meaning: 'Unique name for that tiny piece of text.' },
    ],
    example: '<p>Hello <span>friend</span></p>',
    mistake: 'Do not use span as a big page section. Use div or section for that.',
  },
  a: {
    tag: '<a>',
    purpose: 'This makes a clickable link.',
    why: 'Links take people to another page or website.',
    whenToUse: 'For menus, “click here”, or any jump to another place.',
    attributes: [
      { name: 'href', meaning: 'Where the link goes. Example: href="https://example.com"' },
      { name: 'target', meaning: 'Optional. Use "_blank" to open in a new tab.' },
    ],
    example: '<a href="https://example.com">Visit Example</a>',
    mistake: 'A link needs href and visible words. Empty links confuse people.',
  },
  img: {
    tag: '<img>',
    purpose: 'This shows a picture. It has no closing tag.',
    why: 'Pictures make pages clearer and more fun.',
    whenToUse: 'For photos, icons, logos, or any image.',
    attributes: [
      { name: 'src', meaning: 'The picture file path or link.' },
      { name: 'alt', meaning: 'Short text that describes the picture (very important).' },
    ],
    example: '<img src="hero.jpg" alt="A warrior in the arena" />',
    mistake: 'Do not forget alt. If the image fails, people still need to know what it was.',
  },
  br: {
    tag: '<br>',
    purpose: 'This forces a new line inside text. No closing tag.',
    why: 'Sometimes you want the next words on the next line.',
    whenToUse: 'Inside a paragraph for a short line break.',
    attributes: [],
    example: '<p>Line one<br>Line two</p>',
    mistake: 'Do not use many <br> tags to build a whole page layout.',
  },
  hr: {
    tag: '<hr>',
    purpose: 'This draws a simple divider line. No closing tag.',
    why: 'It shows that one topic ended and a new topic begins.',
    whenToUse: 'Between two different parts of content.',
    attributes: [],
    example: '<p>Part A</p>\n<hr>\n<p>Part B</p>',
    mistake: 'Do not use hr instead of real section titles when a title is better.',
  },
  blockquote: {
    tag: '<blockquote>',
    purpose: 'This shows a quote from someone else.',
    why: 'So readers know these words are a quote, not your normal text.',
    whenToUse: 'For testimonials, famous quotes, or copied long lines.',
    attributes: [{ name: 'cite', meaning: 'Optional link to where the quote came from.' }],
    example: '<blockquote>\n  <p>Code is power.</p>\n</blockquote>',
    mistake: 'Do not leave blockquote empty. Put the quote inside.',
  },
  cite: {
    tag: '<cite>',
    purpose: 'This names the source of a quote (like a book or article title).',
    why: 'It gives credit to where the quote came from.',
    whenToUse: 'Next to quotes or references.',
    attributes: [],
    example: '<cite>Clean Code</cite>',
    mistake: 'Do not use cite for a person’s name. Use it for work titles.',
  },
  code: {
    tag: '<code>',
    purpose: 'This shows short code inside a sentence.',
    why: 'So people know this text is code, not normal English.',
    whenToUse: 'When you mention a tag name or short command in a paragraph.',
    attributes: [],
    example: '<p>Use the <code>&lt;p&gt;</code> tag for text.</p>',
    mistake: 'For long code blocks, wrap code inside <pre> too.',
  },
  pre: {
    tag: '<pre>',
    purpose: 'This keeps spaces and line breaks exactly as you typed them.',
    why: 'Code needs exact spacing to stay readable.',
    whenToUse: 'For multi-line code samples.',
    attributes: [],
    example: '<pre><code>hello()</code></pre>',
    mistake: 'Do not leave pre empty.',
  },
  header: {
    tag: '<header>',
    purpose: 'This is the top area of a page. Like the banner at the top.',
    why: 'People expect the title and menu near the top. Header marks that area clearly.',
    whenToUse: 'For the top part: site name, logo, or top menu.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for styling.' }],
    example: '<header>\n  <h1>Code Fatality</h1>\n</header>',
    mistake: 'Do not write only <header>. Put content inside and close with </header>.',
  },
  main: {
    tag: '<main>',
    purpose: 'This is the main content area. The most important part of the page.',
    why: 'It tells the browser: “this is the real content people came to read.”',
    whenToUse: 'For the main lesson, article, or center content. Use once per page.',
    attributes: [],
    example: '<main>\n  <h2>Lesson</h2>\n  <p>Learn HTML the easy way.</p>\n</main>',
    mistake: 'Do not leave main empty. Put real content inside and close it.',
  },
  nav: {
    tag: '<nav>',
    purpose: 'This holds menu links.',
    why: 'So people can move around your site easily.',
    whenToUse: 'For Home, About, Contact, or chapter links.',
    attributes: [{ name: 'aria-label', meaning: 'Optional name if you have more than one menu.' }],
    example: '<nav>\n  <a href="/">Home</a>\n</nav>',
    mistake: 'A nav should contain real links with words people can click.',
  },
  footer: {
    tag: '<footer>',
    purpose: 'This is the bottom area of the page.',
    why: 'People look at the bottom for copyright, contact, or extra links.',
    whenToUse: 'At the end of the page.',
    attributes: [],
    example: '<footer>\n  <p>© 2026 Code Fatality</p>\n</footer>',
    mistake: 'Do not leave footer empty. Add something useful and close it.',
  },
  section: {
    tag: '<section>',
    purpose: 'This groups one topic together.',
    why: 'Long pages are easier when each topic has its own section.',
    whenToUse: 'For parts like News, Features, or FAQ.',
    attributes: [{ name: 'id', meaning: 'Optional name for jump links.' }],
    example: '<section>\n  <h2>News</h2>\n  <p>New update today.</p>\n</section>',
    mistake: 'Do not make an empty section. Add a title and content.',
  },
  article: {
    tag: '<article>',
    purpose: 'This is one complete piece of content, like one post or one card.',
    why: 'It marks content that can stand alone and still make sense.',
    whenToUse: 'Blog posts, news cards, or self-contained stories.',
    attributes: [],
    example: '<article>\n  <h2>My First Win</h2>\n  <p>I cleared chapter 1.</p>\n</article>',
    mistake: 'Do not use article for tiny random text with no meaning.',
  },
  aside: {
    tag: '<aside>',
    purpose: 'This is side information, like a tip box.',
    why: 'It keeps extra tips away from the main story.',
    whenToUse: 'For tips, notes, or related links on the side.',
    attributes: [],
    example: '<aside>\n  <p>Tip: always close your tags.</p>\n</aside>',
    mistake: 'Do not leave aside empty.',
  },
  figure: {
    tag: '<figure>',
    purpose: 'This groups a picture with its caption.',
    why: 'So the image and its explanation stay together.',
    whenToUse: 'When an image needs a short description under it.',
    attributes: [],
    example:
      '<figure>\n  <img src="arena.jpg" alt="Arena" />\n  <figcaption>The arena</figcaption>\n</figure>',
    mistake: 'A figure usually needs both an image and a caption.',
  },
  figcaption: {
    tag: '<figcaption>',
    purpose: 'This is the caption text under a picture.',
    why: 'It explains what the picture is.',
    whenToUse: 'Inside <figure>, under the image.',
    attributes: [],
    example: '<figcaption>Warrior face-off</figcaption>',
    mistake: 'Do not put figcaption outside figure.',
  },
  form: {
    tag: '<form>',
    purpose: 'This is a form where users type and submit information.',
    why: 'Login, search, and signup all need forms.',
    whenToUse: 'Anytime you collect user input.',
    attributes: [
      { name: 'action', meaning: 'Where the form data goes.' },
      { name: 'method', meaning: 'How data is sent (get or post).' },
    ],
    example: '<form>\n  <label for="name">Name</label>\n  <input id="name" type="text" />\n</form>',
    mistake: 'Do not leave a form empty. Put inputs inside.',
  },
  input: {
    tag: '<input>',
    purpose: 'This is a typing box or choice control. No closing tag.',
    why: 'Users need a place to type or choose answers.',
    whenToUse: 'Inside forms for name, email, password, and more.',
    attributes: [
      { name: 'type', meaning: 'What kind of input: text, email, password, checkbox...' },
      { name: 'id', meaning: 'Links this input to a label.' },
      { name: 'placeholder', meaning: 'Hint text inside the box.' },
      { name: 'required', meaning: 'User must fill this before submit.' },
    ],
    example: '<input id="email" type="email" placeholder="you@mail.com" required />',
    mistake: 'Use the correct type the mission asks for.',
  },
  label: {
    tag: '<label>',
    purpose: 'This is the name shown next to an input box.',
    why: 'So users know what to type. Clicking the label also focuses the box.',
    whenToUse: 'For every important form field.',
    attributes: [{ name: 'for', meaning: 'Must match the input id. Example: for="name" with id="name".' }],
    example: '<label for="name">Name</label>\n<input id="name" type="text" />',
    mistake: 'If for and id do not match, the label will not connect correctly.',
  },
  button: {
    tag: '<button>',
    purpose: 'This makes a clickable button.',
    why: 'Buttons start actions like submit, save, or continue.',
    whenToUse: 'For actions users can click.',
    attributes: [{ name: 'type', meaning: 'Use type="submit" to send a form.' }],
    example: '<button type="submit">Send</button>',
    mistake: 'Do not leave button text empty. People need to read what it does.',
  },
  textarea: {
    tag: '<textarea>',
    purpose: 'This is a big multi-line typing box.',
    why: 'Useful for long answers, comments, or messages.',
    whenToUse: 'When one-line input is not enough.',
    attributes: [
      { name: 'rows', meaning: 'How tall the box looks.' },
      { name: 'name', meaning: 'Name used when submitting the form.' },
    ],
    example: '<textarea name="bio" rows="4">Write about yourself</textarea>',
    mistake: 'Always close textarea with </textarea>.',
  },
  select: {
    tag: '<select>',
    purpose: 'This makes a dropdown menu.',
    why: 'Users can pick one option from a ready list.',
    whenToUse: 'For choices like plan, city, or difficulty.',
    attributes: [{ name: 'name', meaning: 'Name used when submitting.' }],
    example: '<select name="plan">\n  <option>Free</option>\n  <option>Pro</option>\n</select>',
    mistake: 'A select needs option items inside it.',
  },
  option: {
    tag: '<option>',
    purpose: 'This is one choice inside a dropdown.',
    why: 'Each option is one possible answer.',
    whenToUse: 'Always inside <select>.',
    attributes: [{ name: 'value', meaning: 'The value sent when this option is chosen.' }],
    example: '<option value="pro">Pro</option>',
    mistake: 'Do not leave options empty.',
  },
  fieldset: {
    tag: '<fieldset>',
    purpose: 'This groups related form fields together.',
    why: 'Long forms become easier when similar fields stay in one group.',
    whenToUse: 'For groups like Login details or Shipping info.',
    attributes: [],
    example: '<fieldset>\n  <legend>Login</legend>\n  <input type="email" />\n</fieldset>',
    mistake: 'Usually add a <legend> so the group has a clear title.',
  },
  legend: {
    tag: '<legend>',
    purpose: 'This is the title of a fieldset group.',
    why: 'It tells users what that group of inputs is about.',
    whenToUse: 'Inside fieldset, usually at the top.',
    attributes: [],
    example: '<legend>Account details</legend>',
    mistake: 'Do not put legend outside fieldset.',
  },
  table: {
    tag: '<table>',
    purpose: 'This makes a table with rows and columns.',
    why: 'Perfect for scores, prices, schedules, and comparisons.',
    whenToUse: 'For data that fits in a grid. Not for whole page layout.',
    attributes: [],
    example: '<table>\n  <tr><td>HTML</td><td>A+</td></tr>\n</table>',
    mistake: 'Do not build your whole website with tables.',
  },
  thead: {
    tag: '<thead>',
    purpose: 'This is the header part of a table (column titles).',
    why: 'It shows what each column means.',
    whenToUse: 'At the top of data tables.',
    attributes: [],
    example: '<thead>\n  <tr><th>Skill</th><th>Rank</th></tr>\n</thead>',
    mistake: 'Put title cells with <th>, not normal <td>.',
  },
  tbody: {
    tag: '<tbody>',
    purpose: 'This holds the main data rows of a table.',
    why: 'It keeps real data separate from column titles.',
    whenToUse: 'Under thead in a complete table.',
    attributes: [],
    example: '<tbody>\n  <tr><td>CSS</td><td>A</td></tr>\n</tbody>',
    mistake: 'Do not leave tbody empty.',
  },
  th: {
    tag: '<th>',
    purpose: 'This is a title cell in a table.',
    why: 'It names the column so data makes sense.',
    whenToUse: 'Inside thead rows.',
    attributes: [{ name: 'scope', meaning: 'Optional. Use scope="col" for column titles.' }],
    example: '<th scope="col">XP</th>',
    mistake: 'Do not use td for titles. Use th.',
  },
  td: {
    tag: '<td>',
    purpose: 'This is a normal data cell.',
    why: 'Each cell holds one value.',
    whenToUse: 'Inside body rows.',
    attributes: [],
    example: '<td>120</td>',
    mistake: 'Keep each cell clear and simple.',
  },
  tr: {
    tag: '<tr>',
    purpose: 'This is one row in a table.',
    why: 'Tables are built one row at a time.',
    whenToUse: 'Inside thead or tbody.',
    attributes: [],
    example: '<tr><td>HTML</td><td>50</td></tr>',
    mistake: 'A row needs cells inside it.',
  },
  video: {
    tag: '<video>',
    purpose: 'This plays a video.',
    why: 'You can show lessons or demos right on the page.',
    whenToUse: 'For video content.',
    attributes: [
      { name: 'controls', meaning: 'Shows play and pause buttons.' },
      { name: 'src', meaning: 'The video file link.' },
    ],
    example: '<video controls src="intro.mp4"></video>',
    mistake: 'Add controls so users can play the video.',
  },
  audio: {
    tag: '<audio>',
    purpose: 'This plays sound.',
    why: 'Useful for music, voice notes, or sound effects.',
    whenToUse: 'For audio clips.',
    attributes: [
      { name: 'controls', meaning: 'Shows audio controls.' },
      { name: 'src', meaning: 'The audio file link.' },
    ],
    example: '<audio controls src="hit.mp3"></audio>',
    mistake: 'Add controls so users can play the sound.',
  },
  details: {
    tag: '<details>',
    purpose: 'This creates a show/hide box.',
    why: 'Users can open extra info only when they want it.',
    whenToUse: 'For FAQ answers and optional tips.',
    attributes: [{ name: 'open', meaning: 'Optional. Starts open.' }],
    example: '<details>\n  <summary>What is HTML?</summary>\n  <p>HTML builds web pages.</p>\n</details>',
    mistake: 'Always include a <summary> title people can click.',
  },
  summary: {
    tag: '<summary>',
    purpose: 'This is the clickable title of a details box.',
    why: 'Users need a clear label to open or close the extra info.',
    whenToUse: 'Inside details.',
    attributes: [],
    example: '<summary>Show tip</summary>',
    mistake: 'Do not put summary outside details.',
  },
  html: {
    tag: '<html>',
    purpose: 'This wraps the whole webpage.',
    why: 'It is the root container of the full document.',
    whenToUse: 'In full HTML pages.',
    attributes: [{ name: 'lang', meaning: 'Page language. Example: lang="en".' }],
    example: '<html lang="en">\n  <head>...</head>\n  <body>...</body>\n</html>',
    mistake: 'For full pages, add lang so the language is clear.',
  },
  head: {
    tag: '<head>',
    purpose: 'This holds hidden page settings (title, meta). Users do not see this area directly.',
    why: 'The browser tab title and important settings live here.',
    whenToUse: 'In full HTML documents.',
    attributes: [],
    example: '<head>\n  <meta charset="UTF-8" />\n  <title>Arena</title>\n</head>',
    mistake: 'Do not put normal visible text in head.',
  },
  body: {
    tag: '<body>',
    purpose: 'This holds everything people can see on the page.',
    why: 'All visible content belongs here.',
    whenToUse: 'In full HTML documents.',
    attributes: [{ name: 'class', meaning: 'Optional nickname for whole-page styling.' }],
    example: '<body>\n  <h1>Hello</h1>\n</body>',
    mistake: 'Do not leave body empty if the page should show content.',
  },
  title: {
    tag: '<title>',
    purpose: 'This sets the text in the browser tab.',
    why: 'Users and Google use it to know the page name.',
    whenToUse: 'Inside <head>.',
    attributes: [],
    example: '<title>Code Fatality</title>',
    mistake: 'Do not leave title empty.',
  },
  meta: {
    tag: '<meta>',
    purpose: 'This stores page settings. No closing tag.',
    why: 'Used for character set, description, and mobile setup.',
    whenToUse: 'Inside head.',
    attributes: [
      { name: 'charset', meaning: 'Usually UTF-8 so all characters show correctly.' },
      { name: 'name + content', meaning: 'Settings like description or viewport.' },
    ],
    example: '<meta name="description" content="Learn HTML the easy way." />',
    mistake: 'If a mission asks for content, do not leave it blank.',
  },
  time: {
    tag: '<time>',
    purpose: 'This marks a date or time.',
    why: 'So both people and computers can understand the date.',
    whenToUse: 'For post dates and event times.',
    attributes: [{ name: 'datetime', meaning: 'Machine date value, like 2026-08-01.' }],
    example: '<time datetime="2026-08-01">Aug 1, 2026</time>',
    mistake: 'Add datetime when the mission asks for it.',
  },
  address: {
    tag: '<address>',
    purpose: 'This shows contact information.',
    why: 'It clearly marks contact details.',
    whenToUse: 'In footers or author info areas.',
    attributes: [],
    example: '<address>\n  Email: nova@codex.dev\n</address>',
    mistake: 'Do not leave address empty.',
  },
  progress: {
    tag: '<progress>',
    purpose: 'This shows how much of a task is done.',
    why: 'People understand progress bars very quickly.',
    whenToUse: 'For loading or quest completion.',
    attributes: [
      { name: 'value', meaning: 'How much is done now.' },
      { name: 'max', meaning: 'The full amount.' },
    ],
    example: '<progress value="70" max="100"></progress>',
    mistake: 'Set value and max clearly.',
  },
  meter: {
    tag: '<meter>',
    purpose: 'This shows a score inside a known range.',
    why: 'Useful for ratings or levels inside min/max limits.',
    whenToUse: 'For gauges like score or storage.',
    attributes: [
      { name: 'value', meaning: 'Current number.' },
      { name: 'min / max', meaning: 'Lowest and highest possible values.' },
    ],
    example: '<meter value="0.6" min="0" max="1"></meter>',
    mistake: 'Use progress for unknown-length tasks, meter for known ranges.',
  },
  picture: {
    tag: '<picture>',
    purpose: 'This can show different images for different screen sizes.',
    why: 'Phones and desktops can get the best image for each screen.',
    whenToUse: 'When you need responsive images.',
    attributes: [],
    example:
      '<picture>\n  <source srcset="wide.jpg" media="(min-width: 800px)" />\n  <img src="small.jpg" alt="Hero" />\n</picture>',
    mistake: 'Always keep a normal <img> fallback inside picture.',
  },
  source: {
    tag: '<source>',
    purpose: 'This gives another file option for picture/video/audio. No closing tag.',
    why: 'The browser can pick the best file.',
    whenToUse: 'Inside picture, video, or audio.',
    attributes: [
      { name: 'srcset', meaning: 'Image options for picture.' },
      { name: 'src', meaning: 'File path for video/audio.' },
      { name: 'media', meaning: 'When to use this source.' },
    ],
    example: '<source srcset="wide.jpg" media="(min-width: 900px)" />',
    mistake: 'Do not put source alone outside picture/video/audio.',
  },
  datalist: {
    tag: '<datalist>',
    purpose: 'This gives suggestion options for an input box.',
    why: 'Users can type faster with helpful suggestions.',
    whenToUse: 'When an input has recommended values.',
    attributes: [{ name: 'id', meaning: 'Must match the input list="..." value.' }],
    example:
      '<input list="cities" />\n<datalist id="cities">\n  <option value="Delhi" />\n</datalist>',
    mistake: 'list and id must match exactly.',
  },
}

function normalizeTagKey(tag: string): string {
  return tag.replace(/[<>/\s]/g, '').toLowerCase().split('{')[0]!.trim()
}

function lessonFromGuide(key: string): TagLesson | null {
  const guide = TAG_GUIDE[key]
  if (!guide) return null
  return {
    tag: guide.tag,
    purpose: guide.purpose,
    why: guide.why,
    whenToUse: guide.whenToUse,
    attributes: guide.attributes,
    example: guide.example,
    mistake: guide.mistake,
  }
}

/** Merge quest tagLessons with the simple TAG_GUIDE encyclopedia. */
export function enrichTagLessons(lessons: TagLesson[]): TagLesson[] {
  return lessons.map((lesson) => {
    const key = normalizeTagKey(lesson.tag)
    const guide = TAG_GUIDE[key]
    if (!guide) return lesson
    return {
      tag: lesson.tag || guide.tag,
      purpose: guide.purpose || lesson.purpose,
      why: guide.why ?? lesson.why,
      whenToUse: guide.whenToUse ?? lesson.whenToUse,
      attributes: guide.attributes?.length ? guide.attributes : lesson.attributes,
      example: guide.example || lesson.example,
      mistake: guide.mistake ?? lesson.mistake,
    }
  })
}

/** Keep every mission tag in the instruction list — not just the first one. */
export function completeTagLessons(quest: {
  tagLessons: TagLesson[]
  objectives: { id: string; label: string }[]
}): TagLesson[] {
  const lessons: TagLesson[] = []
  const seen = new Set<string>()

  const add = (lesson: TagLesson) => {
    const key = normalizeTagKey(lesson.tag)
    if (!key || seen.has(key)) return
    seen.add(key)
    lessons.push(lesson)
  }

  for (const lesson of quest.tagLessons) add(lesson)

  for (const obj of quest.objectives) {
    const fromId = lessonFromGuide(obj.id)
    if (fromId) add(fromId)

    const names = obj.label.match(/<\/?([a-z][a-z0-9]*)\b/gi) ?? []
    for (const raw of names) {
      const key = raw.replace(/[</>]/g, '').toLowerCase()
      const extra = lessonFromGuide(key)
      if (extra) add(extra)
    }
  }

  return lessons
}
