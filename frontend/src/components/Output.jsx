import {Box, Button, Text, useToast} from "@chakra-ui/react";
import {execute} from "../api.js";
import {useState} from "react";

const Output = ({editorRef, language}) =>
{
    const toast = useToast();
    const [output, setOutput] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [codeError, setCodeError] = useState(false)
    const runCode = async () => {
        const code = editorRef.current?.getValue();
        if (!code) return;
        try {
            setIsLoading(true);
            const {run: result} = await execute(language, code);
            setOutput(result.output.split("\n"));
            result.stderr ? setCodeError(true): setCodeError(false);
        } catch (error) {
            console.log(error);
            toast({
                title: "Wystąpił błąd.",
                description: error.message || "Problem z uruchomieniem kodu",
                status: "error",
                duration: 6000,
            });
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <Box w='50%'>
            <Text mb={2} fontSize='lg'>Wynik:</Text>
            <Button variant='outline' colorScheme="green" mb={4} isLoading={isLoading} onClick={runCode}>Uruchom kod</Button>
            <Box height='75vh' p={2} border='1px solid' borderRadius={4} borderColor={codeError? "red.400" : ""}>
                {
                    output ? output.map((item, i) => <Text key={i}>{item}</Text>) : 'Kliknij "Uruchom Kod", aby zobaczyć wynik działania  kodu'
                }
            </Box>
        </Box>

    )
}
export default Output;