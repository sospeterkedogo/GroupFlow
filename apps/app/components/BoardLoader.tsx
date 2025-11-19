// components/Loader.tsx

import React from 'react'

interface BoardLoaderProps {
    message: string;
    isError?: boolean;
}

export const BoardLoader: React.FC<BoardLoaderProps> = ({ message, isError = false }) => {
    const colorClass = isError ? 'text-red-500' : 'text-slate-500';

    return (
        <div className="flex-1 flex items-center justify-center h-full min-h-[50vh] p-8">
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
                {!isError && (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
                )}
                <p className={`text-xl font-medium ${colorClass}`}>{message}</p>
                {isError && (
                    <p className="text-sm text-gray-500 mt-2">Please refresh or check your network connection.</p>
                )}
            </div>
        </div>
    )
}