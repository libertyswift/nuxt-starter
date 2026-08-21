#!/usr/bin/env node
/**
 * Сверяет токены из DESIGN.md с блоками :root / .dark в tailwind.css.
 *
 * DESIGN.md — источник правды. Этот скрипт ничего не чинит, только сообщает,
 * что разъехалось: правки вносит агент по DESIGN.md, а не наоборот.
 *
 * Разделы в DESIGN.md ищутся по заголовкам «Светлая тема» / «Тёмная тема»,
 * значения — из ближайшего css-блока. Нет блока — проверка пропускается.
 */
import { readFileSync } from 'node:fs'

const DESIGN = 'DESIGN.md'
const CSS = 'app/assets/css/tailwind.css'

const read = (path) => {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    console.error(`✗ не читается ${path}`)
    process.exit(1)
  }
}

/** Достаёт пары --token: value из текста */
const parseTokens = (text) => {
  const tokens = new Map()
  for (const [, name, value] of text.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    tokens.set(name, value.trim().replace(/\s+/g, ' '))
  }
  return tokens
}

/** Первый ```css блок после заголовка, содержащего heading */
const cssBlockAfter = (md, heading) => {
  const at = md.indexOf(heading)
  if (at === -1) return null
  const block = /```css\n([\s\S]*?)```/.exec(md.slice(at))
  return block ? block[1] : null
}

/** Содержимое CSS-правила по селектору */
const ruleBody = (css, selector) => {
  const at = css.indexOf(`${selector} {`)
  if (at === -1) return null
  const end = css.indexOf('\n}', at)
  return end === -1 ? null : css.slice(at, end)
}

const md = read(DESIGN)
const css = read(CSS)

const sections = [
  { title: 'Светлая тема', selector: ':root' },
  { title: 'Тёмная тема', selector: '.dark' }
]

let problems = 0
let checked = 0

for (const { title, selector } of sections) {
  const declared = cssBlockAfter(md, title)
  if (!declared) {
    console.log(`• «${title}»: css-блока в ${DESIGN} нет, пропускаю`)
    continue
  }

  const body = ruleBody(css, selector)
  if (!body) {
    console.error(`✗ в ${CSS} не найдено правило ${selector}`)
    problems++
    continue
  }

  const want = parseTokens(declared)
  const have = parseTokens(body)

  for (const [name, value] of want) {
    checked++
    if (!have.has(name)) {
      console.error(`✗ ${selector}: нет токена ${name} (объявлен в ${DESIGN})`)
      problems++
    } else if (have.get(name) !== value) {
      console.error(`✗ ${selector} ${name}: в CSS «${have.get(name)}», в ${DESIGN} «${value}»`)
      problems++
    }
  }

  for (const name of have.keys()) {
    if (!want.has(name)) {
      console.error(`✗ ${selector}: токен ${name} есть в CSS, но не описан в ${DESIGN}`)
      problems++
    }
  }
}

if (problems > 0) {
  console.error(`\n${problems} расхождений. DESIGN.md — источник правды: приведите ${CSS} к нему.`)
  process.exit(1)
}

console.log(`✓ токены совпадают с ${DESIGN} (проверено ${checked})`)
