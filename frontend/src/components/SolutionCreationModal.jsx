import { useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Select, Textarea, Box, HStack, Text,
    FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { solutionSchema } from "../validationSchemas.js";

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
];

export default function SolutionCreationModal({ isOpen, onClose, initialSolution, onSave }) {

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(solutionSchema),
        defaultValues: {
            code: '',
            explanation: '',
            language: 'javascript'
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialSolution || { code: '', explanation: '', language: 'javascript' });
        }
    }, [isOpen, initialSolution, reset]);

    const onSubmit = (data) => {
        onSave(data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Wzorcowe rozwiązanie</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs isLazy>
                        <TabList>
                            <Tab>Kod <Text as="span" color="red.500" ml={1}>*</Text></Tab>
                            <Tab>Wyjaśnienie <Text as="span" color="red.500" ml={1}>*</Text></Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <HStack mb={4}>
                                    <Text>Język:</Text>
                                    <Select w="200px" {...register("language")}>
                                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                    </Select>
                                </HStack>

                                <FormControl isInvalid={!!errors.code}>
                                    <Box border="1px solid" borderColor={errors.code ? "red.300" : "gray.200"} borderRadius="md" overflow="hidden">
                                        <Controller
                                            name="code"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Editor
                                                    height="300px"
                                                    language="javascript"
                                                    value={value}
                                                    onChange={onChange}
                                                    options={{ minimap: { enabled: false } }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
                                </FormControl>
                            </TabPanel>

                            <TabPanel>
                                <FormControl isRequired isInvalid={!!errors.explanation}>
                                    <FormLabel>Wyjaśnienie</FormLabel>
                                    <Textarea
                                        {...register("explanation")}
                                        rows={12}
                                        placeholder="Wytłumacz dlaczego to rozwiązanie działa..."
                                    />
                                    {errors.explanation ?
                                        <FormErrorMessage>{errors.explanation.message}</FormErrorMessage> :
                                        <FormHelperText>Minimum 10 znaków.</FormHelperText>
                                    }
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Anuluj</Button>
                    <Button type="submit" colorScheme="yellow">Zapisz rozwiązanie</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}