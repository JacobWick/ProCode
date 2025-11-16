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
    Select,
    FormHelperText,
    useColorModeValue,
    useToast,
    HStack,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {getCourses, createLesson} from "../api.js";

export default function CreateLessonPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [lessonData, setLessonData] = useState({
        title: '',
        videoUri: '',
        textUri: '',
        courseId: '',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();
                setCourses(response.data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!lessonData.title || !lessonData.courseId) {
            toast({
                title: "Błąd walidacji",
                description: "Tytuł i kurs są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);
            const createLessonData = {
                title: lessonData.title,
                videoUri: lessonData.videoUri || null,
                textUri: lessonData.textUri || null,
                exerciseIds: [],
            };
            console.log('Creating lesson:', createLessonData);
            console.log('For course:', lessonData.courseId);
            const response = await createLesson(createLessonData);
            console.log('Created lesson: ', response.data);
            toast({
                title: "Lekcja utworzona!",
                description: "Lekcja została pomyślnie dodana do kursu",
                status: "success",
                duration: 5000,
            });
            navigate('/create');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd tworzenia lekcji",
                description: error.message || "Nie udało się utworzyć lekcji",
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
                            <Heading size="xl" mb={2}>Utwórz nową lekcję</Heading>
                            <Text color="gray.500">
                                Dodaj nową lekcję do wybranego kursu
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
                                        <FormLabel>Wybierz kurs</FormLabel>
                                        <Select
                                            name="courseId"
                                            placeholder="Wybierz kurs"
                                            value={lessonData.courseId}
                                            onChange={handleChange}
                                            size="lg"
                                        >
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.title}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Lekcja zostanie dodana do wybranego kursu
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Tytuł lekcji</FormLabel>
                                        <Input
                                            name="title"
                                            placeholder="np. Wprowadzenie do React Hooks"
                                            value={lessonData.title}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            Krótki i opisowy tytuł lekcji
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Link do wideo (opcjonalnie)</FormLabel>
                                        <Input
                                            name="videoUri"
                                            type="url"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={lessonData.videoUri}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            URL do materiału wideo (YouTube, Vimeo, itp.)
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Link do materiałów tekstowych (opcjonalnie)</FormLabel>
                                        <Input
                                            name="textUri"
                                            type="url"
                                            placeholder="https://..."
                                            value={lessonData.textUri}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormHelperText>
                                            URL do dokumentacji, artykułu lub innych materiałów
                                        </FormHelperText>
                                    </FormControl>

                                    <Box
                                        bg="blue.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="blue.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="blue.800">
                                            <strong>Wskazówka:</strong> Po utworzeniu lekcji możesz dodać do niej
                                            zadania programistyczne w panelu tworzenia.
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
                                            colorScheme="blue"
                                            isLoading={isLoading}
                                        >
                                            Utwórz lekcję
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