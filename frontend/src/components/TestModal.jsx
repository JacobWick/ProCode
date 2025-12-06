import { useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, VStack, HStack, FormControl, FormLabel, Input, IconButton, FormErrorMessage, Box, FormHelperText
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema } from "../validationSchemas.js";

export default function TestModal({ isOpen, onClose, initialTests, onSave }) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(testSchema),
        defaultValues: {
            testCases: [{ input: '', output: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "testCases"
    });

    useEffect(() => {
        if (isOpen) {
            const values = (initialTests && initialTests.length > 0)
                ? initialTests.map(t => ({ input: t.input ?? '', output: t.output ?? '' }))
                : [{ input: '', output: '' }];
            reset({ testCases: values });
        }
    }, [isOpen, initialTests, reset]);

    const onSubmit = (data) => {
        onSave(data.testCases);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Konfiguracja testów</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        {errors.testCases?.root && (
                            <Box color="red.500" fontSize="sm">{errors.testCases.root.message}</Box>
                        )}

                        {fields.map((field, index) => (
                            <HStack key={field.id} align="flex-start" w="full">
                                <FormControl isInvalid={!!errors.testCases?.[index]?.input}>
                                    <FormLabel fontSize="xs">Dane wejściowe</FormLabel>
                                    <Input
                                        {...register(`testCases.${index}.input`)}
                                        fontFamily="monospace"
                                        placeholder="np. '2 2'"
                                    />
                                    <FormHelperText color="gray.500">Dane wejściowe zostaną podane dla programu do uruchomienia wraz z kodem użytkownika</FormHelperText>
                                    <FormErrorMessage>
                                        {errors.testCases?.[index]?.input?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.testCases?.[index]?.output}>
                                    <FormLabel fontSize="xs">Oczekiwany wynik</FormLabel>
                                    <Input
                                        {...register(`testCases.${index}.output`)}
                                        fontFamily="monospace"
                                        placeholder="np. '4'"
                                    />
                                    <FormHelperText color="gray.500">Dane wyjściowe będą porównane z wynikiem działania kodu użytkownika, w celu ustalenia poprawności rozwiązania</FormHelperText>
                                    <FormErrorMessage>
                                        {errors.testCases?.[index]?.output?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <Box pt={7}>
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => remove(index)}
                                    />
                                </Box>
                            </HStack>
                        ))}

                        <Button
                            size="sm"
                            leftIcon={<AddIcon />}
                            onClick={() => append({ input: '', output: '' })}
                            width="full"
                            variant="dashed"
                            border="1px dashed gray"
                        >
                            Dodaj kolejny przypadek testowy
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Anuluj</Button>
                    <Button type="submit" colorScheme="orange">Zapisz testy</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}