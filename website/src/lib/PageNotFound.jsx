const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useLocation } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await db.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-6xl font-light text-foreground/10">404</h1>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-light tracking-wide text-foreground/60">
                            Lost in the void
                        </h2>
                        <p className="text-xs tracking-wide text-foreground/25">
                            The page you're looking for doesn't exist.
                        </p>
                    </div>
                    
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-card border border-border/30">
                            <p className="text-[10px] tracking-[0.1em] uppercase text-foreground/30">
                                Admin: This page hasn't been implemented yet.
                            </p>
                        </div>
                    )}
                    
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 border border-foreground/20 px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-500"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}