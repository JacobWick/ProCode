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
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {createExercise, getLessons} from "../api.js";


export default function CreateExercisePage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [exerciseData, setExerciseData] = useState({
        description: '',
        initialContent: '',
        lessonId: '',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
               const response = await getLessons();
                setLessons(response.data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchLessons();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExerciseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!exerciseData.description || !exerciseData.lessonId) {
            toast({
                title: "Błąd walidacji",
                description: "Opis zadania i lekcja są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const createExerciseData = {
                description: exerciseData.description,
                initialContent: exerciseData.initialContent,
                lessonId: exerciseData.lessonId,
            };

            console.log('Creating exercise:', createExerciseData);
            const response = await createExercise(createExerciseData);
            console.log('Created exercise: ', response.data);
            toast({
                title: "Zadanie utworzone!",
                description: "Zadanie zostało pomyślnie dodane do lekcji",
                status: "success",
                duration: 5000,
            });

            navigate('/create');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd tworzenia zadania",
                description: error.message || "Nie udało się utworzyć zadania",
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
                            <Heading size="xl" mb={2}>Utwórz nowe zadanie</Heading>
                            <Text color="gray.500">
                                Dodaj zadanie programistyczne do lekcji
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
                                        <FormLabel>Wybierz lekcję</FormLabel>
                                        <Select
                                            name="lessonId"
                                            placeholder="Wybierz lekcję"
                                            value={exerciseData.lessonId}
                                            onChange={handleChange}
                                            size="lg"
                                        >
                                            {lessons.map(lesson => (
                                                <option key={lesson.id} value={lesson.id}>
                                                    {lesson.courseTitle} - {lesson.title}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Zadanie zostanie dodane do wybranej lekcji
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Opis zadania</FormLabel>
                                        <Textarea
                                            name="description"
                                            placeholder="Szczegółowy opis zadania, wymagania, przykłady użycia..."
                                            value={exerciseData.description}
                                            onChange={handleChange}
                                            rows={10}
                                            resize="vertical"
                                        />
                                        <FormHelperText>
                                            Opisz dokładnie co użytkownik ma zrobić, jakie są wymagania i kryteria sukcesu
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Początkowa zawartość (Initial Content)</FormLabel>
                                        <Input
                                            name="initialContent"
                                            placeholder="np. Dla liczb 5 i 3 suma wynosi 8"
                                            value={exerciseData.initialContent}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Opcjonalny tekst, który pojawi się jako komentarz na górze edytora kodu
                                        </FormHelperText>
                                    </FormControl>

                                    <Box
                                        bg="green.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="green.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="green.800">
                                            <strong>Wskazówka:</strong> Po utworzeniu zadania możesz dodać do niego
                                            testy sprawdzające oraz przykładowe rozwiązania w panelu tworzenia.
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
                                            colorScheme="green"
                                            isLoading={isLoading}
                                        >
                                            Utwórz zadanie
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