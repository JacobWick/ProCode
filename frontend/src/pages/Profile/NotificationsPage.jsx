import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    Badge,
    Spinner,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {NOTIFICATION_TYPE_LABELS,NOTIFICATION_TYPE_COLORS} from '../../constants';
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../../api';
import {jwtDecode} from "jwt-decode";

export default function NotificationsPage() {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const toast = useToast();
    const pageBg = useColorModeValue('gray.50', 'gray.900');
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
        if (userId)
        {
            fetchNotifications();
        }
    }, [userId]);

    const fetchNotifications = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const [unreadRes, readRes] = await Promise.all([
                getUserNotifications(userId, false),
                getUserNotifications(userId, true),
            ]);
            setUnreadNotifications(unreadRes.data);
            setReadNotifications(readRes.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się pobrać powiadomień",
                status: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            await fetchNotifications();
            toast({
                title: "Oznaczono jako przeczytane",
                status: "success",
                duration: 2000,
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            await fetchNotifications();
            toast({
                title: "Wszystkie powiadomienia oznaczone",
                status: "success",
                duration: 2000,
            });
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL');
    };

    const renderNotificationList = (notifications) => {
        if (notifications.length === 0) {
            return (
                <Box textAlign="center" py={10}>
                    <Text color="gray.500">Brak powiadomień</Text>
                </Box>
            );
        }

        return (
            <VStack spacing={3} align="stretch">
                {notifications.map((notification) => (
                    <Box
                        key={notification.id}
                        p={4}
                        bg={notification.isRead ? bgColor : hoverBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        transition="all 0.2s"
                    >
                        <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={2} flex={1}>
                                <HStack>
                                    <Badge
                                        colorScheme={NOTIFICATION_TYPE_COLORS[notification.type]}
                                    >
                                        {NOTIFICATION_TYPE_LABELS[notification.type]}
                                    </Badge>
                                    {!notification.isRead && (
                                        <Badge colorScheme="blue">Nowe</Badge>
                                    )}
                                </HStack>
                                <Text fontWeight={notification.isRead ? 'normal' : 'semibold'}>
                                    {notification.message}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {formatDate(notification.date)}
                                </Text>
                            </VStack>
                            <HStack>
                                {!notification.isRead && (
                                    <IconButton
                                        icon={<CheckIcon />}
                                        size="sm"
                                        colorScheme="green"
                                        variant="ghost"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        aria-label="Oznacz jako przeczytane"
                                    />
                                )}
                            </HStack>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        );
    };

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />
            <Box py={10}>
                <Container maxW="container.lg">
                    <VStack spacing={6} align="stretch">
                        <HStack justify="space-between">
                            <Heading>Powiadomienia</Heading>
                            {unreadNotifications.length > 0 && (
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                >
                                    Oznacz wszystkie jako przeczytane
                                </Button>
                            )}
                        </HStack>

                        {isLoading ? (
                            <Box textAlign="center" py={10}>
                                <Spinner size="xl" />
                            </Box>
                        ) : (
                            <Box
                                bg={bgColor}
                                p={6}
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor={borderColor}
                            >
                                <Tabs
                                    colorScheme="purple"
                                    index={activeTab}
                                    onChange={setActiveTab}
                                >
                                    <TabList>
                                        <Tab>
                                            Nieprzeczytane ({unreadNotifications.length})
                                        </Tab>
                                        <Tab>
                                            Przeczytane ({readNotifications.length})
                                        </Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel px={0}>
                                            {renderNotificationList(unreadNotifications)}
                                        </TabPanel>
                                        <TabPanel px={0}>
                                            {renderNotificationList(readNotifications)}
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        )}
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}