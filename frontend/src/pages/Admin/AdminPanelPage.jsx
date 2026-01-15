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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Card,
    CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel,
    Textarea, Select, Checkbox, Stack, ModalFooter,
} from '@chakra-ui/react';
import {EditIcon, DeleteIcon, AddIcon, BellIcon} from '@chakra-ui/icons';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { jwtDecode } from 'jwt-decode';
import {
    getUsers,
    deleteUser,
    getCourses,
    deleteCourse,
    sendNotification,
    getLessons,
    getExercises,
    getTests,
    getSolutionExamples
} from '../../api.js';
import { COURSE_DIFFICULTY } from '../../constants.js';

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [tests, setTests] = useState([]);
    const [solutionExamples, setSolutionExamples] = useState([]);
    const [user, setUser] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sendToAll, setSendToAll] = useState(false);
    const [isSendingNotification, setIsSendingNotification] = useState(false);
    const {
        isOpen: isNotificationOpen,
        onOpen: onNotificationOpen,
        onClose: onNotificationClose
    } = useDisclosure();

    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
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
                    const [
                        usersRes,
                        coursesRes,
                        lessonsRes,
                        exercisesRes,
                        testsRes,
                        solutionsRes
                    ] = await Promise.all([
                        getUsers(),
                        getCourses(),
                        getLessons(),
                        getExercises(),
                        getTests(),
                        getSolutionExamples(),
                    ]);

                    setUsers(usersRes.data);
                    setCourses(coursesRes.data);
                    setLessons(lessonsRes.data);
                    setExercises(exercisesRes.data);
                    setTests(testsRes.data);
                    setSolutionExamples(solutionsRes.data);
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

        checkAdminAndFetchData();
    }, [toast]);

    const onAddChallenge = () => {
        navigate('/challenges/create');
    }

    const handleDeleteClick = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            switch(deleteType) {
                case 'user':
                    await deleteUser(itemToDelete.id);
                    setUsers(users.filter(u => u.id !== itemToDelete.id));
                    break;
                case 'course':
                    await deleteCourse(itemToDelete.id);
                    setCourses(courses.filter(c => c.id !== itemToDelete.id));
                    break;
                default:
                    break;
            }

            toast({
                title: "Usunięto",
                description: "Element został pomyślnie usunięty",
                status: "success",
                duration: 3000,
            });

            onClose();
            setItemToDelete(null);
            setDeleteType('');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd",
                description: "Nie udało się usunąć elementu",
                status: "error",
                duration: 5000,
            });
        }
    };

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) {
            toast({
                title: "Błąd walidacji",
                description: "Wiadomość nie może być pusta",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (!sendToAll && selectedUsers.length === 0) {
            toast({
                title: "Błąd walidacji",
                description: "Wybierz przynajmniej jednego użytkownika",
                status: "error",
                duration: 3000,
            });
            return;
        }
        setIsSendingNotification(true);
        try {
            const userIds = sendToAll ? users.map(u => u.id) : selectedUsers;

            await sendNotification({
                userIds: userIds,
                message: notificationMessage,
                type: notificationType,
            });

            toast({
                title: "Powiadomienie wysłane",
                description: `Wysłano do ${userIds.length} użytkownik(ów)`,
                status: "success",
                duration: 3000,
            });
            setNotificationMessage('');
            setNotificationType(0);
            setSelectedUsers([]);
            setSendToAll(false);
            onNotificationClose();
        } catch (error) {
            console.error('Error sending notification:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się wysłać powiadomienia",
                status: "error",
                duration: 5000,
            });
        } finally {
            setIsSendingNotification(false);
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
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
                        <Box>
                            <Heading size="xl" mb={2}>Panel Administracyjny</Heading>
                            <Text color="gray.500">
                                Zarządzanie platformą ProCode
                            </Text>
                        </Box>
                        <HStack>
                            <Button
                                leftIcon={<BellIcon />}
                                colorScheme="purple"
                                onClick={onNotificationOpen}
                            >
                                Wyślij powiadomienie
                            </Button>
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="purple"
                                onClick={onAddChallenge}
                            >
                                Utwórz wyzwanie
                            </Button>
                        </HStack>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Użytkownicy</StatLabel>
                                        <StatNumber>{users.length}</StatNumber>
                                        <StatHelpText>Zarejestrowani użytkownicy</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Kursy</StatLabel>
                                        <StatNumber>{courses.length}</StatNumber>
                                        <StatHelpText>Utworzone kursy</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Lekcje</StatLabel>
                                        <StatNumber>{lessons.length}</StatNumber>
                                        <StatHelpText>Dostępne lekcje</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Zadania</StatLabel>
                                        <StatNumber>{exercises.length}</StatNumber>
                                        <StatHelpText>Utworzone zadania</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Testy</StatLabel>
                                        <StatNumber>{tests.length}</StatNumber>
                                        <StatHelpText>Przypadki testowe</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Rozwiązania</StatLabel>
                                        <StatNumber>{solutionExamples.length}</StatNumber>
                                        <StatHelpText>Przykładowe rozwiązania</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </SimpleGrid>
                        <Tabs colorScheme="purple" variant="enclosed">
                            <TabList>
                                <Tab>Użytkownicy</Tab>
                                <Tab>Kursy</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Box
                                        bg={bgColor}
                                        p={6}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                    >
                                        <HStack justify="space-between" mb={4}>
                                            <Heading size="md">Użytkownicy ({users.length})</Heading>
                                            <Button
                                                leftIcon={<AddIcon />}
                                                colorScheme="purple"
                                                size="sm"
                                                onClick={() => navigate('/administrator/users/create')}
                                            >
                                                Dodaj
                                            </Button>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Nazwa</Th>
                                                        <Th>Email</Th>
                                                        <Th>Rola</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {users.map((u) => (
                                                        <Tr key={u.id}>
                                                            <Td>{u.username}</Td>
                                                            <Td>{u.email}</Td>
                                                            <Td>
                                                                <Badge colorScheme={u.role === 'Admin' ? 'red' : 'gray'}>
                                                                    {u.role || 'User'}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/administrator/users/${u.id}/edit`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(u, 'user')}
                                                                        aria-label="Usuń"
                                                                    />
                                                                </HStack>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box
                                        bg={bgColor}
                                        p={6}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                    >
                                        <HStack justify="space-between" mb={4}>
                                            <Heading size="md">Kursy ({courses.length})</Heading>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Tytuł</Th>
                                                        <Th>Opis</Th>
                                                        <Th>Poziom</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {courses.map((c) => (
                                                        <Tr key={c.id}>
                                                            <Td fontWeight="semibold">{c.title}</Td>
                                                            <Td maxW="300px" isTruncated>{c.description}</Td>
                                                            <Td>
                                                                <Badge>
                                                                    {COURSE_DIFFICULTY[c.difficultyLevel] || '—'}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/edit-course/${c.id}`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(c, 'course')}
                                                                        aria-label="Usuń"
                                                                    />
                                                                </HStack>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
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
                            Potwierdź usunięcie
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Czy na pewno chcesz usunąć ten element? Ta akcja jest nieodwracalna.
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
            <Modal
                isOpen={isNotificationOpen}
                onClose={onNotificationClose}
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Wyślij powiadomienie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Wiadomość</FormLabel>
                                <Textarea
                                    value={notificationMessage}
                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                    placeholder="Wpisz treść powiadomienia..."
                                    rows={4}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Typ powiadomienia</FormLabel>
                                <Select
                                    value={notificationType}
                                    onChange={(e) => setNotificationType(parseInt(e.target.value))}
                                >
                                    <option value={0}>Społeczność</option>
                                    <option value={1}>Nowy kurs</option>
                                    <option value={2}>Sukces</option>
                                    <option value={3}>Błąd</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <Checkbox
                                    isChecked={sendToAll}
                                    onChange={(e) => {
                                        setSendToAll(e.target.checked);
                                        if (e.target.checked) {
                                            setSelectedUsers([]);
                                        }
                                    }}
                                >
                                    Wyślij do wszystkich użytkowników
                                </Checkbox>
                            </FormControl>

                            {!sendToAll && (
                                <FormControl>
                                    <FormLabel>Wybierz użytkowników</FormLabel>
                                    <Box
                                        maxH="300px"
                                        overflowY="auto"
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                        borderRadius="md"
                                        p={3}
                                    >
                                        <Stack spacing={2}>
                                            {users.map((user) => (
                                                <Checkbox
                                                    key={user.id}
                                                    isChecked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleUserSelect(user.id)}
                                                >
                                                    <HStack>
                                                        <Text>{user.username}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            ({user.email})
                                                        </Text>
                                                    </HStack>
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </Box>
                                    {selectedUsers.length > 0 && (
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Wybrano: {selectedUsers.length} użytkownik(ów)
                                        </Text>
                                    )}
                                </FormControl>
                            )}

                            {sendToAll && (
                                <Alert status="info" borderRadius="md">
                                    <AlertIcon />
                                    Powiadomienie zostanie wysłane do {users.length} użytkownik(ów)
                                </Alert>
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onNotificationClose}>
                            Anuluj
                        </Button>
                        <Button
                            colorScheme="purple"
                            onClick={handleSendNotification}
                            isLoading={isSendingNotification}
                        >
                            Wyślij
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Footer />
        </Box>
    );
}