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
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerCloseButton,
    useToast
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CodeEditor from '../../components/CodeEditor.jsx';
import { getExerciseById, getLessonById, getSolutionExampleById } from '../../api.js';
import { Editor } from '@monaco-editor/react';

export default function ExercisePage() {
    const { courseId, lessonId, exerciseId } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [solutionExample, setSolutionExample] = useState(null);
    const [solutionLoading, setSolutionLoading] = useState(false);
    const [solutionError, setSolutionError] = useState(null);

    const { isOpen: isSolOpen, onOpen: onSolOpen, onClose: onSolClose } = useDisclosure();
    const toast = useToast();

    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log(`[ExercisePage] fetchData start - exerciseId=${exerciseId}, lessonId=${lessonId}`);
                const [exerciseRes, lessonRes] = await Promise.all([
                    getExerciseById(exerciseId),
                    lessonId ? getLessonById(lessonId) : Promise.resolve({ data: null })
                ]);

                const ex = exerciseRes.data;
                setExercise(ex);
                setLesson(lessonRes.data);

                // If the exercise already contains the solution object, use it directly.
                if (ex.solutionExample) {
                    console.log('[ExercisePage] exercise contains embedded solutionExample:', ex.solutionExample);
                    setSolutionExample(ex.solutionExample);
                    setSolutionError(null);
                } else {
                    // Otherwise, fetch by id if we have a referenced id
                    const solId = ex.solutionExampleId;
                    console.log('[ExercisePage] solutionExampleId from exercise:', solId);
                    if (solId) {
                        try {
                            setSolutionLoading(true);
                            console.log(`[ExercisePage] fetching solution example by id=${solId}`);
                            const solRes = await getSolutionExampleById(solId);
                            console.log('[ExercisePage] getSolutionExampleById response:', solRes?.data);
                            setSolutionExample(solRes.data);
                            setSolutionError(null);
                        } catch (err) {
                            console.error('[ExercisePage] Failed to load solution example', err);
                            setSolutionError(err?.message || 'Błąd podczas pobierania przykładowego rozwiązania');
                            toast({ title: 'Błąd', description: 'Nie udało się pobrać przykładowego rozwiązania', status: 'warning', duration: 3000 });
                        } finally {
                            setSolutionLoading(false);
                        }
                    } else {
                        console.log('[ExercisePage] no solutionExampleId provided, skipping solution fetch');
                        setSolutionExample(null);
                    }
                }
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

                            {(exercise.solutionExampleId || exercise.solutionExample?.id) && (
                                <Button
                                    colorScheme="purple.500"
                                    variant="ghost"
                                    onClick={onSolOpen}
                                    isLoading={solutionLoading}
                                    isDisabled={solutionLoading || !solutionExample}
                                    size="sm"
                                >
                                    Pokaż rozwiązanie
                                </Button>
                            )}
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

                        <HStack align="start" spacing={6}>
                            <Box flex={1}>
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
                            </Box>


                        </HStack>
                    </VStack>
                </Container>
            </Box>

            <Footer />

            {/* Drawer with solution example */}
            <Drawer isOpen={isSolOpen} placement="right" onClose={onSolClose} size="lg">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Przykładowe rozwiązanie</DrawerHeader>
                    <DrawerBody>
                        {solutionLoading && (
                            <Box textAlign="center" py={4}><Spinner /></Box>
                        )}

                        {solutionError && (
                            <Box color="red.500">{solutionError}</Box>
                        )}

                        {solutionExample && (
                            <VStack align="stretch" spacing={4}>
                                <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.200">
                                    <Editor
                                        height="320px"
                                        defaultLanguage="python"
                                        value={solutionExample.Code || solutionExample.code || ''}
                                        options={{ readOnly: true, minimap: { enabled: false } }}
                                    />
                                </Box>
                                <Box>
                                    <Heading size="sm" mb={2}>Wyjaśnienie</Heading>
                                    <Text whiteSpace="pre-line">{solutionExample.Explanation || solutionExample.explanation || ''}</Text>
                                </Box>
                            </VStack>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}