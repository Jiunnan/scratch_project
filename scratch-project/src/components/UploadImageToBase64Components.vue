<!-- src/components/UploadToBase64.vue -->
<template>
    <div class="uploader">
      <input ref="fileInput" type="file" accept="image/*" @change="onSelect" />
      <div v-if="base64" class="preview">
        <img :src="base64" alt="preview" />
        <!-- <textarea readonly>{{ base64 }}</textarea> -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, defineExpose } from 'vue'
  import { fileToPngBase64 } from '@/utils/imageTransfer'
  
  const base64 = ref<string>('')
  const fileInput = ref<HTMLInputElement | null>(null)

  const props = defineProps({
    isBackgroundImage: {
        type: Boolean,
        default: false
    }
  })

  const emits = defineEmits<{
    (e: 'imageOutput', payload: { isBackgroundImage: boolean; base64: string }): void
  }>()
  
  async function onSelect(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    base64.value = await fileToPngBase64(file, 1024) // 可選最大邊縮放
    // TODO: 存到你的 store（例如 Pinia）或送到 API
    emits('imageOutput', {isBackgroundImage: props.isBackgroundImage, base64: base64.value})
  }

  function clear() {
    base64.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }

  defineExpose({ clear })

  </script>
  
  <style scoped>
  .uploader { display: grid; gap: 12px; }
  .preview { display: grid; grid-template-columns: 220px 1fr; gap: 12px; align-items: start; }
  .preview img { width: 220px; border-radius: 8px; border: 1px solid #ddd; }
  .preview textarea { width: 100%; height: 160px; font-family: monospace; font-size: 12px; }
  </style>
  