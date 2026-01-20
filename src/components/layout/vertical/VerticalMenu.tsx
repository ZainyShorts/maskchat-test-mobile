

import type React from "react"
import { useParams } from "next/navigation"
import { useTheme } from "@mui/material/styles"
import PerfectScrollbar from "react-perfect-scrollbar"
import type { getDictionary } from "@/utils/getDictionary"
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu"
import { Menu, MenuItem, MenuSection } from "@menu/vertical-menu"
import { useSettings } from "@core/hooks/useSettings"
import useVerticalNav from "@menu/hooks/useVerticalNav"
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon"
import menuItemStyles from "@core/styles/vertical/menuItemStyles"
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles"
import { useAuthStore } from "@/store/authStore"

import { useEffect, useState } from "react"
import { getAllBusiness, getBusinessById } from "@/api/business"
import { BusinessTypeForFile } from "@/types/apps/businessTypes"
import { BusinessDataType } from "@/api/interface/businessInterface"

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps["transitionDuration"]
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
)

// Custom disabled MenuItem component
const DisabledMenuItem = ({
  children,
  icon,
  className = "",
}: { children: React.ReactNode; icon: React.ReactNode; className?: string }) => (
  <div
    className={`flex items-center px-4 py-2 text-gray-400 cursor-not-allowed opacity-50 select-none ${className}`}
    onClick={(e) => e.preventDefault()}
    style={{ pointerEvents: "none" }}
  >
    <span className="mr-3">{icon}</span>
    <span>{children}</span>
  </div>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  const { user } = useAuthStore()

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar

    const [businessItemData, setSelectBusinessID] = useState<string | null>(null)
      
        useEffect(() => {
    console.log('useEffect triggered for getAllBusiness')
    
    const fetchBusiness = async () => {
      try {
        console.log('Starting fetchBusiness...')
        const response = await getAllBusiness()
        console.log('Response received:', response)
        
        setSelectBusinessID(response?.data?.results[0].business_id || null)
      } catch (error: any) {
        console.log('Error in fetchBusiness:', error)
        console.log('Error details:', error.message, error.response?.data)
      }
    }
    
    fetchBusiness()
  }, [])

  if (!user) return null

  // Get user type and subscription status
  const userType = Number(user?.user_type)
  const hasSubscription = user?.subscription === true

  // Helper function to determine if a menu item should be enabled
  const isMenuItemEnabled = (menuItem: string): boolean => {
    // Special case for zainyshorts@gmail.com - only enable inbox and settings
    if (Number(user?.user_type) === 4) {
      return menuItem === "speaker" || menuItem === "settings" || menuItem === "inbox"
    }

    // If no subscription, all items are disabled except settings (which is always enabled)
    if (!hasSubscription) {
      return menuItem === "settings"
    }

    // If has subscription, check user type restrictions
    switch (userType) {
      case 1:
        // Type 1: Show all items when subscription is true
        return true

      case 2:
        // Type 2: Disable home and settings when subscription is true
        return !["home", "settings"].includes(menuItem)

      case 3:
        // Type 3: Disable home, settings, users, business, and outlet when subscription is true
        return !["home", "settings", "users", "business", "outlet"].includes(menuItem)

      default:
        return true
    }
  }

  // Helper function to render menu item (enabled or disabled)
  const renderMenuItem = (
    menuItem: string,
    href: string,
    icon: React.ReactNode,
    label: string,
    additionalCondition = true,
  ) => {
    const isEnabled = isMenuItemEnabled(menuItem) && additionalCondition

    if (isEnabled) {
      return (
        <MenuItem href={href} icon={icon}>
          {label}
        </MenuItem>
      )
    } else {
      return <DisabledMenuItem icon={icon}>{label}</DisabledMenuItem>
    }
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
               <MenuSection label="">
           {/* Home */}
           {renderMenuItem(
            "home",
            `/${locale}/home`,
            <i className="tabler-smart-home" />,
            dictionary["navigation"].home,
          )}

          {/* Menu */}
          {renderMenuItem(
            "menu",
            `/${locale}/menu`,
            <i className="tabler-list-search" />,
            dictionary["navigation"].menu,
          )}

          {/* Feed Back */}
          {renderMenuItem(
            "speaker",
            `/${locale}/news-letter`,
            <i className="tabler-volume" />, // Tabler speaker icon class
            dictionary["navigation"].newsLetter,
          )}

          {/* FeedBack */}
          {renderMenuItem(
            "feedback",
            `/${locale}/feedback`,
             <i className="tabler-message-dots" />, // Tabler speaker icon class
            dictionary["navigation"].feedBack,
          )}

          {/* Support */}
          {renderMenuItem(
            "inbox",
            `/${locale}/inbox/${businessItemData}`,
            <i className="tabler-lifebuoy" />, // Tabler support/help icon class
            dictionary["navigation"].inbox,
          )}

          {renderMenuItem(
            "integration",
            `/${locale}/integration/`,
            <i className="tabler-plug-connected" />, // Tabler support/help icon class
            dictionary["navigation"].IntegrationsPage,
          )}

          

          {/* Support */}
          {renderMenuItem(
            "chatbot",
            `/${locale}/chatbot`,
            <i className="tabler-robot" />, // Tabler support/help icon class
            dictionary["navigation"].chatbot,
          )}

          {/* Order Confirmation */}
          {renderMenuItem(
            "order-confirmation",
            `/${locale}/activity`, 
            // <i className="tabler-check" />, // Tabler confirmation icon
             <i className="tabler-shopping-cart" />,
            dictionary["navigation"].orderConfirmation, // make sure you have this key in dictionary
          )}



          {/* Support */}
          {renderMenuItem(
            "notification",
            `/${locale}/notifications`,
            <i className="tabler-bell" />, // Tabler support/help icon class
            dictionary["navigation"].notification,
          )}

          {/* Settings */}
          {renderMenuItem(
            "settings",
            `/${locale}/account-settings`,
            <i className="tabler-settings" />,
            dictionary["navigation"].settings,
          )}
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
