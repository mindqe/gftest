
import { useRef, useEffect } from 'react';
export function useIsomorficEffect () {
    const isFirstRun = useRef(true)
  
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      return () => {
        isFirstRun.current = true
      }
    }, [])
  
    return isFirstRun.current
  }