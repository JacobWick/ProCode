import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Badge,
    HStack,
    useColorModeValue,
    VStack,
    Collapse,
    Button,
    Icon,
    Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Trophy, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getActiveChallenges } from '../api.js';

const ChallengeItem = ({ challenge }) => {
    const navigate = useNavigate();
    const itemBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const titleColor = useColorModeValue('gray.800', 'white');
    const descColor = useColorModeValue('gray.600', 'gray.400');

    const timeRemaining = new Date(challenge.endTime) - new Date();
    const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const isActive = daysLeft > 0;

    return (
        <Box
            bg={itemBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            transition="all 0.2s"
            _hover={{
                borderColor: 'orange.400',
                shadow: 'sm'
            }}
            cursor="pointer"
            onClick={() => navigate(`/challenges/${challenge.id}`)}
        >
            <Flex justify="space-between" align="start" gap={4}>
                <HStack spacing={3} flex={1}>
                    <Icon as={Trophy} boxSize={5} color="orange.500" />
                    <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="semibold" color={titleColor} fontSize="sm">
                            {challenge.title}
                        </Text>
                        <HStack spacing={3} fontSize="xs" color={descColor}>
                            <HStack spacing={1}>
                                <Icon as={FileText} boxSize={3} />
                                <Text>{challenge.exercises?.length || 0} zadań</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Icon as={Calendar} boxSize={3} />
                                <Text>{new Date(challenge.startTime).toLocaleDateString('pl-PL')}</Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </HStack>
                <Badge
                    colorScheme={isActive ? (daysLeft > 3 ? 'green' : 'orange') : 'gray'}
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    flexShrink={0}
                >
                    {isActive ? `${daysLeft} dni` : 'Zakończone'}
                </Badge>
            </Flex>
        </Box>
    );
};

const ActiveChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.300');

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getActiveChallenges();
                setChallenges(response.data || []);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    if (loading || !challenges.length) return null;

    return (
        <Box borderTopWidth="1px" borderColor={borderColor} bg={bgColor}>
            <Container maxW="container.xl" py={4}>
                <VStack align="stretch" spacing={3}>
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(!isOpen)}
                        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        justifyContent="space-between"
                        fontWeight="semibold"
                        color={textColor}
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                        size="sm"
                    >
                        <HStack spacing={2}>
                            <Icon as={Trophy} boxSize={4} color="orange.500" />
                            <Text>Aktywne wyzwania ({challenges.length})</Text>
                        </HStack>
                    </Button>

                    <Collapse in={isOpen} animateOpacity>
                        <VStack align="stretch" spacing={2} pt={2}>
                            {challenges.map((challenge) => (
                                <ChallengeItem key={challenge.id} challenge={challenge} />
                            ))}
                        </VStack>
                    </Collapse>
                </VStack>
            </Container>
        </Box>
    );
};

export default ActiveChallenges;