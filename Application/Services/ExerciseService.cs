using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Application.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IPistonApiClient _pistonApiClient;
        public ExerciseService(IPistonApiClient pistonApiClient)
        {
             _pistonApiClient = pistonApiClient;
        }

        public async Task<bool>  AttemptExercise(
            string Code, 
            Exercise exercise, 
            CancellationToken cancellationToken = default)
        {
            var tests = exercise.Tests;

            var testCases = tests
                .Select(t => (
                    Input: JsonSerializer.Deserialize<VariableSetDto>(t.InputData),
                    Output: JsonSerializer.Deserialize<VariableSetDto>(t.OutputData)
                ))
                .ToList();

            if (testCases.Count <= 0)
                throw new Exception("Test doesn't have any InputData");


            var runnerCode = BuildRunner(
                Code,
                testCases!);

            var response = await _pistonApiClient.ExecuteAsync(
                new PistonExecuteRequest()
                {
                    Code = runnerCode,
                    Language = "python",
                    Version = "3.10.0",

                }, cancellationToken);

            if (response.ExitCode != 0)
                return false;

            var output = JsonSerializer.Deserialize<Dictionary<string, int>>(response.RunOutput!);
            if (output == null)
                return false;

            if (output["failures"] > 0 || output["errors"] > 0)
                return false;


            return true;
        }

        private string BuildRunner(
            string userCode,
            List<(VariableSetDto Input, VariableSetDto Output)> testCases)
        {
            var functionName = ExtractFunctionName(userCode);
            var sb = new StringBuilder();

            sb.AppendLine(userCode);
            sb.AppendLine();

            sb.AppendLine("import unittest");
            sb.AppendLine("import json");
            sb.AppendLine("import sys");
            sb.AppendLine();

            sb.AppendLine("class TestSolution(unittest.TestCase):");

            var test_index = 0;
            foreach (var tc in testCases)
            {

                string parsedInput = ParseVariablesToPython(tc.Input);
                string parsedOutput = ParseVariablesToPython(tc.Output);

                sb.AppendLine($"\tdef test_{test_index}(self):");
                sb.AppendLine($"\t\tself.assertEqual({functionName}({parsedInput}), {parsedOutput})");
                sb.AppendLine();

                test_index++;   
            }

            sb.AppendLine("if __name__ == \"__main__\":");
            sb.AppendLine("\tsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestSolution)");
            sb.AppendLine("\tresult = unittest.TextTestRunner().run(suite)");
            sb.AppendLine();
            sb.AppendLine("\toutput = {");
            sb.AppendLine("\t\t\"failures\": len(result.failures),");
            sb.AppendLine("\t\t\"errors\": len(result.errors),");
            sb.AppendLine("\t\t\"testsRun\": result.testsRun");
            sb.AppendLine("\t}");
            sb.AppendLine("\tprint(json.dumps(output))");

            return sb.ToString();
        }

        private string ParseVariablesToPython(VariableSetDto variables)
        {
            if (variables == null || variables.Count == 0)
                return "{}";

            var parsedList = variables.Select(kv =>
                $"{kv.Value.Value}"
            );

            return string.Join(", ", parsedList);
        }

        private string ExtractFunctionName(string userCode)
        {
            var match = Regex.Match(
                userCode,
                @"def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(",
                RegexOptions.Multiline
            );

            if (!match.Success)
                throw new Exception("Cannot find function name in user code.");

            return match.Groups[1].Value;
        }


        public async Task<PistonExecuteResponse> ExecuteCode(
            string code, 
            string language, 
            string version, 
            CancellationToken cancellationToken = default)
        {
            var response = await _pistonApiClient.ExecuteAsync(
                new PistonExecuteRequest()
                {
                    Code = code,
                    Language = language,
                    Version = version
                }, cancellationToken);

            return new PistonExecuteResponse()
            {
                RunOutput = response.RunOutput,
                RunStderr = response.RunStderr,
                ExitCode = response.ExitCode
            };
        }

        public async Task<List<PistonRuntimeResponse>> GetSupportedRuntimes(CancellationToken cancellationToken)
        {
            var runtimes = await _pistonApiClient.GetSupportedLanguagesAsync(cancellationToken);

            return runtimes;
        }
    }
}
