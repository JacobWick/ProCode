import { Box, Input, Container, FormControl, Heading, Button, FormLabel, VStack, InputGroup, InputRightElement, IconButton, Text, Link } from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { login } from "../../api.js"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
    } = useForm();

  const handleLogin = async (data) => {
    try {    
        const res = await login(data)

        localStorage.setItem("token", res.data.token);
        navigate("/");
    } 
    catch (err) {
        console.error(err);
        alert("Niepoprawne dane logowania");
    }

  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="purple.50" p={4}>
      <Container maxW="md">
        <Box bg="white" p={8} rounded="2xl" boxShadow="xl">
          <Heading textAlign="center" mb={6} fontSize="2xl">
            Witamy ponownie w <Text size="md" color="purple.500" >ProCode!</Text>
          </Heading>

          <form onSubmit={handleSubmit(handleLogin)}>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <InputGroup>
                <Input placeholder="Wpisz nazwę użytkownika"
                    bg="gray.50"
                    p={6}
                    rounded="xl"
                    {...register("userName")}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Hasło</FormLabel>
              <InputGroup>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wpisz hasło"
                    bg="gray.50"
                    p={6}
                    rounded="xl"
                    {...register("password")}
                />
                <InputRightElement h="full" rounded="xl">
                    <IconButton
                        variant="ghost"
                        aria-label="Pokaż hasło"
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword? <ViewOffIcon/> : <ViewIcon />}
                        h="full"
                        rounded="xl"
                    />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                rounded="xl"
                fontWeight="bold"
            >
              Zaloguj się
            </Button>

            <Text>Nie masz jeszcze konta?<Link color="blue.500" as={RouterLink} to="/register"> Zarejestruj się</Link></Text>
            
          </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
