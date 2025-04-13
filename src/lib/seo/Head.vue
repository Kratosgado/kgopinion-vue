<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import type { SEOMetadata } from './types'

const { metadata } = defineProps<{
  metadata: SEOMetadata
}>()

const router = useRouter()

const defaultMetadata: SEOMetadata = {
  type: 'website',
  canonicalUrl: router.currentRoute.value.fullPath,
  ogImage: 'https://kgopinion.pages.dev/favicon.ico',
  title: '',
  description: '',
  keywords: [],
}

const seoData = { ...defaultMetadata, ...metadata }

// Use @vueuse/head to manage head tags
useHead({
  title: `${seoData.title} | Kgopinion`,
  meta: [
    { name: 'description', content: seoData.description },
    { name: 'keywords', content: seoData.keywords?.join(', ') || '' },
    { name: 'google-site-verification', content: 'Om30v--Ewy1b-EScX40h9uDEpVM1BLgp-vjxhM8K-aM' },
    // Open Graph
    { property: 'og:type', content: seoData.type },
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:url', content: seoData.canonicalUrl },
    seoData.ogImage ? { property: 'og:image', content: seoData.ogImage } : {},
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    seoData.ogImage ? { name: 'twitter:image', content: seoData.ogImage } : {},
    // Article-specific meta
    ...(seoData.type === 'article'
      ? [
        { property: 'article:published_time', content: seoData.publishedTime },
        { property: 'article:modified_time', content: seoData.modifiedTime },
        { property: 'article:author', content: seoData.author },
      ]
      : []),
  ],
  link: [{ rel: 'canonical', href: seoData.canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': seoData.type === 'article' ? 'BlogPosting' : 'WebSite',
        headline: seoData.title,
        description: seoData.description,
        ...(seoData.type === 'article'
          ? {
            datePublished: seoData.publishedTime,
            dateModified: seoData.modifiedTime,
            author: {
              '@type': 'Person',
              name: seoData.author,
            },
          }
          : {}),
        url: seoData.canonicalUrl,
      }),
    },
  ],
})
</script>

<template>
  <!-- No template content needed since this component only manages head metadata -->
</template>
