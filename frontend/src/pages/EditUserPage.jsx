import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormHelperText,
    useColorModeValue,
    useToast,
    HStack,
    Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserById, updateUser } from '../api';

const ROLES = [
    { value: 'Student', label: 'Student' },
    { value: 'Mentor', label: 'Mentor' },
    { value: 'Admin', label: 'Admin' },
];

export default function EditUserPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'Student',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const response = await getUserById(userId);
                const user = response.data;

                setUserData({
                    userName: user.userName || '',
                    email: user.email || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    role: user.role || 'Student',
                });
            } catch (error) {
                console.error(error);
                toast({
                    title: "Błąd",
                    description: "Nie udało się pobrać danych użytkownika",
                    status: "error",
                    duration: 5000,
                });
                navigate('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const updateUserData = {
                id: userId,
                username: userData.userName || null,
                email: userData.email || null,
                firstName: userData.firstName || null,
                lastName: userData.lastName || null,
                role: userData.role || null,
            };
            const response = await updateUser(userId, updateUserData);
            if (response.data === true) {
                toast({
                    title: "Użytkownik zaktualizowany!",
                    description: `Dane użytkownika ${userData.userName} zostały zapisane`,
                    status: "success",
                    duration: 5000,
                });
                navigate('/administrator');
            } else {
                toast({
                    title: "Błąd aktualizacji",
                    description: "Nie udało się zaktualizować użytkownika",
                    status: "error",
                    duration: 6000,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji użytkownika",
                description: error.response?.data?.message || error.message || "Wystąpił nieoczekiwany błąd",
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.md" py={20}>
                    <Box textAlign="center">
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Ładowanie danych użytkownika...</Text>
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />

            <Box py={10}>
                <Container maxW="container.md">
                    <VStack spacing={8} align="stretch">
                        <HStack>
                            <Button
                                leftIcon={<ArrowBackIcon />}
                                variant="ghost"
                                onClick={() => navigate('/administrator')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Edytuj użytkownika</Heading>
                            <Text color="gray.500">
                                Zaktualizuj dane użytkownika i przypisaną rolę
                            </Text>
                        </Box>

                        <Box
                            bg={bgColor}
                            p={8}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            boxShadow="sm"
                        >
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={6} align="stretch">
                                    <FormControl>
                                        <FormLabel>Nazwa użytkownika</FormLabel>
                                        <Input
                                            name="userName"
                                            placeholder="np. jan_kowalski"
                                            value={userData.username}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Unikalna nazwa użytkownika do logowania
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="jan@example.com"
                                            value={userData.email}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Adres email użytkownika
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Imię</FormLabel>
                                        <Input
                                            name="firstName"
                                            placeholder="Jan"
                                            value={userData.firstName}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Nazwisko</FormLabel>
                                        <Input
                                            name="lastName"
                                            placeholder="Kowalski"
                                            value={userData.lastName}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Rola</FormLabel>
                                        <Select
                                            name="role"
                                            value={userData.role}
                                            onChange={handleChange}
                                            size="lg"
                                        >
                                            {ROLES.map(role => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            <strong>Student:</strong> Podstawowy użytkownik<br />
                                            <strong>Mentor:</strong> Może tworzyć kursy<br />
                                            <strong>Admin:</strong> Pełny dostęp administracyjny
                                        </FormHelperText>
                                    </FormControl>

                                    <Box
                                        bg="yellow.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="yellow.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="yellow.800">
                                            <strong>Uwaga:</strong> Zmiana roli użytkownika może wpłynąć na jego uprawnienia.
                                            Upewnij się, że użytkownik powinien mieć przypisaną nową rolę.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3} pt={4}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/admin')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="purple"
                                            isLoading={isSaving}
                                        >
                                            Zapisz zmiany
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </Box>
                    </VStack>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}