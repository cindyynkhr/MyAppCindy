import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

const hanyaAdmin = ["/product", "/admin",  "/setting/app"];
const hanyaEditor = ["/editor"];

export default function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = [],
){
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname = req.nextUrl.pathname;
        
        if (requireAuth.includes(pathname)) {
            const token: any = await getToken({
                req,
                secret: process.env.NEXTAUTH_SECRET,
            });
            if (!token) {
                const loginUrl = new URL("/auth/login", req.url);
                loginUrl.searchParams.set("callbackUrl", encodeURI(req.url));
                return NextResponse.redirect(loginUrl);
            }
            if (token.role !== "admin" && hanyaAdmin.includes(pathname)) {
                return NextResponse.redirect(new URL("/", req.url));
            }
            if (token.role !== "editor" && hanyaEditor.includes(pathname)) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
        return middleware(req, next);
    }
}