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
    Spinner,
    Alert,
    AlertIcon,
    IconButton,
    Stack,
    Badge,
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Navbar from '../../../components/Navbar.jsx';
import Footer from '../../../components/Footer.jsx';
import { getTestById, updateTest } from '../../../api.js';

export default function EditTestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [inputData, setInputData] = useState(['']);
    const [outputData, setOutputData] = useState(['']);
    const [originalTestData, setOriginalTestData] = useState(null);
    const [error, setError] = useState(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const response = await getTestById(testId);
                const test = response.data;

                setInputData(test.inputData && test.inputData.length > 0 ? test.inputData : ['']);
                setOutputData(test.outputData && test.outputData.length > 0 ? test.outputData : ['']);

                setOriginalTestData({
                    inputData: test.inputData || [],
                    outputData: test.outputData || [],
                });

            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania danych testu");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [testId]);

    const handleInputChange = (index, value) => {
        const newInputData = [...inputData];
        newInputData[index] = value;
        setInputData(newInputData);
    };

    const handleOutputChange = (index, value) => {
        const newOutputData = [...outputData];
        newOutputData[index] = value;
        setOutputData(newOutputData);
    };

    const addTestCase = () => {
        setInputData([...inputData, '']);
        setOutputData([...outputData, '']);
    };

    const removeTestCase = (index) => {
        if (inputData.length > 1) {
            setInputData(inputData.filter((_, i) => i !== index));
            setOutputData(outputData.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const filteredInputData = inputData.filter(item => item.trim() !== '');
        const filteredOutputData = outputData.filter(item => item.trim() !== '');

        if (filteredInputData.length === 0 || filteredOutputData.length === 0) {
            toast({
                title: "Błąd walidacji",
                description: "Musisz dodać przynajmniej jeden przypadek testowy",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (filteredInputData.length !== filteredOutputData.length) {
            toast({
                title: "Błąd walidacji",
                description: "Liczba danych wejściowych musi być równa liczbie danych wyjściowych",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const inputChanged = JSON.stringify(filteredInputData) !== JSON.stringify(originalTestData.inputData);
            const outputChanged = JSON.stringify(filteredOutputData) !== JSON.stringify(originalTestData.outputData);

            const updateTestData = {
                id: testId,
                inputData: inputChanged ? filteredInputData : null,
                outputData: outputChanged ? filteredOutputData : null,
            };

            console.log('Updating test:', updateTestData);

            const response = await updateTest(updateTestData);
            console.log('Updated test:', response.data);

            toast({
                title: "Test zaktualizowany!",
                description: "Zmiany zostały pomyślnie zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd aktualizacji testu",
                description: error.message || "Nie udało się zaktualizować testu",
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
                    <Spinner size="xl" color="orange.500" />
                    <Text mt={4} color="gray.500">Ładowanie danych testu...</Text>
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
                        onClick={() => navigate('/my-tests')}
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
                            <Heading size="xl" mb={2}>Edytuj test</Heading>
                            <Text color="gray.500">
                                Zaktualizuj przypadki testowe z danymi wejściowymi i oczekiwanymi wynikami
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
                                    <Box>
                                        <HStack justify="space-between" mb={4}>
                                            <Text fontSize="lg" fontWeight="semibold">
                                                Przypadki testowe ({inputData.length})
                                            </Text>
                                            <Button
                                                leftIcon={<AddIcon />}
                                                colorScheme="orange"
                                                size="sm"
                                                onClick={addTestCase}
                                            >
                                                Dodaj przypadek
                                            </Button>
                                        </HStack>

                                        <Stack spacing={4}>
                                            {inputData.map((input, index) => (
                                                <Box
                                                    key={index}
                                                    p={4}
                                                    borderWidth="1px"
                                                    borderColor={borderColor}
                                                    borderRadius="md"
                                                    bg={useColorModeValue('gray.50', 'gray.900')}
                                                >
                                                    <HStack align="start" spacing={4}>
                                                        <Badge colorScheme="orange" alignSelf="center">
                                                            Test {index + 1}
                                                        </Badge>

                                                        <VStack flex={1} align="stretch" spacing={3}>
                                                            <FormControl>
                                                                <FormLabel fontSize="sm">Dane wejściowe</FormLabel>
                                                                <Input
                                                                    value={input}
                                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                                    placeholder="np. [1, 2, 3]"
                                                                />
                                                            </FormControl>

                                                            <FormControl>
                                                                <FormLabel fontSize="sm">Oczekiwany wynik</FormLabel>
                                                                <Input
                                                                    value={outputData[index]}
                                                                    onChange={(e) => handleOutputChange(index, e.target.value)}
                                                                    placeholder="np. 6"
                                                                />
                                                            </FormControl>
                                                        </VStack>

                                                        <IconButton
                                                            icon={<DeleteIcon />}
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={() => removeTestCase(index)}
                                                            isDisabled={inputData.length === 1}
                                                            aria-label="Usuń przypadek testowy"
                                                            alignSelf="center"
                                                        />
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Box
                                        bg="orange.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="orange.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="orange.800">
                                            <strong>Wskazówka:</strong> Każdy przypadek testowy powinien zawierać
                                            dane wejściowe i odpowiadający im oczekiwany wynik. Testy będą
                                            automatycznie sprawdzać poprawność rozwiązań uczestników.
                                        </Text>
                                    </Box>

                                    <HStack justify="flex-end" spacing={3}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate('/')}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorScheme="orange"
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