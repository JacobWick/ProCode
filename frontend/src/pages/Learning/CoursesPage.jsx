import { useEffect, useState } from "react";
import {
    Box,
    Text,
    SimpleGrid,
    Spinner,
    Heading,
    Container,
    VStack,
    HStack,
    useColorModeValue,
    Progress,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Badge,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getPaginatedCourses, getCourseProgress } from "../../api.js";
import { COURSE_DIFFICULTY } from "../../constants.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function CoursesPage() {
    const navigate = useNavigate();
    
    // Stan dla kursów i paginacji
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Stan dla filtrów
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("CreatedOn");
    
    // Stan dla progressów
    const [progressMap, setProgressMap] = useState({});
    
    const bgCard = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    // Pobierz kursy
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                console.log("=== WYWOŁANIE API ===");
                console.log("Page:", page);
                console.log("SearchQuery:", searchQuery);
                console.log("SortBy:", sortBy);
                
                const params = {
                    page,
                    pageSize: 20,
                    query: searchQuery,
                    sortBy
                };
                
                console.log("Parametry do API:", params);
                
                const response = await getPaginatedCourses(params);
                
                console.log("Odpowiedź z API:", response.data);
                
                setCourses(response.data.items);
                setTotalPages(response.data.totalPages);
                
                // Pobierz progress dla każdego kursu
                const progressPromises = response.data.items.map(course =>
                    getCourseProgress(course.id)
                        .then(res => ({ courseId: course.id, progress: res.data }))
                        .catch(() => ({ courseId: course.id, progress: null }))
                );
                
                const progressResults = await Promise.all(progressPromises);
                const newProgressMap = {};
                progressResults.forEach(({ courseId, progress }) => {
                    newProgressMap[courseId] = progress;
                });
                setProgressMap(newProgressMap);
                
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [page, searchQuery, sortBy]);

    // Funkcja do wyszukiwania z debounce
    const handleSearch = (value) => {
        console.log("Zmiana search query:", value);
        setSearchQuery(value);
        setPage(1); // Reset do pierwszej strony przy wyszukiwaniu
    };

    const handleSortChange = (value) => {
        console.log("Zmiana sortowania:", value);
        setSortBy(value);
        setPage(1);
    };

    const getDifficultyColor = (level) => {
        const colors = {
            0: "green",
            1: "yellow",
            2: "orange",
            3: "red"
        };
        return colors[level] || "gray";
    };

    return (
        <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
            <Navbar />
            
            <Container maxW="container.xl" py={8}>
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <Heading size="xl">Kursy</Heading>

                    {/* Filtry */}
                    <Flex gap={4} wrap="wrap">
                        <InputGroup maxW="400px">
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Szukaj kursów..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </InputGroup>

                        <Select
                            maxW="250px"
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="CreatedOn">Data utworzenia</option>
                            <option value="title">Tytuł</option>
                            <option value="enrollments">Liczba zapisów</option>
                        </Select>
                    </Flex>

                    {/* Debug info */}
                    <Box p={4} bg="gray.100" borderRadius="md" fontSize="sm">
                        <Text><strong>Debug Info:</strong></Text>
                        <Text>Page: {page}</Text>
                        <Text>Search Query: "{searchQuery}"</Text>
                        <Text>Sort By: {sortBy}</Text>
                    </Box>

                    {/* Lista kursów */}
                    {loading ? (
                        <Flex justify="center" align="center" minH="400px">
                            <Spinner size="xl" />
                        </Flex>
                    ) : courses.length === 0 ? (
                        <Text textAlign="center" py={10} fontSize="lg" color="gray.500">
                            Nie znaleziono kursów
                        </Text>
                    ) : (
                        <>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {courses.map((course) => {
                                    const progress = progressMap[course.id];
                                    const progressPercent = progress?.percentage || 0;

                                    return (
                                        <Box
                                            key={course.id}
                                            bg={bgCard}
                                            border="1px"
                                            borderColor={borderColor}
                                            borderRadius="lg"
                                            p={5}
                                            cursor="pointer"
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                                            transition="all 0.2s"
                                        >
                                            <VStack align="stretch" spacing={3}>
                                                <HStack justify="space-between">
                                                    <Badge colorScheme={getDifficultyColor(course.difficultyLevel)}>
                                                        {COURSE_DIFFICULTY[course.difficultyLevel]}
                                                    </Badge>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {course.lessonCount} lekcji
                                                    </Text>
                                                </HStack>

                                                <Heading size="md" noOfLines={2}>
                                                    {course.title}
                                                </Heading>

                                                <Text fontSize="sm" color="gray.600" noOfLines={3}>
                                                    {course.description}
                                                </Text>

                                                {course.tags && course.tags.length > 0 && (
                                                    <HStack spacing={2} flexWrap="wrap">
                                                        {course.tags.slice(0, 3).map((tag) => (
                                                            <Badge key={tag.id} variant="outline" fontSize="xs">
                                                                {tag.name}
                                                            </Badge>
                                                        ))}
                                                    </HStack>
                                                )}

                                                <Box>
                                                    <HStack justify="space-between" mb={2}>
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            Twój postęp
                                                        </Text>
                                                        <Text fontSize="sm" fontWeight="bold">
                                                            {progressPercent.toFixed(0)}%
                                                        </Text>
                                                    </HStack>
                                                    <Progress
                                                        value={progressPercent}
                                                        colorScheme="blue"
                                                        size="sm"
                                                        borderRadius="full"
                                                    />
                                                </Box>
                                            </VStack>
                                        </Box>
                                    );
                                })}
                            </SimpleGrid>

                            {/* Paginacja */}
                            <Flex justify="center" align="center" gap={4} pt={4}>
                                <IconButton
                                    icon={<ChevronLeftIcon />}
                                    isDisabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    aria-label="Previous page"
                                />
                                
                                <Text>
                                    Strona {page} z {totalPages}
                                </Text>
                                
                                <IconButton
                                    icon={<ChevronRightIcon />}
                                    isDisabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    aria-label="Next page"
                                />
                            </Flex>
                        </>
                    )}
                </VStack>
            </Container>

            <Footer />
        </Box>
    );
}