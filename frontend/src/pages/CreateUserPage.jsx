import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createUser } from '../api';

const ROLES = [
    { value: 'Student', label: 'Student' },
    { value: 'Mentor', label: 'Mentor' },
    { value: 'Admin', label: 'Admin' },
];

export default function CreateUserPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'Student',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.userName || !userData.email || !userData.password) {
            toast({
                title: "Błąd walidacji",
                description: "Nazwa użytkownika, email i hasło są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (userData.password.length < 6) {
            toast({
                title: "Błąd walidacji",
                description: "Hasło musi mieć minimum 6 znaków",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);
            const createUserData = {
                userName: userData.userName,
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName || null,
                lastName: userData.lastName || null,
                role: userData.role,
            };

            const response = await createUser(createUserData);
            const result =  response.data;


            if (result.status === 200) {
                toast({
                    title: "Użytkownik utworzony!",
                    description: `Użytkownik ${userData.userName} został dodany z rolą ${userData.role}`,
                    status: "success",
                    duration: 5000,
                });
                navigate('/administrator');
            } else {
                toast({
                    title: "Błąd tworzenia użytkownika",
                    description: result.message,
                    status: "error",
                    duration: 6000,
                });
            }
        } catch (error) {
            toast({
                title: "Błąd tworzenia użytkownika",
                description: error.response?.data?.error,
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            <Heading size="xl" mb={2}>Dodaj nowego użytkownika</Heading>
                            <Text color="gray.500">
                                Utwórz konto użytkownika i przypisz rolę
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
                                    <FormControl isRequired>
                                        <FormLabel>Nazwa użytkownika</FormLabel>
                                        <Input
                                            name="userName"
                                            placeholder="np. jan_kowalski"
                                            value={userData.userName}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Unikalna nazwa użytkownika do logowania
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
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

                                    <FormControl isRequired>
                                        <FormLabel>Hasło</FormLabel>
                                        <InputGroup size="lg">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Minimum 6 znaków"
                                                value={userData.password}
                                                onChange={handleChange}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormHelperText>
                                            Hasło musi mieć minimum 6 znaków
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
                                            <strong>Student:</strong> Podstawowy użytkownik, może uczestniczyć w kursach<br />
                                            <strong>Mentor:</strong> Może tworzyć kursy i zarządzać treściami<br />
                                            <strong>Admin:</strong> Pełny dostęp do panelu administracyjnego
                                        </FormHelperText>
                                    </FormControl>

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
                                            isLoading={isLoading}
                                        >
                                            Utwórz użytkownika
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