import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hanyaAdmin = ["/product", "/admin", "/setting/app"]; // Path hanya untuk admin
    const hanyaEditor = ["/editor"]; // Path hanya untuk editor
    
    const token: any = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Jika belum login sama sekali
    if (!token) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    // Jika sudah login tapi bukan admin dan path hanya untuk admin
    if (hanyaAdmin.includes(pathname) && token.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Jika sudah login tapi bukan editor dan path hanya untuk editor
    if (hanyaEditor.includes(pathname) && token.role !== "editor") {
        return NextResponse.redirect(new URL("/", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/product", "/about", "/profile", "/admin", "/setting/app", "/editor"],
};
