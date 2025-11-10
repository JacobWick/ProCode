import { useEffect, useState } from "react";
import {
    Box,
    Text,
    SimpleGrid,
    Spinner,
    Heading,
    Container,
    Badge,
    VStack,
    HStack,
    useColorModeValue,
    Icon,
    Flex,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { getCourses } from "../api.js";
import { COURSE_DIFFICULTY } from "../constants.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CourseCard = ({ course, onClick }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");
    const titleColor = useColorModeValue("gray.800", "white");
    const descColor = useColorModeValue("gray.600", "gray.300");
    const metaColor = useColorModeValue("gray.500", "gray.400");


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
            <Flex h="140px" align="center" justify="center" bg={useColorModeValue("gray.50", "gray.900")}>
            </Flex>

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
