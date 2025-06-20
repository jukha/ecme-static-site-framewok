'use server'

import { signIn } from '@/_auth'
import appConfig from '@/configs/app.config'

const handleOauthSignIn = async (
    signInMethod: string,
    callbackUrl?: string,
) => {
    await signIn(signInMethod, {
        redirectTo: callbackUrl || appConfig.authenticatedEntryPath,
    })
}

export default handleOauthSignIn
