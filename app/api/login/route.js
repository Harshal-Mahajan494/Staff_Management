import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Simple validation - replace this with your actual authentication logic
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes, accept any email/password combination
    // In production, you should validate against your database
    if (email && password) {
      const response = NextResponse.json(
        { message: 'Login successful' },
        { status: 200 }
      )

      // Set the auth token cookie with proper security settings
      response.cookies.set('authToken', 'your-auth-token-here', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
