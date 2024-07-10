import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeleteStore = defineStore('delete', () => {
  const deleteState = ref(false)
  const deleteLastResultAction = ref(false)
  const deleteMessage = ref('')

  function setDeleteState(state: boolean, message: string) {
    deleteState.value = state
    deleteMessage.value = message
  }

  function setDeleteLastResult(result: boolean) {
    deleteLastResultAction.value = result
  }

  return {
    deleteState,
    deleteLastResultAction,
    deleteMessage,
    setDeleteState,
    setDeleteLastResult,
  }
})
