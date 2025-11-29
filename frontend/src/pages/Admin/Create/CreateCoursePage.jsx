import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Button, VStack, HStack,
    useToast, useColorModeValue, Stepper, Step, StepIndicator,
    StepStatus, StepIcon, StepNumber, StepTitle, StepDescription,
    StepSeparator, useDisclosure, Heading, Text
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import CourseInfoStep from '../../../components/CourseInfoStep.jsx';
import LessonsStep from '../../../components/CreateLessonsStep.jsx';
import ExercisesStep from '../../../components/CreateExercisesStep.jsx';
import SummaryStep from '../../../components/SummaryStep.jsx';
import TestCreationModal from '../../../components/TestCreationModal.jsx';
import SolutionCreationModal from '../../../components/SolutionCreationModal.jsx';
import {createCourse, createExercise, createLesson, createSolutionExample, createTest} from "../../../api.js";
import {jwtDecode} from "jwt-decode";

const steps = [
    { title: 'Kurs', description: 'Informacje' },
    { title: 'Lekcje', description: 'Struktura' },
    { title: 'Zadania', description: 'Praktyka' },
    { title: 'Koniec', description: 'Zapisz' }
];

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure();
    const { isOpen: isSolOpen, onOpen: onSolOpen, onClose: onSolClose } = useDisclosure();

    const [activeStep, setActiveStep] = useState(0);
    const [courseData, setCourseData] = useState({ title: '', description: '', difficultyLevel: 0 });
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [activeExerciseId, setActiveExerciseId] = useState(null);

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: name === 'difficultyLevel' ? parseInt(value) : value }));
    };

    const addLesson = (lessonForm) => {
        setLessons(prev => [...prev, { ...lessonForm, id: Date.now() }]);
    };

    const removeLesson = (id) => {
        setLessons(prev => prev.filter(l => l.id !== id));
        setExercises(prev => prev.filter(e => e.lessonId !== id));
    };

    const addExercise = (exerciseForm) => {
        const lesson = lessons[exerciseForm.lessonIndex];
        setExercises(prev => [...prev, {
            ...exerciseForm,
            id: Date.now(),
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            testCases: [],
            solution: null
        }]);
    };

    const updateExerciseWithTests = (tests) => {
        setExercises(prev => prev.map(ex => ex.id === activeExerciseId ? { ...ex, testCases: tests } : ex));
    };

    const updateExerciseWithSolution = (solution) => {
        setExercises(prev => prev.map(ex => ex.id === activeExerciseId ? { ...ex, solution: solution } : ex));
    };

    const handleNext = () => {
        if (activeStep === 0 && !courseData.title) return toast({ title: "Błąd", description: "Wymagany tytuł", status: "error" });
        if (activeStep === 1 && lessons.length === 0) return toast({ title: "Błąd", description: "Brak lekcji", status: "error" });
        setActiveStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const createdCourseResponse = await createCourse({
                title: courseData.title,
                description: courseData.description,
                difficultyLevel: courseData.difficultyLevel,
                createdBy: decoded.nameidentifier
            });
            const courseId = createdCourseResponse.data.id;
            for (const lesson of lessons) {
                const createdLessonResponse = await createLesson({
                    courseId: courseId,
                    title: lesson.title,
                    description: lesson.description,
                    videoUri: lesson.videoUri,
                    textUri: lesson.textUri,
                    exerciseIds: [],
                });
                const lessonId = createdLessonResponse.data.id;
                for (const exercise of exercises) {

                    const createdExerciseResponse = await createExercise({
                        description: exercise.description,
                        initialContent: exercise.initialContent,
                        lessonId: lessonId
                    });
                    const exerciseId = createdExerciseResponse.data.id;

                    if (exercise.testCases && exercise.testCases.length > 0) {
                        await createTest({
                            exerciseId: exerciseId,
                            inputData: exercise.testCases.map(tc => tc.input),
                            outputData: exercise.testCases.map(tc => tc.output),
                        });
                    }

                    if (exercise.solution) {
                        await createSolutionExample({
                            exerciseId: exerciseId,
                            code: exercise.solution.code,
                            explanation: exercise.solution.explanation,
                        });
                    }
                }
            }


            toast({
                title: "Sukces",
                description: "Kurs został utworzony pomyślnie!",
                status: "success",
                duration: 5000,
            });
            navigate("/")
        }
        catch(error) {
            console.error(error);
            toast({
                title: "Błąd!",
                description: "Wystąpił błąd podczas tworzenia kursu.",
                status: "error",
            })
        }
    };

    const pageBg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={pageBg} py={10}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="stretch">
                    <HStack>
                        <Button leftIcon={<ArrowBackIcon />} variant="ghost" onClick={() => navigate('/')}>Powrót</Button>
                    </HStack>
                    <Box>
                        <Heading size="xl" mb={2}>
                            Kreator nowego kursu
                        </Heading>
                        <Text color="gray.500">
                            Uzupełnij kolejne kroki, aby zbudować kompletny kurs z lekcjami i zadaniami.
                        </Text>
                    </Box>
                    <Box bg="white" p={8} borderRadius="xl" shadow="sm">
                        <Stepper index={activeStep} mb={8} colorScheme="purple">
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator><StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} /></StepIndicator>
                                    <Box flexShrink="0" display={{ base: 'none', md: 'block' }}>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>
                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === 0 && <CourseInfoStep data={courseData} onChange={handleCourseChange} />}
                        {activeStep === 1 && <LessonsStep lessons={lessons} onAdd={addLesson} onRemove={removeLesson} />}
                        {activeStep === 2 && <ExercisesStep
                            lessons={lessons}
                            exercises={exercises}
                            onAdd={addExercise}
                            onRemove={(id) => setExercises(prev => prev.filter(e => e.id !== id))}
                            onOpenTest={(id) => { setActiveExerciseId(id); onTestOpen(); }}
                            onOpenSolution={(id) => { setActiveExerciseId(id); onSolOpen(); }}
                        />}
                        {activeStep === 3 && <SummaryStep data={courseData} lessons={lessons} exercises={exercises} />}
                        <Box mt={10} pt={4} borderTopWidth="1px" borderColor="gray.200">
                            <Text fontWeight="bold"fontSize="xs" color="black" textAlign="right" mb={3}>
                                Pola oznaczone symbolem (<Box as="span" color="red.500">*</Box>) są wymagane
                            </Text>
                            <HStack justify="space-between">
                                <Button
                                    onClick={() => setActiveStep(p => p - 1)}
                                    isDisabled={activeStep === 0}
                                    variant="ghost"
                                >
                                    Wstecz
                                </Button>

                                <Button
                                    colorScheme="purple"
                                    onClick={activeStep === 3 ? handleSubmit : handleNext}
                                >
                                    {activeStep === 3 ? "Utwórz kurs" : "Dalej"}
                                </Button>
                            </HStack>
                        </Box>
                    </Box>

                </VStack>
            </Container>

            <TestCreationModal
                isOpen={isTestOpen}
                onClose={onTestClose}
                initialTests={exercises.find(e => e.id === activeExerciseId)?.testCases}
                onSave={updateExerciseWithTests}
            />
            <SolutionCreationModal
                isOpen={isSolOpen}
                onClose={onSolClose}
                initialSolution={exercises.find(e => e.id === activeExerciseId)?.solution}
                onSave={updateExerciseWithSolution}
            />
        </Box>
    );
}