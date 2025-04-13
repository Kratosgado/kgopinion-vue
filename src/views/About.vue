<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loading } from '@/components'
import type { SEO, SEOMetadata } from '@/lib/seo'

const metadata: SEOMetadata = {
  title: 'About - KgOpinion',
  description:
    'Learn more about KgOpinion and its mission to provide high-quality content on web development, design, and technology.',
  keywords: ['about', 'mission', 'team', 'community', 'contact'],
  type: 'website',
  ogImage: '/static/favicon.ico',
}

const loading = ref(true)

onMounted(() => {
  loading.value = false
})
</script>
<template>
  <div class="container mx-auto px-4 py-12">
    <SEO :metadata="metadata" />

    <h1 class="mb-8 text-4xl font-bold">About KgOpinion</h1>

    <div class="prose mb-16 max-w-none lg:prose-xl">
      <p>
        Welcome to KgOpinion, a platform dedicated to sharing knowledge and insights about web
        development, design, and technology.
      </p>

      <h2>Our Mission</h2>
      <p>
        At KgOpinion, we strive to provide high-quality, informative content that helps developers
        and designers stay up-to-date with the latest trends and best practices in the industry.
      </p>

      <p>
        Our articles are written by experienced professionals who are passionate about their craft
        and committed to sharing their knowledge with the community.
      </p>

      <h2>What We Cover</h2>
      <p>Our content spans a wide range of topics, including:</p>

      <ul>
        <li>
          <strong>Web Development</strong> - Frontend and backend technologies, frameworks, and best
          practices
        </li>
        <li><strong>Design</strong> - UI/UX principles, design systems, and creative processes</li>
        <li><strong>Performance</strong> - Optimization techniques, metrics, and tools</li>
        <li>
          <strong>DevOps</strong> - Deployment strategies, CI/CD, and infrastructure management
        </li>
        <li>
          <strong>Career Development</strong> - Professional growth, skill acquisition, and industry
          insights
        </li>
      </ul>

      <h2>Join Our Community</h2>
      <p>
        We encourage our readers to engage with our content, share their thoughts, and contribute to
        discussions. Together, we can create a vibrant community of learners and innovators.
      </p>
    </div>

    <h2 class="mb-8 text-3xl font-bold">Meet Our Team</h2>

    <Loading v-if="loading" />
  </div>
</template>
