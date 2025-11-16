import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants.js";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect }) => {
    const menuBg = useColorModeValue("white", "#110c1b");
    const itemHoverBg = useColorModeValue("gray.100", "gray.900");
    const activeBg = useColorModeValue("gray.100", "gray.900");
    const textColor = useColorModeValue("gray.800", "gray.200");
    const versionColor = useColorModeValue("gray.500", "gray.400");

    return (
        <Box ml={2} mb={4}>
            <Text mb={2} fontSize="lg" color={textColor}>
                Język:
            </Text>
            <Menu isLazy>
                <MenuButton as={Button} colorScheme="purple" variant="solid">
                    {language}
                </MenuButton>
                <MenuList bg={menuBg} borderColor={useColorModeValue("gray.200", "gray.700")}>
                    {languages.map(([lang, version]) => {
                        const isActive = lang === language;
                        return (
                            <MenuItem
                                key={lang}
                                color={isActive ? ACTIVE_COLOR : textColor}
                                bg={isActive ? activeBg : "transparent"}
                                _hover={{
                                    color: ACTIVE_COLOR,
                                    bg: itemHoverBg,
                                }}
                                onClick={() => onSelect(lang)}
                            >
                                {lang}
                                &nbsp;
                                <Text as="span" color={versionColor} fontSize="sm">
                                    {version}
                                </Text>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default LanguageSelector;
