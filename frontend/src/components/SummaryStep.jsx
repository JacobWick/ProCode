import {
    Box, Heading, Text, VStack, HStack, List, ListItem, ListIcon, Badge, Tag, Divider, useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, InfoIcon } from '@chakra-ui/icons';

const DIFFICULTY_LEVELS = [
    { value: 0, label: 'Początkujący', color: 'green' },
    { value: 1, label: 'Średniozaawansowany', color: 'orange' },
    { value: 2, label: 'Zaawansowany', color: 'red' },
];

export default function SummaryStep({ data, lessons, exercises }) {
    const difficulty = DIFFICULTY_LEVELS.find(l => l.value === data.difficultyLevel) || DIFFICULTY_LEVELS[0];

    const cardBg = useColorModeValue('gray.50', 'gray.700');
    const infoBg = useColorModeValue('blue.50', 'blue.900');

    return (
        <VStack spacing={6} align="stretch">

            <Box bg={cardBg} p={5} borderRadius="md" borderWidth="1px">
                <HStack justify="space-between" mb={2}>
                    <Heading size="md" color="purple.600">
                        {data.title || "(Brak tytułu)"}
                    </Heading>
                    <Badge colorScheme={difficulty.color} fontSize="0.8em" px={2} py={1} borderRadius="full">
                        {difficulty.label}
                    </Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                    {data.description || "Brak opisu."}
                </Text>
            </Box>

            <Divider />


            <HStack align="start" spacing={8} flexDirection={{ base: 'column', md: 'row' }}>


                <Box flex={1} w="full">
                    <Text fontWeight="bold" mb={3} fontSize="lg">
                        Lekcje ({lessons.length})
                    </Text>
                    {lessons.length === 0 ? (
                        <Text fontSize="sm" color="gray.500">Nie dodano lekcji.</Text>
                    ) : (
                        <List spacing={2}>
                            {lessons.map((lesson, index) => (
                                <ListItem key={lesson.id} fontSize="sm" display="flex" alignItems="center">
                                    <ListIcon as={CheckIcon} color="green.500" />
                                    <Text as="span" fontWeight="medium" mr={2}>{index + 1}.</Text>
                                    {lesson.title}
                                    {(lesson.videoUri || lesson.textUri) && (
                                        <Badge ml={2} variant="outline" fontSize="xs">Materiały</Badge>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Box flex={1} w="full">
                    <Text fontWeight="bold" mb={3} fontSize="lg">
                        Zadania ({exercises.length})
                    </Text>
                    {exercises.length === 0 ? (
                        <Text fontSize="sm" color="gray.500">Brak zadań programistycznych.</Text>
                    ) : (
                        <List spacing={3}>
                            {exercises.map((exercise) => (
                                <ListItem key={exercise.id} fontSize="sm" bg="white" p={2} borderRadius="md" borderWidth="1px" borderColor="gray.100">
                                    <VStack align="start" spacing={1}>
                                        <HStack>
                                            <ListIcon as={CheckIcon} color="purple.500" />
                                            <Text fontWeight="semibold" noOfLines={1}>
                                                {exercise.description}
                                            </Text>
                                        </HStack>

                                        <HStack pl={6} spacing={2}>
                                            <Badge fontSize="xs" colorScheme="gray">
                                                Lekcja: {exercise.lessonTitle}
                                            </Badge>

                                            {exercise.testCases?.length > 0 && (
                                                <Tag size="sm" colorScheme="orange" variant="subtle">
                                                    {exercise.testCases.length} Testy
                                                </Tag>
                                            )}
                                            {exercise.solution && (
                                                <Tag size="sm" colorScheme="yellow" variant="subtle">
                                                    Rozwiązanie
                                                </Tag>
                                            )}
                                        </HStack>
                                    </VStack>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </HStack>

            <Box bg={infoBg} p={4} borderRadius="md" borderLeftWidth="4px" borderLeftColor="blue.500">
                <HStack>
                    <InfoIcon color="blue.500" />
                    <Text fontSize="sm" color="blue.800">
                        <strong>Gotowe!</strong> Kliknij przycisk <strong>"Utwórz kurs"</strong> poniżej, aby zapisać całą strukturę w bazie danych.
                    </Text>
                </HStack>
            </Box>
        </VStack>
    );
}