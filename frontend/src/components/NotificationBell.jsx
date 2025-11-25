import { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    VStack,
    Text,
    Badge,
    Button,
    HStack,
    useColorModeValue,
    Divider,
    useToast,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import {NOTIFICATION_TYPE_LABELS,NOTIFICATION_TYPE_COLORS} from '../constants';
import {
    getUnreadNotificationsCount,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../api';
import {jwtDecode} from "jwt-decode";

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = decoded.nameidentifier;
                setUserId(id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    },[userId]);

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadNotificationsCount(userId);
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await getUserNotifications(userId, false);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await markNotificationAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.filter(n => n.id !== notification.id));

        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead(userId);
            setUnreadCount(0);
            setNotifications([]);
            toast({
                title: "Wszystkie powiadomienia oznaczone jako przeczytane",
                status: "success",
                duration: 2000,
            });
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się oznaczyć powiadomień",
                status: "error",
                duration: 3000,
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Teraz';
        if (diffMins < 60) return `${diffMins} min temu`;
        if (diffHours < 24) return `${diffHours}h temu`;
        if (diffDays < 7) return `${diffDays}d temu`;
        return date.toLocaleDateString('pl-PL');
    };

    return (
        <Popover onOpen={fetchNotifications} placement="bottom-end">
            <PopoverTrigger>
                <Box position="relative" display="inline-block">
                    <IconButton
                        icon={<BellIcon />}
                        variant="ghost"
                        aria-label="Powiadomienia"
                    />
                    {unreadCount > 0 && (
                        <Badge
                            position="absolute"
                            top="-1"
                            right="-1"
                            colorScheme="red"
                            borderRadius="full"
                            fontSize="xs"
                            minW="20px"
                            h="20px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Box>
            </PopoverTrigger>
            <PopoverContent w="400px" bg={bgColor} borderColor={borderColor}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">
                    <HStack justify="space-between">
                        <Text>Powiadomienia</Text>
                        {notifications.length > 0 && (
                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={handleMarkAllAsRead}
                            >
                                Oznacz wszystkie
                            </Button>
                        )}
                    </HStack>
                </PopoverHeader>
                <PopoverBody maxH="400px" overflowY="auto" p={0}>
                    {isLoading ? (
                        <Box p={4} textAlign="center">
                            <Text color="gray.500">Ładowanie...</Text>
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box p={8} textAlign="center">
                            <Text color="gray.500">Brak nowych powiadomień</Text>
                        </Box>
                    ) : (
                        <VStack spacing={0} align="stretch">
                            {notifications.map((notification, index) => (
                                <Box key={notification.id}>
                                    <Box
                                        p={3}
                                        cursor="pointer"
                                        _hover={{ bg: hoverBg }}
                                        onClick={() => handleNotificationClick(notification)}
                                        transition="background 0.2s"
                                    >
                                        <HStack align="start" spacing={3}>
                                            <Badge
                                                colorScheme={NOTIFICATION_TYPE_COLORS[notification.type]}
                                                fontSize="xs"
                                                px={2}
                                                py={1}
                                            >
                                                {NOTIFICATION_TYPE_LABELS[notification.type]}
                                            </Badge>
                                            <VStack align="start" spacing={1} flex={1}>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {notification.message}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {formatDate(notification.date)}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                    {index < notifications.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </VStack>
                    )}
                        <>
                            <Divider />
                            <Box p={2}>
                                <Button
                                    w="full"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigate('/notifications')}
                                >
                                    Zobacz wszystkie
                                </Button>
                            </Box>
                        </>

                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}