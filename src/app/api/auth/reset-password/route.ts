import { NextResponse } from 'next/server'

export async function POST() {
    try {
        /** implement reset password logic here */
        return NextResponse.json(true)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
