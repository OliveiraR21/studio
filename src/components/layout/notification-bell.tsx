
'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Info, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNotifications, markNotificationsAsRead } from '@/actions/notification-actions';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { getCurrentUser } from '@/lib/auth'; // Not a server action, safe to call
import { getSimulatedUserId } from '@/lib/auth';

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function loadInitialData() {
            const id = await getSimulatedUserId();
            setUserId(id);
        }
        loadInitialData();
    }, []);
    
    useEffect(() => {
        if (!userId) return;

        async function fetchNotifications() {
            setIsLoading(true);
            try {
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchNotifications();
    }, [userId]);

    const handleMarkAllAsRead = async () => {
        if (!userId) return;
        setNotifications([]); // Optimistically update UI
        await markNotificationsAsRead(userId);
        setIsOpen(false);
    };

     const handleMarkOneAsRead = async (notificationId: string) => {
        if (!userId) return;
        setNotifications(prev => prev.filter(n => n.id !== notificationId)); // Optimistically update UI
        await markNotificationsAsRead(userId, notificationId);
    };
    
    const unreadCount = notifications.length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border hover:bg-primary/10 text-foreground hover:text-primary hover:border-primary focus-visible:ring-0 focus-visible:ring-offset-0" data-tour-id="notification-bell">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Abrir notificações</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="font-semibold">Notificações</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                            <Check className="mr-2 h-4 w-4" />
                            Marcar como lidas
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-96">
                    {isLoading ? (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : unreadCount > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = notification.isProjectNotification ? Award : Info;
                                return (
                                    <Link key={notification.id} href={notification.href || '#'} className="block hover:bg-muted/50" onClick={() => handleMarkOneAsRead(notification.id)}>
                                        <div className="flex items-start gap-3 p-4">
                                            <div className="flex-shrink-0 pt-1">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{notification.title}</p>
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ptBR })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            <p>Nenhuma notificação nova.</p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
