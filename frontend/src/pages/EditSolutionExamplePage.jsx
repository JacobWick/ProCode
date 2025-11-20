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
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSolutionExampleById, updateSolutionExample } from '../api';

export default function EditSolutionExamplePage() {
    const { solutionId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [solutionData, setSolutionData] = useState({
        code: '',
        explanation: '',
    });
    const [originalSolutionData, setOriginalSolutionData] = useState(null);
    const [error, setError] = useState(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const response = await getSolutionExampleById(solutionId);
                const solution = response.data;

                setSolutionData({
                    code: solution.code || '',
                    explanation: solution.explanation || '',
                });

                setOriginalSolutionData({
                    code: solution.code || '',
                    explanation: solution.explanation || '',
                });

            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania danych przykładowego rozwiązania");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [solutionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSolutionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!solutionData.code.trim() || !solutionData.explanation.trim()) {
            toast({
                title: "Błąd walidacji",
                description: "Kod i wyjaśnienie są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const updateSolutionData = {
                id: solutionId,
                code: solutionData.code !== originalSolutionData.code
                    ? solutionData.code
                    : "",
                explanation: solutionData.explanation !== originalSolutionData.explanation
                    ? solutionData.explanation
                    : "",
            };

            console.log('Updating solution example:', updateSolutionData);

            const response = await updateSolutionExample(updateSolutionData);
            console.log('Updated solution example:', response.data);

            toast({
                title: "Przykład rozwiązania zaktualizowany!",
                description: "Zmiany zostały pomyślnie zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji przykładu",
                description: error.message || "Nie udało się zaktualizować przykładu rozwiązania",
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
                    <Spinner size="xl" color="teal.500" />
                    <Text mt={4} color="gray.500">Ładowanie przykładu rozwiązania...</Text>
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
                        onClick={() => navigate('/my-solutions')}
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
                                onClick={() => navigate('/my-solutions')}
                            >
                                Powrót
                            </Button>
                        </HStack>

                        <Box>
                            <Heading size="xl" mb={2}>Edytuj przykład rozwiązania</Heading>
                            <Text color="gray.500">
                                Zaktualizuj kod i wyjaśnienie przykładowego rozwiązania
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
                                        <FormLabel>Kod rozwiązania</FormLabel>
                                        <Textarea
                                            name="code"
                                            placeholder="// Przykładowe rozwiązanie zadania function solution{// Twój kod tutaj}"
                                            value={solutionData.code}
                                            onChange={handleChange}
                                            rows={15}
                                            resize="vertical"
                                            fontFamily="mono"
                                            fontSize="sm"
                                        />
                                        <FormHelperText>
                                            Pełny kod przykładowego rozwiązania zadania
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Wyjaśnienie</FormLabel>
                                        <Textarea
                                            name="explanation"
                                            placeholder="Wyjaśnij krok po kroku jak działa rozwiązanie..."
                                            value={solutionData.explanation}
                                            onChange={handleChange}
                                            rows={8}
                                            resize="vertical"
                                        />
                                        <FormHelperText>
                                            Szczegółowe wyjaśnienie logiki i podejścia do rozwiązania
                                        </FormHelperText>
                                    </FormControl>

                                    <Box
                                        bg="teal.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="teal.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="teal.800">
                                            <strong>Wskazówka:</strong> Dobre wyjaśnienie powinno zawierać:
                                            opis algorytmu, złożoność czasową i pamięciową, oraz kluczowe
                                            decyzje implementacyjne. To pomoże uczestnikom zrozumieć
                                            najlepsze praktyki.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/my-solutions')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="teal"
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