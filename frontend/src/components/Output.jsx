import { Box, Button, Text, useToast, VStack, useColorModeValue, HStack, Badge } from "@chakra-ui/react";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {execute, executeSolution, submitExerciseSolution} from "../api.js";
import { useState } from "react";

const Output = ({ editorRef, language, inputData, outputData, exerciseId, onExerciseComplete }) => {
    const toast = useToast();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [testsPassed, setTestsPassed] = useState(null);

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
                
                if (onExerciseComplete) {
                    onExerciseComplete();
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
        </Box>
    );
};

export default Output;