import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';

const Footer = () => {
    const bg = useColorModeValue('purple.50', 'gray.900');
    const headingColor = useColorModeValue('purple.600', 'purple.300');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const linkHoverColor = useColorModeValue('purple.600', 'purple.300');

    return (
        <Box bg={bg} color={textColor} mt={16}>
            <Container maxW="container.xl" py={10}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                    <VStack align="start">
                        <Heading size="md" color={headingColor}>
                            ProCode
                        </Heading>
                        <Text fontSize="sm" color={textColor}>
                            Najlepsza platforma do nauki programowania online
                        </Text>
                    </VStack>
                    <VStack align="start">
                        <Text fontWeight="bold" mb={2}>
                            Nawigacja
                        </Text>
                        <Link as={RouterLink} to="/courses" fontSize="sm" color={textColor} _hover={{ color: linkHoverColor }}>
                            Kursy
                        </Link>
                        <Link fontSize="sm" color={textColor} _hover={{ color: linkHoverColor }}>
                            Ścieżki nauki
                        </Link>
                        <Link fontSize="sm" color={textColor} _hover={{ color: linkHoverColor }}>
                            O nas
                        </Link>
                    </VStack>

                    <VStack align="start">
                        <Text fontWeight="bold" mb={2}>
                            Pomoc
                        </Text>
                        <Link fontSize="sm" color={textColor} _hover={{ color: linkHoverColor }}>
                            Kontakt
                        </Link>
                        <Link fontSize="sm" color={textColor} _hover={{ color: linkHoverColor }}>
                            Regulamin
                        </Link>
                    </VStack>
                </SimpleGrid>

                <Box borderTop="1px" borderColor={borderColor} mt={8} pt={8} textAlign="center">
                    <Text fontSize="sm" color={textColor}>
                        © {new Date().getFullYear()} ProCode. Wszelkie prawa zastrzeżone.
                    </Text>
                </Box>
            </Container>
        </Box>
    );
};
export default Footer;
