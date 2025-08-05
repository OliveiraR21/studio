
'use server';

import * as fs from 'fs/promises';
import path from 'path';
import { animateAvatar } from '@/ai/flows/animate-avatar-flow';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Helper function to read the image file and convert to data URI
async function getAvatarImageAsDataUri(): Promise<string> {
    const imagePath = path.join(process.cwd(), 'public', 'supply-avatar.png');
    const imageBuffer = await fs.readFile(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    return `data:image/png;base64,${imageBase64}`;
}


export async function AnimatedSupply() {
    let videoDataUri: string | null = null;
    let errorOccurred = false;

    try {
        const imageDataUri = await getAvatarImageAsDataUri();
        const result = await animateAvatar({ imageDataUri });
        videoDataUri = result.videoDataUri;
    } catch (error) {
        console.error("Could not generate animated avatar:", error);
        errorOccurred = true;
    }

    if (videoDataUri) {
        return (
            <video
                src={videoDataUri}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-full"
                width={112} // 28 * 4
                height={112}
            />
        );
    }
    
    // Fallback to static image if video generation failed
    return (
        <Avatar className="h-full w-full">
            <AvatarImage src="/supply-avatar.png" alt="Avatar Supply" data-ai-hint="mascot avatar" />
            <AvatarFallback>S</AvatarFallback>
        </Avatar>
    );
}
