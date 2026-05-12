import { handlers } from '@/auth'; // Referring to the auth.ts we just created

export const { GET, POST } = handlers;

// export const GET = auth(function GET(req) {
//   if (req.auth) return NextResponse.json(req.auth)
//   return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
// })
