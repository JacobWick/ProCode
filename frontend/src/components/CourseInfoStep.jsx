import{
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    FormHelperText,
    FormErrorMessage
} from '@chakra-ui/react';
const DIFFICULTY_LEVELS = [
    { value: 0, label: 'Początkujący' },
    { value: 1, label: 'Średniozaawansowany' },
    { value: 2, label: 'Zaawansowany' },
];

export default function CourseInfoStep({ data, onChange, errors = {} }) {
    return (
        <VStack spacing={6} align="stretch">
            <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>Tytuł kursu</FormLabel>
                <Input
                    name="title"
                    placeholder="np. Kompletny kurs Pythona od podstaw"
                    value={data.title}
                    onChange={onChange}
                    size="lg"
                />
                {!errors.title ? (
                    <FormHelperText color="gray.500">Podaj atrakcyjny i opisowy tytuł kursu</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.title[0]}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.description}>
                <FormLabel>Opis kursu</FormLabel>
                <Textarea
                    name="description"
                    placeholder="Opisz czego uczestnicy nauczą się w tym kursie..."
                    value={data.description}
                    onChange={onChange}
                    rows={6} />
                {!errors.description ? (
                    <FormHelperText color="gray.500">Szczegółowy opis pomoże uczestnikom zrozumieć o czym dokładnie jest kurs</FormHelperText>
                ) : (
                    <FormErrorMessage >{errors.description[0]}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Poziom trudności</FormLabel>
                <Select name="difficultyLevel" value={data.difficultyLevel} onChange={onChange} size="lg">
                    {DIFFICULTY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
            </FormControl>
        </VStack>
    );
}