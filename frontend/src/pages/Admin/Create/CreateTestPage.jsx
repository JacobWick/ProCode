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
    IconButton,
    Badge,
    Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Navbar from '../../../components/Navbar.jsx';
import Footer from '../../../components/Footer.jsx';
import {createTest, getExercises} from '../../../api.js';

export default function CreateTestPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [exerciseId, setExerciseId] = useState('');
    const [testCases, setTestCases] = useState([
        { input: '', output: '' }
    ]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const caseBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await getExercises();
                setExercises(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchExercises();
    }, []);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }]);
    };

    const handleRemoveTestCase = (index) => {
        if (testCases.length === 1) {
            toast({
                title: "Nie można usunąć",
                description: "Test musi mieć przynajmniej jeden przypadek testowy",
                status: "warning",
                duration: 3000,
            });
            return;
        }
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!exerciseId) {
            toast({
                title: "Błąd walidacji",
                description: "Wybierz zadanie",
                status: "error",
                duration: 3000,
            });
            return;
        }

        const hasEmptyFields = testCases.some(tc => !tc.input || !tc.output);
        if (hasEmptyFields) {
            toast({
                title: "Błąd walidacji",
                description: "Wszystkie przypadki testowe muszą mieć dane wejściowe i wyjściowe",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const createTestData = {
                inputData: testCases.map(tc => tc.input),
                outputData: testCases.map(tc => tc.output),
                exerciseId: exerciseId,
            };

            console.log('Creating test:', createTestData);

            const response = await createTest(createTestData);
            console.log('Created test: ', response.data);
            toast({
                title: "Test utworzony!",
                description: `Dodano ${testCases.length} przypadków testowych`,
                status: "success",
                duration: 5000,
            });
            navigate('/create');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd tworzenia testu",
                description: error.message || "Nie udało się utworzyć testu",
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
                            <Heading size="xl" mb={2}>Utwórz test dla zadania</Heading>
                            <Text color="gray.500">
                                Dodaj przypadki testowe sprawdzające poprawność rozwiązania
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
                                        <FormLabel>Wybierz zadanie</FormLabel>
                                        <Select
                                            placeholder="Wybierz zadanie"
                                            value={exerciseId}
                                            onChange={(e) => setExerciseId(e.target.value)}
                                            size="lg"
                                        >
                                            {exercises.map(exercise => (
                                                <option key={exercise.id} value={exercise.id}>
                                                    {exercise.lessonTitle} - {exercise.description}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Test zostanie przypisany do wybranego zadania
                                        </FormHelperText>
                                    </FormControl>

                                    <Divider />

                                    <HStack justify="space-between">
                                        <Text fontSize="lg" fontWeight="semibold">
                                            Przypadki testowe ({testCases.length})
                                        </Text>
                                        <Button
                                            leftIcon={<AddIcon />}
                                            colorScheme="orange"
                                            size="sm"
                                            onClick={handleAddTestCase}
                                        >
                                            Dodaj przypadek
                                        </Button>
                                    </HStack>

                                    {testCases.map((testCase, index) => (
                                        <Box
                                            key={index}
                                            bg={caseBg}
                                            p={5}
                                            borderRadius="lg"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                        >
                                            <HStack justify="space-between" mb={4}>
                                                <Badge colorScheme="orange" fontSize="md">
                                                    Test #{index + 1}
                                                </Badge>
                                                {testCases.length > 1 && (
                                                    <IconButton
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveTestCase(index)}
                                                        aria-label="Usuń przypadek testowy"
                                                    />
                                                )}
                                            </HStack>

                                            <VStack spacing={4}>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize="sm">Dane wejściowe (Input)</FormLabel>
                                                    <Input
                                                        placeholder='np. "5 3" lub "10\n20"'
                                                        value={testCase.input}
                                                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                                        fontFamily="monospace"
                                                    />
                                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                                        Dane przekazane przez stdin do programu użytkownika
                                                    </Text>
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel fontSize="sm">Oczekiwany wynik (Output)</FormLabel>
                                                    <Input
                                                        placeholder='np. "8" lub "30"'
                                                        value={testCase.output}
                                                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                                        fontFamily="monospace"
                                                    />
                                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                                        Oczekiwany output z stdout programu użytkownika
                                                    </Text>
                                                </FormControl>
                                            </VStack>
                                        </Box>
                                    ))}

                                    <Box
                                        bg="orange.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="orange.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="orange.800">
                                            <strong>Jak działa testowanie:</strong> Kod użytkownika zostanie uruchomiony
                                            z każdym zestawem danych wejściowych. Wynik zostanie porównany z oczekiwanym
                                            outputem. Wszystkie testy muszą przejść pomyślnie.
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
                                            colorScheme="orange"
                                            isLoading={isLoading}
                                        >
                                            Utwórz test
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