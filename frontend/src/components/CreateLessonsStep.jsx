import { useState } from 'react';
import {
    VStack,
    Box,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Button,
    List,
    ListItem,
    Badge,
    Text,
    IconButton,
    Textarea, FormHelperText
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

export default function CreateLessonsStep({ lessons, onAdd, onRemove }) {
    const [form, setForm] = useState({ title: '', videoUri: '', textUri: '' });

    const handleAdd = () => {
        if (!form.title) return;
        onAdd(form);
        setForm({ title: '', description: '', videoUri: '', textUri: '' });
    };

    return (
        <VStack spacing={6} align="stretch">
            <Box bg="gray.50" p={5} borderRadius="md" borderWidth="1px">
                <VStack spacing={4} align="stretch" mb={6}>
                    <FormControl isRequired>
                        <FormLabel>Tytuł lekcji</FormLabel>
                        <Input
                            name="title"
                            placeholder="Tytuł lekcji"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            bg="white"
                        />
                        <FormHelperText color="gray.500">
                            Zdefiniuj główny temat lekcji. Jaką konkretną umiejętność zdobędzie kursant po jej ukończeniu?
                        </FormHelperText>
                    </FormControl>
                    <VStack width="full" align="stretch" mb={7}>
                        <FormControl isRequired>
                            <FormLabel>Opis lekcji</FormLabel>
                            <Textarea
                                name="description"
                                placeholder="Wprowadź w zagadnienie"
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                rows={6} />
                            <FormHelperText color="gray.500">
                                Wprowadź kursanta w teorię. Wyjaśnij zagadnienie prostym językiem, podając definicję lub kontekst użycia.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>
                                Link do filmu (opcjonalne)
                            </FormLabel>
                            <Input
                                name="videoUri"
                                placeholder="https://example.com"
                                value={form.videoUri}
                                onChange={e => setForm({...form, videoUri: e.target.value})}
                                bg="white"
                            />
                            <FormHelperText color="gray.500">
                                Wzbogać lekcję o materiał wideo. Wizualne przykłady znacznie przyspieszają proces zrozumienia trudnych tematów.
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>
                                Link do tekstu (opcjonalne)
                            </FormLabel>
                            <Input
                                name="textUri"
                                placeholder="https://example.com"
                                value={form.textUri}
                                onChange={e => setForm({...form, textUri: e.target.value})}
                                bg="white"
                            />
                            <FormHelperText color="gray.500">
                                Wskaż źródła zewnętrzne (dokumentacja, artykuły). Pozwól ambitnym uczestnikom zgłębić temat we własnym zakresie.
                            </FormHelperText>
                        </FormControl>
                    </VStack>
                    <Button leftIcon={<AddIcon />} onClick={handleAdd} colorScheme="blue" width="full">Dodaj lekcję</Button>
                </VStack>
            </Box>

            <List spacing={3}>
                {lessons.map((lesson, index) => (
                    <ListItem key={lesson.id} bg="blue.50" p={3} borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                        <HStack>
                            <Badge colorScheme="blue" borderRadius="full" px={2}>{index + 1}</Badge>
                            <Text fontWeight="bold">{lesson.title}</Text>
                        </HStack>
                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => onRemove(lesson.id)} />
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
}