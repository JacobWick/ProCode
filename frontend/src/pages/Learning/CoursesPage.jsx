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
    Flex, Progress,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { getCourses, getCourseProgress } from "../../api.js";
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
                console.warn("Failed to load progress for course", course.id);
            }
        };
        fetchProgress();
        return () => { isMounted = false; };
    }, [course.id]);

    const percent = progress ? Math.round(progress.percentage):0;
    return (
        <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{ transform: "translateY(-6px)", shadow: "lg", cursor: "pointer" }}
            onClick={onClick}
        >
            {progress && (
                <Box position="absolute" top={0} left={0} right={0} zIndex={2}>
                    <Progress value={percent} size="xs" colorScheme="purple" />
                </Box>
            )}
            <Box p={5}>
                <Heading size="sm" mb={2} noOfLines={2} color={titleColor}>
                    {course.title}
                </Heading>

                <Text fontSize="sm" color={descColor} noOfLines={3} mb={3}>
                    {course.description ?? "Brak opisu"}
                </Text>
                <HStack spacing={3} align="center" mb={2}>
                    <HStack>
                        <Icon as={StarIcon} color="orange.400" />
                        <Text fontWeight="bold" color="orange.400">
                            {course.rating ?? "—"}
                        </Text>
                    </HStack>
                </HStack>

                <Text fontSize="sm" color={metaColor}>
                    Prowadzący: {course.createdBy ?? "—"}
                </Text>

                <Text mt={3} fontSize="sm" color={metaColor}>
                    Poziom trudności: {COURSE_DIFFICULTY[course.difficultyLevel] ?? "—"}
                </Text>
                {progress && progress.completedLessons > 0 && (
                    <Box mt={3} mb={2}>
                        <Text fontSize="xs" color="purple.500" fontWeight="bold" mb={1}>
                            Twój postęp: {percent}%
                        </Text>
                        <Progress value={percent} size="sm" colorScheme="purple" borderRadius="md" />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await getCourses();
                setCourses(res.data ?? []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Błąd podczas pobierania kursów");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const pageBg = useColorModeValue("gray.50", "gray.900");
    const headingColor = useColorModeValue("gray.800", "white");

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
            <Navbar />
            <Box flex="1" py={12}>
                <Container maxW="container.xl">
                    <VStack spacing={6} align="stretch" mb={6}>
                        <Heading color={headingColor}>Lista kursów</Heading>

                        {loading && (
                            <Box textAlign="center" py={10}>
                                <Spinner size="xl" />
                            </Box>
                        )}

                        {error && (
                            <Box bg="red.600" color="white" p={4} rounded="md">
                                {error}
                            </Box>
                        )}
                    </VStack>

                    {!loading && !error && (
                        <>
                            {courses.length === 0 ? (
                                <Box
                                    textAlign="center"
                                    py={20}
                                    color={useColorModeValue("gray.600", "gray.400")}
                                >
                                    Brak dostępnych kursów.
                                </Box>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {courses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onClick={() =>
                                                navigate(`/courses/${course.id}`, { state: { course } })
                                            }
                                        />
                                    ))}
                                </SimpleGrid>
                            )}
                        </>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}
export default CoursesPage;
