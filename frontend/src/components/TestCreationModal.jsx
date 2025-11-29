import { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, VStack, HStack, FormControl, FormLabel, Input, IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

export default function TestCreationModal({ isOpen, onClose, initialTests, onSave }) {
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setTestCases(initialTests?.length > 0 ? initialTests : [{ input: '', output: '' }]);
        }
    }, [isOpen, initialTests]);

    const handleSave = () => {
        if (testCases.some(tc => !tc.input || !tc.output)) return;
        onSave(testCases);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Konfiguracja testów</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        {testCases.map((tc, idx) => (
                            <HStack key={idx} align="flex-end" w="full">
                                <FormControl>
                                    <FormLabel fontSize="xs">Dane wejściowe</FormLabel>
                                    <Input
                                        value={tc.input}
                                        onChange={e => {
                                            const newArr = [...testCases];
                                            newArr[idx].input = e.target.value;
                                            setTestCases(newArr);
                                        }}
                                        fontFamily="monospace"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="xs">Dane wyjściowe</FormLabel>
                                    <Input
                                        value={tc.output}
                                        onChange={e => {
                                            const newArr = [...testCases];
                                            newArr[idx].output = e.target.value;
                                            setTestCases(newArr);
                                        }}
                                        fontFamily="monospace"
                                    />
                                </FormControl>
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red" variant="ghost"
                                    onClick={() => setTestCases(prev => prev.filter((_, i) => i !== idx))}
                                    isDisabled={testCases.length === 1}
                                />
                            </HStack>
                        ))}
                        <Button size="sm" leftIcon={<AddIcon />} onClick={() => setTestCases([...testCases, { input: '', output: '' }])}>
                            Dodaj przypadek
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Anuluj</Button>
                    <Button colorScheme="orange" onClick={handleSave}>Zapisz testy</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}