import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import Image from 'next/image';

interface TextItem {
    text: string;
    image: string;
}

interface CircularRevealHeadingProps {
    items: TextItem[];
    centerText: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}


const sizeConfig = {
    sm: {
        container: 'h-[280px] w-[280px]',
        fontSize: 'text-[10px]',
        tracking: 'tracking-[0.2em]',
        radius: 140,
        gap: 36,
        imageSize: 'w-[65%] h-[65%]',
        textStyle: 'font-medium'
    },
    md: {
        container: 'h-[350px] w-[350px]',
        fontSize: 'text-xs',
        tracking: 'tracking-[0.25em]',
        radius: 150,
        gap: 32,
        imageSize: 'w-[70%] h-[70%]',
        textStyle: 'font-medium',
    },
    lg: {
        container: 'h-[450px] w-[450px]',
        fontSize: 'text-sm',
        tracking: 'tracking-[0.3em]',
        radius: 160,
        gap: 24,
        imageSize: 'w-[75%] h-[75%]',
        textStyle: 'font-medium'
    }
};

const usePreloadImages = (images: string[]) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadImage = (url: string): Promise<void> =>
            new Promise((resolve, reject) => {
                const img = new window.Image();
                img.src = url;
                img.onload = () => resolve();
                img.onerror = reject;
            });

        Promise.all(images.map(loadImage))
            .then(() => setLoaded(true))
            .catch(err => console.error('Error preloading images:', err));
    }, [images]);

    return loaded;
};





const ImagePreloader = ({ images }: { images: string[] }) => (
    <div className="hidden" aria-hidden="true">
        {images.map((src, index) => (
            <Image 
                key={index} 
                src={src} 
                alt="" 
                width={1}
                height={1}
                style={{ width: '1px', height: '1px' }}
                priority
            />
        ))}
    </div>
);

const ImageOverlay = ({ image, size = 'md' }: { image: string, size?: 'sm' | 'md' | 'lg' }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
    >
        <motion.div 
            className={cn(
                sizeConfig[size].imageSize,
                "relative rounded-full overflow-hidden"
            )}
            style={{ filter: 'brightness(0.9)' }}
        >
            <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
            />
        </motion.div>
    </motion.div>
);
export const CircularRevealHeading = ({
    items,
    centerText,
    className,
    size = 'md'
}: CircularRevealHeadingProps) => {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const config = sizeConfig[size];
    const imagesLoaded = usePreloadImages(items.map(item => item.image));

    const createTextSegments = () => {
        const totalItems = items.length;
        const totalGapDegrees = config.gap * totalItems; // Total space for gaps
        const availableDegrees = 360 - totalGapDegrees; // Remaining space for text
        const segmentDegrees = availableDegrees / totalItems; // Space per text segment
        return items.map((item, index) => {
            const startPosition = index * (segmentDegrees + config.gap);
            const startOffset = `${(startPosition / 360) * 100}%`;
            return (
                <g key={index}>
                    <text
                        className={cn(
                            config.fontSize,
                            config.tracking,
                            config.textStyle,
                            "uppercase cursor-pointer transition-all duration-300"
                        )}
                        onMouseEnter={() => imagesLoaded && setActiveImage(item.image)}
                        onMouseLeave={() => setActiveImage(null)}
                        style={{
                            filter: 'url(#textShadow)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <textPath
                            href="#curve"
                            className="fill-[url(#textGradient)]"
                            startOffset={startOffset}
                            textLength={`${segmentDegrees * 1.8}`}
                            lengthAdjust="spacingAndGlyphs"
                        >
                            {item.text}
                        </textPath>
                    </text>
                </g>
            );
        });
    };

    return (
        <>
            <ImagePreloader images={items.map(item => item.image)} />
            <motion.div
                whileHover={{
                    boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)"
                }}
                whileTap={{ scale: 0.98 }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "relative overflow-hidden",
                    config.container,
                    "rounded-full bg-[#e6e6e6]",
                    "shadow-[16px_16px_32px_#bebebe,-16px_-16px_32px_#ffffff]",
                    "transition-all duration-500 ease-out",
                    className
                )}
            >
                <AnimatePresence>
                    {activeImage && imagesLoaded && (
                        <ImageOverlay image={activeImage} size={size} />
                    )}
                </AnimatePresence>

                <motion.div
                    className="absolute inset-[2px] rounded-full bg-[#e6e6e6]"
                    style={{
                        boxShadow: "inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)"
                    }}
                />

                <motion.div
                    className="absolute inset-[12px] rounded-full bg-[#e6e6e6]"
                    style={{
                        boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)"
                    }}
                />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="p-6">
                        <div className="text-center" style={{
                            background: 'linear-gradient(90deg, #666666 0%, #444444 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'url(#textShadow)'
                        }}>
                            {centerText}
                        </div>
                    </div>
                </div>

                <motion.div
                    className="absolute inset-0"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                        <defs>
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#666666" />
                                <stop offset="100%" stopColor="#444444" />
                            </linearGradient>
                        </defs>
                        <path
                            id="curve"
                            fill="none"
                            d={`M 200,200 m -${config.radius},0 a ${config.radius},${config.radius} 0 1,1 ${config.radius * 2},0 a ${config.radius},${config.radius} 0 1,1 -${config.radius * 2},0`}
                        />
                        {createTextSegments()}
                    </svg>
                </motion.div>
            </motion.div>
        </>
    );
};