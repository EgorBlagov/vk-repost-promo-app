import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, periodMs: number) {
    const currentCallback = useRef<() => void>();

    useEffect(() => {
        currentCallback.current = callback;
    }, [callback])
    
    useEffect(() => {
        const tick = () => currentCallback.current && currentCallback.current();
        const interval = setInterval(tick, periodMs);
        return () => clearInterval(interval);
    }, [periodMs]);
}
