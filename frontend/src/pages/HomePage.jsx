import{ useState } from 'react';
import {
  Box,
  Flex,
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
  Link,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} position="sticky" top="0" zIndex="10">
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Heading size="md" color="purple.500">ProCode</Heading>
          
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link>Kursy</Link>
            <Link>Ścieżki nauki</Link>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
            <Button variant="ghost">Zaloguj się</Button>
            <Button colorScheme="purple">Zarejestruj się</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

const Hero = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
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

const CourseCard = ({ title, instructor, rating, students, category, image }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
      cursor="pointer"
    >
      <Box h="140px" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="4xl">{image}</Text>
      </Box>
      
      <Box p={4}>
        <Badge colorScheme="purple" mb={2}>{category}</Badge>
        <Heading size="sm" mb={2} noOfLines={2}>{title}</Heading>
        <Text fontSize="sm" color="gray.500" mb={2}>{instructor}</Text>
        
        <HStack mb={2}>
          <Text fontWeight="bold" color="orange.400">{rating}</Text>
          <Text fontSize="sm" color="gray.500">({students} uczniów)</Text>
        </HStack>
      </Box>
    </Box>
  );
};

const FeaturedCourses = () => {
  const courses = [
    {
      title: 'Kompletny kurs React od podstaw',
      instructor: 'Jan Kowalski',
      rating: '4.8',
      students: '12,453',
      category: 'React',
      image: '⚛️'
    },
    {
      title: 'Python dla początkujących',
      instructor: 'Anna Nowak',
      rating: '4.9',
      students: '23,891',
      category: 'Python',
      image: '🐍'
    },
    {
      title: 'JavaScript - kompletny przewodnik',
      instructor: 'Piotr Wiśniewski',
      rating: '4.7',
      students: '18,234',
      category: 'JavaScript',
      image: '📜'
    },
    {
      title: 'Node.js i Express - Backend',
      instructor: 'Marek Lewandowski',
      rating: '4.6',
      students: '9,876',
      category: 'Backend',
      image: '🟢'
    },
  ];

  return (
    <Box py={16}>
      <Container maxW="container.xl">
        <Heading mb={8}>Popularne kursy</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const Categories = () => {
  const categories = [
    { name: 'Frontend', icon: '💻', count: '234 kursy' },
    { name: 'Backend', icon: '⚙️', count: '189 kursów' },
    { name: 'Mobile', icon: '📱', count: '145 kursów' },
    { name: 'Data Science', icon: '📊', count: '198 kursów' },
    { name: 'DevOps', icon: '🚀', count: '112 kursów' },
    { name: 'AI/ML', icon: '🤖', count: '167 kursów' },
  ];

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
      <Container maxW="container.xl">
        <Heading mb={8}>Kategorie</Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          {categories.map((cat, index) => (
            <Box
              key={index}
              p={6}
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
            >
              <Text fontSize="3xl" mb={2}>{cat.icon}</Text>
              <Text fontWeight="bold" mb={1}>{cat.name}</Text>
              <Text fontSize="sm" color="gray.500">{cat.count}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box bg={useColorModeValue('gray.900', 'gray.900')} color="white" mt={16}>
      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack align="start">
            <Heading size="md" color="purple.400">ProCode</Heading>
            <Text fontSize="sm" color="gray.400">
              Najlepsza platforma do nauki programowania online
            </Text>
          </VStack>
          
          <VStack align="start">
            <Text fontWeight="bold" mb={2}>Nawigacja</Text>
            <Link fontSize="sm" color="gray.400">Kursy</Link>
            <Link fontSize="sm" color="gray.400">Ścieżki nauki</Link>
            <Link fontSize="sm" color="gray.400">O nas</Link>
          </VStack>
          
          <VStack align="start">
            <Text fontWeight="bold" mb={2}>Pomoc</Text>
            <Link fontSize="sm" color="gray.400">Kontakt</Link>
            <Link fontSize="sm" color="gray.400">Regulamin</Link>
          </VStack>
        </SimpleGrid>
        
        <Box borderTop="1px" borderColor={useColorModeValue('gray.700', 'gray.700')} mt={8} pt={8} textAlign="center">
          <Text fontSize="sm" color="gray.400">
            © 2025 ProCode. Wszelkie prawa zastrzeżone.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default function HomePage() {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    alert(`Szukam kursów: ${query}`);
  };

  return (
      <Box minH="100vh">
        <Navbar />
        <Hero onSearch={handleSearch} />
        <FeaturedCourses />
        <Categories />
        <Footer />
      </Box>
  );
}