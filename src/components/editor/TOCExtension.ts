import type { HeadingItem } from '@/lib/utils/types'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

type TOCOptions = {
  element: HTMLElement | null
  levels: number[]
  cssClass: string
  updateEvent: string
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
                ;(extension as any).renderToElement(extension.options.element, headings)
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
