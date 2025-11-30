import {
    VStack, Box, FormControl, FormLabel, Input, HStack, Button, List, ListItem, Badge, Text, IconButton, Textarea, FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "../validationSchemas.js";

export default function CreateLessonsStep({ lessons, onAdd, onRemove }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(lessonSchema)
    });

    const onSubmit = (data) => {
        onAdd(data);
        reset();
    };

    return (
        <VStack spacing={6} align="stretch">
            <Box bg="gray.50" p={5} borderRadius="md" borderWidth="1px">
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
                    </VStack>

                    <Button leftIcon={<AddIcon />} onClick={handleSubmit(onSubmit)} colorScheme="blue" width="full">
                        Dodaj lekcję
                    </Button>
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