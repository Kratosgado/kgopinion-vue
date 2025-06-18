import type { HeadingItem } from '@/lib/utils/types'
import { Extension } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'

type TOCOptions = {
  element: HTMLElement | null
  levels: number[]
  cssClass: string
  updateEvent: string
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}
function ensureUniqueId(id: string, ids: Set<string>) {
  if (!ids.has(id)) {
    return id
  }

  let counter = 1
  let uniqueId = `${id}-${counter}`
  while (ids.has(uniqueId)) {
    counter++
    uniqueId = `${id}-${counter}`
  }
  return uniqueId
}

function collectExistingIds(doc: Node): Set<string> {
  const existingIds = new Set<string>()

  doc.descendants((node) => {
    if (node.type.name === 'heading' && node.attrs.id) {
      existingIds.add(node.attrs.id)
    }
  })
  return existingIds
}

export const TOC = Extension.create<TOCOptions>({
  name: 'toc',
  addOptions() {
    return {
      element: null,
      levels: [1, 2, 3],
      title: 'Table of Contents',
      cssClass: 'toc',
      updateEvent: 'update:toc',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute('id'),
            renderHTML: (attributes: { id?: string }) => {
              if (!attributes.id) {
                return {}
              }
              return {
                id: attributes.id,
              }
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    const extension = this
    return [
      new Plugin({
        key: new PluginKey('toc'),
        view() {
          return {
            update: (view, prevState) => {
              const state = view.state
              if (prevState && prevState.doc.eq(state.doc)) return

              const headings: HeadingItem[] = []
              const { levels } = extension.options

              state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading' && levels.includes(node.attrs.level)) {
                  // generate id based on text content if none exists
                  let id = node.attrs.id || ''
                  if (!id) {
                    id = node.textContent
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w-]/g, '')
                  }

                  headings.push({
                    id,
                    level: node.attrs.level,
                    text: node.textContent,
                    pos,
                  })
                }
                return true
              })

              // update toc element if provided
              if (extension.options.element) {
                ; (extension as any).renderToElement(extension.options.element, headings)
              }

              // emit event for vue component to catch
              const event = new CustomEvent(extension.options.updateEvent, {
                detail: { headings },
              })
              window.dispatchEvent(event)
              return true
            },
          }
        },
      }),
      new Plugin({
        key: new PluginKey('headingId'),
        appendTransaction: (
          transactions: readonly Transaction[],
          oldState: EditorState,
          newState: EditorState,
        ): Transaction | null => {
          const docChanged = transactions.some((trans) => trans.docChanged)
          if (!docChanged) {
            return null
          }

          const tr = newState.tr
          const existingIds = collectExistingIds(newState.doc)
          let modified = false

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'heading') {
              const textContent = node.textContent.trim()
              if (textContent && !node.attrs.id) {
                const baseId = generateSlug(textContent)
                const uniqueId = ensureUniqueId(baseId, existingIds)
                existingIds.add(uniqueId)
                tr.setNodeMarkup(pos, null, { ...node.attrs, id: uniqueId })
                modified = true
              }
            }
          })
          return modified ? tr : null
        },
      }),
    ]
  },

  // helper method to render TOC to a DOM element
  renderToElement(element: HTMLElement, headings: HeadingItem[]) {
    if (!element) return
    element.innerHTML = ''

    // add title if specified
    if (this.options.title) {
      const title = document.createElement('div')
      title.className = 'toc-title'
      title.textContent = this.options.title
      element.appendChild(title)
    }

    // create container with the specified class
    const container = document.createElement('ul')
    container.className = this.options.cssClass

    // build TOC tree structure
    let lastLevel = 0
    let containerStack = [container]

    headings.forEach((heading) => {
      const levelDiff = heading.level - lastLevel

      // handle nesting
      if (levelDiff > 0) {
        // create new nested list as needed
        for (let i = 0; i < levelDiff; i++) {
          const nestedUl = document.createElement('ul')
          const parentLi = containerStack[containerStack.length - 1].lastElementChild

          if (parentLi) {
            parentLi.appendChild(nestedUl)
          } else {
            containerStack[containerStack.length - 1].appendChild(nestedUl)
          }

          containerStack.push(nestedUl)
        }
      } else if (levelDiff < 0) {
        // move up in the nesting
        containerStack = containerStack.slice(0, containerStack.length + levelDiff)
      }

      // create a dnadd list HeadingItem
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `#${heading.id}`
      a.textContent = heading.text
      a.className = `toc-item toc-item-h${heading.level}`

      // handle click to scroll to the heading
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const targetHeading = document.getElementById(heading.id)
        if (targetHeading) targetHeading.scrollIntoView({ behavior: 'smooth' })
      })
      li.appendChild(a)
      containerStack[containerStack.length - 1].appendChild(li)
      lastLevel = heading.level
    })
    element.appendChild(container)
  },
})

export default TOC
