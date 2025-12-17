import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Badge,
    HStack,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getActiveChallenges } from '../api.js';


const ChallengeCard = ({ challenge }) => {
    const navigate = useNavigate();
    const timeRemaining = new Date(challenge.endTime) - new Date();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            borderRadius="lg"
            p={6}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
            cursor="pointer"
            onClick={() => navigate(`/challenges/${challenge.id}`)}
        >
            <HStack justify="space-between" mb={3}>
                <Badge colorScheme="orange" fontSize="sm">🏆 Wyzwanie</Badge>
                <Badge colorScheme={daysRemaining > 3 ? 'green' : 'red'}>
                    {daysRemaining > 0 ? `${daysRemaining} dni pozostało` : 'Zakończone'}
                </Badge>
            </HStack>

            <Heading size="md" mb={2} noOfLines={2}>
                {challenge.title}
            </Heading>

            <Text color="gray.500" mb={4} noOfLines={3}>
                {challenge.description}
            </Text>

            <HStack spacing={4} fontSize="sm" color="gray.600">
                <HStack>
                    <Text>📝</Text>
                    <Text>{challenge.exercises?.length || 0} zadań</Text>
                </HStack>
                <HStack>
                    <Text>📅</Text>
                    <Text>{new Date(challenge.startTime).toLocaleDateString('pl-PL')}</Text>
                </HStack>
            </HStack>
        </Box>
    );
};

const ActiveChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useState(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getActiveChallenges();
                const data = response.data;
                setChallenges(data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    if (loading) {
        return null;
    }

    if (!challenges || challenges.length === 0) {
        return null;
    }

    return (
        <Box py={16}>
            <Container maxW="container.xl">
                <VStack align="start" spacing={4} mb={8}>
                    <Heading>🏆 Aktywne Wyzwania</Heading>
                    <Text color="gray.500" fontSize="lg">
                        Weź udział w programistycznych wyzwaniach i rywalizuj z innymi uczestnikami!
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {challenges.map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};
export default ActiveChallenges;