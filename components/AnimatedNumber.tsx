import React, { useEffect, useRef, useState } from 'react';

// Easing function for a smooth animation
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useCountUp = (endValue: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let startTime: number | null = null;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        const easedPercentage = easeOutCubic(percentage);
                        const currentCount = endValue * easedPercentage;
                        setCount(currentCount);

                        if (progress < duration) {
                            animationFrameId.current = requestAnimationFrame(animate);
                        } else {
                            setCount(endValue); // Ensure it ends on the exact value
                        }
                    };

                    animationFrameId.current = requestAnimationFrame(animate);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (currentRef) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(currentRef);
            }
        };
    }, [endValue, duration]);

    return { count, ref };
};

interface AnimatedNumberProps {
    metric: string;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ metric, className }) => {
    // Regular expression to extract the numerical part of the metric
    const numberMatch = metric.match(/([0-9.]+)/);
    const endValue = numberMatch ? parseFloat(numberMatch[0]) : 0;
    
    // Extract any text before or after the number
    const prefix = metric.substring(0, numberMatch?.index ?? 0);
    const suffix = numberMatch ? metric.substring((numberMatch.index ?? 0) + numberMatch[0].length) : '';
    
    const { count, ref } = useCountUp(endValue);
    
    // Check if the original number had a decimal to determine formatting
    const hasDecimal = (endValue.toString().indexOf('.') !== -1);
    const formattedCount = hasDecimal ? count.toFixed(1) : Math.round(count).toLocaleString();

    return (
        <span ref={ref} className={className} aria-label={metric}>
            {prefix}{formattedCount}{suffix}
        </span>
    );
};

export default AnimatedNumber;