import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useColorStore = defineStore('color', () => {
  const colorState = ref(false)
  const colorLastResultAction = ref(false)
  const colorLastChoice = ref(-1)

  function setColorState(state: boolean) {
    colorState.value = state
  }

  function setColorLastResult(result: boolean) {
    colorLastResultAction.value = result
  }

  function setColorLastChoice(color: number) {
    colorLastChoice.value = color
  }

  return {
    colorState,
    colorLastResultAction,
    colorLastChoice,
    setColorState,
    setColorLastResult,
    setColorLastChoice
  }
})
