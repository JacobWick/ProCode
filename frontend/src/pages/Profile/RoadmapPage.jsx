import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { Box, Container, Flex, Text, Spinner, Heading, Card, CardBody, Stack, Badge, useColorModeValue } from "@chakra-ui/react";
import { getRecommendedCourses } from "../../api.js";

export default function RoadmapPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const response = await getRecommendedCourses();
        const data = response.data;
        setCourses(data.recommendedCourses || []);
      } catch (err) {
        setError("Nie udało się pobrać rekomendowanych kursów");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []);

  const bgRoad = useColorModeValue('purple.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgRoad}>
      <Navbar />

      <Container maxW="container.lg" pt={16} pb={20}>
        <Heading size="2xl" mb={4} textAlign="center" color="purple.700" fontWeight="bold">
          Twoja spersonalizowana ścieżka nauki
        </Heading>

        <Text textAlign="center" fontSize="lg" color="gray.600" maxW="600px" mx="auto" mb={12}>
          Na podstawie Twojej aktywności przygotowaliśmy listę kursów, które pomogą Ci najszybciej rozwinąć umiejętności.
        </Text>

        {loading && (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" thickness="4px" />
          </Flex>
        )}

        {error && <Text color="red.500" fontWeight="bold" textAlign="center">{error}</Text>}

        <Flex direction="column" gap={10} position="relative"
          _before={{ content: '""', position: 'absolute', left: '24px', top: 0, bottom: 0, width: '4px', bg: 'purple.300', borderRadius: 'full' }}>

          {courses.map((course, index) => (
            <Flex key={course.id} align="flex-start" gap={6} position="relative">
              <Box
                w="20px"
                h="20px"
                bg="purple.600"
                borderRadius="full"
                position="absolute"
                left="14px"
                top="8px"
                zIndex={2}
                border="3px solid white"
              />

              <Card ml="60px" width="100%" bg={cardBg} boxShadow="xl" borderRadius="2xl" p={6}
                _hover={{ transform: 'scale(1.01)', transition: '0.2s', shadow: 'xl' }}>
                <CardBody>
                  <Stack spacing={4}>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                      <Box>
                        <Heading size="lg" mb={1}>{course.title}</Heading>
                        <Text fontSize="sm" color="gray.500">Rekomendowane specjalnie dla Ciebie</Text>
                      </Box>
                      <Flex gap={3} align="center">
                        <Badge colorScheme="purple" px={3} py={1} borderRadius="lg">
                          🎯 {course.difficultyLevel === 0 ? 'Beginner' : course.difficultyLevel === 1 ? 'Intermediate' : 'Advanced'}
                        </Badge>
                        <Text fontWeight="bold" color="orange.400">⭐ {course.rating}</Text>
                      </Flex>
                    </Flex>

                    <Text color="gray.700" lineHeight="1.7" fontSize="md">{course.description}</Text>
                  </Stack>
                </CardBody>
              </Card>
            </Flex>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}
