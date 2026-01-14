import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, GridItem, VStack, FormControl, FormLabel, Input, Textarea, Button, Heading, Text, useToast, FormErrorMessage, FormHelperText, HStack, Badge, IconButton } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { challengeSchema, challengeExerciseSchema } from '../../../validationSchemas.js';
import { createChallenge, createChallengeExercise, createTest } from "../../../api.js";
import TestModal from '../../../components/TestModal.jsx';

export default function CreateChallengePage() {
    const navigate = useNavigate();
    const toast = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(challengeSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: '',
            endTime: ''
        }
    });

    const [exercises, setExercises] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const { register: regEx, handleSubmit: handleSubmitEx, reset: resetEx, setValue: setExValue, formState: { errors: exErrors } } = useForm({
        resolver: zodResolver(challengeExerciseSchema),
        defaultValues: { description: '', initialContent: '' }
    });

    const [activeExerciseId, setActiveExerciseId] = useState(null);
    const [isTestOpen, setIsTestOpen] = useState(false);

    const onAddExercise = (data) => {
        if (editingId) return;
        setExercises(prev => [...prev, { ...data, id: Date.now(), testCases: [] }]);
        resetEx();
    };

    const onEditExercise = (exercise) => {
        setEditingId(exercise.id);
        setExValue('description', exercise.description);
        setExValue('initialContent', exercise.initialContent || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSaveExerciseEdit = (data) => {
        setExercises(prev => prev.map(e => e.id === editingId ? { ...e, ...data } : e));
        setEditingId(null);
        resetEx();
    };

    const onCancelEdit = () => {
        setEditingId(null);
        resetEx();
    };

    const onRemoveExercise = (id) => {
        setExercises(prev => prev.filter(e => e.id !== id));
    };

    const openTestModal = (id) => {
        setActiveExerciseId(id);
        setIsTestOpen(true);
    };

    const closeTestModal = () => {
        setActiveExerciseId(null);
        setIsTestOpen(false);
    };

    const saveTestsForExercise = (tests) => {
        setExercises(prev => prev.map(e => e.id === activeExerciseId ? { ...e, testCases: tests } : e));
    };

    const onSubmit = async (data) => {
        const payload = {
            title: data.title,
            description: data.description,
            startTime: new Date(data.startTime).toISOString(),
            endTime: new Date(data.endTime).toISOString()
        };

        try {
            console.log('Tworzenie wyzwania z danymi:', payload, 'i zadaniami:', exercises);

            const challengeRes = await createChallenge(payload);

            const challengeId = challengeRes.data; 
            console.log('Utworzono wyzwanie:', challengeRes.data);

            for (const ex of exercises) {
                const exercisePayload = {
                    description: ex.description,
                    initialContent: ex.initialContent || ''
                };

                console.log('Tworzenie zadania z danymi:', exercisePayload, 'dla wyzwania ID:', challengeId);

                const exerciseRes = await createChallengeExercise(challengeId, exercisePayload);

                console.log('Utworzono zadanie:', exerciseRes.data);
                const exerciseId = exerciseRes.data;

                if (ex.testCases && ex.testCases.length > 0) {
                    console.log('Tworzenie testu z danymi:', ex.testCases, 'dla zadania ID:', exerciseId);
                    await createTest(ex.testCases, exerciseId);
                }
            }
            toast({
                title: 'Wyzwanie utworzone',
                description: 'Nowe wyzwanie zostało pomyślnie utworzone.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            navigate('/administrator');

        } catch (error) {
            console.error('Błąd podczas tworzenia wyzwania:', error);
            toast({
                title: 'Błąd',
                description: 'Wystąpił błąd podczas tworzenia wyzwania. Spróbuj ponownie.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box minH="100vh" py={10} bg="gray.50">
            <Container maxW="container.xl">
                <VStack spacing={6} align="stretch">
                    <Box>
                        <Heading size="lg">Nowe wyzwanie</Heading>
                        <Text color="gray.600">Utwórz nowe wyzwanie — ustaw datę rozpoczęcia i zakończenia. Dodaj zadania (exercises) i opcjonalne testy.</Text>
                    </Box>

                    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} as="form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Lewa kolumna - Podstawowe informacje */}
                        <GridItem>
                            <Box bg="white" p={6} borderRadius="lg" shadow="sm" h="full">
                                <VStack spacing={4} align="stretch">
                                    <Heading size="md" mb={2}>Podstawowe informacje</Heading>
                                    
                                    <FormControl isRequired isInvalid={!!errors.title}>
                                        <FormLabel>Tytuł</FormLabel>
                                        <Input {...register('title')} placeholder="Nazwa wyzwania" />
                                        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.description}>
                                        <FormLabel>Opis</FormLabel>
                                        <Textarea {...register('description')} placeholder="Opis wyzwania" rows={6} />
                                        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.startTime}>
                                        <FormLabel>Data rozpoczęcia</FormLabel>
                                        <Input {...register('startTime')} type="datetime-local" />
                                        {!errors.startTime ? (
                                            <FormHelperText>Wybierz datę i godzinę rozpoczęcia</FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.endTime}>
                                        <FormLabel>Data zakończenia</FormLabel>
                                        <Input {...register('endTime')} type="datetime-local" />
                                        {!errors.endTime ? (
                                            <FormHelperText>Wybierz datę i godzinę zakończenia</FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.endTime?.message || errors?.endTime?.root?.message}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </VStack>
                            </Box>
                        </GridItem>

                        {/* Prawa kolumna - Zadania */}
                        <GridItem>
                            <Box bg="white" p={6} borderRadius="lg" shadow="sm" h="full">
                                <VStack spacing={4} align="stretch">
                                    <Heading size="md" mb={2}>Zadania</Heading>
                                    
                                    <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                                        <VStack as="form" spacing={3} align="stretch" onSubmit={(e) => { e.preventDefault(); editingId ? handleSubmitEx(onSaveExerciseEdit)() : handleSubmitEx(onAddExercise)(); }}>
                                            <FormControl isRequired isInvalid={!!exErrors.description}>
                                                <FormLabel fontSize="sm">Treść zadania</FormLabel>
                                                <Textarea {...regEx('description')} placeholder="Opis zadania" rows={2} size="sm" />
                                                <FormErrorMessage>{exErrors.description?.message}</FormErrorMessage>
                                            </FormControl>
                                            
                                            <FormControl isInvalid={!!exErrors.initialContent}>
                                                <FormLabel fontSize="sm">Kod początkowy (opcjonalne)</FormLabel>
                                                <Input {...regEx('initialContent')} placeholder="Kod początkowy" size="sm" />
                                                <FormErrorMessage>{exErrors.initialContent?.message}</FormErrorMessage>
                                            </FormControl>

                                            <HStack>
                                                {editingId ? (
                                                    <>
                                                        <Button leftIcon={<CheckIcon />} colorScheme="green" size="sm" onClick={handleSubmitEx(onSaveExerciseEdit)}>Zapisz</Button>
                                                        <Button leftIcon={<CloseIcon />} variant="ghost" size="sm" onClick={onCancelEdit}>Anuluj</Button>
                                                    </>
                                                ) : (
                                                    <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm" onClick={handleSubmitEx(onAddExercise)}>Dodaj zadanie</Button>
                                                )}
                                            </HStack>
                                        </VStack>
                                    </Box>

                                    <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto" pr={2}>
                                        {exercises.length === 0 ? (
                                            <Text color="gray.500" textAlign="center" py={4}>Brak zadań. Dodaj przynajmniej jedno zadanie.</Text>
                                        ) : (
                                            exercises.map((ex) => (
                                                <Box key={ex.id} bg="gray.50" p={3} borderRadius="md" borderWidth="1px">
                                                    <VStack align="stretch" spacing={2}>
                                                        <Text fontWeight="semibold" fontSize="sm">{ex.description}</Text>
                                                        <HStack justify="space-between">
                                                            <HStack>
                                                                <Badge colorScheme="purple" fontSize="xs">Zadanie</Badge>
                                                                {ex.testCases?.length > 0 && <Badge colorScheme="orange" fontSize="xs">Testy: {ex.testCases.length}</Badge>}
                                                            </HStack>
                                                            <HStack spacing={1}>
                                                                <IconButton icon={<EditIcon />} size="xs" onClick={() => onEditExercise(ex)} aria-label="Edytuj" />
                                                                <IconButton icon={<DeleteIcon />} size="xs" colorScheme="red" variant="ghost" onClick={() => onRemoveExercise(ex.id)} aria-label="Usuń" />
                                                                <Button size="xs" onClick={() => openTestModal(ex.id)}>{ex.testCases?.length > 0 ? 'Edytuj testy' : 'Dodaj testy'}</Button>
                                                            </HStack>
                                                        </HStack>
                                                    </VStack>
                                                </Box>
                                            ))
                                        )}
                                    </VStack>
                                </VStack>
                            </Box>
                        </GridItem>

                        {/* Przycisk submit na całej szerokości */}
                        <GridItem colSpan={{ base: 1, lg: 2 }}>
                            <Button colorScheme="purple" type="submit" isLoading={isSubmitting} size="lg" w="full">
                                Utwórz wyzwanie
                            </Button>
                        </GridItem>
                    </Grid>
                </VStack>
            </Container>

            <TestModal
                isOpen={isTestOpen}
                onClose={closeTestModal}
                initialTests={exercises.find(e => e.id === activeExerciseId)?.testCases}
                onSave={saveTestsForExercise}
            />
        </Box>
    );
}