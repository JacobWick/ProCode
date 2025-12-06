import { useState } from 'react';
import {
    VStack, Box, FormControl, FormLabel, Select, Textarea, Input, Button, Divider, Stack, HStack, Badge, Text, IconButton, FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CheckIcon, SettingsIcon, EditIcon, CloseIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "../validationSchemas.js";

export default function ExercisesStep({ lessons, exercises, onAdd, onRemove, onUpdate, onOpenTest, onOpenSolution }) {
    const [editingId, setEditingId] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(exerciseSchema)
    });

    const onSubmit = (data) => {
        const selectedLesson = lessons[data.lessonIndex];
        const enrichedData = {
            ...data,
            lessonId: selectedLesson.id,
            lessonTitle: selectedLesson.title
        };

        if (editingId) {
            onUpdate({ ...enrichedData, id: editingId });
            setEditingId(null);
        } else {
            onAdd(enrichedData);
        }
        reset();
    };
    const handleEditClick = (exercise) => {
        setEditingId(exercise.id);

        setValue("lessonIndex", exercise.lessonIndex.toString());
        setValue("description", exercise.description);
        setValue("initialContent", exercise.initialContent || "");

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };
    if (lessons.length === 0) return <Text color="red.500">Najpierw dodaj lekcje w poprzednim kroku.</Text>;

    return (
        <VStack spacing={6} align="stretch">
            <Box bg={editingId ? "green.50" : "gray.50"} p={5} borderRadius="md" borderWidth="1px">
                {editingId && (
                    <Text mb={4} fontWeight="bold" color="green.700">Edytujesz zadanie</Text>
                )}
                <VStack spacing={4} as="form">
                    <FormControl isRequired isInvalid={!!errors.lessonIndex}>
                        <FormLabel>Wybierz lekcję</FormLabel>
                        <Select
                            {...register("lessonIndex")}
                            placeholder="---"
                            bg="white"
                        >
                            {lessons.map((l, i) => <option key={l.id} value={i}>{l.title}</option>)}
                        </Select>
                        <FormHelperText color="gray.500">
                            Do której lekcji chcesz dodać zadanie? Nie każda lekcja wymaga sprawdzenia wiedzy użytkownika
                        </FormHelperText>
                        <FormErrorMessage>{errors.lessonIndex?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.description}>
                        <FormLabel>Treść zadania</FormLabel>
                        <Textarea
                            {...register("description")}
                            placeholder="Na przykład: Napisz funkcję, która zwróci sumę dwóch liczb całkowitych"
                            bg="white"
                        />
                        <FormHelperText color="gray.500">
                            Jakie zadanie sprawdzi, czy użytkownik nabył wiedzę, o której była lekcja?
                        </FormHelperText>
                        {errors.description ?
                            <FormErrorMessage>{errors.description.message}</FormErrorMessage> :
                            <FormHelperText color="gray.500">Minimum 20 znaków</FormHelperText>
                        }
                    </FormControl>

                    <FormControl isInvalid={!!errors.initialContent}>
                        <FormLabel>Kod początkowy (opcjonalne)</FormLabel>
                        <Input
                            {...register("initialContent")}
                            placeholder="Suma liczb 2 i 4 jest równa 6"
                            bg="white"
                        />
                        <FormHelperText color="gray.500">
                            Kod początkowy pokaże się w edytorze kodu, gdy kursant rozpocznie zadanie - wskaż czego ma szukać np. "Suma liczb 2 i 4 jest równa 6"
                        </FormHelperText>
                        {errors.initialContent ?
                            <FormErrorMessage>{errors.initialContent.message}</FormErrorMessage> :
                            <FormHelperText color="gray.500">Minimum 10 znaków</FormHelperText>
                        }
                    </FormControl>

                    <HStack>
                        {editingId && (
                            <Button leftIcon={<CloseIcon />} onClick={cancelEdit} variant="ghost" width="50%">
                                Anuluj
                            </Button>
                        )}
                        <Button
                            leftIcon={editingId ? <CheckIcon /> : <AddIcon />}
                            onClick={handleSubmit(onSubmit)}
                            colorScheme={editingId ? "green" : "blue"}
                            width={editingId ? "50%" : "full"}
                        >
                            {editingId ? "Zapisz zmiany" : "Dodaj zadanie"}
                        </Button>
                    </HStack>
                </VStack>
            </Box>

            <Stack spacing={4}>
                {exercises.map((exercise) => {
                    // --- LOGIKA STANU (NOWOŚĆ) ---
                    const hasTests = exercise.testCases && exercise.testCases.length > 0;
                    const hasSolution = !!exercise.solution;
                    // -----------------------------

                    return (
                        <Box
                            key={exercise.id}
                            bg={editingId === exercise.id ? "green.50" : "white"} // Podświetlenie edytowanego
                            p={4}
                            borderRadius="lg"
                            borderWidth={editingId === exercise.id ? "2px" : "1px"}
                            borderColor={editingId === exercise.id ? "green.400" : "gray.200"}
                            boxShadow="sm"
                        >
                            <HStack justify="space-between" align="start" mb={3}>
                                <VStack align="start" spacing={1}>
                                    <HStack>
                                        <Badge colorScheme="purple">{exercise.lessonTitle}</Badge>
                                        {/* Badge informacyjne */}
                                        {exercise.isNew && <Badge colorScheme="green">NOWE</Badge>}
                                        {hasTests && <Badge colorScheme="orange" variant="subtle">Testy: {exercise.testCases.length}</Badge>}
                                        {hasSolution && <Badge colorScheme="yellow" variant="subtle">Rozwiązanie</Badge>}
                                    </HStack>
                                    <Text fontWeight="semibold">{exercise.description}</Text>
                                </VStack>
                                <HStack>
                                    <IconButton
                                        icon={<EditIcon />}
                                        size="sm"
                                        onClick={() => handleEditClick(exercise)}
                                        aria-label="Edytuj"
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => onRemove(exercise.id)}
                                        aria-label="Usuń"
                                        isDisabled={!!editingId}
                                    />
                                </HStack>
                            </HStack>
                            <Divider my={2} />
                            <HStack spacing={4}>

                                <Button
                                    size="sm"
                                    leftIcon={hasTests ? <CheckIcon /> : <SettingsIcon />}
                                    colorScheme={hasTests ? "orange" : "gray"}
                                    variant={hasTests ? "solid" : "outline"}
                                    onClick={() => onOpenTest(exercise.id)}
                                >
                                    {hasTests ? `Edytuj testy (${exercise.testCases.length})` : "Skonfiguruj testy"}
                                </Button>

                                {/* Przycisk ROZWIĄZANIE - zmienia wygląd jeśli jest rozwiązanie */}
                                <Button
                                    size="sm"
                                    leftIcon={hasSolution ? <CheckIcon /> : <EditIcon />}
                                    colorScheme={hasSolution ? "yellow" : "gray"}
                                    variant={hasSolution ? "solid" : "outline"}
                                    onClick={() => onOpenSolution(exercise.id)}
                                >
                                    {hasSolution ? "Edytuj rozwiązanie" : "Dodaj rozwiązanie"}
                                </Button>
                            </HStack>
                        </Box>
                    );
                })}
            </Stack>
        </VStack>
    );
}