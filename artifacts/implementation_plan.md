# Bilingual Resume Content Toggle (EN/ID)

Add a language toggle to the resume section so that clicking the **Indonesia** button switches the Skills → Languages content from English to Indonesian, and clicking **English** switches it back.

## Proposed Changes

### Approach

Use `data-lang-en` and `data-lang-id` attributes on translatable text elements. The existing resume language switcher buttons (English/Indonesia) already toggle active state — we'll extend their click handler to also show/hide the appropriate language content in the resume grid.

**How it works:**
- Each translatable text element gets wrapped in two `<span>` tags: one with `data-lang="en"` (visible by default) and one with `data-lang="id"` (hidden by default)
- When the Indonesia button is clicked, all `data-lang="en"` spans hide and `data-lang="id"` spans show, and vice versa
- Non-translatable content (skill names like "Python", company names, dates, etc.) stays unchanged

### Sections to translate (Skills → Languages)

| Section | What changes | What stays in English |
|---------|-------------|----------------------|
| **Skills** (heading only) | "Skills" → "Keahlian" | Skill names (Python, R, etc.) stay the same |
| **Working Experience** | Heading, job titles, bullet descriptions | Company names, dates |
| **Publications** | Heading, citation context text | Author names, paper title, conference name |
| **Education** | Heading, degree description | University name |
| **Honours and Awards** | Heading, scope labels, descriptions | Event names, dates |
| **Volunteer Experience** | Heading, role descriptions | Organization names, dates |
| **Languages** | Heading, proficiency labels | Language names |

### [MODIFY] [index.html](file:///c:/Users/ThinkPad/project/journeywithfendy/index.html)

1. **Resume grid content (L173–543)**: Add `data-lang="en"` and `data-lang="id"` spans around translatable text in all resume cards (headings, descriptions, bullets, table cells)

2. **JavaScript (L1205–1227)**: Extend the existing `resumeLanguageButtons` click handler to toggle visibility of `[data-lang]` elements inside `.resume-grid`

### [MODIFY] [main.css](file:///c:/Users/ThinkPad/project/journeywithfendy/assets/css/main.css)

Add CSS rules for `[data-lang="id"]` to be hidden by default, and a `.lang-id` class on `.resume-grid` that flips visibility.

```css
.resume-grid [data-lang="id"] { display: none; }
.resume-grid.lang-id [data-lang="en"] { display: none; }
.resume-grid.lang-id [data-lang="id"] { display: inline; }
```

## Scope

> [!IMPORTANT]
> This is a significant amount of content to translate. The translated text will be an Indonesian version of each bullet/heading. I'll provide accurate translations based on the content.

> [!NOTE]
> Technical terms, company names, proper nouns, programming languages, and dates will remain unchanged (as is standard for Indonesian CV/resume format).

## Open Questions

1. **Section subtitle**: Should the resume subtitle "Highlights of experience, education, and community impact." also switch to Indonesian? (e.g., "Sorotan pengalaman, pendidikan, dan dampak komunitas.")
2. **Download buttons**: Should the "Download Full Resume" button labels also toggle, or keep them as-is since they already have separate EN/ID download links?

## Verification Plan

### Manual Verification
- Click the **Indonesia** button → verify all resume grid content switches to Indonesian
- Click the **English** button → verify content reverts to English
- Verify the resume PDF preview iframe still switches correctly (existing behavior)
- Verify no layout shifts or broken elements
