import { auth } from '@/_auth'

export default async function getServerSession() {
    return await auth()
}
