
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initialize based on current screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkScreenSize()
    
    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern approach with addEventListener
    const handleChange = () => {
      checkScreenSize()
    }
    
    // Add listener
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", handleChange)
    }
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange)
      } else {
        window.removeEventListener("resize", handleChange)
      }
    }
  }, [])

  return isMobile === undefined ? false : isMobile
}
