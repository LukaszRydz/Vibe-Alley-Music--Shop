export interface IJWT {
    sessionToken: string;
    id: string;
    role: string;
    spotifyToken: {
        access_token: string;
        refresh_token: string;
        next_refresh: number;
        scope: string;
    }
}