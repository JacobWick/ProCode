import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    Container,
    HStack,
    VStack,
    Link,
    IconButton,
    useColorMode,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Text,
} from '@chakra-ui/react';
import NotificationBell from './NotificationBell';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded.nameidentifier,
                    name: decoded.name,
                    surname: decoded.surname,
                    email: decoded.email,
                    role: decoded.role,
                    username: decoded.username
                });
            } catch (error) {
                console.error('Błąd dekodowania tokenu:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <Box bg={bg} borderBottom="1px" borderColor={borderColor} position="sticky" top="0" zIndex="10">
            <Container maxW="container.xl">
                <Flex h="16" alignItems="center" justifyContent="space-between">
                    <RouterLink to="/">
                        <Heading size="md" color="purple.500" cursor="pointer">ProCode</Heading>
                    </RouterLink>

                    <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Link as={RouterLink} to="/courses">Kursy</Link>
                        {user?.role === "Mentor" || user?.role === "Admin" && (<Link as={RouterLink} to="/create">Stwórz</Link>)}
                        {user && (<Link as={RouterLink} to="/courses/recommended">Ścieżki nauki</Link>)}
                    </HStack>

                    <HStack spacing={4}>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                        />
                        {user && (<NotificationBell/>)}
                        {user ? (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    variant="ghost"
                                >
                                    <HStack spacing={2}>
                                        <Avatar
                                            size="sm"
                                            name={`${user.name|| ''} ${user.surname || ''}`}
                                            bg="purple.500"
                                        />
                                        <Text display={{ base: 'none', md: 'block' }}>
                                            {user.name || user.surname}
                                        </Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem isDisabled>
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="semibold">
                                                {user.name} {user.surname}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                @{user.username}
                                            </Text>
                                        </VStack>
                                    </MenuItem>
                                    <MenuDivider />
                                    {user?.role == "Admin" && (
                                        <MenuItem onClick={() => navigate('/administrator')}>
                                            Panel Administratora
                                    </MenuItem>)}
                                    <MenuItem onClick={() => navigate('/my-profile')}>
                                        Mój profil
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/my-courses')}>
                                        Moje kursy
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/settings')}>
                                        Ustawienia
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout} color="red.500">
                                        Wyloguj się
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <>
                                <Button as={RouterLink} to="/login" variant="ghost">
                                    Zaloguj się
                                </Button>
                                <Button as={RouterLink} to="/register" colorScheme="purple">
                                    Zarejestruj się
                                </Button>
                            </>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;