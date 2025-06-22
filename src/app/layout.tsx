import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import pageMetaConfig from '@/configs/page-meta.config'
import LocaleProvider from '@/components/template/LocaleProvider'
import NavigationProvider from '@/components/template/Navigation/NavigationProvider'
// import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
import { getLocale, getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'
import '@/assets/styles/app.css'
import { loadNavigationConfig } from '@/configs/navigation.config'


export const metadata = {
    ...pageMetaConfig,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const locale = await getLocale()
    const messages = await getMessages()

    // const navigationTree = (await params).nav
    const navigationTree = loadNavigationConfig()
    

    const theme = await getTheme()

    return (
        <html
            className={theme.mode === 'dark' ? 'dark' : 'light'}
            lang={locale}
            dir={theme.direction}
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                <LocaleProvider locale={locale} messages={messages}>
                    <ThemeProvider locale={locale} theme={theme}>
                        <NavigationProvider navigationTree={navigationTree}>
                            {children}
                        </NavigationProvider>
                    </ThemeProvider>
                </LocaleProvider>
            </body>
        </html>
    )
}
