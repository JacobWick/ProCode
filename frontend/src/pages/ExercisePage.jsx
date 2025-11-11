import {
    Box,
    Container,
    useColorModeValue,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CodeEditor from '../components/CodeEditor';

export default function ExercisePage() {
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />

            <Box py={6}>
                <Container maxW="container.xl">
                    <CodeEditor />
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}