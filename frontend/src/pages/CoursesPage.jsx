import { useEffect, useState } from "react";
import {Box, Text, SimpleGrid, Spinner, Heading, Link} from "@chakra-ui/react";
import { getCourses } from "../api.js";
import {COURSE_DIFFICULTY} from "../constants.js";

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await getCourses();
                setCourses(res.data);
            } catch (error) {
                console.error(error);
                setError(error.message || "Błąd podczas pobierania kursów");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Box minH="100vh" bg="#0f0a19" color="gray.200" px={6} py={8}>
            <Heading mb={6} color="white">
                Lista kursów
            </Heading>
            {loading && (
                <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                </Box>
            )}
            {error && (
                <Box bg="red.700" color="white" p={4} rounded="md">
                    {error}
                </Box>
            )}
            {!loading && !error && (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                    {courses.map((course) => (
                        <Link key={course.id} to={`/courses/${course.id}`}>
                            <Box bg="#1c1530" p={4} rounded="lg" shadow="md" _hover={{ bg: "#261d42" }}>
                                <Text fontWeight="bold" fontSize="lg" color="white">
                                    {course.title}
                                </Text>
                                <Text mt={2} noOfLines={3}>
                                    {course.description}
                                </Text>
                                <Text mt={4} fontSize="sm" color="gray.400">
                                    Poziom trudności: {COURSE_DIFFICULTY[course.difficultyLevel] ?? "—"}
                                </Text>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}

export default CoursesPage;
