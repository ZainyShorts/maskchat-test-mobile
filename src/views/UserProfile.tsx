'use client'

import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import type { Data, ProfileHeaderType, DataType } from '@/types/pages/profileTypes'
import UserProfile from '@/views/pages/user-profile'

import { useAuthStore } from '@/store/authStore'

type DB = {
  users: DataType
  profileHeader: ProfileHeaderType
}

const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
const ConnectionsTab = dynamic(() => import('@/views/pages/user-profile/connections'))

const UserProfilePage = () => {
  const [db, setDb] = useState<DB | null>(null)

  const { user } = useAuthStore()
  // console.log(user, 'user')

  useEffect(() => {
    if (user) {
      const newDb: DB = {
        users: {
          profile: {
            about: [
              {
                property: 'Full Name',
                value: user ? `${user.first_name} ${user.last_name}` : 'Guest User',
                // value: user.first_name || 'Guest User',

                icon: 'tabler-user'
              },
              { property: 'Status', value: user.status || 'active', icon: 'tabler-check' },
              { property: 'Role', value: user.user_type || 'Developer', icon: 'tabler-crown' },
              { property: 'Country', value: 'USA', icon: 'tabler-flag' },
              { property: 'Language', value: 'English', icon: 'tabler-language' }
            ],
            contacts: [
              { property: 'Contact', value: '(123) 456-7890', icon: 'tabler-phone-call' },
              { property: 'Skype', value: 'john.doe', icon: 'tabler-messages' },
              { property: 'Email', value: user.email || 'john.doe@example.com', icon: 'tabler-mail' }
            ],
            teams: [
              { property: 'Backend Developer', value: '(126 Members)' },
              { property: 'React Developer', value: '(98 Members)' }
            ],
            overview: [
              { property: 'Task Compiled', value: '13.5k', icon: 'tabler-check' },
              { property: 'Connections', value: '897', icon: 'tabler-users' },
              { property: 'Projects Compiled', value: '146', icon: 'tabler-layout-grid' }
            ],
            connections: [
              {
                isFriend: true,
                connections: '45',
                name: 'Cecilia Payne',
                avatar: '/images/avatars/2.png'
              }

              // ... other connections
            ],
            teamsTech: [
              {
                members: 72,
                ChipColor: 'error',
                chipText: 'Developer',
                title: 'React Developers',
                avatar: '/images/logos/react-bg.png'
              }

              // ... other teamsTech
            ],
            projectTable: [
              {
                id: 1,
                title: 'BGC eCommerce App',
                subtitle: 'React Project',
                leader: 'Eileen',
                avatar: '/images/logos/react-bg.png',
                avatarGroup: [
                  '/images/avatars/1.png',
                  '/images/avatars/2.png',
                  '/images/avatars/3.png',
                  '/images/avatars/4.png'
                ],
                status: 78
              }

              // ... other projects
            ]
          },
          teams: [
            {
              extraMembers: 9,
              title: 'React Developers',
              avatar: '/images/logos/react-bg.png',
              avatarGroup: [
                { avatar: '/images/avatars/1.png', name: 'Vinnie Mostowy' },
                { avatar: '/images/avatars/2.png', name: 'Allen Rieske' },
                { avatar: '/images/avatars/3.png', name: 'Julee Rossignol' }
              ],
              description:
                'We don’t make assumptions about the rest of your technology stack, so you can develop new features.',
              chips: [
                { title: 'React', color: 'primary' },
                { title: 'MUI', color: 'info' }
              ]
            }

            // ... other teams
          ],
          projects: [
            {
              daysLeft: 28,
              comments: 15,
              totalTask: 344,
              hours: '380/244',
              tasks: '290/344',
              budget: '$18.2k',
              completedTask: 328,
              deadline: '28/2/22',
              chipColor: 'success',
              startDate: '14/2/21',
              budgetSpent: '$24.8k',
              members: '280 members',
              title: 'Social Banners',
              client: 'Christian Jimenez',
              avatar: '/images/icons/social-bg.png',
              description: 'We are Consulting, Software Development and Web Development Services.',
              avatarGroup: [
                { avatar: '/images/avatars/1.png', name: 'Vinnie Mostowy' },
                { avatar: '/images/avatars/2.png', name: 'Allen Rieske' },
                { avatar: '/images/avatars/3.png', name: 'Julee Rossignol' }
              ]
            }

            // ... other projects
          ],
          connections: [
            {
              tasks: '834',
              projects: '18',
              isConnected: true,
              connections: '129',
              name: 'Mark Gilbert',
              designation: 'UI Designer',
              avatar: '/images/avatars/1.png',
              chips: [
                { title: 'Figma', color: 'secondary' },
                { title: 'Sketch', color: 'warning' }
              ]
            }

            // ... other connections
          ]
        },
        profileHeader: {
          fullName: 'John Doe',
          location: 'Vatican City',
          joiningDate: 'April 2021',
          designation: 'UX Designer',
          profileImg: '/images/avatars/1.png',
          designationIcon: 'tabler-palette',
          coverImg: '/images/pages/profile-banner.png'
        }
      }

      setDb(newDb)
    }
  }, [user])

  if (!db) return <div>Loading...</div>

  return <UserProfile data={db} tabContentList={tabContentList(db)} />
}

const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  // projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

export default UserProfilePage
