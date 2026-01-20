// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/pages/account-settings'
const AccountTab = dynamic(() => import('@views/pages/account-settings/account'))
const SecurityTab = dynamic(() => import('@views/pages/account-settings/security'))
const BillingPlansTab = dynamic(() => import('@views/pages/account-settings/billing-plans')) 
const NotificationsTab = dynamic(() => import('@views/pages/account-settings/notifications')) 
const UsersTab = dynamic(()=>import('@views/pages/account-settings/users'))  
const OutletTab = dynamic(()=>import('@views/pages/account-settings/resturants')) 
const BusinessTab = dynamic(()=>import('@views/pages/account-settings/business'))
const ConnectionsTab = dynamic(() => import('@views/pages/account-settings/connections'))
const PostalCodes = dynamic(() => import('@views/pages/account-settings/postal-codes'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />, 
  users: <UsersTab />,      
  outlets : <OutletTab/>,
  business : <BusinessTab/>,
  connections: <ConnectionsTab />,
  postalcodes: <PostalCodes />
})

const AccountSettingsPage = () => {
  return  <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
