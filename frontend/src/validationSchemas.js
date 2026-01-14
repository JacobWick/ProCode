import { z } from "zod";

const httpUrl = z.string().url().startsWith("http", { message: "Link musi zaczynąć się od http:// lub https://" });

export const courseSchema = z.object({
    title: z.string().min(1, "Tytuł kursu jest wymagany").max(200, "Maksymalnie 200 znaków"),
    description: z.string()
        .min(10, "Opis musi mieć przynajmniej 10 znaków")
        .max(500, "Opis może mieć maksymalnie 500 znaków"),
    difficultyLevel: z.number().min(0).max(2)
});

export const challengeSchema = z.object({
    title: z.string().min(1, "Tytuł wyzwania jest wymagany").max(200, "Maksymalnie 200 znaków"),
    description: z.string().min(10, "Opis musi mieć przynajmniej 10 znaków").max(1000, "Opis może mieć maksymalnie 1000 znaków"),
    startTime: z.string().refine(val => !Number.isNaN(Date.parse(val)), { message: "Nieprawidłowa data rozpoczęcia" }),
    endTime: z.string().refine(val => !Number.isNaN(Date.parse(val)), { message: "Nieprawidłowa data zakończenia" })
}).refine(data => Date.parse(data.startTime) < Date.parse(data.endTime), { message: "Data rozpoczęcia musi być przed datą zakończenia", path: ["endTime"] });

export const lessonSchema = z.object({
    title: z.string()
        .min(5, "Tytuł lekcji musi mieć przynajmniej 5 znaków")
        .max(200, "Tytuł lekcji może mieć co najwyżej 200 znaków"),
    description: z.string()
        .min(10, "Opis musi mieć przynajmniej 10 znaków")
        .max(1000, "Opis może mieć co najwyżej 1000 znaków"),
    videoUri: httpUrl.or(z.literal("")),
    textUri: httpUrl.or(z.literal("")),
});


export const exerciseSchema = z.object({
    lessonIndex: z.string().min(1, "Wybierz lekcję"),
    description: z.string()
        .min(20, "Opis musi mieć przynajmniej 20 znaków")
        .max(1000, "Opis może mieć maksymalnie 1000 znaków"),
    initialContent: z.string()
        .min(10, "Początkowy kod musi mieć przynajmniej 10 znaków")
        .max(500, "Początkowy kod może mieć co najwyżej 500 znaków")
        .or(z.literal("")),
});

export const challengeExerciseSchema = z.object({
    description: z.string()
        .min(20, "Opis musi mieć przynajmniej 20 znaków")
        .max(1000, "Opis może mieć maksymalnie 1000 znaków"),
    initialContent: z.string()
        .min(0)
        .max(500, "Początkowy kod może mieć co najwyżej 500 znaków")
        .or(z.literal("")),
});
export const solutionSchema = z.object({
    code: z.string()
        .min(5, "Kod musi mieć przynajmniej 5 znaków")
        .max(1000, "Kod może mieć maksymalnie 1000 znaków"),
    explanation: z.string()
        .min(10, "Wyjaśnienie musi mieć przynajmniej 10 znaków")
        .max(1000, "Wyjaśnienie może mieć maksymalnie 1000 znaków"),
});


export const testSchema = z.object({
    testCases: z.array(
        z.object({
            inputs: z.array(
                z.object({
                    varName: z.string().min(1, "Nazwa zmiennej jest wymagana"),
                    value: z.string().min(1, "Wartość jest wymagana"),
                    type: z.enum(["int", "string", "float", "bool"])
                })
            ).min(1, "Wymagana co najmniej jedna zmienna wejściowa"),
            outputs: z.array(
                z.object({
                    varName: z.string().min(1, "Nazwa zmiennej jest wymagana"),
                    value: z.string().min(1, "Wartość jest wymagana"),
                    type: z.enum(["int", "string", "float", "bool"])
                })
            ).min(1, "Wymagana co najmniej jedna zmienna wyjściowa")
        })
    ).min(1, "Musisz podać przynajmniej jeden przypadek testowy")
});