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
    CardBody,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';
import {
    getUsers,
    deleteUser,
    getCourses,
    deleteCourse,
    getLessons,
    deleteLesson,
    getExercises,
    deleteExercise,
    getTests,
    deleteTest,
    getSolutionExamples,
    deleteSolutionExample,
} from '../api';
import { COURSE_DIFFICULTY } from '../constants';

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

                    // Pobierz wszystkie dane
                    const [usersRes, coursesRes, lessonsRes, exercisesRes, testsRes, solutionsRes] = await Promise.all([
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
                case 'lesson':
                    await deleteLesson(itemToDelete.id);
                    setLessons(lessons.filter(l => l.id !== itemToDelete.id));
                    break;
                case 'exercise':
                    await deleteExercise(itemToDelete.id);
                    setExercises(exercises.filter(e => e.id !== itemToDelete.id));
                    break;
                case 'test':
                    await deleteTest(itemToDelete.id);
                    setTests(tests.filter(t => t.id !== itemToDelete.id));
                    break;
                case 'solution':
                    await deleteSolutionExample(itemToDelete.id);
                    setSolutionExamples(solutionExamples.filter(s => s.id !== itemToDelete.id));
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

                        {/* Statystyki */}
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

                        {/* Zakładki z tabelami */}
                        <Tabs colorScheme="purple" variant="enclosed">
                            <TabList>
                                <Tab>Użytkownicy</Tab>
                                <Tab>Kursy</Tab>
                                <Tab>Lekcje</Tab>
                                <Tab>Zadania</Tab>
                                <Tab>Testy</Tab>
                                <Tab>Rozwiązania</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Użytkownicy */}
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

                                <TabPanel>
                                    <Box
                                        bg={bgColor}
                                        p={6}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                    >
                                        <HStack justify="space-between" mb={4}>
                                            <Heading size="md">Lekcje ({lessons.length})</Heading>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Tytuł</Th>
                                                        <Th>Video</Th>
                                                        <Th>Materiały</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {lessons.map((l) => (
                                                        <Tr key={l.id}>
                                                            <Td fontWeight="semibold">{l.title || '—'}</Td>
                                                            <Td>
                                                                <Badge colorScheme={l.videoUri ? 'green' : 'gray'}>
                                                                    {l.videoUri ? 'Tak' : 'Nie'}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <Badge colorScheme={l.textUri ? 'green' : 'gray'}>
                                                                    {l.textUri ? 'Tak' : 'Nie'}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/edit-lesson/${l.id}`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(l, 'lesson')}
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
                                            <Heading size="md">Zadania ({exercises.length})</Heading>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Opis</Th>
                                                        <Th>Kod początkowy</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {exercises.map((e) => (
                                                        <Tr key={e.id}>
                                                            <Td maxW="400px" isTruncated>{e.description || '—'}</Td>
                                                            <Td>
                                                                <Badge colorScheme={e.initialContent ? 'green' : 'gray'}>
                                                                    {e.initialContent ? 'Tak' : 'Nie'}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/edit-exercise/${e.id}`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(e, 'exercise')}
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
                                            <Heading size="md">Testy ({tests.length})</Heading>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>ID</Th>
                                                        <Th>Przypadki testowe</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {tests.map((t) => (
                                                        <Tr key={t.id}>
                                                            <Td fontFamily="mono" fontSize="xs">{t.id.substring(0, 8)}...</Td>
                                                            <Td>
                                                                <Badge>
                                                                    {t.inputData?.length || 0} test(ów)
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/edit-test/${t.id}`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(t, 'test')}
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
                                            <Heading size="md">Przykładowe rozwiązania ({solutionExamples.length})</Heading>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>ID</Th>
                                                        <Th>Wyjaśnienie</Th>
                                                        <Th>Akcje</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {solutionExamples.map((s) => (
                                                        <Tr key={s.id}>
                                                            <Td fontFamily="mono" fontSize="xs">{s.id.substring(0, 8)}...</Td>
                                                            <Td maxW="400px" isTruncated>{s.explanation || '—'}</Td>
                                                            <Td>
                                                                <HStack spacing={1}>
                                                                    <IconButton
                                                                        icon={<EditIcon />}
                                                                        colorScheme="blue"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/edit-solution/${s.id}`)}
                                                                        aria-label="Edytuj"
                                                                    />
                                                                    <IconButton
                                                                        icon={<DeleteIcon />}
                                                                        colorScheme="red"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(s, 'solution')}
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

            <Footer />
        </Box>
    );
}