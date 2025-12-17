import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Text,
    Spinner,
    Heading,
    Button,
    HStack,
    Link as ChakraLink,
    VStack,
    Alert,
    AlertIcon,
    Container,
    useColorModeValue,
    Badge,
    SimpleGrid,
    List,
    ListItem,
    Avatar,
    AspectRatio,
    Progress,
    useToast,
    IconButton,
    Wrap,
    WrapItem,
    Divider
} from "@chakra-ui/react";
import { getLessonById, getCourseById, getCourseProgress, completeLesson } from "../../api.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ExternalLinkIcon, CheckCircleIcon, ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [completing, setCompleting] = useState(false);
    const toast = useToast();
    const progressPercent = progress?.percentage || 0
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const titleColor = useColorModeValue("gray.800", "white");
    const metaColor = useColorModeValue("gray.600", "gray.400");
    const linkColor = useColorModeValue("purple.600", "purple.300");
    const activeBg = useColorModeValue("purple.50", "gray.700");
    const activeBorder = useColorModeValue("purple.300", "purple.400");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("[LessonPage] Fetching data for lessonId:", lessonId, "courseId:", courseId);
                const [lessonRes, courseRes, progressRes] = await Promise.all([
                    getLessonById(lessonId),
                    courseId ? getCourseById(courseId) : Promise.resolve({ data: null }),
                    courseId ? getCourseProgress(courseId) : Promise.resolve({ data: null }),
                ]);

                console.log("[LessonPage] Raw lesson response:", lessonRes?.data);
                console.log("[LessonPage] lesson.exercises (camelCase):", lessonRes?.data?.exercises);
                console.log("[LessonPage] lesson.Exercises (PascalCase):", lessonRes?.data?.Exercises);
                console.log("[LessonPage] All lesson keys:", Object.keys(lessonRes?.data || {}));

                setLesson(lessonRes?.data ?? null);
                setCourse(courseRes?.data ?? null);
                setProgress(progressRes?.data ?? null);
            } catch (err) {
                console.error("fetch lesson error:", err);
                setError(err?.message ?? "Błąd podczas pobierania lekcji");
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchData();
    }, [lessonId, courseId]);

    const normalizeId = (item) => {
        if (item == null) return null;
        if (typeof item === "string" || typeof item === "number") return String(item);
        return item.id ?? item.Id ?? null;
    };
    const normalizeTitle = (item, idx) => {
        if (!item) return `Lekcja ${idx + 1}`;
        if (typeof item === "string" || typeof item === "number") return `Lekcja ${idx + 1}`;
        return item.title ?? item.name ?? `Lekcja ${idx + 1}`;
    };

    const lessonsListRaw = Array.isArray(course?.lessons) ? course.lessons : [];
    const lessonsList = lessonsListRaw.map((l, i) => ({
        id: normalizeId(l),
        title: normalizeTitle(l, i),
    }));

    const currentIndex = lessonsList.findIndex((l) => String(l.id) === String(lesson?.id ?? lesson?.Id));
    const prevLessonId = currentIndex > 0 ? lessonsList[currentIndex - 1]?.id : null;
    const nextLessonId = currentIndex >= 0 && currentIndex < lessonsList.length - 1 ? lessonsList[currentIndex + 1]?.id : null;


    const handleStartExercise = () => {
        if (!lesson.exercises.length) {
            alert("Ta lekcja nie zawiera jeszcze ćwiczeń.");
            return;
        }

        navigate(`/courses/${courseId}/lessons/${lessonId}/exercises/${lesson.exercises[0]}`);
    };

    const handleMarkLessonCompleted = async () => {
        if (!lesson?.id && !lesson?.Id) return;
        const id = lesson?.id ?? lesson?.Id;
        if (progress?.completedLessonIds?.some(cid => String(cid) === String(id))) {
            toast({ title: 'Już oznaczona', description: 'Ta lekcja jest już oznaczona jako wykonana.', status: 'info' });
            return;
        }
        try {
            setCompleting(true);
            await completeLesson(id);
            toast({ title: 'Gotowe', description: 'Lekcja została oznaczona jako wykonana.', status: 'success' });
            if (courseId) {
                const resp = await getCourseProgress(courseId);
                setProgress(resp.data);
            }
        } catch (err) {
            console.error('complete lesson error:', err);
            toast({ title: 'Błąd', description: 'Nie udało się oznaczyć lekcji jako wykonanej.', status: 'error' });
        } finally {
            setCompleting(false);
        }
    };
    const toEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            if (host.includes("youtube.com")) {
                const vid = u.searchParams.get("v");
                if (vid) return `https://www.youtube.com/embed/${vid}`;
            }
            if (host.includes("youtu.be")) {
                const vid = u.pathname.slice(1);
                if (vid) return `https://www.youtube.com/embed/${vid}`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" bg={bg} display="flex" flexDirection="column">
                <Navbar />
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box minH="100vh" bg={bg} display="flex" flexDirection="column">
                <Navbar />
                <Box flex="1" p={6}>
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (!lesson) {
        return (
            <Box minH="100vh" bg={bg} display="flex" flexDirection="column">
                <Navbar />
                <Box flex="1" p={6} display="flex" alignItems="center" justifyContent="center" color={metaColor}>
                    Brak danych lekcji.
                </Box>
                <Footer />
            </Box>
        );
    }

    const embedUrl = toEmbedUrl(lesson.videoUri);

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
            <Navbar />

            <Box flex="1" py={10}>
                <Container maxW="container.xl">
                    {/* Nawigacja górna */}
                    <HStack spacing={2} mb={6} flexWrap="wrap">
                        <Button 
                            leftIcon={<ArrowBackIcon />}
                            variant="ghost" 
                            onClick={() => navigate(`/courses/${courseId}`)}
                            size={{ base: "sm", md: "md" }}
                        >
                            Powrót
                        </Button>
                        
                        <Box flex="1" />
                        
                        <IconButton
                            icon={<ChevronLeftIcon />}
                            onClick={() => prevLessonId && navigate(`/courses/${courseId}/lessons/${prevLessonId}`)}
                            isDisabled={!prevLessonId}
                            aria-label="Poprzednia lekcja"
                            size={{ base: "sm", md: "md" }}
                        />
                        
                        <IconButton
                            icon={<ChevronRightIcon />}
                            onClick={() => nextLessonId && navigate(`/courses/${courseId}/lessons/${nextLessonId}`)}
                            isDisabled={!nextLessonId}
                            aria-label="Następna lekcja"
                            size={{ base: "sm", md: "md" }}
                        />
                    </HStack>

                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                        {/* Główna zawartość */}
                        <Box gridColumn={{ base: "1 / -1", lg: "1 / 3" }}>
                            <VStack align="stretch" spacing={6}>
                                {/* Nagłówek lekcji */}
                                <Box
                                    bg={cardBg}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                    p={6}
                                    shadow="sm"
                                >
                                    <VStack align="start" spacing={3}>
                                        <Heading size="lg" color={titleColor}>
                                            {lesson.title ?? "Brak tytułu lekcji"}
                                        </Heading>

                                        {course?.title && (
                                            <Text fontSize="sm" color={metaColor}>
                                                Kurs: <Text as="span" color={linkColor} fontWeight="semibold">{course.title}</Text>
                                            </Text>
                                        )}

                                        <Text fontSize="sm" color={metaColor}>
                                            Liczba ćwiczeń: <Text as="span" color={titleColor} fontWeight="semibold">
                                                {Array.isArray(lesson.exercises) ? lesson.exercises.length : 0}
                                            </Text>
                                        </Text>

                                        {lesson.description && (
                                            <>
                                                <Divider />
                                                <Text color={titleColor} fontSize="md" lineHeight="tall">
                                                    {lesson.description}
                                                </Text>
                                            </>
                                        )}
                                    </VStack>
                                </Box>

                                {/* Wideo */}
                                {embedUrl && (
                                    <Box
                                        bg={cardBg}
                                        borderRadius="lg"
                                        borderWidth="1px"
                                        borderColor={useColorModeValue("gray.200", "gray.700")}
                                        overflow="hidden"
                                        shadow="sm"
                                    >
                                        <AspectRatio ratio={16 / 9} w="100%">
                                            <Box as="iframe" src={embedUrl} title={lesson.title} allowFullScreen />
                                        </AspectRatio>
                                        <Box p={3} borderTopWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")}>
                                            <ChakraLink href={lesson.videoUri} isExternal color={linkColor} fontSize="sm">
                                                Otwórz w osobnej karcie <ExternalLinkIcon mx="2px" />
                                            </ChakraLink>
                                        </Box>
                                    </Box>
                                )}

                                {/* Materiały */}
                                <Box
                                    bg={cardBg}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                    p={6}
                                    shadow="sm"
                                >
                                    <VStack align="start" spacing={4}>
                                        <Heading size="sm" color={titleColor}>
                                            Materiały do lekcji
                                        </Heading>
                                        
                                        {!embedUrl && (
                                            <Text color={metaColor} fontSize="sm">
                                                Brak materiału wideo
                                            </Text>
                                        )}

                                        {lesson.textUri ? (
                                            <Text fontSize="sm">
                                                <ChakraLink href={lesson.textUri} isExternal color={linkColor}>
                                                    📄 Materiały tekstowe <ExternalLinkIcon mx="2px" />
                                                </ChakraLink>
                                            </Text>
                                        ) : (
                                            <Text color={metaColor} fontSize="sm">
                                                Brak materiałów tekstowych
                                            </Text>
                                        )}
                                    </VStack>
                                </Box>

                                {/* Akcje */}
                                <Box
                                    bg={cardBg}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                    p={6}
                                    shadow="sm"
                                >
                                    <VStack align="stretch" spacing={3}>
                                        <Button 
                                            colorScheme="purple" 
                                            size="lg"
                                            onClick={handleStartExercise}
                                            w="100%"
                                        >
                                            Przystąp do rozwiązania zadania
                                        </Button>

                                        <Button
                                            variant="outline"
                                            colorScheme="green"
                                            size="lg"
                                            onClick={handleMarkLessonCompleted}
                                            isLoading={completing}
                                            w="100%"
                                        >
                                            Oznacz jako wykonane
                                        </Button>
                                    </VStack>
                                </Box>
                            </VStack>
                        </Box>

                        {/* Sidebar z lekcjami */}
                        <Box>
                            <Box
                                bg={cardBg}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={useColorModeValue("gray.200", "gray.700")}
                                p={4}
                                shadow="sm"
                                position={{ base: "relative", lg: "sticky" }}
                                top={{ base: "0", lg: "20" }}
                                maxH={{ base: "auto", lg: "80vh" }}
                                overflowY="auto"
                            >
                                <VStack align="stretch" spacing={4}>
                                    <HStack justify="space-between">
                                        <Heading size="sm" color={titleColor}>
                                            Lekcje
                                        </Heading>
                                        <Badge colorScheme="purple" fontSize="xs">
                                            {lessonsList.length}
                                        </Badge>
                                    </HStack>

                                    {progress && (
                                        <>
                                            <Divider />
                                            <Box>
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="xs" fontWeight="bold" color="purple.500">
                                                        Postęp kursu
                                                    </Text>
                                                    <Text fontSize="xs" color={metaColor} fontWeight="semibold">
                                                        {Math.round(progressPercent)}%
                                                    </Text>
                                                </HStack>
                                                <Progress
                                                    value={progressPercent}
                                                    size="sm"
                                                    colorScheme="purple"
                                                    borderRadius="full"
                                                    hasStripe={progressPercent === 100}
                                                    isAnimated={progressPercent === 100}
                                                />
                                            </Box>
                                            <Divider />
                                        </>
                                    )}

                                    <List spacing={2}>
                                        {lessonsList.map((l, idx) => {
                                            const isActive = String(l.id) === String(lesson.id ?? lesson.Id);
                                            const isCompleted = progress?.completedLessonIds?.some(completedLessonId => String(completedLessonId) === String(l.id));
                                            return (
                                                <ListItem
                                                    key={l.id ?? idx}
                                                    p={3}
                                                    borderRadius="md"
                                                    bg={isActive ? activeBg : "transparent"}
                                                    borderWidth={isActive ? "2px" : "1px"}
                                                    borderColor={isActive ? activeBorder : "transparent"}
                                                    _hover={{ 
                                                        bg: isActive ? activeBg : useColorModeValue("gray.100", "gray.700"), 
                                                        cursor: "pointer",
                                                        transform: "translateX(2px)",
                                                        transition: "all 0.2s"
                                                    }}
                                                    onClick={() => {
                                                        if (l.id) navigate(`/courses/${courseId}/lessons/${l.id}`);
                                                    }}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={3}
                                                    transition="all 0.2s"
                                                >
                                                    <Avatar size="sm" name={l.title} bg={isActive ? "purple.500" : "gray.400"} />
                                                    <Box flex="1" minW={0}>
                                                        <Text 
                                                            fontSize="sm" 
                                                            color={titleColor} 
                                                            fontWeight={isActive ? "bold" : "normal"} 
                                                            noOfLines={2}
                                                        >
                                                            {l.title}
                                                        </Text>
                                                        <Text fontSize="xs" color={metaColor}>
                                                            Lekcja {idx + 1}
                                                        </Text>
                                                    </Box>
                                                    {isActive ? (
                                                        <Badge colorScheme="purple" fontSize="xs">Aktualna</Badge>
                                                    ) : isCompleted ? (
                                                        <CheckCircleIcon color="green.500" boxSize={5} />
                                                    ) : null}
                                                </ListItem>
                                            );
                                        })}
                                        {lessonsList.length === 0 && (
                                            <Text fontSize="sm" color={metaColor} textAlign="center" py={4}>
                                                Brak listy lekcji w kursie.
                                            </Text>
                                        )}
                                    </List>
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

export default LessonPage;