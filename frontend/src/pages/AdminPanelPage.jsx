import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    useColorModeValue,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    useToast,
    Badge,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';
import { getUsers, deleteUser } from '../api';

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        const checkAdminAndFetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }
                const decoded = jwtDecode(token);
                const role = decoded.role;
                setUser({
                    userName: decoded.username,
                    role: role,
                });
                if (role === 'Admin') {
                    setIsAdmin(true);
                    const response = await getUsers();
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Błąd:', error);
                toast({
                    title: "Błąd",
                    description: "Nie udało się pobrać danych",
                    status: "error",
                    duration: 5000,
                });
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminAndFetchUsers();
    }, [toast]);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUser(userToDelete.id);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast({
                title: "Użytkownik usunięty",
                description: `Użytkownik ${userToDelete.userName} został usunięty`,
                status: "success",
                duration: 3000,
            });

            onClose();
            setUserToDelete(null);
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd",
                description: "Nie udało się usunąć użytkownika",
                status: "error",
                duration: 5000,
            });
        }
    };

    if (isLoading) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <Box textAlign="center">
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Ładowanie panelu...</Text>
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <Alert status="warning" borderRadius="lg">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Wymagane logowanie</AlertTitle>
                            <AlertDescription>
                                Musisz być zalogowany, aby uzyskać dostęp do panelu administracyjnego.
                            </AlertDescription>
                        </Box>
                    </Alert>
                    <HStack mt={4}>
                        <Button onClick={() => navigate('/login')} colorScheme="purple">
                            Zaloguj się
                        </Button>
                        <Button variant="ghost" onClick={() => navigate('/')}>
                            Powrót
                        </Button>
                    </HStack>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (!isAdmin) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Brak dostępu</AlertTitle>
                            <AlertDescription>
                                Nie masz uprawnień do panelu administracyjnego.
                                Twoja rola: {user.role || 'Użytkownik'}
                            </AlertDescription>
                        </Box>
                    </Alert>
                    <HStack mt={4}>
                        <Button onClick={() => navigate('/')} colorScheme="purple">
                            Powrót do strony głównej
                        </Button>
                    </HStack>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />

            <Box py={10}>
                <Container maxW="container.xl">
                    <VStack spacing={8} align="stretch">
                        <HStack justify="space-between">
                            <Box>
                                <Heading size="xl" mb={2}>Panel Administracyjny</Heading>
                                <Text color="gray.500">
                                    Zarządzanie użytkownikami platformy ProCode
                                </Text>
                            </Box>
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="purple"
                                onClick={() => navigate('/administrator/users/create')}
                            >
                                Dodaj użytkownika
                            </Button>
                        </HStack>
                        <Box
                            bg={bgColor}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            overflowX="auto"
                        >
                            <Heading size="md" mb={4}>
                                Użytkownicy ({users.length})
                            </Heading>

                            {users.length === 0 ? (
                                <Text color="gray.500" textAlign="center" py={8}>
                                    Brak użytkowników
                                </Text>
                            ) : (
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Nazwa użytkownika</Th>
                                            <Th>Email</Th>
                                            <Th>Imię</Th>
                                            <Th>Nazwisko</Th>
                                            <Th>Rola</Th>
                                            <Th>Akcje</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {users.map((u) => (
                                            <Tr key={u.id}>
                                                <Td fontWeight="semibold">{u.username}</Td>
                                                <Td>{u.email}</Td>
                                                <Td>{u.firstName || '-'}</Td>
                                                <Td>{u.lastName || '-'}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={u.role === 'Admin' ? 'red' : 'gray'}
                                                    >
                                                        {u.role || 'User'}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={2}>
                                                        <IconButton
                                                            icon={<EditIcon />}
                                                            colorScheme="blue"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/administrator/users/${u.id}/edit`)}
                                                            aria-label="Edytuj użytkownika"
                                                        />
                                                        <IconButton
                                                            icon={<DeleteIcon />}
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(u)}
                                                            aria-label="Usuń użytkownika"
                                                        />
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            )}
                        </Box>
                    </VStack>
                </Container>
            </Box>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Usuń użytkownika
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Czy na pewno chcesz usunąć użytkownika <strong>{userToDelete?.userName}</strong>?
                            Ta akcja jest nieodwracalna.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onClose}>
                                Anuluj
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Usuń
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Footer />
        </Box>
    );
}