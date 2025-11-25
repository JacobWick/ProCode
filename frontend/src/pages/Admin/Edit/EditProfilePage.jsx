import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    useColorModeValue,
    useToast,
    HStack,
    Text,
    Spinner,
    Flex,
} from '@chakra-ui/react';
import { getMyProfile, editProfile } from '../../../api.js';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        websiteLink: '',
        githubLink: '',
        linkedinLink: '',
    });

    const toast = useToast();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await getMyProfile();
            const profile = response.data;
            
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                bio: profile.bio || '',
                websiteLink: profile.website || '',
                githubLink: profile.gitHubLink || '',
                linkedinLink: profile.linkedinLink || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: 'Błąd',
                description: 'Nie udało się pobrać danych profilu',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const dataToSend = {};
            
            if (formData.firstName.trim()) dataToSend.firstName = formData.firstName.trim();
            if (formData.lastName.trim()) dataToSend.lastName = formData.lastName.trim();
            dataToSend.bio = formData.bio.trim();
            if (formData.websiteLink.trim()) dataToSend.websiteLink = formData.websiteLink.trim();
            if (formData.githubLink.trim()) dataToSend.githubLink = formData.githubLink.trim();
            if (formData.linkedinLink.trim()) dataToSend.linkedinLink = formData.linkedinLink.trim();

            console.log('Sending data:', dataToSend);

            const response = await editProfile(dataToSend);
            
            toast({
                title: 'Sukces!',
                description: 'Profil został zaktualizowany',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            

            navigate('/my-profile');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Błąd',
                description: 'Nie udało się zaktualizować profilu',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text>Ładowanie danych profilu...</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box minH="100vh" bg={bgColor} py={12}>
            <Container maxW="container.md">
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <Box>
                        <Heading size="xl" mb={2}>Edytuj profil</Heading>
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                            Aktualizuj swoje dane osobowe i linki do profili społecznościowych
                        </Text>
                    </Box>

                    {/* Form */}
                    <Box
                        as="form"
                        onSubmit={handleSubmit}
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack spacing={6} align="stretch">
                            {/* Imię i Nazwisko */}
                            <HStack spacing={4} align="start">
                                <FormControl>
                                    <FormLabel>Imię</FormLabel>
                                    <Input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Wprowadź imię"
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Nazwisko</FormLabel>
                                    <Input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Wprowadź nazwisko"
                                        size="lg"
                                    />
                                </FormControl>
                            </HStack>

                            {/* Bio */}
                            <FormControl>
                                <FormLabel>O mnie</FormLabel>
                                <Textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Opowiedz coś o sobie..."
                                    size="lg"
                                    rows={5}
                                    resize="vertical"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {formData.bio.length} znaków
                                </Text>
                            </FormControl>

                            {/* Divider */}
                            <Box borderTop="1px" borderColor={borderColor} pt={6}>
                                <Heading size="sm" mb={4}>Linki społecznościowe</Heading>
                                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mb={4}>
                                    Dodaj linki do swoich profili (opcjonalne)
                                </Text>
                            </Box>

                            {/* Website */}
                            <FormControl>
                                <FormLabel>🌐 Strona internetowa</FormLabel>
                                <Input
                                    name="websiteLink"
                                    type="url"
                                    value={formData.websiteLink}
                                    onChange={handleChange}
                                    placeholder="https://twoja-strona.pl"
                                    size="lg"
                                />
                            </FormControl>

                            {/* GitHub */}
                            <FormControl>
                                <FormLabel>GitHub</FormLabel>
                                <Input
                                    name="githubLink"
                                    type="url"
                                    value={formData.githubLink}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                    size="lg"
                                />
                            </FormControl>

                            {/* LinkedIn */}
                            <FormControl>
                                <FormLabel>LinkedIn</FormLabel>
                                <Input
                                    name="linkedinLink"
                                    type="url"
                                    value={formData.linkedinLink}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                    size="lg"
                                />
                            </FormControl>

                            {/* Buttons */}
                            <HStack spacing={4} pt={4}>
                                <Button
                                    type="submit"
                                    colorScheme="purple"
                                    size="lg"
                                    isLoading={saving}
                                    loadingText="Zapisywanie..."
                                    flex={1}
                                >
                                    Zapisz zmiany
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleCancel}
                                    isDisabled={saving}
                                >
                                    Anuluj
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Info box */}
                    <Box
                        bg={useColorModeValue('purple.50', 'purple.900')}
                        p={4}
                        borderRadius="md"
                        borderLeft="4px solid"
                        borderColor="purple.500"
                    >
                        <Text fontSize="sm" color={useColorModeValue('purple.800', 'purple.100')}>
                            💡 <strong>Wskazówka:</strong> Pozostaw pole puste, jeśli nie chcesz aktualizować danej informacji
                        </Text>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default EditProfile;