import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Text,
    Spinner,
    Heading,
    Button,
    Container,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
    useToast,
    Divider,
    SimpleGrid,
    Icon,
} from "@chakra-ui/react";
import { getCourseDetails, enrollInCourse, isUserEnrolledInCourse } from "../../api.js";
import { COURSE_DIFFICULTY } from "../../constants.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ArrowBackIcon, TimeIcon, CalendarIcon, StarIcon } from "@chakra-ui/icons";

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const toast = useToast();

    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const titleColor = useColorModeValue("gray.800", "white");
    const metaColor = useColorModeValue("gray.600", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const hoverBg = useColorModeValue("gray.50", "gray.700");
    const iconBg = useColorModeValue("purple.50", "purple.900");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await getCourseDetails(id);
                const courseData = courseRes.data;
                setCourse(courseData);

                if (courseData) {
                    const enrollRes = await isUserEnrolledInCourse(id);
                    setIsEnrolled(enrollRes.data?.isEnrolled || enrollRes.data?.IsEnrolled || false);
                }
            } catch (err) {
                setError(err?.message || "Błąd podczas pobierania kursu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEnrollAndStart = async () => {
        if (!course?.lessons?.length) {
            toast({ title: 'Brak lekcji', description: 'Ten kurs nie posiada lekcji.', status: 'warning' });
            return;
        }

        try {
            setEnrollLoading(true);
            await enrollInCourse(course.id);
            setIsEnrolled(true);
            toast({ title: 'Sukces! 🎉', description: 'Pomyślnie zapisano na kurs.', status: 'success' });
            
            const firstLessonId = course.lessons[0]?.id || course.lessons[0];
            navigate(`/courses/${course.id}/lessons/${firstLessonId}`);
        } catch (err) {
            toast({ title: 'Błąd', description: 'Nie udało się zapisać na kurs.', status: 'error' });
        } finally {
            setEnrollLoading(false);
        }
    };

    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const parts = String(timeStr).split(':').map(Number);
        if (parts.length >= 2) {
            return Math.ceil(parts[0] * 60 + parts[1]);
        }
        return null;
    };

    if (loading) {
        return (
            <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
                <Navbar />
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error || !course) {
        return (
            <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
                <Navbar />
                <Container maxW="container.md" py={20}>
                    <VStack spacing={4}>
                        <Text fontSize="4xl">😕</Text>
                        <Heading size="md" color={titleColor}>
                            {error || "Nie znaleziono kursu"}
                        </Heading>
                        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate("/courses")}>
                            Powrót do kursów
                        </Button>
                    </VStack>
                </Container>
                <Footer />
            </Box>
        );
    }

    const duration = parseTimeToMinutes(course.estimatedDuration);
    const lessonsCount = course.lessons?.length || 0;

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
            <Navbar />

            <Box flex="1" py={10}>
                <Container maxW="container.xl">
                    {/* Breadcrumb */}
                    <Button
                        leftIcon={<ArrowBackIcon />}
                        variant="ghost"
                        onClick={() => navigate("/courses")}
                        mb={6}
                        size="sm"
                    >
                        Wszystkie kursy
                    </Button>

                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                        {/* Main Content */}
                        <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
                            <VStack align="stretch" spacing={6}>
                                {/* Header Card */}
                                <Box
                                    bg={cardBg}
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    p={8}
                                    shadow="md"
                                >
                                    <HStack spacing={6} align="start" mb={6}>
                                        <Box
                                            w="80px"
                                            h="80px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            fontSize="4xl"
                                            borderRadius="xl"
                                            bg={iconBg}
                                            flexShrink={0}
                                        >
                                            <StarIcon boxSize={10} color="purple.500"/>
                                        </Box>

                                        <VStack align="start" spacing={2} flex="1">
                                            <HStack spacing={3} flexWrap="wrap">
                                                {course.category && (
                                                    <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                                                        {course.category}
                                                    </Badge>
                                                )}
                                                {course.difficultyLevel != null && (
                                                    <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                                                        {COURSE_DIFFICULTY[course.difficultyLevel] || "—"}
                                                    </Badge>
                                                )}
                                            </HStack>

                                            <Heading size="xl" color={titleColor}>
                                                {course.title}
                                            </Heading>

                                            {course.creatorUsername && (
                                                <Text fontSize="md" color={metaColor}>
                                                    👤 {course.creatorUsername}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>

                                    {course.description && (
                                        <>
                                            <Divider my={4} />
                                            <Text color={titleColor} fontSize="md" lineHeight="tall">
                                                {course.description}
                                            </Text>
                                        </>
                                    )}

                                    <Divider my={6} />

                                    {/* Stats */}
                                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
                                        {course.students != null && (
                                            <Box>
                                                <Text fontSize="xs" color={metaColor} mb={1}>
                                                    Uczniowie
                                                </Text>
                                                <Text fontSize="lg" fontWeight="bold" color={titleColor}>
                                                    👥 {course.students}
                                                </Text>
                                            </Box>
                                        )}
                                        {course.rating != null && (
                                            <Box>
                                                <Text fontSize="xs" color={metaColor} mb={1}>
                                                    Ocena
                                                </Text>
                                                <Text fontSize="lg" fontWeight="bold" color="purple.500">
                                                    ⭐ {course.rating}
                                                </Text>
                                            </Box>
                                        )}
                                        {lessonsCount > 0 && (
                                            <Box>
                                                <Text fontSize="xs" color={metaColor} mb={1}>
                                                    Lekcje
                                                </Text>
                                                <Text fontSize="lg" fontWeight="bold" color={titleColor}>
                                                    {lessonsCount}
                                                </Text>
                                            </Box>
                                        )}
                                        {duration && (
                                            <Box>
                                                <Text fontSize="xs" color={metaColor} mb={1}>
                                                    Czas trwania
                                                </Text>
                                                <Text fontSize="lg" fontWeight="bold" color={titleColor}>
                                                    {duration} min
                                                </Text>
                                            </Box>
                                        )}
                                    </SimpleGrid>

                                    {/* CTA Button */}
                                    <HStack spacing={3}>
                                        {isEnrolled ? (
                                            <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full">
                                                Kurs rozpoczęty
                                            </Badge>
                                        ) : (
                                            <Button
                                                colorScheme="purple"
                                                size="lg"
                                                onClick={handleEnrollAndStart}
                                                isLoading={enrollLoading}
                                                isDisabled={!lessonsCount}
                                                w={{ base: "100%", md: "auto" }}
                                            >
                                                Rozpocznij kurs
                                            </Button>
                                        )}
                                    </HStack>
                                </Box>

                                {/* Lessons List */}
                                {lessonsCount > 0 && (
                                    <Box
                                        bg={cardBg}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                        p={6}
                                        shadow="md"
                                    >
                                        <Heading size="md" mb={4} color={titleColor}>
                                            Lista lekcji
                                        </Heading>
                                        <VStack align="stretch" spacing={3}>
                                            {course.lessons.map((lesson, idx) => (
                                                <Box
                                                    key={lesson.id || idx}
                                                    p={4}
                                                    borderWidth="1px"
                                                    borderColor={borderColor}
                                                    borderRadius="lg"
                                                    _hover={{
                                                        bg: hoverBg,
                                                        cursor: 'pointer',
                                                        transform: 'translateX(4px)',
                                                        borderColor: 'purple.300'
                                                    }}
                                                    transition="all 0.2s"
                                                    onClick={() => navigate(`/courses/${course.id}/lessons/${lesson.id}`)}
                                                >
                                                    <HStack spacing={3} align="start">
                                                        <Badge colorScheme="purple" fontSize="sm" borderRadius="full">
                                                            {idx + 1}
                                                        </Badge>
                                                        <VStack align="start" spacing={1} flex="1">
                                                            <Text fontWeight="semibold" color={titleColor}>
                                                                {lesson.title}
                                                            </Text>
                                                            {lesson.description && (
                                                                <Text fontSize="sm" color={metaColor} noOfLines={2}>
                                                                    {lesson.description}
                                                                </Text>
                                                            )}
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </Box>
                                )}
                            </VStack>
                        </Box>

                        {/* Sidebar */}
                        <Box>
                            <Box
                                bg={cardBg}
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor={borderColor}
                                p={6}
                                shadow="md"
                                position={{ base: "relative", lg: "sticky" }}
                                top={{ base: "0", lg: "20" }}
                            >
                                <VStack align="stretch" spacing={4}>
                                    <Heading size="sm" color={titleColor}>
                                        Informacje
                                    </Heading>
                                    
                                    <Divider />

                                    {course.createdOn && (
                                        <HStack spacing={3}>
                                            <Icon as={CalendarIcon} color={metaColor} />
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="xs" color={metaColor}>
                                                    Data utworzenia
                                                </Text>
                                                <Text fontSize="sm" fontWeight="semibold" color={titleColor}>
                                                    {new Date(course.createdOn).toLocaleDateString("pl-PL")}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    )}

                                    {duration && (
                                        <HStack spacing={3}>
                                            <Icon as={TimeIcon} color={metaColor} />
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="xs" color={metaColor}>
                                                    Szacowany czas
                                                </Text>
                                                <Text fontSize="sm" fontWeight="semibold" color={titleColor}>
                                                    {duration} minut
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    )}

                                    {lessonsCount > 0 && (
                                        <HStack spacing={3}>
                                            <Text fontSize="xl">📖</Text>
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="xs" color={metaColor}>
                                                    Liczba lekcji
                                                </Text>
                                                <Text fontSize="sm" fontWeight="semibold" color={titleColor}>
                                                    {lessonsCount}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    )}
                                </VStack>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}

export default CourseDetailPage;