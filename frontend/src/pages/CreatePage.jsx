import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreateCard = ({ title, description, icon, onClick, color }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box
            bg={bgColor}
            p={8}
            borderRadius="xl"
            borderWidth="2px"
            borderColor={borderColor}
            cursor="pointer"
            transition="all 0.3s"
            onClick={onClick}
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
                borderColor: `${color}.400`,
                bg: hoverBg,
            }}
        >
            <VStack spacing={4} align="center" textAlign="center">
                <Box
                    bg={`${color}.100`}
                    p={4}
                    borderRadius="full"
                    color={`${color}.600`}
                >
                    <Text fontSize="4xl">{icon}</Text>
                </Box>

                <Heading size="md" color={`${color}.600`}>
                    {title}
                </Heading>

                <Text color="gray.500" fontSize="sm">
                    {description}
                </Text>
            </VStack>
        </Box>
    );
};

export default function CreatePage() {
    const navigate = useNavigate();
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    const cards = [
        {
            title: 'Utwórz kurs',
            description: 'Stwórz nowy kurs z lekcjami i materiałami edukacyjnymi',
            color: 'purple',
            path: '/create-course',
        },
        {
            title: 'Dodaj lekcję',
            description: 'Dodaj nową lekcję do istniejącego kursu',
            color: 'blue',
            path: '/create-lesson',
        },
        {
            title: 'Dodaj zadanie',
            description: 'Utwórz zadanie programistyczne dla lekcji',
            color: 'green',
            path: '/create-exercise',
        },
        {
            title: 'Dodaj test',
            description: 'Stwórz testy sprawdzające dla zadania',
            color: 'orange',
            path: '/create-test',
        },
        {
            title: 'Dodaj rozwiązanie',
            description: 'Dodaj przykładowe rozwiązanie zadania',
            color: 'yellow',
            path: '/create-solution',
        },
    ];

    return (
        <Box minH="100vh" bg={pageBg}>
            <Navbar />

            <Box py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={12} align="stretch">
                        <VStack spacing={4} textAlign="center">
                            <Heading size="2xl">
                                Panel tworzenia treści
                            </Heading>
                            <Text fontSize="xl" color="gray.500" maxW="2xl">
                                Wybierz co chcesz utworzyć. Każda opcja poprowadzi Cię przez proces krok po kroku.
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                            {cards.map((card, index) => (
                                <CreateCard
                                    key={index}
                                    title={card.title}
                                    description={card.description}
                                    color={card.color}
                                    onClick={() => navigate(card.path)}
                                />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}