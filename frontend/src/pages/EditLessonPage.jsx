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
import { getLessonById, getExercises, updateLesson } from '../api';

export default function EditLessonPage() {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [lessonData, setLessonData] = useState({
        title: '',
        videoUri: '',
        textUri: '',
    });
    const [originalLessonData, setOriginalLessonData] = useState(null);
    const [error, setError] = useState(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const lessonResponse = await getLessonById(lessonId);
                const lesson = lessonResponse.data;

                setLessonData({
                    title: lesson.title || '',
                    videoUri: lesson.videoUri || '',
                    textUri: lesson.textUri || '',
                });

                setOriginalLessonData({
                    title: lesson.title || '',
                    videoUri: lesson.videoUri || '',
                    textUri: lesson.textUri || '',
                    exercises: lesson.exercises?.map(e => typeof e === 'object' ? e.id : e) || [],
                });

                const exercisesResponse = await getExercises();
                setAllExercises(exercisesResponse.data);

                const exerciseIds = lesson.exercises?.map(e => typeof e === 'object' ? e.id : e) || [];
                setSelectedExercises(exerciseIds);

            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania danych lekcji");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [lessonId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExerciseToggle = (exerciseId) => {
        setSelectedExercises(prev =>
            prev.includes(exerciseId)
                ? prev.filter(id => id !== exerciseId)
                : [...prev, exerciseId]
        );
    };

    const handleRemoveExercise = (exerciseId) => {
        setSelectedExercises(prev => prev.filter(id => id !== exerciseId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const updateLessonData = {
                title: lessonData.title !== originalLessonData.title
                    ? lessonData.title
                    : "",

                videoUri:
                    lessonData.videoUri !== originalLessonData.videoUri
                        ? (lessonData.videoUri ?? originalLessonData.videoUri)
                        : originalLessonData.videoUri,

                textUri:
                    lessonData.textUri !== originalLessonData.textUri
                        ? (lessonData.textUri ?? originalLessonData.textUri)
                        : originalLessonData.textUri,

                exercises: [],
            }

            const exercisesChanged = JSON.stringify(selectedExercises.sort()) !==
                originalLessonData.exercises.sort();

            if (exercisesChanged) {
                updateLessonData.exercises = selectedExercises;
            }

            console.log('Updating lesson:', updateLessonData);

            const response = await updateLesson(lessonId, updateLessonData);
            console.log('Updated lesson:', response.data);

            toast({
                title: "Lekcja zaktualizowana!",
                description: "Zmiany zostały pomyślnie zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji lekcji",
                description: error.message || "Nie udało się zaktualizować lekcji",
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
                    <Text mt={4} color="gray.500">Ładowanie danych lekcji...</Text>
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
                        onClick={() => navigate('/my-lessons')}
                    >
                        Powrót
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
                                onClick={() => navigate('/my-lessons')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Edytuj lekcję</Heading>
                            <Text color="gray.500">
                                Zaktualizuj informacje o lekcji i zarządzaj zadaniami
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
                                        <FormLabel>Tytuł lekcji</FormLabel>
                                        <Input
                                            name="title"
                                            placeholder="np. Wprowadzenie do React Hooks"
                                            value={lessonData.title}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Podaj opisowy tytuł lekcji
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Link do wideo</FormLabel>
                                        <Input
                                            name="videoUri"
                                            type="url"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={lessonData.videoUri}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            URL do materiału wideo (opcjonalnie)
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Link do materiałów tekstowych</FormLabel>
                                        <Input
                                            name="textUri"
                                            type="url"
                                            placeholder="https://example.com/materials.pdf"
                                            value={lessonData.textUri}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            URL do dokumentacji lub materiałów (opcjonalnie)
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Zadania w lekcji ({selectedExercises.length})</FormLabel>
                                        <Box
                                            maxH="300px"
                                            overflowY="auto"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                            borderRadius="md"
                                            p={4}
                                        >
                                            <Stack spacing={3}>
                                                {allExercises.length === 0 ? (
                                                    <Text color="gray.500" fontSize="sm">
                                                        Brak dostępnych zadań
                                                    </Text>
                                                ) : (
                                                    allExercises.map(exercise => (
                                                        <Checkbox
                                                            key={exercise.id}
                                                            isChecked={selectedExercises.includes(exercise.id)}
                                                            onChange={() => handleExerciseToggle(exercise.id)}
                                                        >
                                                            {exercise.description || exercise.title || `Zadanie ${exercise.id}`}
                                                        </Checkbox>
                                                    ))
                                                )}
                                            </Stack>
                                        </Box>
                                        <FormHelperText>
                                            Wybierz zadania przypisane do tej lekcji
                                        </FormHelperText>
                                    </FormControl>

                                    {selectedExercises.length > 0 && (
                                        <Box>
                                            <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                                Wybrane zadania:
                                            </Text>
                                            <Stack spacing={2}>
                                                {selectedExercises.map((exerciseId, index) => {
                                                    const exercise = allExercises.find(e => e.id === exerciseId);
                                                    return (
                                                        <HStack
                                                            key={exerciseId}
                                                            bg={useColorModeValue('blue.50', 'blue.900')}
                                                            p={2}
                                                            borderRadius="md"
                                                            justify="space-between"
                                                        >
                                                            <HStack>
                                                                <Badge colorScheme="blue">{index + 1}</Badge>
                                                                <Text fontSize="sm">
                                                                    {exercise?.description || exercise?.title || `Zadanie ${exerciseId}`}
                                                                </Text>
                                                            </HStack>
                                                            <IconButton
                                                                icon={<DeleteIcon />}
                                                                size="sm"
                                                                variant="ghost"
                                                                colorScheme="red"
                                                                onClick={() => handleRemoveExercise(exerciseId)}
                                                                aria-label="Usuń zadanie"
                                                            />
                                                        </HStack>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    )}

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/my-lessons')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="blue"
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