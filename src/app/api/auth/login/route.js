// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/config/firebase-admin';
import { generateSessionFingerprint } from '@/utils/fingerprint';
import { SignJWT } from 'jose'; // Next.js edge-compatible runtime token signer

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing authentication token" }, { status: 400 });
    }

    // 1. Verify the incoming token with the Firebase Admin Auth SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Generate the unique client-device signature hash
    const browserFingerprint = generateSessionFingerprint(request);

    // 3. Assemble a cryptographically signed secure state token containing the device boundary
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const secureSessionPayload = await new SignJWT({ uid, fingerprint: browserFingerprint })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h') // Session automatically self-destructs after 2 hours
      .sign(secretKey);

    // 4. Construct response attaching hardened, unreadable administrative cookies
    const response = NextResponse.json({ success: true, user: { uid, email: decodedToken.email } });

    response.cookies.set('admin_session', secureSessionPayload, {
      httpOnly: true,       // Destroys any client-side JavaScript reading access (Stops Cookie Stealing)
      secure: process.env.NODE_ENV === 'production', // Forces cookie transmission strictly over HTTPS
      sameSite: 'strict',   // Completely mitigates Cross-Site Request Forgery (CSRF) vectors
      path: '/',
      maxAge: 7200         // Matches session lifecycle (2 Hours in seconds)
    });

    return response;

  } catch (error) {
    console.error("❌ Administrative Authentication Exception:", error);
    return NextResponse.json({ error: "Authentication transaction failed." }, { status: 401 });
  }
}