import { promises as fs } from 'fs';
import path from 'path';

// Load fonts
const loadFont = async (fontName: string) => {
    try {
        const buffer = await fs.readFile(path.join(process.cwd(), 'public', 'fonts', fontName));
        return buffer;
    } catch (error) {
        console.error(`Error loading font ${fontName}:`, error);
        return null;
    }
};

const interRegular = loadFont('Inter-Regular.otf');
const interBold = loadFont('Inter-Bold.otf');

export { interBold, interRegular };
