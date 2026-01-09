import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Container,
    SimpleGrid,
    Badge,
    VStack,
    HStack,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActiveChallenges from '../components/Challenges.jsx';
import { getPaginatedCourses } from '../api.js';

const Hero = ({ onSearch, searchQuery, setSearchQuery }) => {
    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    return (
        <Box bg={useColorModeValue('purple.50', 'gray.900')} py={20}>
            <Container maxW="container.xl">
                <VStack spacing={8} textAlign="center">
                    <Heading size="2xl">
                        Naucz się programowania
                    </Heading>
                    <Text fontSize="xl" maxW="2xl" color={useColorModeValue('gray.600', 'gray.300')}>
                        Tysiące kursów programowania w jednym miejscu. Rozwijaj swoje umiejętności i buduj karierę w IT.
                    </Text>

                    <InputGroup maxW="600px" size="lg">
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Czego chcesz się nauczyć? (np. React, Python, JavaScript)"
                            bg={useColorModeValue('white', 'gray.700')}
                            color={useColorModeValue('gray.800', 'white')}
                            _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </InputGroup>

                    <Button colorScheme="purple" size="lg" onClick={handleSearch}>
                        Szukaj kursów
                    </Button>
                </VStack>
            </Container>
        </Box>
    );
};

const WhyProCode = () => {
    const bgColor = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const iconBg = useColorModeValue('purple.50', 'gray.800');

    const features = [
        { icon: '🎯', text: 'Praktyczne projekty' },
        { icon: '🏆', text: 'Wyzwania programistyczne' },
        { icon: '📈', text: 'Śledź swój progres' },
        { icon: '💡', text: 'Uczenie przez działanie' },
    ];

    return (
        <Box bg={bgColor} py={12} borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <Container maxW="container.xl">
                <HStack spacing={8} justify="center" flexWrap="wrap">
                    {features.map((feature, index) => (
                        <HStack key={index} spacing={2}>
                            <Box
                                bg={iconBg}
                                w="32px"
                                h="32px"
                                fontSize="24px"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {feature.icon}
                            </Box>
                            <Text fontSize="sm" color={textColor} fontWeight="medium">
                                {feature.text}
                            </Text>
                        </HStack>
                    ))}
                </HStack>
            </Container>
        </Box>
    );
};

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        navigate('/courses', { state: { searchQuery: query } });
    };

    return (
        <Box minH="100vh">
            <Navbar />

            
            <ActiveChallenges />

            <Hero 
                onSearch={handleSearch} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <WhyProCode />
            <Footer />
        </Box>
    );
}