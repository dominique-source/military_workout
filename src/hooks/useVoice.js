import { useCallback } from 'react'

export function useVoice() {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(String(text))
    u.rate = 1.05
    u.pitch = 1.1
    u.volume = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [])

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, cancel }
}
