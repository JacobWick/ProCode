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
    Icon,
    Progress,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Badge,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { StarIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getPaginatedCourses, getCourseProgress } from "../../api.js";
import { COURSE_DIFFICULTY } from "../../constants.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const CourseCard = ({ course, onClick }) => {
    const [progress, setProgress] = useState(null);
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");
    const titleColor = useColorModeValue("gray.800", "white");
    const descColor = useColorModeValue("gray.600", "gray.300");
    const metaColor = useColorModeValue("gray.500", "gray.400");

    useEffect(() => {
        let isMounted = true;
        const fetchProgress = async () => {
            try {
                const res = await getCourseProgress(course.id);
                if (isMounted) setProgress(res.data);
            } catch (e) {
                // Progress not available
            }
        };
        if (course.id) fetchProgress();
        return () => { isMounted = false; };
    }, [course.id]);

    const percent = progress ? Math.round(progress.percentage) : 0;
    const hasProgress = progress && progress.completedLessons > 0;

    return (
        <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ 
                transform: "translateY(-8px)", 
                shadow: "xl", 
                cursor: "pointer",
                borderColor: "purple.400"
            }}
            onClick={onClick}
            position="relative"
            h="100%"
        >
            {hasProgress && (
                <Box position="absolute" top={0} left={0} right={0} zIndex={2}>
                    <Progress value={percent} size="xs" colorScheme="purple" />
                </Box>
            )}
            
            <Box p={6} h="100%" display="flex" flexDirection="column">
                <VStack align="stretch" spacing={3} flex="1">
                    <Heading size="md" noOfLines={2} color={titleColor} minH="60px">
                        {course.title}
                    </Heading>

                    <Text fontSize="sm" color={descColor} noOfLines={3} flex="1">
                        {course.description || "Brak opisu"}
                    </Text>

                    {course.tags && course.tags.length > 0 && (
                        <HStack spacing={2} flexWrap="wrap">
                            {course.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} colorScheme="purple" fontSize="xs" px={2} py={1} borderRadius="md">
                                    {tag.name}
                                </Badge>
                            ))}
                            {course.tags.length > 3 && (
                                <Badge colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="md">
                                    +{course.tags.length - 3}
                                </Badge>
                            )}
                        </HStack>
                    )}

                    <HStack spacing={4} pt={2}>
                        <Text fontSize="sm" color={metaColor}>
                            {course.lessonCount || 0} lekcji
                        </Text>
                    </HStack>

                    <Text fontSize="xs" color={metaColor}>
                        Poziom: {COURSE_DIFFICULTY[course.difficultyLevel] ?? "—"}
                    </Text>

                    {hasProgress && (
                        <Box pt={2}>
                            <HStack justify="space-between" mb={1}>
                                <Text fontSize="xs" color="purple.500" fontWeight="bold">
                                    Twój postęp
                                </Text>
                                <Text fontSize="xs" color="purple.500" fontWeight="bold">
                                    {percent}%
                                </Text>
                            </HStack>
                            <Progress 
                                value={percent} 
                                size="sm" 
                                colorScheme="purple" 
                                borderRadius="full"
                                hasStripe
                                isAnimated
                            />
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [query, setQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("CreatedOn");
    const navigate = useNavigate();

    const pageBg = useColorModeValue("gray.50", "gray.900");
    const headingColor = useColorModeValue("gray.800", "white");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPaginatedCourses({
                page,
                pageSize,
                query,
                sortBy
            });
            
            const data = res.data;
            setCourses(data.items || []);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            console.error(err);
            setError(err.message || "Błąd podczas pobierania kursów");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, query, sortBy, pageSize]);

    const handleSearch = () => {
        setQuery(searchInput);
        setPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return (
            <HStack spacing={2} justify="center" flexWrap="wrap">
                <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={() => goToPage(page - 1)}
                    isDisabled={page === 1}
                    variant="outline"
                    size="sm"
                    aria-label="Poprzednia strona"
                />

                {start > 1 && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => goToPage(1)}
                        >
                            1
                        </Button>
                        {start > 2 && <Text>...</Text>}
                    </>
                )}

                {pages.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={p === page ? "solid" : "outline"}
                        colorScheme={p === page ? "purple" : "gray"}
                        onClick={() => goToPage(p)}
                    >
                        {p}
                    </Button>
                ))}

                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <Text>...</Text>}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => goToPage(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={() => goToPage(page + 1)}
                    isDisabled={page === totalPages}
                    variant="outline"
                    size="sm"
                    aria-label="Następna strona"
                />
            </HStack>
        );
    };

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
            <Navbar />
            <Box flex="1" py={12}>
                <Container maxW="container.xl">
                    <VStack spacing={8} align="stretch">
                        {/* Header */}
                        <VStack align="stretch" spacing={4}>
                            <Heading color={headingColor} size="xl">
                                Katalog kursów
                            </Heading>
                            
                            {totalCount > 0 && (
                                <Text color={useColorModeValue("gray.600", "gray.400")} fontSize="lg">
                                    Znaleziono {totalCount} {totalCount === 1 ? 'kurs' : 'kursów'}
                                </Text>
                            )}
                        </VStack>

                        {/* Filters */}
                        <Box
                            bg={cardBg}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            p={6}
                            shadow="sm"
                        >
                            <Flex 
                                direction={{ base: "column", md: "row" }} 
                                gap={4}
                            >
                                <InputGroup flex="1">
                                    <InputLeftElement pointerEvents="none">
                                        <SearchIcon color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Szukaj kursu..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </InputGroup>

                                <HStack spacing={3}>
                                    <Select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        w={{ base: "100%", md: "180px" }}
                                    >
                                        <option value="CreatedOn">Najnowsze</option>
                                        <option value="title">Alfabetycznie</option>
                                        <option value="enrollments">Najpopularniejsze</option>
                                    </Select>

                                    <Select
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        w={{ base: "100%", md: "120px" }}
                                    >
                                        <option value={6}>6 na str.</option>
                                        <option value={12}>12 na str.</option>
                                        <option value={24}>24 na str.</option>
                                        <option value={48}>48 na str.</option>
                                    </Select>

                                    <Button 
                                        colorScheme="purple" 
                                        onClick={handleSearch}
                                        px={8}
                                    >
                                        Szukaj
                                    </Button>
                                </HStack>
                            </Flex>
                        </Box>

                        {/* Loading State */}
                        {loading && (
                            <Box textAlign="center" py={20}>
                                <Spinner size="xl" color="purple.500" thickness="4px" />
                                <Text mt={4} color={useColorModeValue("gray.600", "gray.400")}>
                                    Ładowanie kursów...
                                </Text>
                            </Box>
                        )}

                        {/* Error State */}
                        {error && (
                            <Box 
                                bg="red.500" 
                                color="white" 
                                p={6} 
                                borderRadius="xl"
                                textAlign="center"
                            >
                                <Text fontSize="xl" mb={2}>❌</Text>
                                <Text>{error}</Text>
                            </Box>
                        )}

                        {/* Empty State */}
                        {!loading && !error && courses.length === 0 && (
                            <VStack py={20} spacing={4}>
                                <Text fontSize="6xl">📚</Text>
                                <Heading size="md" color={headingColor}>
                                    Nie znaleziono kursów
                                </Heading>
                                <Text color={useColorModeValue("gray.600", "gray.400")}>
                                    Spróbuj zmienić kryteria wyszukiwania
                                </Text>
                            </VStack>
                        )}

                        {/* Courses Grid */}
                        {!loading && !error && courses.length > 0 && (
                            <>
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {courses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                        />
                                    ))}
                                </SimpleGrid>

                                {/* Pagination */}
                                <Box
                                    bg={cardBg}
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    p={6}
                                    shadow="sm"
                                >
                                    <VStack spacing={4}>
                                        {renderPagination()}
                                        
                                        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                                            Strona {page} z {totalPages}
                                        </Text>
                                    </VStack>
                                </Box>
                            </>
                        )}
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

export default CoursesPage;