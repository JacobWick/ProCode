import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, VStack, HStack, Badge } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getChallengeById } from '../../api.js';

const ExerciseCard = ({ exercise, index, isActive, onClick }) => {
    return (
        <Box
            p={4}
            bg={isActive ? 'purple.100' : 'white'}
            border="2px solid"
            borderColor={isActive ? 'purple.500' : 'gray.200'}
            borderRadius="md"
            cursor="pointer"
            onClick={onClick}
        >
            <Text fontWeight="bold">Zadanie {index + 1}</Text>
        </Box>
    );
};

// Komponent pokazujący szczegóły zadania
const ExerciseDetail = ({ exercise, index }) => {
    return (
        <VStack align="start" spacing={6} w="100%">
            <Box>
                <Badge colorScheme="purple" mb={2}>Zadanie {index + 1}</Badge>
                <Heading size="lg">{exercise.description}</Heading>
            </Box>

            <Box w="100%">
                <Text fontWeight="bold" mb={2}>Dane wejściowe:</Text>
                <Box bg="gray.50" p={3} borderRadius="md">
                    {exercise.inputData?.map((input, idx) => (
                        <Text key={idx} fontFamily="mono">{input}</Text>
                    ))}
                </Box>
            </Box>

            <Box w="100%">
                <Text fontWeight="bold" mb={2}>Oczekiwane wyjście:</Text>
                <Box bg="gray.50" p={3} borderRadius="md">
                    {exercise.outputData?.map((output, idx) => (
                        <Text key={idx} fontFamily="mono">{output}</Text>
                    ))}
                </Box>
            </Box>
        </VStack>
    );
};

export default function ChallengePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [challenge, setChallenge] = useState(null);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);

    useEffect(() => {
        const fetchChallenge = async () => {
            const response = await getChallengeById(id);
            setChallenge(response.data);
        };
        fetchChallenge();
    }, [id]);

    if (!challenge) {
        return null;
    }

    const timeRemaining = new Date(challenge.endTime) - new Date();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    return (
        <Box minH="100vh" bg="gray.50">
            <Navbar />

            <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
                <Container maxW="container.xl" py={6}>
                    <Button mb={4} onClick={() => navigate('/')}>← Powrót</Button>

                    <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                            <Badge colorScheme="orange">🏆 Wyzwanie</Badge>
                            <Badge colorScheme={daysRemaining > 3 ? 'green' : 'red'}>
                                {daysRemaining} dni pozostało
                            </Badge>
                        </HStack>

                        <Heading size="xl">{challenge.title}</Heading>
                        <Text fontSize="lg" color="gray.600">{challenge.description}</Text>
                    </VStack>
                </Container>
            </Box>

            <Container maxW="container.xl" py={8}>
                <HStack align="start" spacing={6}>
                    
                    <VStack w="250px" spacing={3} align="stretch">
                        <Text fontWeight="bold" fontSize="lg">📝 Zadania</Text>
                        {challenge.exercises?.map((exercise, index) => (
                            <ExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                index={index}
                                isActive={selectedExerciseIndex === index}
                                onClick={() => setSelectedExerciseIndex(index)}
                            />
                        ))}
                    </VStack>

                    <Box flex="1" bg="white" p={6} borderRadius="md">
                        {challenge.exercises?.[selectedExerciseIndex] ? (
                            <ExerciseDetail
                                exercise={challenge.exercises[selectedExerciseIndex]}
                                index={selectedExerciseIndex}
                            />
                        ) : (
                            <Text color="gray.500">Brak zadań</Text>
                        )}
                    </Box>
                </HStack>
            </Container>

            <Footer />
        </Box>
    );
}