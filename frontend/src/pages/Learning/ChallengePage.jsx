import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, VStack, HStack, Badge, useToast } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CodeEditor from '../../components/CodeEditor';
import { getChallengeById, getChallengeStatus, setChallengeStatus } from '../../api.js';

const ExerciseCard = ({ exercise, index, isActive, isCompleted, onClick }) => {
    return (
        <Box
            p={4}
            bg={isActive ? 'purple.100' : 'white'}
            border="2px solid"
            borderColor={isActive ? 'purple.500' : 'gray.200'}
            borderRadius="md"
            cursor="pointer"
            onClick={onClick}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <Text fontWeight="bold">Zadanie {index + 1}</Text>
            {isCompleted && <Badge colorScheme="green">✓ Zaliczone</Badge>}
        </Box>
    );
};

const ExerciseDetail = ({ exercise, index }) => {
    return (
        <VStack align="start" spacing={6} w="100%">
            <Box>
                <Badge colorScheme="purple" mb={2}>Zadanie {index + 1}</Badge>
                <Text size="lg">{exercise.description}</Text>
            </Box>

        </VStack>
    );
};

export default function ChallengePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [challenge, setChallenge] = useState(null);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState(new Set());
    const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(id);
                setChallenge(response.data);
            } catch (error) {
                console.error('Failed to fetch challenge:', error);
                toast({
                    title: 'Błąd ładowania wyzwania',
                    description: error?.response?.data || error.message || 'Nie można pobrać danych wyzwania',
                    status: 'error',
                    duration: 6000,
                });
            }
        };
        fetchChallenge();
    }, [id, toast]);

    useEffect(() => {
        const fetchChallengeStatus = async () => {
            try {
                const response = await getChallengeStatus(id);
                const data = response.data || {};
                const isCompleted = data.isCompleted ?? data.IsCompleted ?? false;
                setIsChallengeCompleted(isCompleted);
            } catch (error) {
                console.error('Failed to fetch challenge status:', error);
                toast({
                    title: 'Błąd ładowania statusu',
                    description: error?.response?.data || error.message || 'Nie można pobrać statusu wyzwania',
                    status: 'error',
                    duration: 6000,
                });
            }
        };
        fetchChallengeStatus();
    }, [id, toast]);

    useEffect(() => {
        if (!challenge) return;
        if (isChallengeCompleted) return;

        const total = challenge.exercises ? challenge.exercises.length : 0;
        if (total > 0 && completedExercises.size === total) {
            const setStatus = async () => {
                try {
                    await setChallengeStatus(id, true);
                    setIsChallengeCompleted(true);
                } catch (error) {
                    console.error("Failed to set challenge status:", error);
                }
            };
            setStatus();
        }
    }, [completedExercises, challenge, id, isChallengeCompleted]);

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
                            {isChallengeCompleted && (
                                <Badge colorScheme="green">✓ Ukończone</Badge>
                            )}
                        </HStack>

                        <Heading size="xl">{challenge.title}</Heading>
                        <Text fontSize="lg" color="gray.600">{challenge.description}</Text>
                    </VStack>
                </Container>
            </Box>

            <Container maxW="container.xl" py={8}>
                <HStack align="start" spacing={6} alignItems="flex-start">
                    
                    <VStack w="250px" spacing={3} align="stretch">
                        <Text fontWeight="bold" fontSize="lg">📝 Zadania</Text>
                        {challenge.exercises?.map((exercise, index) => (
                            <ExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                index={index}
                                isActive={selectedExerciseIndex === index}
                                isCompleted={completedExercises.has(exercise.id)}
                                onClick={() => setSelectedExerciseIndex(index)}
                            />
                        ))}
                    </VStack>

                    <Box flex="1">
                        <VStack align="stretch" spacing={4}>
                            <Box bg="white" p={6} borderRadius="md">
                                {challenge.exercises?.[selectedExerciseIndex] ? (
                                    <ExerciseDetail
                                        exercise={challenge.exercises[selectedExerciseIndex]}
                                        index={selectedExerciseIndex}
                                    />
                                ) : (
                                    <Text color="gray.500">Brak zadań</Text>
                                )}
                            </Box>

                            {challenge.exercises?.[selectedExerciseIndex] && (
                                <Box bg="white" borderRadius="md" p={4}>
                                    <CodeEditor
                                        key={challenge.exercises[selectedExerciseIndex].id}
                                        initialContent={challenge.exercises[selectedExerciseIndex].initialContent}
                                        inputData={challenge.exercises[selectedExerciseIndex].inputData || []}
                                        outputData={challenge.exercises[selectedExerciseIndex].outputData || []}
                                        exerciseId={challenge.exercises[selectedExerciseIndex].id}
                                        onExerciseComplete={(completedExerciseId) => {
                                            setCompletedExercises(prev => {
                                                const s = new Set(prev);
                                                s.add(completedExerciseId);
                                                return s;
                                            });
                                        }}
                                    />
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </HStack>
            </Container>

            <Footer />
        </Box>
    );
}