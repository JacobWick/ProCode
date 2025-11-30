import {
    VStack, Box, FormControl, FormLabel, Select, Textarea, Input, Button, Divider, Stack, HStack, Badge, Text, IconButton, FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CheckIcon, SettingsIcon, EditIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "../validationSchemas.js";

export default function CreateExercisesStep({ lessons, exercises, onAdd, onRemove, onOpenTest, onOpenSolution }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(exerciseSchema)
    });

    const onSubmit = (data) => {
        onAdd(data);
        reset();
    };

    if (lessons.length === 0) return <Text color="red.500">Najpierw dodaj lekcje w poprzednim kroku.</Text>;

    return (
        <VStack spacing={6} align="stretch">
            <Box bg="gray.50" p={5} borderRadius="md" borderWidth="1px">
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

                    <Button leftIcon={<AddIcon />} onClick={handleSubmit(onSubmit)} colorScheme="green" width="full">
                        Dodaj zadanie
                    </Button>
                </VStack>
            </Box>

            <Stack spacing={4}>
                {exercises.map((exercise) => (
                    <Box key={exercise.id} bg="white" p={4} borderRadius="lg" borderWidth="1px" boxShadow="sm">
                        <HStack justify="space-between" align="start" mb={3}>
                            <VStack align="start" spacing={1}>
                                <Badge colorScheme="purple">{exercise.lessonTitle}</Badge>
                                <Text fontWeight="semibold">{exercise.description}</Text>
                            </VStack>
                            <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => onRemove(exercise.id)} />
                        </HStack>
                        <Divider my={2} />
                        <HStack spacing={4}>
                            <Button size="sm" leftIcon={exercise.testCases?.length > 0 ? <CheckIcon /> : <SettingsIcon />} colorScheme={exercise.testCases?.length > 0 ? "orange" : "gray"} variant="outline" onClick={() => onOpenTest(exercise.id)}>
                                {exercise.testCases?.length > 0 ? `Testy (${exercise.testCases.length})` : "Dodaj dane testowe"}
                            </Button>
                            <Button size="sm" leftIcon={exercise.solution ? <CheckIcon /> : <EditIcon />} colorScheme={exercise.solution ? "yellow" : "gray"} variant="outline" onClick={() => onOpenSolution(exercise.id)}>
                                {exercise.solution ? "Rozwiązanie dodane" : "Dodaj rozwiązanie"}
                            </Button>
                        </HStack>
                    </Box>
                ))}
            </Stack>
        </VStack>
    );
}