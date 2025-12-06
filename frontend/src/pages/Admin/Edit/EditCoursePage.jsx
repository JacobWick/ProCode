import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Container, Button, VStack, HStack, useToast, useColorModeValue,
    Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber,
    StepTitle, StepDescription, StepSeparator, useDisclosure, Spinner, Center, Text
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "../../../validationSchemas.js";

import CourseInfoStep from '../../../components/CourseInfoStep.jsx';
import LessonsStep from '../../../components/LessonsStep';
import ExercisesStep from '../../../components/ExercisesStep';
import SummaryStep from '../../../components/SummaryStep';
import TestModal from '../../../components/TestModal';
import SolutionModal from '../../../components/SolutionModal';

import {
    getCourseById, getLessons, getExercises,
    updateCourse, updateLesson, updateExercise,
    createLesson, createExercise,
    deleteLesson, deleteExercise,
    createTest, updateTest, getTestById,
    createSolutionExample, getSolutionExampleById, updateSolutionExample
} from '../../../api';

const STEPS = [
    { title: 'Edycja Kursu', description: 'Informacje' },
    { title: 'Lekcje', description: 'Struktura' },
    { title: 'Zadania', description: 'Praktyka' },
    { title: 'Zapisz', description: 'Podsumowanie' }
];

const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

export default function EditCoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    // Modals
    const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure();
    const { isOpen: isSolOpen, onOpen: onSolOpen, onClose: onSolClose } = useDisclosure();

    // Application State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Data State
    const [courseData, setCourseData] = useState({ title: '', description: '', difficultyLevel: 0 });
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [activeExercise, setActiveExercise] = useState(null);

    // Change Tracking
    const [modifiedCourse, setModifiedCourse] = useState(false);
    const [deletedLessonIds, setDeletedLessonIds] = useState([]);
    const [deletedExerciseIds, setDeletedExerciseIds] = useState([]);

    // Form Configuration
    const { setValue, getValues, trigger, formState: { errors } } = useForm({
        resolver: zodResolver(courseSchema),
        mode: "onBlur",
        defaultValues: { title: '', description: '', difficultyLevel: 0 }
    });

    // ==================== DATA FETCHING ====================

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Course
                const courseRes = await getCourseById(courseId);
                const course = courseRes.data;

                setCourseData({
                    title: course.title,
                    description: course.description,
                    difficultyLevel: course.difficultyLevel
                });
                setValue("title", course.title);
                setValue("description", course.description);
                setValue("difficultyLevel", course.difficultyLevel);

                // Fetch Lessons
                const lessonsRes = await getLessons();
                const courseLessons = lessonsRes.data.filter(l => l.courseId === courseId);
                setLessons(courseLessons);

                // Fetch Exercises with Tests and Solutions
                const exercisesRes = await getExercises();
                const allExercises = exercisesRes.data;

                const mappedExercises = await Promise.all(
                    allExercises
                        .filter(ex => courseLessons.some(l => (l.id || l.Id) === (ex.lessonId || ex.LessonId)))
                        .map(async (ex) => {
                            const lessonIndex = courseLessons.findIndex(l => (l.id || l.Id) === (ex.lessonId || ex.LessonId));
                            const lesson = courseLessons[lessonIndex];

                            // Map Test Data from InputData/OutputData (case-sensitive!)
                            let testCases = [];
                            const inputArr = ex.InputData || ex.inputData || [];
                            const outputArr = ex.OutputData || ex.outputData || [];
                            const len = Math.min(inputArr.length, outputArr.length);

                            for (let i = 0; i < len; i++) {
                                testCases.push({
                                    input: inputArr[i],
                                    output: outputArr[i]
                                });
                            }

                            // Get TestId (case-sensitive!)
                            const testId = ex.TestId || ex.testId || null;

                            // Fetch Solution Data if SolutionExampleId exists and is not empty GUID
                            let solution = null;
                            const solutionId = ex.SolutionExampleId || ex.solutionExampleId || null;
                            const emptyGuid = "00000000-0000-0000-0000-000000000000";

                            if (solutionId && solutionId !== emptyGuid) {
                                try {
                                    const solutionRes = await getSolutionExampleById(solutionId);
                                    // Extract only the fields we need
                                    solution = {
                                        code: solutionRes.data.Code || solutionRes.data.code,
                                        explanation: solutionRes.data.explanation || solutionRes.data.explanation,
                                    };
                                } catch (err) {
                                    console.error(`Error fetching solution for exercise ${ex.Id || ex.id}:`, err);
                                }
                            }

                            return {
                                ...ex,
                                id: ex.Id || ex.id,
                                lessonId: ex.LessonId || ex.lessonId,
                                description: ex.Description || ex.description,
                                initialContent: ex.InitialContent || ex.initialContent,
                                lessonIndex,
                                lessonTitle: lesson.title || lesson.Title,
                                testId,
                                solutionId,
                                testCases,
                                solution
                            };
                        })
                );

                setExercises(mappedExercises);

            } catch (error) {
                console.error("Fetch error:", error);
                toast({
                    title: "Błąd pobierania danych",
                    description: error.message,
                    status: "error",
                    duration: 5000
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) fetchData();
    }, [courseId, toast, setValue]);

    // ==================== EVENT HANDLERS ====================

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'difficultyLevel' ? parseInt(value) : value;
        setCourseData(prev => ({ ...prev, [name]: finalValue }));
        setValue(name, finalValue, { shouldValidate: true });
        setModifiedCourse(true);
    };

    // ==================== LESSON OPERATIONS ====================

    const addLesson = (lessonForm) => {
        const newLesson = {
            ...lessonForm,
            id: generateTempId(),
            isNew: true
        };
        setLessons(prev => [...prev, newLesson]);
        toast({ title: "Dodano lekcję", status: "success", duration: 1000 });
    };

    const updateLessonInState = (updatedLessonData) => {
        setLessons(prev => prev.map(lesson =>
            lesson.id === updatedLessonData.id
                ? { ...lesson, ...updatedLessonData, isNew: lesson.isNew }
                : lesson
        ));
        toast({ title: "Zaktualizowano lekcję", status: "info", duration: 1000 });
    };

    const removeLesson = (id) => {
        // Track deletion if lesson exists in DB
        if (typeof id === 'string' && !id.startsWith('temp_')) {
            setDeletedLessonIds(prev => [...prev, id]);

            // Track all exercises from this lesson that exist in DB
            const exercisesToDelete = exercises
                .filter(e => e.lessonId === id && typeof e.id === 'string' && !e.id.startsWith('temp_'))
                .map(e => e.id);

            if (exercisesToDelete.length > 0) {
                setDeletedExerciseIds(prev => [...prev, ...exercisesToDelete]);
            }
        }

        setLessons(prev => prev.filter(l => l.id !== id));
        setExercises(prev => prev.filter(e => e.lessonId !== id));
        toast({ title: "Usunięto lekcję i powiązane zadania", status: "info", duration: 1000 });
    };

    // ==================== EXERCISE OPERATIONS ====================

    const addExercise = (exerciseForm) => {
        const lesson = lessons[exerciseForm.lessonIndex];
        const newExercise = {
            ...exerciseForm,
            id: generateTempId(),
            isNew: true,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            testCases: [],
            solution: null,  // Explicitly null, no extra fields
            testId: null,
            solutionId: null
        };
        setExercises(prev => [...prev, newExercise]);
        toast({ title: "Dodano zadanie", status: "success", duration: 1000 });
    };

    const updateExerciseInState = (updatedExerciseData) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === updatedExerciseData.id) {
                return {
                    ...ex,
                    ...updatedExerciseData,
                    testCases: updatedExerciseData.testCases ?? ex.testCases,
                    solution: updatedExerciseData.solution ?? ex.solution,
                    testId: updatedExerciseData.testId ?? ex.testId,
                    solutionId: updatedExerciseData.solutionId ?? ex.solutionId
                };
            }
            return ex;
        }));
        toast({ title: "Zaktualizowano zadanie", status: "info", duration: 1000 });
    };

    const removeExercise = (id) => {
        if (typeof id === 'string' && !id.startsWith('temp_')) {
            setDeletedExerciseIds(prev => [...prev, id]);
        }
        setExercises(prev => prev.filter(e => e.id !== id));
        toast({ title: "Usunięto zadanie", status: "info", duration: 1000 });
    };

    // ==================== MODAL OPERATIONS ====================

    const handleOpenTest = (exerciseId) => {
        const exercise = exercises.find(e => e.id === exerciseId);
        console.log("=== Opening Test Modal ===");
        console.log("Exercise ID:", exerciseId);
        console.log("Found Exercise:", exercise);
        console.log("Test Cases:", exercise?.testCases);
        console.log("Test ID:", exercise?.testId);
        setActiveExercise(exercise);
        onTestOpen();
    };

    const handleOpenSolution = (exerciseId) => {
        const exercise = exercises.find(e => e.id === exerciseId);
        console.log("=== Opening Solution Modal ===");
        console.log("Exercise ID:", exerciseId);
        console.log("Found Exercise:", exercise);
        console.log("Solution:", exercise?.solution);
        console.log("Solution ID:", exercise?.solutionId);
        setActiveExercise(exercise);
        onSolOpen();
    };

    const updateExerciseWithTests = (tests) => {
        setExercises(prev => prev.map(ex =>
            ex.id === activeExercise?.id ? { ...ex, testCases: tests } : ex
        ));
        toast({ title: "Zaktualizowano testy", status: "info", duration: 1000 });
    };

    const updateExerciseWithSolution = (solution) => {
        // Only store the fields we need, strip out id, exerciseId, exercise
        const cleanSolution = {
            code: solution.code,
            explanation: solution.explanation
        };

        setExercises(prev => prev.map(ex =>
            ex.id === activeExercise?.id ? { ...ex, solution: cleanSolution } : ex
        ));
        toast({ title: "Zaktualizowano rozwiązanie", status: "info", duration: 1000 });
    };

    // ==================== NAVIGATION ====================

    const handleNextStep = async () => {
        if (activeStep === 0) {
            const isValid = await trigger();
            if (!isValid) {
                toast({ title: "Popraw błędy w formularzu", status: "warning" });
                return;
            }
        }
        setActiveStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setActiveStep(prev => prev - 1);
    };

    // ==================== SAVE LOGIC ====================

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const formValues = getValues();
            const emptyGuid = "00000000-0000-0000-0000-000000000000";

            // 1. Update Course if modified
            if (modifiedCourse) {
                await updateCourse(courseId, {
                    id: courseId,
                    title: formValues.title,
                    description: formValues.description,
                    difficultyLevel: formValues.difficultyLevel
                });
            }

            // 2. Delete removed items (exercises first due to foreign key constraints)
            if (deletedExerciseIds.length > 0) {
                await Promise.all(deletedExerciseIds.map(id => deleteExercise(id)));
            }
            if (deletedLessonIds.length > 0) {
                await Promise.all(deletedLessonIds.map(id => deleteLesson(id)));
            }

            // 3. Process Lessons (create new, update existing)
            const lessonIdMap = {};
            for (const lesson of lessons) {
                if (lesson.isNew) {
                    const res = await createLesson({
                        courseId,
                        title: lesson.title,
                        description: lesson.description,
                        videoUri: lesson.videoUri || null,
                        textUri: lesson.textUri || null
                    });
                    lessonIdMap[lesson.id] = res.data?.id || res.id;
                } else {
                    await updateLesson(lesson.id, {
                        title: lesson.title,
                        description: lesson.description,
                        videoUri: lesson.videoUri || null,
                        textUri: lesson.textUri || null,
                        exercises: []
                    });
                    lessonIdMap[lesson.id] = lesson.id;
                }
            }

            // 4. Process Exercises with Tests and Solutions
            for (const exercise of exercises) {
                const realLessonId = lessonIdMap[exercise.lessonId] || exercise.lessonId;
                let currentExerciseId = exercise.id;

                // Create or Update Exercise
                if (exercise.isNew) {
                    const res = await createExercise({
                        lessonId: realLessonId,
                        description: exercise.description,
                        initialContent: exercise.initialContent
                    });
                    currentExerciseId = res.data?.id || res.id;
                } else {
                    await updateExercise(exercise.id, {
                        id: exercise.id,
                        lessonId: realLessonId,
                        description: exercise.description,
                        initialContent: exercise.initialContent
                    });
                }

                // Handle Tests
                if (exercise.testCases?.length > 0) {
                    const inputData = exercise.testCases.map(tc => tc.input);
                    const outputData = exercise.testCases.map(tc => tc.output);

                    // Check if testId exists and is not empty GUID
                    if (exercise.testId && exercise.testId !== emptyGuid) {
                        await updateTest(exercise.testId, {
                            id: exercise.testId,
                            inputData,
                            outputData
                        });
                    } else {
                        await createTest({
                            exerciseId: currentExerciseId,
                            inputData,
                            outputData
                        });
                    }
                }

                // Handle Solutions
                // Handle Solutions
                if (exercise.solution) {
                    // 1. Pobierz wartości (obsługa camelCase i PascalCase)
                    const solCode = exercise.solution.code || exercise.solution.Code || '';
                    const solExplanation = exercise.solution.explanation || exercise.solution.Explanation || '';

                    // 2. Sprawdź ID
                    const hasValidId = exercise.solutionId &&
                        exercise.solutionId !== emptyGuid;

                    if (hasValidId) {
                        // UPDATE
                        console.log("UPDATING solution:", exercise.solutionId);

                        // ✅ POPRAWKA: Tworzymy jawny obiekt (payload) TYLKO z wymaganymi polami.
                        // Ignorujemy 'exerciseId', 'exercise', 'language' itd. ze stanu.
                        const cleanPayload = {
                            id: exercise.solutionId,
                            code: solCode,
                            explanation: solExplanation
                        };

                        await updateSolutionExample(exercise.solutionId, cleanPayload);
                    } else {
                        // CREATE
                        console.log("CREATING solution for exercise:", currentExerciseId);

                        // Tutaj exerciseId JEST potrzebne
                        await createSolutionExample({
                            exerciseId: currentExerciseId,
                            code: solCode,
                            explanation: solExplanation
                        });
                    }
                }
            }
            toast({ title: "Zmiany zapisane pomyślnie!", status: "success" });
            navigate('/courses');

        } catch (error) {
            console.error("Save Error:", error);
            toast({
                title: "Błąd zapisu",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ==================== RENDER ====================

    if (isLoading) {
        return (
            <Center minH="100vh" bg={pageBg}>
                <VStack>
                    <Spinner size="xl" color="purple.500" />
                    <Text mt={4}>Ładowanie danych...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Box minH="100vh" bg={pageBg} py={10}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between">
                        <Button
                            leftIcon={<ArrowBackIcon />}
                            variant="ghost"
                            onClick={() => navigate('/courses')}
                        >
                            Anuluj
                        </Button>
                        <HStack spacing={4}>
                            <Text fontSize="sm" color="gray.500">
                                Lekcje: {lessons.length} | Zadania: {exercises.length}
                            </Text>
                            <Text fontSize="sm" color="gray.500">Tryb Edycji</Text>
                        </HStack>
                    </HStack>

                    {/* Main Content */}
                    <Box bg="white" p={8} borderRadius="xl" shadow="sm">
                        {/* Stepper */}
                        <Stepper index={activeStep} mb={8} colorScheme="purple">
                            {STEPS.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>
                                    <Box flexShrink="0" display={{ base: 'none', md: 'block' }}>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>
                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>

                        {/* Step Content */}
                        {activeStep === 0 && (
                            <CourseInfoStep
                                data={courseData}
                                onChange={handleCourseChange}
                                errors={errors}
                            />
                        )}

                        {activeStep === 1 && (
                            <LessonsStep
                                lessons={lessons}
                                onAdd={addLesson}
                                onRemove={removeLesson}
                                onUpdate={updateLessonInState}
                            />
                        )}

                        {activeStep === 2 && (
                            <ExercisesStep
                                lessons={lessons}
                                exercises={exercises}
                                onAdd={addExercise}
                                onRemove={removeExercise}
                                onUpdate={updateExerciseInState}
                                onOpenTest={handleOpenTest}
                                onOpenSolution={handleOpenSolution}
                            />
                        )}

                        {activeStep === 3 && (
                            <SummaryStep
                                data={courseData}
                                lessons={lessons}
                                exercises={exercises}
                            />
                        )}

                        {/* Footer */}
                        <Box mt={10} pt={4} borderTopWidth="1px" borderColor="gray.200">
                            <Text fontSize="xs" color="gray.500" textAlign="right" mb={3}>
                                Pola oznaczone (<Box as="span" color="red.500">*</Box>) są wymagane
                            </Text>
                            <HStack justify="space-between">
                                <Button
                                    onClick={handlePrevStep}
                                    isDisabled={activeStep === 0}
                                    variant="ghost"
                                >
                                    Wstecz
                                </Button>
                                <Button
                                    colorScheme="purple"
                                    onClick={activeStep === 3 ? handleSaveChanges : handleNextStep}
                                    isLoading={isSaving}
                                >
                                    {activeStep === 3 ? "Zapisz zmiany" : "Dalej"}
                                </Button>
                            </HStack>
                        </Box>
                    </Box>
                </VStack>
            </Container>

            {/* Modals */}
            <TestModal
                isOpen={isTestOpen}
                onClose={onTestClose}
                initialTests={activeExercise?.testCases || []}
                onSave={updateExerciseWithTests}
            />
            <SolutionModal
                isOpen={isSolOpen}
                onClose={onSolClose}
                initialSolution={activeExercise?.solution || null}
                onSave={updateExerciseWithSolution}
            />
        </Box>
    );
}