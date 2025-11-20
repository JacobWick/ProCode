import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getLessons, getCourseById, updateCourse } from '../api';

const DIFFICULTY_LEVELS = [
    { value: 0, label: 'Początkujący' },
    { value: 1, label: 'Średniozaawansowany' },
    { value: 2, label: 'Zaawansowany' },
];

export default function EditCoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [allLessons, setAllLessons] = useState([]);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        difficultyLevel: 0,
    });
    const [originalCourseData, setOriginalCourseData] = useState(null);
    const [error, setError] = useState(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const courseResponse = await getCourseById(courseId);
                const course = courseResponse.data;

                setCourseData({
                    title: course.title,
                    description: course.description,
                    difficultyLevel: course.difficultyLevel,
                });

                setOriginalCourseData({
                    title: course.title,
                    description: course.description,
                    difficultyLevel: course.difficultyLevel,
                    lessons: course.lessons?.map(l => typeof l === 'object' ? l.id : l) || [],
                });

                const lessonsResponse = await getLessons();
                setAllLessons(lessonsResponse.data);

                const lessonIds = course.lessons?.map(l => typeof l === 'object' ? l.id : l) || [];
                setSelectedLessons(lessonIds);

            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania danych kursu");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [courseId]);

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

        try {
            setIsLoading(true);

            const updateCourseData = {
                id: courseId,
                title: courseData.title !== originalCourseData.title ? courseData.title : "",
                description: courseData.description !== originalCourseData.description ? courseData.description : "",
                difficultyLevel: courseData.difficultyLevel !== originalCourseData.difficultyLevel ? courseData.difficultyLevel : originalCourseData.difficultyLevel,
                lessons: null,
            };

            const lessonsChanged = selectedLessons.sort() !==
                originalCourseData.lessons.sort();

            if (lessonsChanged) {
                updateCourseData.lessons = selectedLessons;
            }

            console.log('Updating course:', updateCourseData);

            const response = await updateCourse(updateCourseData);
            console.log('Updated course: ', response.data);

            toast({
                title: "Kurs zaktualizowany!",
                description: "Zmiany zostały pomyślnie zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/my-courses');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji kursu",
                description: error.message || "Nie udało się zaktualizować kursu",
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Box py={20} textAlign="center">
                    <Spinner size="xl" color="purple.500" />
                    <Text mt={4} color="gray.500">Ładowanie danych kursu...</Text>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.lg" py={10}>
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                    <Button
                        mt={4}
                        leftIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/my-courses')}
                    >
                        Powrót do moich kursów
                    </Button>
                </Container>
                <Footer />
            </Box>
        );
    }

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
                                onClick={() => navigate('/my-courses')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Edytuj kurs</Heading>
                            <Text color="gray.500">
                                Zaktualizuj informacje o kursie i zarządzaj lekcjami
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

                                    <FormControl>
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

                                    <FormControl>
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
                                        bg="blue.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="blue.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="blue.800">
                                            <strong>Informacja:</strong> Zmiany w lekcjach kursu zostaną
                                            natychmiast zapisane i będą widoczne dla wszystkich uczestników.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/my-courses')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="purple"
                                            isLoading={isLoading}
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