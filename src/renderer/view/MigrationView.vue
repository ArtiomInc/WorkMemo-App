<template>
  <div class="h-screen w-screen p-5">
    <div class="flex h-full items-center justify-center rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
      <div class="flex flex-col items-center gap-2 text-center md:max-w-[50%]">
        <h1 class="text-2xl font-bold">Migration of the storing data system</h1>
        <p class="text-lg">
          From the version 2.1.1, the WorkMemo application use a different way to store the data to make them more
          robust.
        </p>
        <p class="text-lg">Please import the old data.json file once to migrate your data to the new system</p>
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center justify-center gap-1">
            <Info class="text-black dark:text-white" :size="20" />
            <p class="truncate font-semibold">On Windows, go to</p>
          </div>
          <code class="rounded-md bg-black/10 px-1 dark:bg-white/10"
            >C:\Users\%user%\AppData\Roaming\Notes\data.json</code
          >
        </div>
        <div class="flex justify-center">
          <input
            type="file"
            accept=".json"
            class="w-full max-w-[230px] text-sm text-slate-500 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-green-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-500 hover:file:bg-green-500/30"
            @change="handleFileInputChange"
          />
        </div>
        <span v-if="!isFileLoaded && !isFileWrong" class="h-8"></span>
        <button v-if="isFileLoaded" class="btn secondary" @click="router.push('/todos')">Migration =></button>
        <span v-if="isFileWrong" class="flex h-8 items-center justify-center rounded bg-red-500/20 px-10 text-red-500"
          >wrong file</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(() => {
  router.push('/')
})

const isFileLoaded = ref(false)
const isFileWrong = ref(false)

const handleFileInputChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const fileContent = reader.result as string
      const fileContentParsed = JSON.parse(fileContent)
      if (fileContentParsed.todo && fileContentParsed.note) {
        isFileLoaded.value = true
        isFileWrong.value = false
      } else {
        isFileLoaded.value = false
        isFileWrong.value = true
      }
    }
    reader.readAsText(file)
  }
}
</script>

<style scoped></style>
