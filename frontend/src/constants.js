export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
    cpp: "10.2.0",
    c: "10.2.0"
}
export const CODE_DEFAULT_CODE = {
    javascript: 'console.log("Hello, World! This is JavaScript!");',
    typescript: 'function main(): void {\n  console.log("Hello, World! This is TypeScript!");\n}\n\nmain();',
    python: 'def main():\n\tprint("Hello, World! Welcome to Python")\n\nif __name__ == "__main__":\n\tmain()',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World! Java Edition");\n    }\n}',
    csharp: 'using System;\n\nnamespace HelloWorld;\n{\nclass Hello\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello World! Written in C#");\n    }\n}\n}',
    php: '<?php\n\necho "Hello, World! php";',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello in C++, World!" << endl;\n    return 0;\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World! in C\\n");\n    return 0;\n}'
}
export const COURSE_DIFFICULTY = {
    0: "Początkujący",
    1: "Średnio zaawansowany",
    2: "Zaawansowany",

}