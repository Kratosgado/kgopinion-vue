<script setup lang="ts">
import { useAuth } from '@/lib/backend/auth'
import type { Author } from '@/lib/utils/types'
import { ref } from 'vue'
import Status from '@/components/Status.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'


// State
const editMode = ref(false)
const isSaving = ref(false)
const error = ref('')
const success = ref('')
const editedAuthor = ref<Author | undefined>(undefined)
const newAvatarUrl = ref('')
const auth = useAuth()
const authState = ref(auth.state)

const setStatus = ({ err, succ }: { err?: string; succ?: string }) => {
  error.value = err || ''
  success.value = succ || ''
  setTimeout(() => {
    error.value = ''
    success.value = ''
  }, 5000)
}
const toggleEditMode = () => {
  if (!editMode.value) {
    editedAuthor.value = auth.state.user
    newAvatarUrl.value = ''
  }
  editMode.value = !editMode.value
  setStatus({})
}

const saveProfile = async () => {
  if (!editedAuthor.value?.name || !editedAuthor.value.email) {
    setStatus({ err: 'Name and email are required' })
    return
  }

  isSaving.value = true
  setStatus({})

  try {
    if (newAvatarUrl.value) {
      editedAuthor.value.avatar = newAvatarUrl.value
    }

    await auth.updateProfile(editedAuthor.value)
    setStatus({ succ: 'Profile updated successfully' })
    editMode.value = false
  } catch (err) {
    console.error(err)
    setStatus({ err: 'Failed to update profile. Please try again.' })
  } finally {
    isSaving.value = false
  }
}

const ensureSocialExists = () => {
  if (!editedAuthor.value!.social) {
    editedAuthor.value!.social = {}
  }
}
</script>

<template>
  <div class="container mx-auto py-12 px-4">
    <Status :success="success" :error="error" />
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold">My Profile</h1>
      <button v-if="!authState.isLoading && !editMode" class="btn btn-primary" @click="toggleEditMode">
        Edit Profile
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div v-if="editMode">
              <h2 class="card-title text-2xl mb-6">Edit Profile</h2>
              <form @submit.prevent="saveProfile" class="space-y-6">
                <div class="space-y-4">
                  <div class="form-control">
                    <label class="label" for="name">
                      <span class="label-text">Full Name</span>
                    </label>
                    <input v-model="editedAuthor!.name" type="text" id="name" class="input input-bordered w-full"
                      required />
                  </div>
                  <div class="form-control">
                    <label class="label" for="email">
                      <span class="label-text">Email</span>
                    </label>
                    <input v-model="editedAuthor!.email" type="email" id="email" class="input input-bordered w-full"
                      required />
                  </div>
                  <div class="form-control">
                    <label class="label" for="bio">
                      <span class="label-text">Bio</span>
                    </label>
                    <textarea v-model="editedAuthor!.bio" id="bio" class="textarea textarea-bordered h-24 w-full"
                      placeholder="Tell readers about yourself..."></textarea>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-3">Social Media Links</h3>
                  <div class="space-y-4">
                    <div class="form-control">
                      <label class="label" for="twitter">
                        <span class="label-text">Twitter Username</span>
                      </label>
                      <div class="input-group">
                        <span>@</span>
                        <input v-model="editedAuthor!.social!.twitter" type="text" id="twitter"
                          class="input input-bordered w-full" placeholder="username" @focus="ensureSocialExists" />
                      </div>
                    </div>
                    <div class="form-control">
                      <label class="label" for="github">
                        <span class="label-text">GitHub Username</span>
                      </label>
                      <div class="input-group">
                        <span>github.com/</span>
                        <input v-model="editedAuthor!.social!.github" type="text" id="github"
                          class="input input-bordered w-full" placeholder="username" @focus="ensureSocialExists" />
                      </div>
                    </div>
                    <div class="form-control">
                      <label class="label" for="linkedin">
                        <span class="label-text">LinkedIn Username</span>
                      </label>
                      <div class="input-group">
                        <span>linkedin.com/in/</span>
                        <input v-model="editedAuthor!.social!.linkedIn" type="text" id="linkedin"
                          class="input input-bordered w-full" placeholder="username" @focus="ensureSocialExists" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-4">
                  <button type="button" class="btn btn-outline" @click="toggleEditMode" :disabled="isSaving">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="loading loading-spinner loading-sm"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
            <div v-else>
              <h2 class="card-title text-2xl mb-6">Profile Information</h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold mb-2">Basic Information</h3>
                  <div class="space-y-3">
                    <div>
                      <span class="text-gray-500">Name:</span>
                      <span class="ml-2 font-medium">{{ authState.user?.name }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Email:</span>
                      <span class="ml-2 font-medium">{{ authState.user?.email }}</span>
                    </div>
                    <div v-if="authState.user?.bio">
                      <span class="text-gray-500">Bio:</span>
                      <p class="mt-1">{{ authState.user?.bio }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="authState.user?.social">
                  <h3 class="text-lg font-semibold mb-2">Social Media</h3>
                  <div class="flex flex-wrap gap-3">
                    <IconGithub :link="authState.user?.social.github" v-if="authState.user?.social.github" />
                    <IconTwitter :link="authState.user?.social.twitter" v-if="authState.user?.social.twitter" />
                    <IconLinkedIn :link="authState.user?.social.linkedIn" v-if="authState.user?.social.linkedIn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-xl mb-4">Profile Picture</h2>
            <div class="avatar mb-4">
              <div class="w-32 h-32 rounded-full">
                <img :src="editMode && newAvatarUrl ? newAvatarUrl : authState.user?.avatar"
                  :alt="authState.user?.name" />
              </div>
            </div>
            <div v-if="editMode" class="form-control w-full">
              <label class="label" for="avatarUrl">
                <span class="label-text">Avatar URL</span>
              </label>
              <input v-model="newAvatarUrl" type="text" id="avatarUrl" placeholder="https://example.com/avatar.jpg"
                class="input input-bordered w-full" />
              <label for="" class="label">
                <span class="label-text-alt">Enter a URL for your profile picture</span>
              </label>
            </div>
            <div v-if="editMode" class="divider">OR</div>
            <div v-if="editMode" class="form-control w-full">
              <label class="label" for="avatarFile">
                <span class="label-text">Upload Image</span>
              </label>
              <input type="file" id="avatarFile" accept="image/*" class="file-input file-input-bordered w-full" />
              <label for="" class="label">
                <span class="label-text-alt">Max size: 2MB</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="!editMode" class="card bg-base-100 shadow-xl mt-6">
          <div class="card-body">
            <h2 class="card-title text-xl mb-2">Account Settings</h2>
            <div class="space-y-3">
              <button class="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </button>
              <button class="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Privacy Settings
              </button>
              <button class="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notification Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!editMode" class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Public Profile Preview</h2>
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div class="avatar">
              <div class="w-24 h-24 rounded-full">
                <img :src="authState.user?.avatar || '/favicon.ico'" :alt="authState.user?.name" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold">{{ authState.user?.name }}</h3>
              <p v-if="authState.user?.bio" class="mt-2">{{ authState.user!.bio }}</p>
              <div v-if="authState.user?.social" class="flex gap-3 mt-4">
                <IconGithub :link="authState.user?.social.github" v-if="authState.user?.social.github" />
                <IconTwitter :link="authState.user?.social.twitter" v-if="authState.user?.social.twitter" />
                <IconLinkedIn :link="authState.user?.social.linkedIn" v-if="authState.user?.social.linkedIn" />
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div>
            <h4 class="font-semibold mb-2">Recent Articles</h4>
            <p class="text-gray-500 italic">
              This is where your published articles will appear to readers.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
