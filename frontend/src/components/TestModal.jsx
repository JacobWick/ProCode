import { useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, VStack, HStack, FormControl, FormLabel, Input, IconButton, Box, Select
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
            testCases: [{ 
                inputs: [{ varName: '', value: '', type: 'int' }],
                outputs: [{ varName: '', value: '', type: 'int' }]
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "testCases"
    });

    useEffect(() => {
        if (isOpen) {
            const values = (initialTests && initialTests.length > 0)
                ? initialTests.map(t => ({ 
                    inputs: Array.isArray(t.inputs) ? t.inputs : [{ varName: '', value: '', type: 'int' }],
                    outputs: Array.isArray(t.outputs) ? t.outputs : [{ varName: '', value: '', type: 'int' }]
                }))
                : [{ 
                    inputs: [{ varName: '', value: '', type: 'int' }],
                    outputs: [{ varName: '', value: '', type: 'int' }]
                }];
            reset({ testCases: values });
        }
    }, [isOpen, initialTests, reset]);

    const onSubmit = (data) => {
        onSave(data.testCases);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Konfiguracja testów</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6}>
                        {errors.testCases?.root && (
                            <Box color="red.500" fontSize="sm">{errors.testCases.root.message}</Box>
                        )}

                        {fields.map((field, caseIndex) => (
                            <Box key={field.id} w="full" p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between">
                                        <FormLabel fontSize="sm" fontWeight="bold" m={0}>Przypadek testowy #{caseIndex + 1}</FormLabel>
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(caseIndex)}
                                            isDisabled={fields.length === 1}
                                        />
                                    </HStack>

                                    {/* INPUT VARIABLES */}
                                    <Box bg="blue.50" p={3} borderRadius="md">
                                        <FormLabel fontSize="xs" fontWeight="bold" color="blue.700" mb={3}>📥 Zmienne wejściowe (Input)</FormLabel>
                                        <InputVariables control={control} caseIndex={caseIndex} register={register} />
                                    </Box>

                                    {/* OUTPUT VARIABLES */}
                                    <Box bg="green.50" p={3} borderRadius="md">
                                        <FormLabel fontSize="xs" fontWeight="bold" color="green.700" mb={3}>📤 Zmienne wyjściowe (Output)</FormLabel>
                                        <OutputVariables control={control} caseIndex={caseIndex} register={register} />
                                    </Box>
                                </VStack>
                            </Box>
                        ))}

                        <Button
                            size="sm"
                            leftIcon={<AddIcon />}
                            onClick={() => append({ 
                                inputs: [{ varName: '', value: '', type: 'int' }],
                                outputs: [{ varName: '', value: '', type: 'int' }]
                            })}
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

function InputVariables({ control, caseIndex, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `testCases.${caseIndex}.inputs`
    });

    return (
        <VStack spacing={2} align="stretch">
            {fields.map((field, varIndex) => (
                <HStack key={field.id} spacing={2}>
                    <FormControl flex={1}>
                        <Input
                            {...register(`testCases.${caseIndex}.inputs.${varIndex}.varName`)}
                            placeholder="nazwa zmiennej"
                            size="sm"
                        />
                    </FormControl>
                    <FormControl flex={1}>
                        <Input
                            {...register(`testCases.${caseIndex}.inputs.${varIndex}.value`)}
                            placeholder="wartość"
                            size="sm"
                        />
                    </FormControl>
                    <FormControl w="100px">
                        <Select {...register(`testCases.${caseIndex}.inputs.${varIndex}.type`)} size="sm">
                            <option value="int">int</option>
                            <option value="string">string</option>
                            <option value="float">float</option>
                            <option value="bool">bool</option>
                        </Select>
                    </FormControl>
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(varIndex)}
                        isDisabled={fields.length === 1}
                    />
                </HStack>
            ))}
            <Button
                size="xs"
                leftIcon={<AddIcon />}
                onClick={() => append({ varName: '', value: '', type: 'int' })}
                variant="ghost"
            >
                Dodaj zmienną wejściową
            </Button>
        </VStack>
    );
}

function OutputVariables({ control, caseIndex, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `testCases.${caseIndex}.outputs`
    });

    return (
        <VStack spacing={2} align="stretch">
            {fields.map((field, varIndex) => (
                <HStack key={field.id} spacing={2}>
                    <FormControl flex={1}>
                        <Input
                            {...register(`testCases.${caseIndex}.outputs.${varIndex}.varName`)}
                            placeholder="nazwa zmiennej"
                            size="sm"
                        />
                    </FormControl>
                    <FormControl flex={1}>
                        <Input
                            {...register(`testCases.${caseIndex}.outputs.${varIndex}.value`)}
                            placeholder="wartość"
                            size="sm"
                        />
                    </FormControl>
                    <FormControl w="100px">
                        <Select {...register(`testCases.${caseIndex}.outputs.${varIndex}.type`)} size="sm">
                            <option value="int">int</option>
                            <option value="string">string</option>
                            <option value="float">float</option>
                            <option value="bool">bool</option>
                        </Select>
                    </FormControl>
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(varIndex)}
                        isDisabled={fields.length === 1}
                    />
                </HStack>
            ))}
            <Button
                size="xs"
                leftIcon={<AddIcon />}
                onClick={() => append({ varName: '', value: '', type: 'int' })}
                variant="ghost"
            >
                Dodaj zmienną wyjściową
            </Button>
        </VStack>
    );
}
