import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    FormHelperText,} from '@chakra-ui/react';

const DIFFICULTY_LEVELS = [
    { value: 0, label: 'Początkujący' },
    { value: 1, label: 'Średniozaawansowany' },
    { value: 2, label: 'Zaawansowany' },
];
export default function CourseInfoStep({ data, onChange, }) {
    return (
        <VStack spacing={6} align="stretch">
            <FormControl isRequired>
                <FormLabel>Tytuł kursu</FormLabel>
                <Input
                    name="title"
                    placeholder="np. Kompletny kurs Pythona od podstaw"
                    value={data.title}
                    onChange={onChange}
                    size="lg"
                />
                <FormHelperText>
                    Podaj atrakcyjny i opisowy tytuł kursu
                </FormHelperText>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Opis kursu</FormLabel>
                <Textarea
                    name="description"
                    placeholder="Opisz czego uczestnicy nauczą się w tym kursie..."
                    value={data.description}
                    onChange={onChange}
                    rows={6} />
                <FormHelperText>
                    Szczegółowy opis pomoże uczestnikom zrozumieć o czym dokładnie jest kurs
                </FormHelperText>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Poziom trudności</FormLabel>
                <Select name="difficultyLevel" value={data.difficultyLevel} onChange={onChange} size="lg">
                    {DIFFICULTY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
                <FormHelperText>
                    Wybierz odpowiedni poziom trudności dla grupy docelowej
                </FormHelperText>
            </FormControl>

        </VStack>
    );
}