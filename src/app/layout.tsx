// import 'react-perfect-scrollbar/dist/css/styles.css'

// // Type Imports
// import type { ChildrenType } from '@core/types'
// import type { Locale } from '@configs/i18n'

// import { i18n } from '@configs/i18n'

// // Style Imports
// import '@/app/globals.css'

// // Generated Icon CSS Imports
// import '@assets/iconify-icons/generated-icons.css'

// export const metadata = {
//   title: 'Adroittech Admin Dashboard',
//   description:
//     'Adroittech Admin Dashboard - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
// }

// const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
//   // Vars
//   const direction = i18n.langDirection[params.lang]

//   return (
//     <html id='__next' lang={params.lang} dir={direction}>
//       <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
//     </html>
//   )
// }

// export default RootLayout

// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { VideoPlayerProvider } from '@/components/audio_video/contexts/video-player-context'
import { WebSocketProvider } from '@/context/WebSocketContext'



export const metadata = {
  title: 'Mask Chat Admin Dashboard',
  description:
    'Mask Chat Admin Dashboard - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const headersList = headers()
  const direction = i18n.langDirection[params.lang]

  return (
    // <TranslationWrapper headersList={headersList} lang={params.lang}>
    <html id='__next' lang={params.lang} dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
         {/* <WebSocketProvider> */}

        <VideoPlayerProvider>
            {children}
        </VideoPlayerProvider>
         {/* </WebSocketProvider> */}
      </body>
    </html>

    // </TranslationWrapper>
  )
}

export default RootLayout


