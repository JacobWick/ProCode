import {
    VStack, Box, FormControl, FormLabel, Input, HStack, Button, List, ListItem, Badge, Text, IconButton, Textarea, FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import {useState} from "react";
import { AddIcon, DeleteIcon, EditIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "../validationSchemas.js";


export default function LessonsStep({ lessons, onAdd, onRemove, onUpdate}) {
    const [editingId, setEditingId] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(lessonSchema)
    });
    const handleEditClick = (lesson) => {
        setEditingId(lesson.id);
        setValue("title", lesson.title);
        setValue("description", lesson.description);
        setValue("videoUri", lesson.videoUri || "");
        setValue("textUri", lesson.textUri || "");

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };
    const onSubmit = (data) => {
        if (editingId) {
            onUpdate({ ...data, id: editingId });
            setEditingId(null);
        } else {
            onAdd(data);
        }
        reset();
    };

    return (
        <VStack spacing={6} align="stretch">
            <Box bg={editingId ? "orange.50" : "gray.50"}
                 p={5}
                 borderRadius="md"
                 borderWidth="1px">
                {editingId && (
                    <Text mb={4} fontWeight="bold" color="orange.600">
                        Edytujesz lekcję
                    </Text>
                )}
                <VStack spacing={4} align="stretch" mb={6} as="form">

                    <FormControl isRequired isInvalid={!!errors.title}>
                        <FormLabel>Tytuł lekcji</FormLabel>
                        <Input
                            {...register("title")}
                            placeholder="Tytuł lekcji"
                            bg="white"
                        />
                        <FormHelperText color="gray.500">
                            Zdefiniuj główny temat lekcji. Jaką konkretną umiejętność zdobędzie kursant po jej ukończeniu?
                        </FormHelperText>
                        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                    </FormControl>

                    <VStack width="full" align="stretch" mb={7}>
                        <FormControl isRequired isInvalid={!!errors.description}>
                            <FormLabel>Opis lekcji</FormLabel>
                            <Textarea
                                {...register("description")}
                                placeholder="Wprowadź w zagadnienie"
                                rows={6}
                                bg="white"
                            />
                            <FormHelperText color="gray.500">
                                Wprowadź kursanta w teorię. Wyjaśnij zagadnienie prostym językiem, podając definicję lub kontekst użycia.
                            </FormHelperText>
                            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                            <FormHelperText color="gray.500">Minimum 10 znaków</FormHelperText>
                        </FormControl>

                        <FormControl isInvalid={!!errors.videoUri}>
                            <FormLabel>Link do filmu (opcjonalne)</FormLabel>
                            <Input
                                {...register("videoUri")}
                                placeholder="https://example.com"
                                bg="white"
                            />
                            <FormHelperText color="gray.500">
                                Wzbogać lekcję o materiał wideo. Wizualne przykłady znacznie przyspieszają proces zrozumienia trudnych tematów.
                            </FormHelperText>
                            {errors.videoUri ?
                                <FormErrorMessage>{errors.videoUri.message}</FormErrorMessage> :
                                <FormHelperText color="gray.500">Musi zaczynać się od http/https</FormHelperText>
                            }
                        </FormControl>
                        <FormControl isInvalid={!!errors.textUri}>
                            <FormLabel>Link do tekstu (opcjonalne)</FormLabel>
                            <Input
                                {...register("textUri")}
                                placeholder="https://example.com"
                                bg="white"
                            />
                            <FormHelperText color="gray.500">
                                Wskaż źródła zewnętrzne (dokumentacja, artykuły). Pozwól ambitnym uczestnikom zgłębić temat we własnym zakresie.
                            </FormHelperText>
                            {errors.textUri ?
                                <FormErrorMessage>{errors.textUri.message}</FormErrorMessage> :
                                <FormHelperText color="gray.500">Musi zaczynać się od http/https</FormHelperText>
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
                                colorScheme={editingId ? "orange" : "blue"}
                                width={editingId ? "50%" : "full"}
                            >
                                {editingId ? "Zapisz zmiany" : "Dodaj lekcję"}
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </Box>

            <List spacing={3}>
                {lessons.map((lesson, index) => (
                    <ListItem
                        key={lesson.id}
                        bg={editingId === lesson.id ? "orange.100" : "blue.50"}
                        p={3}
                        borderRadius="md"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderWidth={editingId === lesson.id ? "2px" : "0px"}
                        borderColor="orange.300"
                    >
                        <HStack>
                            <Badge colorScheme="blue" borderRadius="full" px={2}>{index + 1}</Badge>
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">{lesson.title}</Text>
                                {lesson.isNew && <Badge colorScheme="green" fontSize="0.6em">NOWA</Badge>}
                            </VStack>
                        </HStack>
                        <HStack>
                            <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="gray"
                                aria-label="Edytuj"
                                onClick={() => handleEditClick(lesson)}
                            />
                            <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Usuń"
                                onClick={() => onRemove(lesson.id)}
                                isDisabled={!!editingId}
                            />
                        </HStack>
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
}