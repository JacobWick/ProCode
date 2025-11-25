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
    Stack,
} from "@chakra-ui/react";
import { getCourseById } from "../../api.js";
import { COURSE_DIFFICULTY } from "../../constants.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const titleColor = useColorModeValue("gray.800", "white");
    const metaColor = useColorModeValue("gray.600", "gray.400");
    const accent = useColorModeValue("purple.500", "purple.300");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const iconBg = useColorModeValue("purple.50", "gray.900");

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await getCourseById(id);
                setCourse(response.data ?? null);
            } catch (err) {
                console.error(err);
                setError(err?.message ?? "Błąd podczas pobierania kursu");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const startCourse = () => {
        if (!course?.lessons || course.lessons.length === 0) {
            alert("Ten kurs nie posiada lekcji.");
            return;
        }
        const lessonId = course.lessons[0];
        navigate(`/courses/${course.id}/lessons/${lessonId}`);
    };

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
            <Navbar />

            <Box flex="1" py={10}>
                <Container maxW="container.xl">
                    {loading ? (
                        <Box textAlign="center" py={12}>
                            <Spinner size="xl" />
                        </Box>
                    ) : error ? (
                        <Box bg="red.600" color="white" p={4} rounded="md">
                            {error}
                        </Box>
                    ) : !course ? (
                        <Box textAlign="center" py={12} color={metaColor}>
                            Nie znaleziono kursu.
                        </Box>
                    ) : (
                        <Stack direction={{ base: "column", md: "row" }} spacing={8} align="flex-start">
                            <Box
                                flex="1"
                                bg={cardBg}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={borderColor}
                                p={6}
                                shadow="sm"
                            >
                                <VStack align="start" spacing={4}>
                                    <HStack spacing={4} align="center" w="100%">
                                        <Box
                                            w="84px"
                                            h="84px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            fontSize="3xl"
                                            borderRadius="md"
                                            bg={iconBg}
                                        >
                                            {course.category === "Python" ? "🐍" : course.category === "React" ? "⚛️" : "🎓"}
                                        </Box>

                                        <Box flex="1">
                                            <Heading size="lg" color={titleColor} mb={1}>
                                                {course.title}
                                            </Heading>
                                            <Text fontSize="sm" color={metaColor}>
                                                {course.createdBy ?? "Autor nieznany"}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <Badge colorScheme="purple">{course.category ?? "Inne"}</Badge>

                                    <Text color={metaColor} noOfLines={6}>
                                        {course.description ?? "Brak opisu kursu."}
                                    </Text>

                                    <HStack spacing={6} pt={2}>
                                        <Text fontWeight="bold" color={accent}>
                                            Ocena: {course.rating ?? "—"}
                                        </Text>
                                        <Text fontSize="sm" color={metaColor}>
                                            {course.students ? `${course.students} uczniów` : "Brak uczniów"}
                                        </Text>
                                        <Text fontSize="sm" color={metaColor}>
                                            Poziom: {COURSE_DIFFICULTY[course.difficultyLevel] ?? "—"}
                                        </Text>
                                    </HStack>

                                    <HStack spacing={3} pt={4}>
                                        <Button colorScheme="purple" onClick={startCourse} isDisabled={!course.lessons || course.lessons.length === 0}>
                                            Rozpocznij kurs
                                        </Button>

                                        <Button variant="outline" onClick={() => navigate("/courses")}>
                                            ← Powrót do listy
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                            <Box w={{ base: "100%", md: "360px" }}>
                                <Box
                                    bg={cardBg}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    p={5}
                                    shadow="sm"
                                >
                                    <VStack align="start" spacing={3}>
                                        <Text fontSize="sm" color={metaColor}>
                                            Utworzono:{" "}
                                            <Text as="span" color={titleColor} fontWeight="semibold">
                                                {course.createdOn ? new Date(course.createdOn).toLocaleDateString("pl-PL") : "—"}
                                            </Text>
                                        </Text>

                                        <Text fontSize="sm" color={metaColor}>
                                            Liczba lekcji:{" "}
                                            <Text as="span" color={titleColor} fontWeight="semibold">
                                                {course.lessons?.length ?? 0}
                                            </Text>
                                        </Text>
                                    </VStack>
                                </Box>
                            </Box>
                        </Stack>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}
export default CourseDetailPage;