import { Box, Input, Container, FormControl, Heading, Button, FormLabel, VStack, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react"
import { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";


const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box minH="100vh">
            <Container>
                <Box>
                    <Heading>Witamy ponownie w ProCode!</Heading>
                    <VStack>
                        <FormControl>
                            <InputGroup>
                            <Input placeholder="Nazwa użytkownika"></Input>
                            </InputGroup>

                            <InputGroup>
                                <Input type={showPassword ? "text":"password"} placeholder="Hasło"/>
                                <InputRightElement>
                                    <IconButton onClick={() => setShowPassword(!showPassword)} icon={<ViewIcon/>}/>
                                </InputRightElement>
                            </InputGroup>

                            <Button>Zaloguj się</Button>
                        </FormControl>
                    </VStack>
                </Box>
            </Container>
        </Box>
    )
}

export default LoginPage;