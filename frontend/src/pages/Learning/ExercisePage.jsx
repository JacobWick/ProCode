import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    useColorModeValue,
    Spinner,
    Text,
    VStack,
    Heading,
    Button,
    HStack,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CodeEditor from '../../components/CodeEditor.jsx';
import { getExerciseById, getLessonById } from '../../api.js';

export default function ExercisePage() {
    const { courseId, lessonId, exerciseId } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [exerciseRes, lessonRes] = await Promise.all([
                    getExerciseById(exerciseId),
                    lessonId ? getLessonById(lessonId) : Promise.resolve({ data: null })
                ]);
                setExercise(exerciseRes.data);
                setLesson(lessonRes.data);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Błąd podczas pobierania zadania");
            } finally {
                setLoading(false);
            }
        };

        if (exerciseId) {
            fetchData();
        }
    }, [exerciseId, lessonId]);

    const handleBackToLesson = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
    };

    if (loading) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <Box textAlign="center">
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Ładowanie zadania...</Text>
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (error || !exercise) {
        return (
            <Box minH="100vh" bg={pageBg}>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <Box bg="red.500" color="white" p={4} borderRadius="md">
                        <Text>{error || "Nie znaleziono zadania"}</Text>
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />
            <Box py={6}>
                <Container maxW="container.xl">
                    <VStack spacing={6} align="stretch">
                        <HStack>
                            <Button
                                leftIcon={<ArrowBackIcon />}
                                variant="ghost"
                                onClick={handleBackToLesson}
                            >
                                Powrót do lekcji
                            </Button>
                        </HStack>

                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <Heading size="md" mb={4} color="purple.500">
                                Opis zadania
                            </Heading>
                            <Text color={textColor} whiteSpace="pre-line">
                                {exercise.description}
                            </Text>
                        </Box>

                        <CodeEditor
                            initialContent={exercise.initialContent}
                            inputData={exercise.test?.inputData || []}
                            outputData={exercise.test?.outputData || []}
                            exerciseId={exercise.id}
                            solutionExampleId={exercise.solutionExampleId || exercise.solutionExample?.id}
                            courseId={courseId}
                            lessonId={lessonId}
                            lesson={lesson}
                        />
                    </VStack>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}