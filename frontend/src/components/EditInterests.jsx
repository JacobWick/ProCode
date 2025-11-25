import { 
    Box,
    Button, 
    Heading, 
    Tag, 
    TagLabel, 
    TagCloseButton,
    Wrap,
    WrapItem,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getAllTags, getUserTags, updateUserTags } from "../api.js";


const EditInterests = () => {
    const toast = useToast();
    const [userTags, setUserTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const hoverBg = useColorModeValue('purple.50', 'gray.700');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const userTagsResponse = await getUserTags();
                setUserTags(userTagsResponse.data.tags);
                const allTagsResponse = await getAllTags();
                setAvailableTags(allTagsResponse.data?.items);
            } catch (error) {
                console.error("Błąd podczas pobierania tagów:", error);
            }
        };

        fetchTags();
    }, []);

    const handleRemoveTag = (tagId) => {
        setUserTags(userTags.filter(tag => tag.id !== tagId));
    };

    const handleAddTag = (tag) => {
        if (!userTags.some(t => t.id === tag.id)) {
            setUserTags([...userTags, tag]);
        }
    };

    const handleSaveInterests = async () => {
        console.log('Zapisywanie tagów:', userTags);

        await updateUserTags(userTags.map(tag => tag.id))
            .then(response => {
                console.log("Zainteresowania zostały zaktualizowane:", response.data);

                toast({
                    title: "Zapisano!",
                    description: "Twoje zainteresowania zostały pomyślnie zaktualizowane.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
            }
            )
            .catch(error => {
                console.error("Błąd podczas aktualizacji zainteresowań:", error);

                toast({
                    title: "Błąd!",
                    description: "Nie udało się zapisać zmian.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
            });
    };


    const unselectedTags = availableTags.filter(
        tag => !userTags.some(userTag => userTag.id === tag.id)
    );

    return (
        <Box
            bg={cardBg}
            p={8}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            mb={8}
        >
            <Heading size="md" mb={6}>Twoje zainteresowania</Heading>
            
            <Wrap spacing={3} mb={6}>
                {userTags.map((tag) => (
                    <WrapItem key={tag.id}>
                        <Tag
                            size="lg"
                            colorScheme="purple"
                            borderRadius="full"
                            cursor="pointer"
                        >
                            <TagLabel>{tag.name}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveTag(tag.id)} />
                        </Tag>
                    </WrapItem>
                ))}
            </Wrap>

            {unselectedTags.length > 0 && (
                <>
                    <Heading size="sm" mb={4} color={textColor}>
                        Dostępne tagi
                    </Heading>
                    <Wrap spacing={3} mb={6}>
                        {unselectedTags.map((tag) => (
                            <WrapItem key={tag.id}>
                                <Tag
                                    size="lg"
                                    variant="outline"
                                    colorScheme="gray"
                                    borderRadius="full"
                                    cursor="pointer"
                                    onClick={() => handleAddTag(tag)}
                                    transition="all 0.2s"
                                    _hover={{
                                        bg: hoverBg,
                                        borderColor: 'purple.500',
                                        transform: 'translateY(-2px)'
                                    }}
                                >
                                    <TagLabel>{tag.name}</TagLabel>
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>
                </>
            )}

            <Button 
                colorScheme="purple" 
                size="lg" 
                onClick={handleSaveInterests}
            >
                Zapisz zainteresowania
            </Button>
        </Box>
    );
};

export default EditInterests;