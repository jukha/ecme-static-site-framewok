import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    outputFileTracingIncludes: {
        // include entire content folder in server bundle
        '.': ['content/**/*'],
    },
}

export default withNextIntl(nextConfig)
