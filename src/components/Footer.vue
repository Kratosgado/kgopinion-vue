<script setup lang="ts">
import { facebookLink, githubLink, linkedInLink, twitterLink } from '@/lib'
</script>
<template>
  <footer class="footer p-10 bg-base-300 text-base-content mt-auto">
    <div>
      <span class="footer-title">KgOpinion</span>
      <p class="max-w-xs">
        A platform for bloggers and content creators to share their knowledge and insights.
      </p>
    </div>
    <div>
      <span class="footer-title">Company</span>
      <router-link to="/about" class="link link-hover">About</router-link>
      <router-link to="/contact" class="link link-hover">Contact</router-link>
      <router-link to="/terms" class="link link-hover">Terms of Service</router-link>
      <router-link to="/privacy" class="link link-hover">Privacy Policy</router-link>
    </div>
    <div>
      <span class="footer-title">Explore</span>
      <router-link to="/articles" class="link link-hover">Articles</router-link>
      <router-link to="/articles/categories" class="link link-hover">Categories</router-link>
      <router-link to="/authors" class="link link-hover">Authors</router-link>
      <router-link to="/tags" class="link link-hover">Tags</router-link>
    </div>
    <div>
      <span class="footer-title">Social</span>
      <div class="mt-4 flex gap-4">
        <a :href="twitterLink" target="_blank" aria-label="Twitter Profile" class="btn btn-circle btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
          </svg>
        </a>
        <a :href="githubLink" target="_blank" aria-label="Github Profile" class="btn btn-circle btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z">
            </path>
          </svg>
        </a>
        <a :href="facebookLink" target="_blank" aria-label="Facebook Profile" class="btn btn-circle btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z">
            </path>
          </svg>
        </a>
        <a :href="linkedInLink" aria-label="LinkedIn Profile" target="_blank" class="btn btn-circle btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </div>
    </div>
  </footer>
  <div class="footer footer-center bg-base-300 p-4 text-base-content">
    <p>Copyright © 2025 - All rights reserved by KgOpinion</p>
  </div>
</template>
