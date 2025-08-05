
'use server';

/**
 * @fileOverview A Genkit flow to animate a static character image using a video generation model.
 * - animateAvatar - Takes an image data URI and returns an animated video data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import * as fs from 'fs/promises';

const AnimateAvatarInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The character image to animate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnimateAvatarInput = z.infer<typeof AnimateAvatarInputSchema>;

const AnimateAvatarOutputSchema = z.object({
    videoDataUri: z.string().describe('The generated animated video as a data URI.')
});
export type AnimateAvatarOutput = z.infer<typeof AnimateAvatarOutputSchema>;

export async function animateAvatar(
  input: AnimateAvatarInput
): Promise<AnimateAvatarOutput> {
  return animateAvatarFlow(input);
}


const animateAvatarFlow = ai.defineFlow(
  {
    name: 'animateAvatarFlow',
    inputSchema: AnimateAvatarInputSchema,
    outputSchema: AnimateAvatarOutputSchema,
  },
  async ({ imageDataUri }) => {

    let { operation } = await ai.generate({
        // Use the Veo model for image-to-video generation
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: [
            {
                text: 'Animate this character. Make it have subtle, realistic movements like breathing and blinking, as if it is a friendly guide. The background should remain the same. The animation should be able to loop seamlessly. Do not change the character design.',
            },
            {
                media: {
                    url: imageDataUri,
                },
            },
        ],
        config: {
            durationSeconds: 5,
            aspectRatio: '1:1', // Square aspect ratio for the avatar
        },
    });

    if (!operation) {
        throw new Error('Video generation operation was not initiated.');
    }

    // Poll for completion, as video generation is asynchronous
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
    }
    
    if (operation.error) {
        console.error('Video generation failed:', operation.error.message);
        throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find(p => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
        throw new Error('No video content was found in the operation result.');
    }
    
    // The URL from Veo is temporary and needs to be fetched.
    const fetch = (await import('node-fetch')).default;
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY environment variable is not set.');
    }

    const videoDownloadResponse = await fetch(`${videoPart.media.url}&key=${apiKey}`);

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download the generated video. Status: ${videoDownloadResponse.status}`);
    }

    const videoBuffer = await videoDownloadResponse.buffer();
    const videoBase64 = videoBuffer.toString('base64');
    
    // Use the content type from the response if available, otherwise default to mp4
    const contentType = videoDownloadResponse.headers.get('content-type') || 'video/mp4';

    return {
        videoDataUri: `data:${contentType};base64,${videoBase64}`
    };
  }
);
