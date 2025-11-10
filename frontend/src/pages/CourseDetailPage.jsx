import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Text, Spinner, Heading, Button } from "@chakra-ui/react";
import {getCourseById} from "../api.js";
import {COURSE_DIFFICULTY} from "../constants.js";

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await getCourseById(id);
                setCourse(response.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <Spinner size="xl" />;
    if (error) return <Box color="red.400">{error}</Box>;
    if (!course) return null;

    return (
        <Box minH="100vh" bg="#0f0a19" color="gray.200" px={6} py={8}>
            <Button mb={4} onClick={() => navigate("/courses")}>← Powrót</Button>
            <Heading mb={4}>Tytuł: {course.title}</Heading>
            <Text mb={2}>Twórca: {course.createdBy}</Text>
            <Text mb={2}>Opis: {course.description}</Text>
            <Text fontSize="sm" color="gray.400">
                Poziom trudności: {COURSE_DIFFICULTY[course.difficultyLevel]}
            </Text>
            <Text fontSize="sm" color="gray.400">
                Ocena: {course.rating ?? 0}
            </Text>
            <Text fontSize="sm" color="gray.400">
                Utworzno: {new Date(course.createdOn).toLocaleDateString()}
            </Text>
        </Box>
    );
}
export default CourseDetailPage;
