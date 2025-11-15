import { useState, useEffect } from 'react';
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
    Textarea,
    Select,
    FormHelperText,
    useColorModeValue,
    useToast,
    HStack,
    Checkbox,
    Stack,
    Badge,
    IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getLessons, createCourse } from '../api';

const DIFFICULTY_LEVELS = [
    { value: 0, label: 'Początkujący' },
    { value: 1, label: 'Średniozaawansowany' },
    { value: 2, label: 'Zaawansowany' },
];

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [allLessons, setAllLessons] = useState([]);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        difficultyLevel: 0,
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await getLessons();
                setAllLessons(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLessons();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: name === 'difficultyLevel' ? parseInt(value) : value
        }));
    };

    const handleLessonToggle = (lessonId) => {
        setSelectedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleRemoveLesson = (lessonId) => {
        setSelectedLessons(prev => prev.filter(id => id !== lessonId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!courseData.title || !courseData.description) {
            toast({
                title: "Błąd walidacji",
                description: "Tytuł i opis są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (selectedLessons.length === 0) {
            toast({
                title: "Błąd walidacji",
                description: "Kurs musi mieć przynajmniej jedną lekcję",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const createCourseData = {
                title: courseData.title,
                description: courseData.description,
                difficultyLevel: courseData.difficultyLevel,
                lessons: selectedLessons,
                createdBy: "043c981f-b76b-411c-a638-2871ec330533",
            };

            console.log('Creating course:', createCourseData);

            const response = await createCourse(createCourseData);
            console.log('Created course: ', response.data);
            toast({
                title: "Kurs utworzony!",
                description: "Twój kurs został pomyślnie zapisany",
                status: "success",
                duration: 5000,
            });

            navigate('/create');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd tworzenia kursu",
                description: error.message || "Nie udało się utworzyć kursu",
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
                <Container maxW="container.lg">
                    <VStack spacing={8} align="stretch">
                        <HStack>
                            <Button
                                leftIcon={<ArrowBackIcon />}
                                variant="ghost"
                                onClick={() => navigate('/create')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Utwórz nowy kurs</Heading>
                            <Text color="gray.500">
                                Wypełnij informacje o kursie i wybierz lekcje
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
                                        <FormLabel>Tytuł kursu</FormLabel>
                                        <Input
                                            name="title"
                                            placeholder="np. Kompletny kurs React od podstaw"
                                            value={courseData.title}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Podaj atrakcyjny i opisowy tytuł kursu
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Opis kursu</FormLabel>
                                        <Textarea
                                            name="description"
                                            placeholder="Opisz czego uczestnicy nauczą się w tym kursie..."
                                            value={courseData.description}
                                            onChange={handleChange}
                                            rows={6}
                                            resize="vertical"
                                        />
                                        <FormHelperText>
                                            Szczegółowy opis pomoże uczestnikom zrozumieć wartość kursu
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Poziom trudności</FormLabel>
                                        <Select
                                            name="difficultyLevel"
                                            value={courseData.difficultyLevel}
                                            onChange={handleChange}
                                            size="lg"
                                        >
                                            {DIFFICULTY_LEVELS.map(level => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Wybierz odpowiedni poziom dla grupy docelowej
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Lekcje w kursie ({selectedLessons.length})</FormLabel>
                                        <Box
                                            maxH="300px"
                                            overflowY="auto"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                            borderRadius="md"
                                            p={4}
                                        >
                                            <Stack spacing={3}>
                                                {allLessons.map(lesson => (
                                                    <Checkbox
                                                        key={lesson.id}
                                                        isChecked={selectedLessons.includes(lesson.id)}
                                                        onChange={() => handleLessonToggle(lesson.id)}
                                                    >
                                                        {lesson.title}
                                                    </Checkbox>
                                                ))}
                                            </Stack>
                                        </Box>
                                        <FormHelperText>
                                            Wybierz przynajmniej jedną lekcję dla kursu
                                        </FormHelperText>
                                    </FormControl>

                                    {selectedLessons.length > 0 && (
                                        <Box>
                                            <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                                Wybrane lekcje:
                                            </Text>
                                            <Stack spacing={2}>
                                                {selectedLessons.map((lessonId, index) => {
                                                    const lesson = allLessons.find(l => l.id === lessonId);
                                                    return (
                                                        <HStack
                                                            key={lessonId}
                                                            bg={useColorModeValue('purple.50', 'purple.900')}
                                                            p={2}
                                                            borderRadius="md"
                                                            justify="space-between"
                                                        >
                                                            <HStack>
                                                                <Badge colorScheme="purple">{index + 1}</Badge>
                                                                <Text fontSize="sm">{lesson?.title}</Text>
                                                            </HStack>
                                                            <IconButton
                                                                icon={<DeleteIcon />}
                                                                size="sm"
                                                                variant="ghost"
                                                                colorScheme="red"
                                                                onClick={() => handleRemoveLesson(lessonId)}
                                                                aria-label="Usuń lekcję"
                                                            />
                                                        </HStack>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    )}

                                    <Box
                                        bg="purple.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="purple.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="purple.800">
                                            <strong>Wskazówka:</strong> Jeśli nie masz jeszcze lekcji, najpierw
                                            utwórz je w panelu "Dodaj lekcję", a potem wróć tutaj i utwórz kurs.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/create')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="purple"
                                            isLoading={isLoading}
                                        >
                                            Utwórz kurs
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