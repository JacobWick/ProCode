import { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Flex,
    Text,
    Container,
    Heading,
    VStack,
    HStack,
    Badge,
    Button,
    SimpleGrid,
    Spinner,
    useColorModeValue,
    Link,
    useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { getMyProfile, getCourseProgress } from '../../api.js';
import { useNavigate } from 'react-router-dom';
import EditInterests from '../../components/EditInterests.jsx';

const UserProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [courseProgress, setCourseProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            console.log('Fetching profile data...');
            const profileResponse = await getMyProfile();
            const profile = profileResponse.data;
            console.log('Profile data received:', profile);
            console.log('Profile details:', {
                id: profile.id,
                userId: profile.userId,
                userName: profile.userName,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.userEmail,
                roles: profile.roles,
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
                website: profile.website,
                gitHubLink: profile.gitHubLink,
                linkedinLink: profile.linkedinLink,
                courseIds: profile.courseIds,
                courseCount: profile.courseIds?.length || 0
            });
            setProfileData(profile);

            if (profile.courseIds && profile.courseIds.length > 0) {
                console.log(`Fetching progress for ${profile.courseIds.length} courses...`);
                const progressPromises = profile.courseIds.map((courseId, index) => 
                    getCourseProgress(courseId)
                        .then(response => {
                            console.log(`Course ${index + 1}/${profile.courseIds.length} progress received:`, {
                                courseId,
                                data: response.data
                            });
                            return {
                                courseId,
                                ...response.data
                            };
                        })
                        .catch(error => {
                            console.error(`Error fetching progress for course ${courseId}:`, error);
                            return null;
                        })
                );

                const progressResults = await Promise.all(progressPromises);
                const validProgress = progressResults.filter(p => p !== null);
                console.log('All course progress data:', validProgress);
                console.log('Progress summary:', {
                    totalCourses: validProgress.length,
                    completed: validProgress.filter(c => c.completedLessons === c.totalLessons).length,
                    inProgress: validProgress.filter(c => c.completedLessons > 0 && c.completedLessons < c.totalLessons).length,
                    notStarted: validProgress.filter(c => c.completedLessons === 0).length
                });
                setCourseProgress(validProgress);
            } else {
                console.log('No courses found for this user');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast({
                title: 'Błąd',
                description: 'Nie udało się pobrać danych profilu',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            console.log('Data fetching completed');
        }
    };

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text color={textColor}>Ładowanie profilu...</Text>
                </VStack>
            </Flex>
        );
    }

    if (!profileData) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
                <VStack spacing={4}>
                    <Text fontSize="xl" color={textColor}>Nie znaleziono danych profilu</Text>
                    <Button colorScheme="purple" onClick={fetchData}>Spróbuj ponownie</Button>
                </VStack>
            </Flex>
        );
    }
    
    const completedCourses = courseProgress.filter(c => c.completedLessons === c.totalLessons);
    const inProgressCourses = courseProgress.filter(c => c.completedLessons > 0 && c.completedLessons < c.totalLessons);
    const totalCourses = profileData?.courseIds?.length || 0;

    const calculatePercentage = (completed, total) => {
        return total === 0 ? 0 : Math.round((completed / total) * 100);
    };

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Header z profilem */}
            <Box bg="purple.500" py={12}>
                <Container maxW="container.xl">
                    <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                        <Avatar 
                            name={`${profileData.firstName} ${profileData.lastName}`}
                            src={profileData?.avatarUrl}
                            size="2xl"
                            border="4px solid white"
                        />
                        <VStack align={{ base: 'center', md: 'start' }} spacing={2} flex={1}>
                            <HStack flexWrap="wrap" justify={{ base: 'center', md: 'start' }}>
                                <Heading size="lg" color="white">
                                    {profileData.firstName} {profileData.lastName}
                                </Heading>
                                {profileData.roles && profileData.roles.length > 0 && (
                                    profileData.roles.map((role, index) => (
                                        <Badge key={index} colorScheme="yellow" fontSize="md">
                                            {role}
                                        </Badge>
                                    ))
                                )}
                            </HStack>
                            <Text color="purple.100" fontSize="lg">@{profileData.userName}</Text>
                            {profileData.userEmail && (
                                <Text color="purple.100" fontSize="sm">{profileData.userEmail}</Text>
                            )}
                            
                            {/* Social Links */}
                            {(profileData?.website || profileData?.gitHubLink || profileData?.linkedinLink) && (
                                <HStack spacing={4} pt={2} flexWrap="wrap" justify={{ base: 'center', md: 'start' }}>
                                    {profileData?.website && (
                                        <Link href={profileData.website} isExternal color="white" _hover={{ color: 'purple.100' }}>
                                            <HStack>
                                                <Text fontSize="sm">🌐 Website</Text>
                                                <ExternalLinkIcon />
                                            </HStack>
                                        </Link>
                                    )}
                                    {profileData?.gitHubLink && (
                                        <Link href={profileData.gitHubLink} isExternal color="white" _hover={{ color: 'purple.100' }}>
                                            <HStack>
                                                <Text fontSize="sm">GitHub</Text>
                                                <ExternalLinkIcon />
                                            </HStack>
                                        </Link>
                                    )}
                                    {profileData?.linkedinLink && (
                                        <Link href={profileData.linkedinLink} isExternal color="white" _hover={{ color: 'purple.100' }}>
                                            <HStack>
                                                <Text fontSize="sm">LinkedIn</Text>
                                                <ExternalLinkIcon />
                                            </HStack>
                                        </Link>
                                    )}
                                </HStack>
                            )}
                        </VStack>
                        <Button onClick={() => navigate('edit')} colorScheme="whiteAlpha" size="lg">
                            Edytuj profil
                        </Button>
                    </Flex>
                </Container>
            </Box>

            {/* Statystyki */}
            <Container maxW="container.xl" mt={-8}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
                    <Box
                        bg={cardBg}
                        p={6}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        textAlign="center"
                        transition="transform 0.2s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    >
                        <Text fontSize="3xl" mb={2}>✓</Text>
                        <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                            {completedCourses.length}
                        </Text>
                        <Text color={textColor}>Ukończone kursy</Text>
                    </Box>
                    <Box
                        bg={cardBg}
                        p={6}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        textAlign="center"
                        transition="transform 0.2s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    >
                        <Text fontSize="3xl" mb={2}>📚</Text>
                        <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                            {inProgressCourses.length}
                        </Text>
                        <Text color={textColor}>W trakcie</Text>
                    </Box>
                    <Box
                        bg={cardBg}
                        p={6}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        textAlign="center"
                        transition="transform 0.2s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    >
                        <Text fontSize="3xl" mb={2}>📖</Text>
                        <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                            {totalCourses}
                        </Text>
                        <Text color={textColor}>Wszystkie kursy</Text>
                    </Box>
                </SimpleGrid>

                {/* O mnie */}
                {profileData?.bio && (
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        mb={8}
                    >
                        <Heading size="md" mb={4}>O mnie</Heading>
                        <Text color={textColor} lineHeight="tall">
                            {profileData.bio}
                        </Text>
                    </Box>
                )}

                {/* Kursy w trakcie */}
                {inProgressCourses.length > 0 && (
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        mb={8}
                    >
                        <Heading size="md" mb={6}>Kursy w trakcie</Heading>
                        <VStack spacing={4} align="stretch">
                            {inProgressCourses.map((course) => {
                                const percentage = calculatePercentage(course.completedLessons, course.totalLessons);
                                const courseTitle = course.title || `Kurs ${course.courseId}`;
                                return (
                                    <Box key={course.courseId}>
                                        <Flex justify="space-between" mb={2} flexWrap="wrap" gap={2}>
                                            <VStack align="start" spacing={0} flex={1} minW="200px">
                                                <Text fontWeight="bold">{courseTitle}</Text>
                                                <HStack flexWrap="wrap">
                                                    <Badge colorScheme="purple">W trakcie</Badge>
                                                    <Text fontSize="sm" color={textColor}>
                                                        {course.completedLessons}/{course.totalLessons} lekcji
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                            <Text fontWeight="bold" color="purple.500" fontSize="lg">
                                                {percentage}%
                                            </Text>
                                        </Flex>
                                        <Box bg={useColorModeValue('gray.200', 'gray.700')} h="8px" borderRadius="full">
                                            <Box 
                                                bg="purple.500" 
                                                h="100%" 
                                                borderRadius="full" 
                                                width={`${percentage}%`}
                                                transition="width 0.3s"
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </VStack>
                    </Box>
                )}

                {/* Ukończone kursy */}
                {completedCourses.length > 0 && (
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        mb={8}
                    >
                        <Heading size="md" mb={6}>Ukończone kursy</Heading>
                        <VStack spacing={4} align="stretch">
                            {completedCourses.map((course) => {
                                const courseTitle = course.title || `Kurs ${course.courseId}`;
                                return (
                                    <Flex 
                                        key={course.courseId}
                                        justify="space-between" 
                                        align="center"
                                        p={4}
                                        bg={useColorModeValue('purple.50', 'gray.700')}
                                        borderRadius="md"
                                        flexWrap="wrap"
                                        gap={2}
                                    >
                                        <VStack align="start" spacing={1} flex={1} minW="200px">
                                            <Text fontWeight="bold">{courseTitle}</Text>
                                            <HStack flexWrap="wrap">
                                                <Badge colorScheme="green">Ukończony</Badge>
                                                <Text fontSize="sm" color={textColor}>
                                                    {course.totalLessons} lekcji
                                                </Text>
                                            </HStack>
                                        </VStack>
                                        <Text fontSize="2xl">✓</Text>
                                    </Flex>
                                );
                            })}
                        </VStack>
                    </Box>
                )}

                {/* Gdy brak kursów */}
                {courseProgress.length === 0 && totalCourses === 0 && (
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        mb={8}
                        textAlign="center"
                    >
                        <Text fontSize="3xl" mb={4}>📚</Text>
                        <Heading size="md" mb={2}>Nie masz jeszcze żadnych kursów</Heading>
                        <Text color={textColor} mb={4}>Zacznij naukę i rozwijaj swoje umiejętności!</Text>
                        <Button colorScheme="purple">Przeglądaj kursy</Button>
                    </Box>
                )}

                {/* Nierozpoczęte kursy */}
                {courseProgress.length > 0 && inProgressCourses.length === 0 && completedCourses.length === 0 && (
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        mb={8}
                    >
                        <Heading size="md" mb={6}>Twoje kursy</Heading>
                        <VStack spacing={4} align="stretch">
                            {courseProgress.map((course) => {
                                const courseTitle = course.title || `Kurs ${course.courseId}`;
                                return (
                                    <Flex 
                                        key={course.courseId}
                                        justify="space-between" 
                                        align="center"
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="md"
                                        flexWrap="wrap"
                                        gap={2}
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                                    >
                                        <VStack align="start" spacing={1} flex={1} minW="200px">
                                            <Text fontWeight="bold">{courseTitle}</Text>
                                            <HStack flexWrap="wrap">
                                                <Badge colorScheme="gray">Nierozpoczęty</Badge>
                                                <Text fontSize="sm" color={textColor}>
                                                    {course.totalLessons} lekcji
                                                </Text>
                                            </HStack>
                                        </VStack>
                                        <Button onClick={() => navigate(`/courses/${course.courseId}`)} colorScheme="purple" size="sm">
                                            Rozpocznij
                                        </Button>
                                    </Flex>
                                );
                            })}
                        </VStack>
                    </Box>
                )}
            <EditInterests/>
            </Container>
        </Box>
    );
};

export default UserProfile;