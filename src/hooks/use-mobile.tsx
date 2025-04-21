
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately on mount
    checkScreenSize()
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkScreenSize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return isMobile
}
