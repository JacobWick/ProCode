import { Button, Box, HStack, useColorModeValue } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector.jsx";
import { CODE_DEFAULT_CODE } from "../constants.js";
import Output from "./Output.jsx";

const CodeEditor = ({ initialContent, inputData, outputData, exerciseId, onExerciseComplete, courseId, lessonId, solutionExampleId }) => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("python");
    const monacoTheme = useColorModeValue("vs", "vs-dark");

    useEffect(() => {
        if (initialContent) {
            setValue(initialContent);
        } else {
            setValue(CODE_DEFAULT_CODE[language]);
        }
    }, [initialContent, language]);

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (newLanguage) => {
        setLanguage(newLanguage);
        if (initialContent) {
            setValue(initialContent);
        } else {
            setValue(CODE_DEFAULT_CODE[newLanguage]);
        }
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
                        value={value}
                        onMount={onMount}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </Box>
                <Output
                    editorRef={editorRef}
                    language={language}
                    inputData={inputData}
                    outputData={outputData}
                    exerciseId={exerciseId}
                    onExerciseComplete={onExerciseComplete}
                    courseId={courseId}
                    lessonId={lessonId}
                    solutionExampleId={solutionExampleId}
                />
            </HStack>
        </Box>
    );
};

export default CodeEditor;