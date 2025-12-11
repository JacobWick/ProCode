import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {execute, executeSolution, submitExerciseSolution} from "../api.js";
import {
    Box,
    Text,
    useToast,
    VStack,
    useColorModeValue,
    HStack,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Code,
} from "@chakra-ui/react";

import { ViewIcon } from "@chakra-ui/icons";
import { getSolutionExampleById, completeLesson } from "../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Output = ({ editorRef, language, exerciseId, solutionExampleId, courseId, lessonId, lesson }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [testsPassed, setTestsPassed] = useState(null);
    const [solutionExample, setSolutionExample] = useState(null);
    const [loadingSolution, setLoadingSolution] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue("gray.50", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "gray.100");

    const runCode = async () => {
        const code = editorRef.current?.getValue();
        if (!code) return;

        try {
            setIsLoading(true);
            const result = await execute(language, code, "");

            const output = result.run.stdout || result.run.output || "";
            setOutput(output.split("\n"));

            const hasError = result.run.stderr && result.run.stderr.length > 0;
            setCodeError(hasError);
        } catch (error) {
            console.error(error);
            toast({
                title: "Wystąpił błąd.",
                description: error.message || "Problem z uruchomieniem kodu",
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const checkSolution = async () => {
        const code = editorRef.current?.getValue();
        if (!code) {
            toast({
                title: "Brak kodu",
                description: "Napisz kod przed sprawdzeniem rozwiązania",
                status: "warning",
                duration: 3000,
            });
            return false;
        }

        try {
            const response = await submitExerciseSolution(exerciseId, code);
            const isSuccessful = response.data.isSuccessful;
            setTestsPassed(isSuccessful);
            return isSuccessful;
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd podczas testowania",
                description: error.message,
                status: "error",
                duration: 5000,
            });
            return false;
        }
    };

    const checkIfLessonComplete = () => {
        if (!lesson || !lesson.exercises) return false;
        const exercises = Array.isArray(lesson.exercises) ? lesson.exercises : [];
        const currentIndex = exercises.findIndex(e => {
            const eId = typeof e === 'object' ? (e.id || e.Id) : e;
            return String(eId) === String(exerciseId);
        });

        return currentIndex === exercises.length - 1;
    };

    const handleCompleteLessonAndNavigate = async () => {
        try {
                await completeLesson(lessonId);
                toast({
                    title: "Lekcja ukończona!",
                    description: "Gratulacje! Ukończyłeś wszystkie zadania w tej lekcji.",
                    status: "success",
                    duration: 5000,
                });
        } catch (error) {
            console.error('Error completing lesson:', error);
        } finally {
            navigate(`/courses/${courseId}/lessons/${lessonId}`);
        }
    };

    const handleSubmitSolution = async () => {
        try {
            setIsSubmitting(true);

            const passed = await checkSolution();

            if (passed) {
                toast({
                    title: "Gratulacje!",
                    description: "Twoje rozwiązanie jest poprawne!",
                    status: "success",
                    duration: 5000,
                });
                const isLastExercise = checkIfLessonComplete();
                if (isLastExercise) {
                    await handleCompleteLessonAndNavigate();
                } else {
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/lessons/${lessonId}`);
                    }, 2000);
                }
            } else {
                toast({
                    title: "Rozwiązanie niepoprawne",
                    description: "Sprawdź swój kod i spróbuj ponownie.",
                    status: "error",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Wystąpił błąd",
                description: error.message || "Problem z przesłaniem rozwiązania",
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewSolution = async () => {
        if (!solutionExampleId) {
            toast({
                title: "Brak rozwiązania",
                description: "Dla tego zadania nie ma przykładowego rozwiązania",
                status: "info",
                duration: 3000,
            });
            return;
        }

        try {
            setLoadingSolution(true);
            const response = await getSolutionExampleById(solutionExampleId);
            setSolutionExample(response.data);
            onOpen();
        } catch (error) {
            console.error(error);
            toast({
                title: "Błąd",
                description: "Nie udało się pobrać rozwiązania",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoadingSolution(false);
        }
    };

    return (
        <Box w="50%">
            <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="100%">
                    <Text fontSize="lg" color={textColor}>
                        Wynik:
                    </Text>
                    {testsPassed !== null && (
                        <Badge
                            colorScheme={testsPassed ? "green" : "red"}
                            fontSize="md"
                            px={3}
                            py={1}
                        >
                            {testsPassed ? (
                                <HStack spacing={1}>
                                    <CheckIcon boxSize={3} />
                                    <Text>Testy zaliczone</Text>
                                </HStack>
                            ) : (
                                <HStack spacing={1}>
                                    <WarningIcon boxSize={3} />
                                    <Text>Testy niezaliczone</Text>
                                </HStack>
                            )}
                        </Badge>
                    )}
                </HStack>

                <VStack spacing={3} w="100%">
                    <HStack spacing={3} w="100%">
                        <Button
                            colorScheme="purple"
                            variant="solid"
                            rounded="xl"
                            shadow="md"
                            isLoading={isLoading}
                            onClick={runCode}
                            flex={1}
                            _hover={{ transform: "scale(1.02)", shadow: "lg" }}
                        >
                            Uruchom kod
                        </Button>

                        <Button
                            colorScheme="teal"
                            variant="solid"
                            rounded="xl"
                            shadow="md"
                            isLoading={isSubmitting}
                            onClick={handleSubmitSolution}
                            flex={1}
                            _hover={{ transform: "scale(1.02)", shadow: "lg" }}
                        >
                            Prześlij rozwiązanie
                        </Button>
                    </HStack>

                    {solutionExampleId && (
                        <Button
                            leftIcon={<ViewIcon />}
                            colorScheme="blue"
                            variant="outline"
                            rounded="xl"
                            w="100%"
                            isLoading={loadingSolution}
                            onClick={handleViewSolution}
                        >
                            Zobacz przykładowe rozwiązanie
                        </Button>
                    )}
                </VStack>

                <Box
                    w="100%"
                    height="75vh"
                    p={4}
                    bg={bg}
                    color={textColor}
                    border="1px solid"
                    borderColor={codeError ? "red.400" : border}
                    borderRadius="xl"
                    shadow="md"
                    fontFamily="mono"
                    overflowY="auto"
                    transition="all 0.2s ease-in-out"
                >
                    {output ? (
                        output.map((item, i) => (
                            <Text key={i} whiteSpace="pre-wrap">
                                {item}
                            </Text>
                        ))
                    ) : (
                        <Text color="gray.500">
                            Kliknij <b>„Uruchom kod"</b>, aby zobaczyć wynik działania programu.
                        </Text>
                    )}
                </Box>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Przykładowe rozwiązanie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {solutionExample ? (
                            <Tabs colorScheme="purple">
                                <TabList>
                                    <Tab>Kod</Tab>
                                    <Tab>Wyjaśnienie</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <Box
                                            p={4}
                                            bg={bg}
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor={border}
                                            maxH="500px"
                                            overflowY="auto"
                                        >
                                            <Code
                                                display="block"
                                                whiteSpace="pre"
                                                fontFamily="mono"
                                                fontSize="sm"
                                            >
                                                {solutionExample.code}
                                            </Code>
                                        </Box>
                                    </TabPanel>
                                    <TabPanel>
                                        <Box
                                            p={4}
                                            bg={bg}
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor={border}
                                            maxH="500px"
                                            overflowY="auto"
                                        >
                                            <Text whiteSpace="pre-line">
                                                {solutionExample.explanation}
                                            </Text>
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        ) : (
                            <Text>Ładowanie rozwiązania...</Text>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>Zamknij</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Output;