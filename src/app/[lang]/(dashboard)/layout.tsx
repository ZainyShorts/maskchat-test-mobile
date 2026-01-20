

import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

import { i18n } from '@configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import SubscriptionGuard from './SubscriptionGuard'

// 👇 import the client-side chatbot
// import ChatbotWidget from './ChatbotWidget'

const Layout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  const direction = i18n.langDirection[params.lang]
  const dictionary = await getDictionary(params.lang)
  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation dictionary={dictionary} mode={mode} systemMode={systemMode} />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
            {children}
          </HorizontalLayout>
        }
      />
      <SubscriptionGuard>
        <ScrollToTop className="mui-fixed">
          <button className="is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center bg-blue-500 text-white">
            <i className="tabler-arrow-up" />
          </button>
        </ScrollToTop>
      </SubscriptionGuard>
    </Providers>
  )
}

export default Layout
