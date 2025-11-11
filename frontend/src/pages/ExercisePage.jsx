import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    useColorModeValue,
    Spinner,
    Text,
    VStack,
    Heading,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CodeEditor from '../components/CodeEditor';
import { getExerciseById } from '../api';

export default function ExercisePage() {
    const { exerciseId } = useParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                setLoading(true);
                const response = await getExerciseById(exerciseId);
                setExercise(response.data);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Błąd podczas pobierania zadania");
            } finally {
                setLoading(false);
            }
        };

        if (exerciseId) {
            fetchExercise();
        }
    }, [exerciseId]);

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
                            inputData={exercise.inputData}
                            outputData={exercise.outputData}
                            exerciseId={exercise.id}
                        />
                    </VStack>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}