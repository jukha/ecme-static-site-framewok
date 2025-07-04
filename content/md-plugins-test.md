# Markdown-it Plugin Demos

This document contains demo content for various \`markdown-it\` plugins to help you verify their functionality.

---

## 1. \`@mdit/plugin-abbr\` (Abbreviations)

This plugin allows you to define abbreviations.

_[HTML]: Hyper Text Markup Language
_[W3C]: World Wide Web Consortium

The HTML specificationis maintained by the W3C.

---

## 2. \`@mdit/plugin-alert\` (Alert Blocks)

This plugin provides special blockquotes for alerts/notes/warnings.

> [!note]
> This is note text

> [!important]
> This is important text

> [!tip]
> This is tip text

> [!warning]
> This is warning text

> [!caution]
> This is caution text

---

## 3. \`@mdit/plugin-align\` (Text Alignment)

This plugin allows you to align text.

:::: center

### Twinkle, Twinkle, Little Star

::: right

——Jane Taylor

:::

Twinkle, twinkle, little star,

How I wonder what you are!

Up above the world so high,

Like a diamond in the sky.

When the blazing sun is gone,

When he nothing shines upon,

Then you show your little light,

Twinkle, twinkle, all the night.

Then the traveller in the dark,

Thanks you for your tiny spark,

He could not see which way to go,

If you did not twinkle so.

In the dark blue sky you keep,

And often thro' my curtains peep,

For you never shut your eye,

Till the sun is in the sky.

'Tis your bright and tiny spark,

Lights the trav’ller in the dark,

Tho' I know not what you are,

Twinkle, twinkle, little star.

::::

---

## 4. \`@mdit/plugin-attrs\` (Custom Attributes)

This plugin allows adding custom attributes to block and inline elements.

# Heading with ID and Class {id="my-heading" class="special-title"}

This is a paragraph with a custom ID. {id="my-paragraph"}

## Hello World {.border}

---

## 5. \`@mdit/plugin-container\` (Custom Containers)

This plugin allows defining custom block containers.

::: info My Custom Info Box
This is content inside a custom info container.
You can put any Markdown here.
:::

::: warning Danger Zone
Be aware of the potential risks!
:::

---

## 6. \`@mdit/plugin-demo\` (Demo Blocks)

This plugin typically renders code blocks with a live preview. The exact rendering depends on your setup.

::: demo

# Heading 1

Text

:::

---

## 7. \`@mdit/plugin-dl\` (Definition Lists)

This plugin supports definition lists.

Apple
: Pomaceous fruit of plants of the genus Malus in the family Rosaceae.

Orange
: The fruit of an evergreen tree of the genus Citrus.

---

## 8. \`@mdit/plugin-embed\` (Embedding Content)

This plugin allows embedding content from various sources.

{% youtube dQw4w9WgXcQ %}

---

## 9. \`@mdit/plugin-figure\` (Figures with Captions)

This plugin creates \`<figure>\` and \`<figcaption>\` elements for images.

![Logo](/favicon.ico)

[![Logo](/favicon.ico)](https://commonmark.org/)

![Logo](/favicon.ico 'Markdown')

[![Logo](/favicon.ico 'Markdown')](https://commonmark.org/)

---

## 10. \`@mdit/plugin-footnote\` (Footnotes)

This plugin enables footnotes.

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference.

[^first]: Footnote **can have markup**

    and multiple paragraphs[^second].

[^second]: Footnote text.

---

## 11. \`@mdit/plugin-icon\` (Icons)

This plugin allows embedding icons from icon libraries (e.g., Font Awesome, Material Design Icons).

iPhone is made by ::create-icon =16 /red::.

---

## 12. \`@mdit/plugin-img-lazyload\` (Image Lazyload)

This plugin automatically adds \`loading="lazy"\` to images. No special Markdown syntax is needed; just a regular image.

![Lazy Loaded Image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s)

---

## 13. \`@mdit/plugin-img-mark\` (Image Mark)

This plugin allows adding marks or highlights to images. The exact syntax might vary, but a common approach uses fragments.

![GitHub Light](https://mdit-plugins.github.io/github-light.png#dark)
![GitHub Dark](https://mdit-plugins.github.io/github-dark.png#light)

---

## 14. \`@mdit/plugin-img-size\` (Image Size)

This plugin allows specifying image dimensions directly in Markdown.

<!-- New Syntax -->

![Logo =200x200](https://mdit-plugins.github.io/logo.svg 'Markdown')
![Logo =150x](https://mdit-plugins.github.io/logo.svg 'Markdown')
![Logo =x100](https://mdit-plugins.github.io/logo.svg 'Markdown')

---

## 15. \`@mdit/plugin-include\` (Include Files)

This plugin allows including content from other Markdown files.
_Note: This demo only shows the syntax. For it to work, \`another-file.md\` must exist in your content directory at the correct path._

@@include(another-file.md)

---

## 16. \`@mdit/plugin-ins\` (Inserted Text)

This plugin renders text as "inserted" (typically underlined).

This is some ++inserted text++.

---

## 17. \`@mdit/plugin-katex\` (KaTeX Math Rendering)

This plugin renders LaTeX math using KaTeX.

Euler’s identity $e^{i\pi}+1=0$ is a beautiful formula in $\mathbb{R}^2$.

$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}
$$

---

## 18. \`@mdit/plugin-mark\` (Marked/Highlighted Text)

This plugin renders text as "marked" (typically highlighted).

This is some ==highlighted text==.

---

## 19. \`@mdit/plugin-mathjax\` (MathJax Math Rendering)

This plugin renders LaTeX math using MathJax.

Inline math: $a^2 + b^2 = c^2$

Block math:
$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$

---

## 20. \`@mdit/plugin-plantuml\` (PlantUML Diagrams)

This plugin renders PlantUML diagrams.

\`\`\`plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another request
Alice <-- Bob: Another response
@enduml
\`\`\`

---

## 21. \`@mdit/plugin-ruby\` (Ruby Annotations)

This plugin adds Ruby annotations (for East Asian languages).

{漢字|かんじ} (Kanji)

---

## 22. \`@mdit/plugin-snippet\` (Code Snippets)

This plugin allows including code snippets from files.
_Note: This demo only shows the syntax. For it to work, \`my-code.js\` must exist in your content directory at the correct path._

@snippet(./my-code.js)

---

## 23. \`@mdit/plugin-spoiler\` (Spoiler Text)

This plugin creates collapsible spoiler blocks.

VuePress Theme Hope is !!powerful!!.

---

## 24. \`@mdit/plugin-stylize\` (Stylize)

This plugin allows applying custom styles or classes using a simplified syntax.

::red[This text should be red.]
::blue[This text should be blue and **bold**.]

---

## 25. \`@mdit/plugin-sub\` (Subscript)

This plugin enables subscript text.

Water is H~2~O.
The chemical formula for methane is CH~4~.

---

## 26. \`@mdit/plugin-sup\` (Superscript)

This plugin enables superscript text.

E=mc^2^
The first power is X^1^, the second is X^2^.

---

## 27. \`@mdit/plugin-tab\` (Tabs)

This plugin creates tabbed content blocks.

::: tabs#fruit

@tab apple

Apple

@tab banana

Banana

@tab orange

Orange

:::

---

## 28. \`@mdit/plugin-tasklist\` (Task List)

This plugin renders GitHub-style task lists.

- [x] Completed task
- [ ] Uncompleted task
- [x] Another completed task
    - [ ] Nested task

---

## 29. \`@mdit/plugin-tex\` (TeX Math Rendering)

This plugin renders TeX math (similar to KaTeX/MathJax).

Inline TeX: $x^2 + y^2 = r^2$

Block TeX:
$$\\frac{d}{dx} \\left( \\int_{a}^{x} f(t) dt \\right) = f(x)$$

---

## 30. \`@mdit/plugin-uml\` (UML Diagrams)

This plugin renders UML diagrams (often using Mermaid.js).

\
@demostart
Content
Another content
@demoend
