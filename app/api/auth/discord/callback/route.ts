import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const errorParam = request.nextUrl.searchParams.get("error")
  const origin = request.nextUrl.origin
  const loginUrl = `${origin}/login`
  const redirectUri = `${origin}/api/auth/discord/callback`

  if (errorParam) {
    return NextResponse.redirect(`${loginUrl}?error=discord_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${loginUrl}?error=discord_no_code`)
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${loginUrl}?error=discord_config`)
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })
    const tokenData = (await tokenRes.json().catch(() => ({}))) as { access_token?: string }
    const accessToken = tokenData.access_token
    if (!accessToken) {
      return NextResponse.redirect(`${loginUrl}?error=discord_exchange`)
    }

    const backendRes = await fetch(`${API_BASE_URL}/auth/discord`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    })
    const backendData = (await backendRes.json().catch(() => ({}))) as {
      status?: boolean
      token?: string
      user?: { id: number; username: string; email: string }
    }

    if (!backendRes.ok || !backendData.token || !backendData.user) {
      return NextResponse.redirect(`${loginUrl}?error=discord_backend`)
    }

    const userPayload = {
      id: backendData.user.id,
      username: backendData.user.username,
      email: backendData.user.email ?? "",
    }
    const userB64 = Buffer.from(JSON.stringify(userPayload)).toString("base64")
    const hash = `token=${encodeURIComponent(backendData.token)}&user=${encodeURIComponent(userB64)}`
    return NextResponse.redirect(`${loginUrl}#${hash}`)
  } catch {
    return NextResponse.redirect(`${loginUrl}?error=discord_failed`)
  }
}
