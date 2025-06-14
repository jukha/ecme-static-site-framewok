import { NextResponse } from 'next/server'

export async function POST() {
    try {
        /** implement signup user logic here */
        return NextResponse.json({})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
