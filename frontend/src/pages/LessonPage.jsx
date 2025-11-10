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
} from "@chakra-ui/react";
import { getLessonById, getCourseById } from "../api.js";

function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const lessonRes = await getLessonById(lessonId);
                setLesson(lessonRes.data);

                if (courseId) {
                    const courseRes = await getCourseById(courseId);
                    setCourse(courseRes.data);
                }
            } catch (err) {
                console.error("fetch lesson error:", err);
                setError(err?.message ?? "Błąd podczas pobierania lekcji");
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchData();
    }, [lessonId, courseId]);

    if (loading) return <Spinner size="xl" />;

    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );

    if (!lesson) return null;

    const lessonsList = course?.lessons ?? [];
    const currentIndex = lessonsList.findIndex(
        (l) => l.id === lesson.id || l.Id === lesson.id || l.id === lesson.Id
    );
    const prevLessonId =
        currentIndex > 0 ? lessonsList[currentIndex - 1]?.id ?? lessonsList[currentIndex - 1]?.Id : null;
    const nextLessonId =
        currentIndex >= 0 && currentIndex < lessonsList.length - 1
            ? lessonsList[currentIndex + 1]?.id ?? lessonsList[currentIndex + 1]?.Id
            : null;

    const firstExerciseId = lesson.exercises && lesson.exercises.length > 0
        ? lesson.exercises[0].id ?? lesson.exercises[0].Id
        : null;

    const handleStartExercise = () => {
        if (!firstExerciseId) {
            alert("Ta lekcja nie zawiera jeszcze ćwiczeń.");
            return;
        }
        navigate(`/courses/${courseId}/lessons/${lesson.id}/exercises/${firstExerciseId}`);
    };

    return (
        <Box minH="100vh" bg="#0f0a19" color="gray.200" px={6} py={8}>
            <HStack spacing={4} mb={6}>
                <Button onClick={() => navigate(`/courses/${courseId}`)}>← Powrót do kursu</Button>

                <Button
                    onClick={() => {
                        if (prevLessonId) navigate(`/courses/${courseId}/lessons/${prevLessonId}`);
                    }}
                    isDisabled={!prevLessonId}
                >
                    Poprzednia lekcja
                </Button>

                <Button
                    onClick={() => {
                        if (nextLessonId) navigate(`/courses/${courseId}/lessons/${nextLessonId}`);
                    }}
                    isDisabled={!nextLessonId}
                >
                    Następna lekcja
                </Button>

                <Button colorScheme="teal" ml="auto" onClick={handleStartExercise}>
                    Startuj lekcję
                </Button>
            </HStack>

            <VStack align="start" spacing={4}>
                <Heading>{lesson.title ?? "Brak tytułu lekcji"}</Heading>

                {lesson.description && <Text>{lesson.description}</Text>}

                {lesson.videoUri ? (
                    <Text>
                        Film:{" "}
                        <ChakraLink href={lesson.videoUri} isExternal>
                            Otwórz wideo <span aria-hidden>↗</span>
                        </ChakraLink>
                    </Text>
                ) : (
                    <Text color="gray.500">Brak materiału wideo</Text>
                )}

                {lesson.textUri ? (
                    <Text>
                        Materiały tekstowe:{" "}
                        <ChakraLink href={lesson.textUri} isExternal>
                            Otwórz tekst <span aria-hidden>↗</span>
                        </ChakraLink>
                    </Text>
                ) : (
                    <Text color="gray.500">Brak materiałów tekstowych</Text>
                )}

                <Box pt={4}>
                    <Text fontSize="sm" color="gray.400">
                        Liczba ćwiczeń: {Array.isArray(lesson.exercises) ? lesson.exercises.length : 0}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
}

export default LessonPage;
