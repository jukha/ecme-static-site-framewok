'use server'

import { signOut } from '@/_auth'
import appConfig from '@/configs/app.config'

const handleSignOut = async () => {
    await signOut({ redirectTo: appConfig.unAuthenticatedEntryPath })
}

export default handleSignOut
