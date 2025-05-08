import { reactive } from 'vue'

export const extra = reactive({
  linkUrl: '',
  linkText: '',
  showImageModal: false,
  showLinkModal: false,
  showYoutubeModal: false,
  error: '',
  success: '',
  isFeatured: false,
})
