import {Box, HStack, useColorModeValue} from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector.jsx";
import { CODE_DEFAULT_CODE } from "../constants.js";
import Output from "./Output.jsx";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");
    const monacoTheme = useColorModeValue("vs", "vs-dark");
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_DEFAULT_CODE[language]);
    };

    return (
        <Box>
            <HStack spacing={4} align="start">
                <Box w="50%">
                    <LanguageSelector language={language} onSelect={onSelect} />
                    <Editor
                        height="75vh"
                        language={language}
                        theme={monacoTheme}
                        defaultValue={CODE_DEFAULT_CODE[language]}
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </Box>
                <Output editorRef={editorRef} language={language} />
            </HStack>
        </Box>
    );
};

export default CodeEditor;