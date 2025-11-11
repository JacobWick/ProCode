import { Box, Button, Text, useToast, VStack, useColorModeValue, HStack } from "@chakra-ui/react";
import { execute } from "../api.js";
import { useState } from "react";

const Output = ({ editorRef, language }) => {
    const toast = useToast();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [codeError, setCodeError] = useState(false);

    const bg = useColorModeValue("gray.50", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "gray.100");

    const runCode = async () => {
        const code = editorRef.current?.getValue();
        if (!code) return;

        try {
            setIsLoading(true);
            const { run: result } = await execute(language, code);
            setOutput(result.output.split("\n"));
            result.stderr ? setCodeError(true) : setCodeError(false);
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

    const handleSubmitSolution = () => {
        toast({
            title: "Rozwiązanie przesłane!",
            description: "Twoje rozwiązanie zostało zapisane do oceny.",
            status: "success",
            duration: 4000,
        });
    };

    return (
        <Box w="50%">
            <VStack align="start" spacing={4}>
                <Text fontSize="lg" color={textColor}>
                    Wynik:
                </Text>

                <HStack spacing={3}>
                    <Button
                        colorScheme="purple"
                        variant="solid"
                        rounded="xl"
                        shadow="md"
                        isLoading={isLoading}
                        onClick={runCode}
                        _hover={{ transform: "scale(1.02)", shadow: "lg" }}
                    >
                        Uruchom kod
                    </Button>

                    <Button
                        colorScheme="teal"
                        variant="outline"
                        rounded="xl"
                        shadow="md"
                        onClick={handleSubmitSolution}
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
                            Kliknij <b>„Uruchom kod”</b>, aby zobaczyć wynik działania programu.
                        </Text>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};
export default Output;
