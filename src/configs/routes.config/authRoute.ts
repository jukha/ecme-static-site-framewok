import type { Routes } from '@/@types/routes'

const dashboardsRoute: Routes = {
    '/sign-in': {
        key: 'signIn',
        authority: [],
    },
    '/sign-up': {
        key: 'signUp',
        authority: [],
    },
    '/forgot-password': {
        key: 'forgotPassword',
        authority: [],
    },
    '/reset-password': {
        key: 'resetPassword',
        authority: [],
    },
    '/otp-verification': {
        key: 'otpVerification',
        authority: [],
    },
}

export default dashboardsRoute
