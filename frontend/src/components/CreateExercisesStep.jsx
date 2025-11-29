import { useState } from 'react';
import {
    VStack,
    Box,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Input,
    Button,
    Divider,
    Stack,
    HStack,
    Badge,
    Text,
    IconButton,
    Tag,
    FormHelperText
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CheckIcon, SettingsIcon, EditIcon } from '@chakra-ui/icons';

export default function CreateExercisesStep({ lessons, exercises, onAdd, onRemove, onOpenTest, onOpenSolution }) {
    const [form, setForm] = useState({ description: '', initialContent: '', lessonIndex: '' });

    const handleAdd = () => {
        if (!form.description || form.lessonIndex === '') return;
        onAdd(form);
        setForm({ description: '', initialContent: '', lessonIndex: '' });
    };

    if (lessons.length === 0) return <Text color="red.500">Najpierw dodaj lekcje w poprzednim kroku.</Text>;

    return (
        <VStack spacing={6} align="stretch">
            <Box bg="gray.50" p={5} borderRadius="md" borderWidth="1px">
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Wybierz lekcję</FormLabel>
                        <Select placeholder="---" value={form.lessonIndex} onChange={e => setForm({...form, lessonIndex: e.target.value})} bg="white">
                            {lessons.map((l, i) => <option key={l.id} value={i}>{l.title}</option>)}
                        </Select>
                        <FormHelperText  color="gray.500">
                            Do której lekcji chcesz dodać zadanie? Nie każda lekcja wymaga sprawdzenia wiedzy użytkownika
                        </FormHelperText>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Treść zadania</FormLabel>
                        <Textarea placeholder="Na przykład: Napisz funkcję, która zwróci sumę dwóch liczb całkowitych"
                                  value={form.description}
                                  onChange={e => setForm({...form, description: e.target.value})}
                                  bg="white"
                        />
                        <FormHelperText  color="gray.500">
                            Jakie zadanie sprawdzi, czy użytkownik nabył wiedzę, o której była lekcja?
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            Kod początkowy (opcjonalne)
                        </FormLabel>
                        <Input
                            placeholder="Suma liczb 2 i 4 jest równa 6"
                            value={form.initialContent}
                            onChange={e => setForm({...form, initialContent: e.target.value})}
                            bg="white" />
                        <FormHelperText  color="gray.500">
                            Kod początkowy pokaże się w edytorze kodu, gdy kursant rozpocznie zadanie - wskaż czego ma szukać np. "Suma liczb 2 i 4 jest równa 6"
                        </FormHelperText>
                    </FormControl>
                    <Button leftIcon={<AddIcon />} onClick={handleAdd} colorScheme="green" width="full">Dodaj zadanie</Button>
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
                            <Button
                                size="sm"
                                leftIcon={exercise.testCases?.length > 0 ? <CheckIcon /> : <SettingsIcon />}
                                colorScheme={exercise.testCases?.length > 0 ? "orange" : "gray"}
                                variant="outline"
                                onClick={() => onOpenTest(exercise.id)}
                            >
                                {exercise.testCases?.length > 0 ? `Testy (${exercise.testCases.length})` : "Dodaj dane testowe"}
                            </Button>

                            <Button
                                size="sm"
                                leftIcon={exercise.solution ? <CheckIcon /> : <EditIcon />}
                                colorScheme={exercise.solution ? "yellow" : "gray"}
                                variant="outline"
                                onClick={() => onOpenSolution(exercise.id)}
                            >
                                {exercise.solution ? "Rozwiązanie dodane" : "Dodaj rozwiązanie"}
                            </Button>
                        </HStack>
                    </Box>
                ))}
            </Stack>
        </VStack>
    );
}