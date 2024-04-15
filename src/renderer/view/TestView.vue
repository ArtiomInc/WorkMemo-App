<template>
  <div class="m-2 flex flex-col gap-2 rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
    <div id="editorjs" class=""></div>
  </div>
</template>

<script setup lang="ts">
import EditorJS, { EditorConfig } from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import { onMounted, ref } from 'vue'

const editor = ref<EditorJS | null>(null)

onMounted(() => {
  const editorContainer = document.getElementById('editorjs')

  if (editorContainer) {
    const editorConfig: EditorConfig = {
      holder: editorContainer,
      autofocus: true,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
        list: List,
        image: SimpleImage,
        embed: Embed,
        quote: Quote,
        table: Table,
        marker: Marker,
        inlineCode: InlineCode,
      },
    }

    editor.value = new EditorJS(editorConfig)
  }
})
</script>
