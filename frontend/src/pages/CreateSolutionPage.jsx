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
    Textarea,
    Select,
    FormHelperText,
    useColorModeValue,
    useToast,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Editor } from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {createSolutionExample, getExercises} from '../api';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
];

export default function CreateSolutionPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [language, setLanguage] = useState('javascript');
    const [solutionData, setSolutionData] = useState({
        exerciseId: '',
        code: '',
        explanation: '',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const monacoTheme = useColorModeValue('vs', 'vs-dark');

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSolutionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCodeChange = (value) => {
        setSolutionData(prev => ({
            ...prev,
            code: value || ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!solutionData.exerciseId || !solutionData.code || !solutionData.explanation) {
            toast({
                title: "Błąd walidacji",
                description: "Wszystkie pola są wymagane",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);

            const createSolutionData = {
                code: solutionData.code,
                explanation: solutionData.explanation,
            };

            console.log('Creating solution for exercise:', solutionData.exerciseId);
            console.log('Solution data:', createSolutionData);

            const response = await createSolutionExample(solutionData.exerciseId, createSolutionData);
            console.log('Created solution for exercise:', response.data);

            toast({
                title: "Rozwiązanie dodane!",
                description: "Przykładowe rozwiązanie zostało zapisane",
                status: "success",
                duration: 5000,
            });

            navigate('/create');
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd dodawania rozwiązania",
                description: error.message || "Nie udało się dodać przykładowego rozwiązania",
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
                <Container maxW="container.xl">
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
                            <Heading size="xl" mb={2}>Dodaj przykładowe rozwiązanie</Heading>
                            <Text color="gray.500">
                                Utwórz wzorcowe rozwiązanie zadania z wyjaśnieniem
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
                                            name="exerciseId"
                                            placeholder="Wybierz zadanie"
                                            value={solutionData.exerciseId}
                                            onChange={handleChange}
                                            size="lg"
                                        >
                                            {exercises.map(exercise => (
                                                <option key={exercise.id} value={exercise.id}>
                                                    {exercise.lessonTitle} - {exercise.description}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Rozwiązanie zostanie przypisane do wybranego zadania
                                        </FormHelperText>
                                    </FormControl>

                                    <Tabs>
                                        <TabList>
                                            <Tab>Kod rozwiązania</Tab>
                                            <Tab>Wyjaśnienie</Tab>
                                        </TabList>

                                        <TabPanels>
                                            <TabPanel px={0} pt={6}>
                                                <VStack spacing={4} align="stretch">
                                                    <FormControl>
                                                        <FormLabel>Język programowania</FormLabel>
                                                        <Select
                                                            value={language}
                                                            onChange={(e) => setLanguage(e.target.value)}
                                                            size="lg"
                                                        >
                                                            {LANGUAGES.map(lang => (
                                                                <option key={lang.value} value={lang.value}>
                                                                    {lang.label}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>Kod rozwiązania</FormLabel>
                                                        <Box
                                                            borderWidth="1px"
                                                            borderColor={borderColor}
                                                            borderRadius="lg"
                                                            overflow="hidden"
                                                        >
                                                            <Editor
                                                                height="400px"
                                                                language={language}
                                                                theme={monacoTheme}
                                                                value={solutionData.code}
                                                                onChange={handleCodeChange}
                                                                options={{
                                                                    minimap: { enabled: false },
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                        </Box>
                                                    </FormControl>
                                                </VStack>
                                            </TabPanel>

                                            <TabPanel px={0} pt={6}>
                                                <FormControl isRequired>
                                                    <FormLabel>Wyjaśnienie rozwiązania</FormLabel>
                                                    <Textarea
                                                        name="explanation"
                                                        placeholder="Opisz krok po kroku jak działa rozwiązanie..."
                                                        value={solutionData.explanation}
                                                        onChange={handleChange}
                                                        rows={15}
                                                        resize="vertical"
                                                    />
                                                    <FormHelperText>
                                                        Szczegółowe wyjaśnienie pomoże uczniom zrozumieć rozwiązanie
                                                    </FormHelperText>
                                                </FormControl>
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>

                                    <Box
                                        bg="yellow.50"
                                        borderLeftWidth="4px"
                                        borderLeftColor="yellow.500"
                                        p={4}
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm" color="yellow.800">
                                            <strong>Wskazówka:</strong> Przykładowe rozwiązanie powinno być dobrze
                                            napisane, optymalne i zawierać najlepsze praktyki programowania.
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
                                            colorScheme="yellow"
                                            isLoading={isLoading}
                                        >
                                            Dodaj rozwiązanie
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