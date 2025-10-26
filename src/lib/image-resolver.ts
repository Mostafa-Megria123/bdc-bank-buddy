// src/lib/image-resolver.ts
export function resolveImageUrl(path: string): string {
    try {
        // The path from JSON should be relative to the /src directory.
        // e.g., 'assets/announcement-1.jpg'
        return new URL(`/src/${path}`, import.meta.url).href;
    } catch (error) {
        console.error(`Failed to resolve image URL for path: ${path}`, error);
        // Return a placeholder or a default image path on error
        return '/placeholder.svg';
    }
}