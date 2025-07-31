import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { interBold, interRegular } from './fonts';

export async function generateOpenGraphImage({
    title,
    subtitle,
    width = 1200,
    height = 630,
}: {
    title: string;
    subtitle?: string;
    width?: number;
    height?: number;
}): Promise<Buffer> {
    const svg = await satori(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '60px',
                backgroundColor: '#000000',
                position: 'relative',
            }}
        >
            {/* White circle in bottom left */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: '60px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#f4f4f5',
                }}
            />

            {/* Text content in top right */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    gap: '24px',
                    maxWidth: '70%',
                    marginLeft: 'auto',
                }}
            >
                <div
                    style={{
                        fontSize: title.length > 40 ? 48 : 64,
                        fontWeight: 700,
                        fontFamily: 'Inter',
                        letterSpacing: '-0.03em',
                        color: '#f4f4f5',
                        lineHeight: 1.1,
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </div>
                {subtitle && (
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 400,
                            fontFamily: 'Inter',
                            color: '#a1a1aa',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {subtitle}
                    </div>
                )}
            </div>

            {/* Author name in bottom right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '60px',
                    fontSize: 24,
                    fontWeight: 500,
                    fontFamily: 'Inter',
                    color: '#71717a',
                }}
            >
                John Annunziato
            </div>
        </div>,
        {
            width,
            height,
            fonts: [
                {
                    name: 'Inter',
                    data: (await interRegular)!,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: (await interBold)!,
                    weight: 700,
                    style: 'normal',
                },
            ],
        }
    );

    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: width },
    });

    return resvg.render().asPng();
}

