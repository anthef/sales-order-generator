"use client"

import { RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }    

    return (
        <div className="flex items-center space-x-2">
            <RiSunLine className={cn(
                "w-4 h-4 transition-colors",
                resolvedTheme === 'light' ? "text-yellow-500" : "text-gray-400"
            )} />
            <Switch
                checked={resolvedTheme === 'dark'}
                onCheckedChange={(checked: boolean) => {setTheme(checked ? 'dark' : 'light');}}
                className="data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-200"
            />
            <RiMoonLine className={cn(
                "w-4 h-4 transition-colors",
                resolvedTheme === 'dark' ? "text-blue-400" : "text-gray-400"
            )} />
        </div>
    );
}