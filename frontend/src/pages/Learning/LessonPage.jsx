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
} from "@chakra-ui/react";
import { getLessonById, getCourseById } from "../../api.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                const [lessonRes, courseRes] = await Promise.all([
                    getLessonById(lessonId),
                    courseId ? getCourseById(courseId) : Promise.resolve({ data: null }),
                ]);

                setLesson(lessonRes?.data ?? null);
                setCourse(courseRes?.data ?? null);
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

    const firstExerciseId =
        Array.isArray(lesson?.exercises) && lesson.exercises.length > 0
            ? normalizeId(lesson.exercises[0])
            : null;

    const handleStartExercise = () => {
        if (!firstExerciseId) {
            alert("Ta lekcja nie zawiera jeszcze ćwiczeń.");
            return;
        }
        navigate(`/courses/${courseId}/lessons/${lesson.id ?? lesson.Id}/exercises/${firstExerciseId}`);
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
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        {/* Main content */}
                        <Box gridColumn={{ base: "1 / -1", md: "1 / 3" }}>
                            <VStack align="start" spacing={4}>
                                <HStack spacing={4} mb={2} w="100%">
                                    <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)}>
                                        ← Powrót do kursu
                                    </Button>

                                    <Button
                                        onClick={() => prevLessonId && navigate(`/courses/${courseId}/lessons/${prevLessonId}`)}
                                        isDisabled={!prevLessonId}
                                    >
                                        Poprzednia lekcja
                                    </Button>

                                    <Button
                                        onClick={() => nextLessonId && navigate(`/courses/${courseId}/lessons/${nextLessonId}`)}
                                        isDisabled={!nextLessonId}
                                    >
                                        Następna lekcja
                                    </Button>

                                    <Button colorScheme="purple" ml="auto" onClick={handleStartExercise}>
                                        Przystąp do rozwiązania zadania
                                    </Button>
                                </HStack>

                                <Box
                                    bg={cardBg}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                    p={6}
                                    shadow="sm"
                                >
                                    <VStack align="start" spacing={4}>
                                        <Heading size="lg" color={titleColor}>
                                            {lesson.title ?? "Brak tytułu lekcji"}
                                        </Heading>

                                        {course?.title && (
                                            <Text fontSize="sm" color={metaColor}>
                                                Kurs: <Text as="span" color={titleColor} fontWeight="semibold">{course.title}</Text>
                                            </Text>
                                        )}

                                        {lesson.description ? (
                                            <Text color={metaColor}>{lesson.description}</Text>
                                        ) : (
                                            <Text color={metaColor}>Brak opisu lekcji.</Text>
                                        )}
                                        {embedUrl ? (
                                            <>
                                                <AspectRatio ratio={16 / 9} w="100%" borderRadius="md" overflow="hidden" bg="blackAlpha.200">
                                                    <Box as="iframe" src={embedUrl} title={lesson.title} allowFullScreen />
                                                </AspectRatio>

                                                <Text mt={2} fontSize="sm" color={metaColor}>
                                                    <ChakraLink href={lesson.videoUri} isExternal color={linkColor}>
                                                        Otwórz w osobnej karcie <ExternalLinkIcon mx="2px" />
                                                    </ChakraLink>
                                                </Text>
                                            </>
                                        ) : (
                                            <Text color={metaColor}>Brak materiału wideo</Text>
                                        )}

                                        {lesson.textUri ? (
                                            <Text>
                                                Materiały tekstowe:{" "}
                                                <ChakraLink href={lesson.textUri} isExternal color={linkColor}>
                                                    Otwórz tekst <ExternalLinkIcon mx="2px" />
                                                </ChakraLink>
                                            </Text>
                                        ) : (
                                            <Text color={metaColor}>Brak materiałów tekstowych</Text>
                                        )}

                                        <Box pt={4} w="100%">
                                            <Text fontSize="sm" color={metaColor}>
                                                Liczba ćwiczeń:{" "}
                                                <Text as="span" color={titleColor} fontWeight="semibold">
                                                    {Array.isArray(lesson.exercises) ? lesson.exercises.length : 0}
                                                </Text>
                                            </Text>
                                        </Box>
                                    </VStack>
                                </Box>
                            </VStack>
                        </Box>

                        <Box>
                            <Box
                                bg={cardBg}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={useColorModeValue("gray.200", "gray.700")}
                                p={4}
                                shadow="sm"
                                position="sticky"
                                top="20"
                                maxH="70vh"
                                overflowY="auto"
                            >
                                <VStack align="start" spacing={3}>
                                    <HStack w="100%" justify="space-between">
                                        <Heading size="sm" color={titleColor}>
                                            Lekcje
                                        </Heading>
                                        <Text fontSize="sm" color={metaColor}>
                                            {lessonsList.length}
                                        </Text>
                                    </HStack>

                                    <List w="100%" spacing={2}>
                                        {lessonsList.map((l, idx) => {
                                            const isActive = String(l.id) === String(lesson.id ?? lesson.Id);
                                            return (
                                                <ListItem
                                                    key={l.id ?? idx}
                                                    p={3}
                                                    borderRadius="md"
                                                    bg={isActive ? activeBg : "transparent"}
                                                    borderWidth={isActive ? "1px" : "0"}
                                                    borderColor={isActive ? activeBorder : "transparent"}
                                                    _hover={{ bg: useColorModeValue("gray.50", "gray.700"), cursor: "pointer" }}
                                                    onClick={() => {
                                                        if (l.id) navigate(`/courses/${courseId}/lessons/${l.id}`);
                                                    }}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={3}
                                                >
                                                    <Avatar size="sm" name={l.title} />
                                                    <Box flex="1" minW={0}>
                                                        <Text fontSize="sm" color={isActive ? titleColor : titleColor} fontWeight={isActive ? "semibold" : "normal"} noOfLines={1}>
                                                            {l.title}
                                                        </Text>
                                                        <Text fontSize="xs" color={metaColor}>
                                                            Lekcja {idx + 1}
                                                        </Text>
                                                    </Box>
                                                    {isActive && (
                                                        <Badge colorScheme="purple">Aktualna</Badge>
                                                    )}
                                                </ListItem>
                                            );
                                        })}
                                        {lessonsList.length === 0 && (
                                            <Text fontSize="sm" color={metaColor}>Brak listy lekcji w kursie.</Text>
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
