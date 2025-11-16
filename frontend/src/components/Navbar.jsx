import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Button,
    Container,
    HStack,
    Link,
    IconButton,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box bg={bg} borderBottom="1px" borderColor={borderColor} position="sticky" top="0" zIndex="10">
            <Container maxW="container.xl">
                <Flex h="16" alignItems="center" justifyContent="space-between">
                    <RouterLink to="/">
                        <Heading size="md" color="purple.500" cursor="pointer">ProCode</Heading>
                    </RouterLink>
                    <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Link as={RouterLink} to="/courses">Kursy</Link>
                        <Link>Ścieżki nauki</Link>
                    </HStack>
                    <HStack spacing={4}>
                        <IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} variant="ghost" aria-label="Toggle color mode"/>
                        <Button onClick={() => navigate('/login')} variant="ghost">Zaloguj się</Button>
                        <Button onClick={() => navigate('/register')} colorScheme="purple">Zarejestruj się</Button>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;