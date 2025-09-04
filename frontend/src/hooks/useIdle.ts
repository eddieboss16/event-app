import { useEffect, useRef, useState } from "react";

interface useIdleOptions {
    timeout: number; // in milliseconds
    onIdle?: () => void;
    events?: string[];
}

export const useIdle = ({ timeout, onIdle, events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'] }: useIdleOptions) => {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setIsIdle(false);

        timeoutRef.current = setTimeout(() => {
            setIsIdle(true);
            onIdle?.();
        }, timeout);
    };

    useEffect(() => {
        // Set initial timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [timeout, onIdle]);

    return { isIdle, resetTimer };
};