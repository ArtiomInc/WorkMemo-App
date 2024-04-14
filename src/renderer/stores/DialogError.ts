import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const errorState = ref(false)
  const errorMessage = ref('')

  function setErrorState(state: boolean, message: string) {
    errorState.value = state
    errorMessage.value = message
  }

  return { errorState, errorMessage, setErrorState }
})
