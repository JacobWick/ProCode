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
    Textarea,
    FormHelperText,
    useColorModeValue,
    useToast,
    HStack,
    Spinner,
    Alert,
    AlertIcon,
    Code,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getExerciseById, updateExercise } from '../api';

export default function EditExercisePage() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [exerciseData, setExerciseData] = useState({
        description: '',
        initialContent: '',
    });
    const [originalExerciseData, setOriginalExerciseData] = useState(null);
    const [error, setError] = useState(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const response = await getExerciseById(exerciseId);
                const exercise = response.data;

                setExerciseData({
                    description: exercise.description || '',
                    initialContent: exercise.initialContent || '',
                });

                setOriginalExerciseData({
                    description: exercise.description || '',
                    initialContent: exercise.initialContent || '',
                });

            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania danych zadania");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [exerciseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExerciseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const updateExerciseData = {
                id: exerciseId,
                description: exerciseData.description !== originalExerciseData.description
                    ? exerciseData.description
                    : "",
                initialContent: exerciseData.initialContent !== originalExerciseData.initialContent
                    ? exerciseData.initialContent
                    : "",
            };

            console.log('Updating exercise:', updateExerciseData);

            const response = await updateExercise(updateExerciseData);
            console.log('Updated exercise:', response.data);

            toast({
                title: "Zadanie zaktualizowane!",
                description: "Zmiany zostały pomyślnie zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji zadania",
                description: error.message || "Nie udało się zaktualizować zadania",
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
                    <Spinner size="xl" color="green.500" />
                    <Text mt={4} color="gray.500">Ładowanie danych zadania...</Text>
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
                        onClick={() => navigate('/')}
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
                                onClick={() => navigate('/')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Edytuj zadanie</Heading>
                            <Text color="gray.500">
                                Zaktualizuj opis i początkowy kod zadania
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
                                        <FormLabel>Opis zadania</FormLabel>
                                        <Textarea
                                            name="description"
                                            placeholder="Opisz zadanie, które mają rozwiązać uczestnicy..."
                                            value={exerciseData.description}
                                            onChange={handleChange}
                                            rows={6}
                                            resize="vertical"
                                        />
                                        <FormHelperText>
                                            Szczegółowy opis zadania z wymaganiami i celami
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Początkowa zawartość kodu</FormLabel>
                                        <Textarea
                                            name="initialContent"
                                            placeholder="// Początkowy kod dla uczestników"
                                            value={exerciseData.initialContent}
                                            onChange={handleChange}
                                            rows={12}
                                            resize="vertical"
                                            fontFamily="mono"
                                            fontSize="sm"
                                        />
                                        <FormHelperText>
                                            Kod startowy, który zobaczą uczestnicy (opcjonalnie)
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
                                            <strong>Wskazówka:</strong> Początkowa zawartość może zawierać
                                            szkielet funkcji, importy lub komentarze pomocnicze dla uczestników.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/my-exercises')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="green"
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