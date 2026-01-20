'use client'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

const NavToggle = () => {
  // Hooks
  const { toggleVerticalNav, isBreakpointReached } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
  }

  return <>{isBreakpointReached && <i className='tabler-menu-2 cursor-pointer' onClick={handleClick} />}</>
}

export default NavToggle
