<script setup lang="ts">
import { facebookLink, githubLink, linkedInLink, twitterLink } from '@/lib/utils/constants'
import IconGithub from './icons/IconGithub.vue'
import IconTwitter from './icons/IconTwitter.vue'
import IconFacebook from './icons/IconFacebook.vue'
import IconLinkedIn from './icons/IconLinkedIn.vue'
import { ref } from 'vue'
import { Query } from '@/lib/backend/query'

const email = ref('')

async function subscribe() {
  const res = await new Query('subscribers').subscribe(email.value)
  if (res) {
    email.value = 'submitted'
  }
}
</script>

<template>
  <footer class="footer bg-base-300 sm:footer-horizontal text-neutral-content p-10">
    <div>
      <h6 class="footer-title">Kratosgado</h6>
      <p class="max-w-xs">
        A platform for bloggers and content creators to share their knowledge and insights.
      </p>
    </div>
    <nav>
      <h6 class="footer-title">Company</h6>
      <router-link to="/about" class="link link-hover">About</router-link>
      <router-link to="/contact" class="link link-hover">Contact</router-link>
      <!-- <router-link to="/terms" class="link link-hover">Terms of Service</router-link> -->
      <!-- <router-link to="/privacy" class="link link-hover">Privacy Policy</router-link> -->
    </nav>
    <nav>
      <h6 class="footer-title">Explore</h6>
      <router-link to="/articles" class="link link-hover">Articles</router-link>
      <router-link to="/articles/categories" class="link link-hover">Categories</router-link>
    </nav>
    <nav>
      <h6 class="footer-title">Social</h6>
      <div class="mt-4 flex gap-4">
        <IconTwitter :link="twitterLink" />
        <IconGithub :link="githubLink" />
        <IconFacebook :link="facebookLink" />
        <IconLinkedIn :link="linkedInLink" />
      </div>
    </nav>

    <form @submit.prevent="subscribe">
      <h6 class="footer-title">Newsletter</h6>
      <fieldset class="w-80">
        <label>Enter your email address</label>
        <div class="join">
          <input type="email" v-model="email" placeholder="username@site.com" class="input input-bordered join-item" />
          <button type="submit" class="btn btn-primary join-item">Subscribe</button>
        </div>
      </fieldset>
    </form>
  </footer>
  <div class="footer footer-center bg-neutral p-4 text-base-content">
    <p>Copyright © 2025 - All rights reserved by Kratosgado</p>
  </div>
</template>
