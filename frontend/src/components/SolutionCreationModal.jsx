import { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Select, Textarea, Box, HStack, Text,
    FormHelperText
} from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
];

export default function SolutionCreationModal({ isOpen, onClose, initialSolution, onSave }) {
    const [solution, setSolution] = useState({ code: '', explanation: '', language: 'javascript' });

    useEffect(() => {
        if (isOpen) {
            setSolution(initialSolution || { code: '', explanation: '', language: 'javascript' });
        }
    }, [isOpen, initialSolution]);

    const handleSave = () => {
        if (!solution.code || !solution.explanation) return;
        onSave(solution);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Wzorcowe rozwiązanie</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>Kod</Tab>
                            <Tab>Wyjaśnienie</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <HStack mb={4}>
                                    <Text>Język:</Text>
                                    <Select
                                        w="200px"
                                        value={solution.language}
                                        onChange={e => setSolution({ ...solution, language: e.target.value })}
                                    >
                                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                    </Select>
                                </HStack>
                                <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
                                    <Editor
                                        height="300px"
                                        language={solution.language}
                                        value={solution.code}
                                        onChange={val => setSolution({ ...solution, code: val || '' })}
                                        options={{ minimap: { enabled: false } }}
                                    />
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <FormControl isRequired>
                                    <FormLabel>Wyjaśnienie</FormLabel>
                                    <Textarea
                                        rows={12}
                                        value={solution.explanation}
                                        onChange={e => setSolution({ ...solution, explanation: e.target.value })}
                                    />
                                    <FormHelperText  color="gray.500">
                                        Pomóż zrozumieć użytkownikowi, dlaczego to rozwiązanie jest poprawne
                                    </FormHelperText>
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Anuluj</Button>
                    <Button colorScheme="yellow" onClick={handleSave}>Zapisz rozwiązanie</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}