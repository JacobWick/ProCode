import { useEffect, useState } from "react";
import {
    Box,
    Text,
    Spinner,
    Heading,
    Container,
    VStack,
    HStack,
    useColorModeValue,
    Icon,
    IconButton,
    Alert,
    AlertIcon,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import { StarIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {deleteCourse, getCourses} from "../api.js";
import { COURSE_DIFFICULTY } from "../constants.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CourseListItem = ({ course, onEdit, onDelete }) => {
    const itemBg = useColorModeValue("white", "gray.800");
    const itemBorder = useColorModeValue("gray.200", "gray.700");
    const titleColor = useColorModeValue("gray.800", "white");
    const descColor = useColorModeValue("gray.600", "gray.300");
    const metaColor = useColorModeValue("gray.500", "gray.400");

    return (
        <Box
            bg={itemBg}
            borderWidth="1px"
            borderColor={itemBorder}
            borderRadius="lg"
            p={5}
            transition="box-shadow 0.2s"
            _hover={{ shadow: "md" }}
        >
            <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2} flex="1">
                    <Heading size="md" color={titleColor}>
                        {course.title}
                    </Heading>

                    <Text fontSize="sm" color={descColor}>
                        {course.description ?? "Brak opisu"}
                    </Text>

                    <HStack spacing={4} mt={2}>
                        <HStack>
                            <Icon as={StarIcon} color="orange.400" />
                            <Text fontWeight="bold" color="orange.400" fontSize="sm">
                                {course.rating ?? "—"}
                            </Text>
                        </HStack>

                        <Text fontSize="sm" color={metaColor}>
                            Poziom: {COURSE_DIFFICULTY[course.difficultyLevel] ?? "—"}
                        </Text>
                    </HStack>
                </VStack>

                <HStack spacing={2}>
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Edytuj kurs"
                        onClick={() => onEdit(course)}
                    />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Usuń kurs"
                        onClick={() => onDelete(course)}
                    />
                </HStack>
            </HStack>
        </Box>
    );
};

function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCourses = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Nie jesteś zalogowany");
                    setLoading(false);
                    return;
                }

                const decoded = jwtDecode(token);
                const userId = decoded.nameidentifier;

                const res = await getCourses();
                const allCourses = res.data ?? [];

                const myCourses = allCourses.filter(
                    (course) => course.createdBy === userId
                );

                setCourses(myCourses);
            } catch (err) {
                console.error(err);
                setError(err.message || "Błąd podczas pobierania kursów");
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    const handleEdit = (course) => {
        navigate(`/edit-course/${course.id}`);
    };

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCourse(courseToDelete.id);

            setCourses(courses.filter(c => c.id !== courseToDelete.id));
            onClose();
            setCourseToDelete(null);
        } catch (err) {
            console.error(err);
            setError("Błąd podczas usuwania kursu");
        }
    };

    const pageBg = useColorModeValue("gray.50", "gray.900");
    const headingColor = useColorModeValue("gray.800", "white");

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
            <Navbar />
            <Box flex="1" py={12}>
                <Container maxW="container.xl">
                    <VStack spacing={6} align="stretch">
                        <Heading color={headingColor}>Moje kursy</Heading>

                        {loading && (
                            <Box textAlign="center" py={10}>
                                <Spinner size="xl" />
                            </Box>
                        )}

                        {error && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        {!loading && !error && (
                            <>
                                {courses.length === 0 ? (
                                    <Box
                                        textAlign="center"
                                        py={20}
                                        color={useColorModeValue("gray.600", "gray.400")}
                                    >
                                        Nie masz jeszcze żadnych kursów.
                                    </Box>
                                ) : (
                                    <VStack spacing={4} align="stretch">
                                        {courses.map((course) => (
                                            <CourseListItem
                                                key={course.id}
                                                course={course}
                                                onEdit={handleEdit}
                                                onDelete={handleDeleteClick}
                                            />
                                        ))}
                                    </VStack>
                                )}
                            </>
                        )}
                    </VStack>
                </Container>
            </Box>
            <Footer />

            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Usuń kurs
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Czy na pewno chcesz usunąć kurs "{courseToDelete?.title}"?
                            Ta operacja jest nieodwracalna.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose}>
                                Anuluj
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Usuń
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default MyCoursesPage;