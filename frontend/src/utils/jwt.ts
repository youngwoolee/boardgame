import jwt_decode from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
    role: string | string[];
}

export function getUserRole(): string | null {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    if (!token) return null;

    try {
        const decoded = jwt_decode<JwtPayload>(token);
        return Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
    } catch (e) {
        return null;
    }
}