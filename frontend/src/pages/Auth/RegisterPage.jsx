import {
  Box,
  Input,
  Container,
  FormControl,
  Heading,
  Button,
  FormLabel,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Link,
  FormErrorMessage
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { register as registerApi } from "../../api.js";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    await registerApi(data)
    navigate("/login")
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="purple.50" p={4}>
      <Container maxW="md">
        <Box bg="white" p={8} rounded="2xl" boxShadow="xl">
          <Heading textAlign="center" mb={6} fontSize="2xl">
            Utwórz konto w <Text size="md" color="purple.500">ProCode!</Text>
          </Heading>

          <form onSubmit={handleSubmit(handleRegister)}>
            <VStack spacing={5}>
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel>Nazwa użytkownika</FormLabel>
                <Input
                  placeholder="Wpisz nazwę użytkownika"
                  bg="gray.50"
                  p={6}
                  rounded="xl"
                  {...register("username", {
                    required: "Nazwa użytkownika jest wymagana",
                  })}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Imię</FormLabel>
                <Input
                  placeholder="Wpisz imię"
                  bg="gray.50"
                  p={6}
                  rounded="xl"
                  {...register("firstName")}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nazwisko</FormLabel>
                <Input
                  placeholder="Wpisz nazwisko"
                  bg="gray.50"
                  p={6}
                  rounded="xl"
                  {...register("lastName")}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Wpisz email"
                  bg="gray.50"
                  p={6}
                  rounded="xl"
                  {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Niepoprawny email"
                    }
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Hasło</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wpisz hasło"
                    bg="gray.50"
                    p={6}
                    rounded="xl"
                    {...register("password", {
                      required: "Hasło jest wymagane",
                      minLength: { value: 6, message: "Min. 6 znaków" }
                    })}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      variant="ghost"
                      aria-label="Pokaż hasło"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      h="full"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                rounded="xl"
                fontWeight="bold"
              >
                Zarejestruj się
              </Button>

              <Text>
                Masz już konto?
                <Link color="blue.500" as={RouterLink} to="/login">
                    {" "}Zaloguj się
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
