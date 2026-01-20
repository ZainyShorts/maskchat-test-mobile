'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import toast, { Toaster } from 'react-hot-toast'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

import { useAuthStore } from '@/store/authStore'
import { ENDPOINTS, getBaseUrl } from '@/api/vars/vars'
import { getAllBusiness } from '@/api/business'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const { user, token, clearAuth } = useAuthStore()
  // console.log(token, 'token')
  let auth_token = null

  if (typeof window !== 'undefined') {
    auth_token = localStorage.getItem('auth_token')
  }
  // const auth_token = localStorage.getItem('auth_token')
  // console.log('irere----5555-------', token, auth_token)
  if (!auth_token) {
    // If no token is found, redirect to the login page
    // router.push('/login')
    router.push(getLocalizedUrl('/login', locale as Locale))
  }

  // console.log(user, 'latest user')
  // console.log(token, 'latest token')

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks

  // Handlers
  const handleDropdownOpen = () => setOpen(prevOpen => !prevOpen)

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleResetPassword = (e: MouseEvent) => {
    e.preventDefault()
    // router.push('/update-password')
    router.push(getLocalizedUrl('/forgot-password', locale as Locale))
    setOpen(false)
  }

  const handleUserProfile = (e: MouseEvent) => {
    e.preventDefault()
    // router.push('/user-profile')
    router.push(getLocalizedUrl('/account-settings', locale as Locale))
    setOpen(false)
  }

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(`${getBaseUrl()}account/${ENDPOINTS.logout}/`,{}, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('auth_token')}`, // Add token here
        'Content-Type': 'application/json',
      },
     })
     console.log(res.data)
     if(res.status == 200){
       toast.success('User logged out successfully')
       router.push(getLocalizedUrl('/login', locale as Locale))
       localStorage.removeItem('auth_token')
      //  clearAuth()
       setOpen(false)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountSettings = (e: MouseEvent) => {
    e.preventDefault()
    // router.push('/account-settings')
    router.push(getLocalizedUrl('/account-settings', locale as Locale))
    setOpen(false)
  }


  const [businessLogo,setBusinessLogo] = useState<string | null>(null)
      useEffect(() => {
          const fetchBusiness = async () => {
            try {
              const response = await getAllBusiness()
              setBusinessLogo(response?.data?.results[0]?.logo || null)
            } catch (err: any) {
              // setError(err.message || 'Failed to fetch business')
            } finally {
              // setLoading(false)
            }
          }
          fetchBusiness()
        }, [])

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          alt={user ? `${user.first_name} ${user.last_name}` : 'User'}
          src={`${businessLogo ?? '/images/avatars/1.png'}`} 
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={user ? `${user.first_name} ${user.last_name}` : 'User'} src={`${businessLogo ?? '/images/avatars/1.png'}`}  />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {user ? `${user.first_name} ${user.last_name}` : 'Guest User'}
                      </Typography>
                      <Typography variant='caption'>{user ? user.email : 'guest@example.com'}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={handleUserProfile}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  {/* <MenuItem className='mli-2 gap-3' onClick={handleAccountSettings}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem> */}
                  <MenuItem className='mli-2 gap-3' onClick={handleResetPassword}>
                    <i className='tabler-lock' />
                    <Typography color='text.primary'>Change Password</Typography>
                  </MenuItem>
                  {/* <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleLogout}
                      disabled={loading}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Toaster />
    </>
  )
}

export default UserDropdown
