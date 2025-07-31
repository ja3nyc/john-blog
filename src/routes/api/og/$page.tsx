import { createServerFileRoute } from '@tanstack/react-start/server';
import { generateOpenGraphImage } from '~/utils/generateOpenGraph';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
    'home': { title: 'John Annunziato', subtitle: 'Software Engineer & Writer' },
    'blog': { title: 'Blog', subtitle: 'Thoughts on software development' },
    'about': { title: 'Projects', subtitle: 'Things I\'ve built' },
    'contact': { title: 'Contact', subtitle: 'Get in touch' },
};

export const ServerRoute = createServerFileRoute('/api/og/$page').methods({
    GET: async ({ params }) => {
        try {
            const route = params.page;
            const pageInfo = routeTitles[route] || {
                title: 'John Annunziato',
                subtitle: 'Software Engineer & Founder'
            };

            const image = await generateOpenGraphImage({
                title: pageInfo.title,
                subtitle: pageInfo.subtitle
            });

            return new Response(image, {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        } catch (error) {
            console.error('Error generating OG image:', error);
            return new Response('Error generating image', { status: 500 });
        }
    },
});
