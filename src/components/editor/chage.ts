// src/composables/useBlogEditor.js
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { lowlight } from 'lowlight/lib/common'
import { useStorage } from '@vueuse/core'

export function useBlogEditor() {
  // Post data state
  const postData = ref(
    useStorage('blog-post-draft', {
      id: null,
      title: '',
      content: '',
      excerpt: '',
      featured_image: null,
      status: 'draft',
      categories: [],
      tags: [],
      seo: {
        title: '',
        description: '',
        keywords: '',
        focus_keyword: '',
        social_title: '',
        social_description: '',
        social_image: null,
      },
      permalink: '',
      published_date: null,
      updated_date: new Date().toISOString(),
      author: {
        id: 1,
        name: 'Admin',
      },
      template: 'default',
      custom_css: '',
      custom_js: '',
    }),
  )

  // Editor initial content
  const initialContent =
    postData.value.content ||
    '<h1>Your post title</h1><p>Start writing your amazing content here...</p>'

  // Create editor instance
  const editor = useEditor({
    content: initialContent,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight,
      Typography,
    ],
    autofocus: true,
    editable: true,
  })

  // Track if content has changed since last save
  const lastSavedContent = ref(initialContent)
  const lastSavedTitle = ref(postData.value.title)
  const isDirty = computed(() => {
    if (!editor.value) return false
    return (
      editor.value.getHTML() !== lastSavedContent.value ||
      postData.value.title !== lastSavedTitle.value
    )
  })

  // Auto-save functionality
  const autoSaveInterval = ref(null)
  const startAutoSave = () => {
    autoSaveInterval.value = setInterval(() => {
      if (isDirty.value) {
        savePost('auto')
      }
    }, 30000) // Auto-save every 30 seconds if there are changes
  }

  // SEO score calculation
  const calculateSeoScore = () => {
    if (!editor.value || !postData.value.seo.focus_keyword) return 0

    let score = 0
    const content = editor.value.getHTML()
    const textContent = editor.value.getText()
    const focusKeyword = postData.value.seo.focus_keyword.toLowerCase()

    // Calculate word count
    const wordCount = textContent.split(/\s+/).filter(Boolean).length

    // Basic checks
    if (wordCount >= 300) score += 10 // Good length
    if (wordCount >= 600) score += 10 // Better length
    if (wordCount >= 1200) score += 10 // Excellent length

    // Check for focus keyword
    if (postData.value.title.toLowerCase().includes(focusKeyword)) score += 15
    if (postData.value.seo.description.toLowerCase().includes(focusKeyword)) score += 10
    if (textContent.toLowerCase().includes(focusKeyword)) score += 10

    // Check keyword density (aim for 1-2%)
    const keywordInstances = (textContent.toLowerCase().match(new RegExp(focusKeyword, 'g')) || [])
      .length
    const keywordDensity = (keywordInstances / wordCount) * 100
    if (keywordDensity >= 1 && keywordDensity <= 2.5) score += 15

    // Check URL/permalink
    if (postData.value.permalink.toLowerCase().includes(focusKeyword)) score += 10

    // Check headings
    const hasH1 = content.includes('<h1')
    const hasH2 = content.includes('<h2')
    if (hasH1) score += 5
    if (hasH2) score += 5

    // Check for images
    const hasImages = content.includes('<img')
    if (hasImages) score += 5

    // Check for external links
    const hasLinks = content.includes('<a href="http')
    if (hasLinks) score += 5

    return Math.min(score, 100) // Cap at 100
  }

  // Save post function
  const savePost = async (status = 'draft') => {
    if (!editor.value) return

    // Update content
    postData.value.content = editor.value.getHTML()
    postData.value.updated_date = new Date().toISOString()

    if (status !== 'auto') {
      postData.value.status = status
    }

    if (status === 'publish' && !postData.value.published_date) {
      postData.value.published_date = new Date().toISOString()
    }

    // Update last saved state
    lastSavedContent.value = postData.value.content
    lastSavedTitle.value = postData.value.title

    // In a real app, you would send to API here
    console.log('Saving post:', postData.value)

    // Simple fake API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // If it's a new post, assign an ID
        if (!postData.value.id) {
          postData.value.id = Date.now()
        }
        resolve(postData.value)
      }, 500)
    })
  }

  // Handle image uploads
  const uploadImage = async (file) => {
    if (!file) return null

    // In a real app, you would upload to server
    // For demo, we'll use a FileReader to get a base64
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }

  // Insert content at cursor position
  const insertContent = (content) => {
    if (!editor.value) return
    editor.value.commands.insertContent(content)
  }

  // Insert image at cursor position
  const insertImage = async (file) => {
    if (!editor.value || !file) return

    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      editor.value.commands.setImage({ src: imageUrl })
    }
  }

  // Watch for content changes
  watch(
    () => editor.value?.getHTML(),
    (html) => {
      if (html) {
        // Update word count or other metrics here
        console.log('Content updated')
      }
    },
  )

  // Start auto-save when component is mounted
  startAutoSave()

  // Clean up
  onBeforeUnmount(() => {
    if (autoSaveInterval.value) {
      clearInterval(autoSaveInterval.value)
    }
  })

  // Return all necessary state and methods
  return {
    editor,
    postData,
    isDirty,
    savePost,
    uploadImage,
    insertContent,
    insertImage,
    calculateSeoScore,
  }
}
