const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const indexPath = path.join(__dirname, '..', 'index.html');
const indexHtmlContent = fs.readFileSync(indexPath, 'utf8');

function setupDOM() {
  const dom = new JSDOM(indexHtmlContent, {
    runScripts: 'outside-only',
    url: 'file://' + indexPath
  });

  const document = dom.window.document;

  // Extract inline script
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (!script.src && script.textContent) {
      try {
        dom.window.eval(script.textContent);
      } catch (e) {
        // Ignore external library missing dependencies in isolated test runner
      }
    }
  });

  return dom;
}

test('TDD 1: Only English button should be active on initial page load', () => {
  const dom = setupDOM();
  const document = dom.window.document;
  const enBtn = document.querySelector('.resume-language-option[data-lang="en"]');
  const idBtn = document.querySelector('.resume-language-option[data-lang="id"]');

  assert.ok(enBtn, 'English button should exist');
  assert.ok(idBtn, 'Indonesia button should exist');

  assert.strictEqual(enBtn.classList.contains('is-active'), true, 'EN button should have is-active');
  assert.strictEqual(enBtn.getAttribute('aria-pressed'), 'true', 'EN button aria-pressed should be true');

  assert.strictEqual(idBtn.classList.contains('is-active'), false, 'ID button should NOT have is-active initially');
  assert.strictEqual(idBtn.getAttribute('aria-pressed'), 'false', 'ID button aria-pressed should be false initially');
});

test('TDD 2: Clicking Indonesia language button toggles grid visibility and attributes', () => {
  const dom = setupDOM();
  const document = dom.window.document;
  const enBtn = document.querySelector('.resume-language-option[data-lang="en"]');
  const idBtn = document.querySelector('.resume-language-option[data-lang="id"]');
  const gridEn = document.querySelector('.resume-grid[data-lang="en"]');
  const gridId = document.querySelector('.resume-grid[data-lang="id"]');

  // Click Indonesia button
  idBtn.click();

  assert.strictEqual(idBtn.classList.contains('is-active'), true, 'ID button should be active');
  assert.strictEqual(idBtn.getAttribute('aria-pressed'), 'true', 'ID button aria-pressed should be true');
  assert.strictEqual(enBtn.classList.contains('is-active'), false, 'EN button should be inactive');

  assert.strictEqual(gridEn.style.display, 'none', 'EN grid should be hidden when ID is selected');
  assert.strictEqual(gridId.style.display, 'grid', 'ID grid should be shown when ID is selected');

  // Click English button back
  enBtn.click();

  assert.strictEqual(enBtn.classList.contains('is-active'), true, 'EN button should be active');
  assert.strictEqual(gridEn.style.display, 'grid', 'EN grid should be shown when EN is selected');
  assert.strictEqual(gridId.style.display, 'none', 'ID grid should be hidden when EN is selected');
});

test('TDD 3: Project cards text length > 200 chars or with lists get Read More toggle', () => {
  const dom = setupDOM();
  const document = dom.window.document;
  const cards = document.querySelectorAll('.project-card');

  let toggleBtnCount = 0;
  cards.forEach(card => {
    const textEl = card.querySelector('.project-text');
    const listEl = card.querySelector('ul');
    const textLength = textEl ? textEl.textContent.trim().length : 0;
    const toggleBtn = card.querySelector('.toggle-text-btn');

    if (textLength > 200 || listEl) {
      assert.ok(toggleBtn, `Card with text length ${textLength} should have a Read more button`);
      toggleBtnCount++;

      // Test click toggle
      toggleBtn.click();
      assert.ok(card.classList.contains('expanded'), 'Card should have .expanded class on click');

      toggleBtn.click();
      assert.ok(!card.classList.contains('expanded'), 'Card should remove .expanded class on second click');
    }
  });

  assert.ok(toggleBtnCount > 0, 'At least one project card should have a toggle button');
});

test('TDD 4: Interactive buttons should not have empty href="" attributes', () => {
  const dom = setupDOM();
  const document = dom.window.document;
  const buttons = document.querySelectorAll('a.button');

  const emptyHrefButtons = [];
  buttons.forEach(btn => {
    const href = btn.getAttribute('href');
    if (href === '' || href === null) {
      emptyHrefButtons.push(btn.textContent.trim());
    }
  });

  assert.deepStrictEqual(emptyHrefButtons, [], `Found buttons with empty href: ${emptyHrefButtons.join(', ')}`);
});

test('TDD 5: Referenced image assets exist on disk', () => {
  const images = ['topeng-cirebon.jpg', 'profile.webp', 'klana.webp'];
  images.forEach(img => {
    const imgPath = path.join(__dirname, '..', 'images', img);
    assert.strictEqual(fs.existsSync(imgPath), true, `Image ${img} should exist in images directory`);
  });
});
