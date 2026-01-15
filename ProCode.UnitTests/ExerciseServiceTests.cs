using System.Text.Json;
using Application.DTOs;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using Moq;

namespace ProCode.UnitTests
{
    public class ExerciseServiceTests
    {
        private readonly Mock<IPistonApiClient> _pistonApiClientMock;
        private readonly ExerciseService _exerciseService;

        public ExerciseServiceTests()
        {
            _pistonApiClientMock = new Mock<IPistonApiClient>();
            _exerciseService = new ExerciseService(_pistonApiClientMock.Object);
        }

        [Fact]
        public async Task AttemptExercise_WhenNoTests_ThrowsException()
        {
            // Arrange
            var exercise = new Exercise
            {
                Tests = new List<Test>()
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(
                () => _exerciseService.AttemptExercise("def add(a, b): return a + b", exercise)
            );

            Assert.Equal("Test doesn't have any InputData", exception.Message);
        }

        [Fact]
        public async Task AttemptExercise_WhenAllTestsPass_ReturnsTrue()
        {
            var inputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } },
                    { "b", new VariableDto { Value = "2" } }
                })
            );

            var outputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "3" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData, OutputData = outputData }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 0,
                RunOutput = JsonSerializer.Serialize(new Dictionary<string, int>
                {
                    { "failures", 0 },
                    { "errors", 0 },
                    { "testsRun", 1 }
                })
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(pistonResponse);

            var result = await _exerciseService.AttemptExercise(
                "def add(a, b): return a + b",
                exercise
            );

            Assert.True(result);
            _pistonApiClientMock.Verify(
                x => x.ExecuteAsync(
                    It.Is<PistonExecuteRequest>(r =>
                        r.Language == "python" &&
                        r.Version == "3.10.0"
                    ),
                    It.IsAny<CancellationToken>()
                ),
                Times.Once
            );
        }


        [Fact]
        public async Task AttemptExercise_WhenTestsFail_ReturnsFalse()
        {
            // Arrange
            var inputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } },
                    { "b", new VariableDto { Value = "2" } }
                })
            );

            var outputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "3" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData, OutputData = outputData }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 0,
                RunOutput = JsonSerializer.Serialize(new Dictionary<string, int>
                {
                    { "failures", 1 },
                    { "errors", 0 },
                    { "testsRun", 1 }
                })
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(pistonResponse);

            // Act
            var result = await _exerciseService.AttemptExercise(
                "def add(a, b): return a - b",
                exercise
            );

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AttemptExercise_WhenHasErrors_ReturnsFalse()
        {
            var inputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } }
                })
            );

            var outputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "1" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData, OutputData = outputData }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 0,
                RunOutput = JsonSerializer.Serialize(new Dictionary<string, int>
                {
                    { "failures", 0 },
                    { "errors", 1 },
                    { "testsRun", 1 }
                })
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(pistonResponse);

            // Act
            var result = await _exerciseService.AttemptExercise(
                "def invalid_function(a): raise Exception()",
                exercise
            );

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AttemptExercise_WhenExitCodeNotZero_ReturnsFalse()
        {
            var inputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } },
                })
            );

            var outputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "3" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData, OutputData = outputData }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 1,
                RunOutput = null
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(pistonResponse);

            // Act
            var result = await _exerciseService.AttemptExercise(
                "def func(a): return a",
                exercise
            );

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AttemptExercise_WhenOutputIsNull_ReturnsFalse()
        {
            // Arrange
            var inputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } },
                    { "b", new VariableDto { Value = "2" } }
                })
            );

            var outputData = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "3" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData, OutputData = outputData }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 0,
                RunOutput = null
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(pistonResponse);

            // Act
            var result = await _exerciseService.AttemptExercise(
                "def func(a): return a",
                exercise
            );

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AttemptExercise_WithMultipleTests_BuildsCorrectRunner()
        {
            // Arrange
            var inputData1 = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "1" } },
                    { "b", new VariableDto { Value = "2" } }
                })
            );

            var outputData1 = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "3" } }
                })
            );
            var inputData2 = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "a", new VariableDto { Value = "5" } },
                    { "b", new VariableDto { Value = "3" } }
                })
            );

            var outputData2 = JsonDocument.Parse(
                JsonSerializer.Serialize(new Dictionary<string, VariableDto>
                {
                    { "result", new VariableDto { Value = "8" } }
                })
            );


            var exercise = new Exercise
            {
                Tests = new List<Test>
                {
                    new Test { InputData = inputData1, OutputData = outputData1 },
                    new Test { InputData = inputData2, OutputData = outputData2 }
                }
            };

            var pistonResponse = new PistonExecuteResponse
            {
                ExitCode = 0,
                RunOutput = JsonSerializer.Serialize(new Dictionary<string, int>
                {
                    { "failures", 0 },
                    { "errors", 0 },
                    { "testsRun", 2 }
                })
            };

            string capturedCode = null;
            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .Callback<PistonExecuteRequest, CancellationToken>((req, ct) => capturedCode = req.Code)
                .ReturnsAsync(pistonResponse);

            // Act
            var result = await _exerciseService.AttemptExercise(
                "def add(a, b): return a + b",
                exercise
            );

            // Assert
            Assert.True(result);
            Assert.NotNull(capturedCode);
            Assert.Contains("test_0", capturedCode);
            Assert.Contains("test_1", capturedCode);
            Assert.Contains("import unittest", capturedCode);
            Assert.Contains("class TestSolution(unittest.TestCase):", capturedCode);
        }

        [Fact]
        public async Task ExecuteCode_ReturnsCorrectResponse()
        {
            // Arrange
            var expectedResponse = new PistonExecuteResponse
            {
                RunOutput = "Hello, World!",
                RunStderr = "",
                ExitCode = 0
            };

            _pistonApiClientMock
                .Setup(x => x.ExecuteAsync(It.IsAny<PistonExecuteRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _exerciseService.ExecuteCode(
                "print('Hello, World!')",
                "python",
                "3.10.0"
            );

            // Assert
            Assert.Equal(expectedResponse.RunOutput, result.RunOutput);
            Assert.Equal(expectedResponse.RunStderr, result.RunStderr);
            Assert.Equal(expectedResponse.ExitCode, result.ExitCode);

            _pistonApiClientMock.Verify(
                x => x.ExecuteAsync(
                    It.Is<PistonExecuteRequest>(r =>
                        r.Code == "print('Hello, World!')" &&
                        r.Language == "python" &&
                        r.Version == "3.10.0"
                    ),
                    It.IsAny<CancellationToken>()
                ),
                Times.Once
            );
        }

        [Fact]
        public async Task GetSupportedRuntimes_ReturnsRuntimesList()
        {
            // Arrange
            var expectedRuntimes = new List<PistonRuntimeResponse>
            {
                new PistonRuntimeResponse { language = "python", version = "3.10.0" },
                new PistonRuntimeResponse { language = "javascript", version = "18.15.0" }
            };

            _pistonApiClientMock
                .Setup(x => x.GetSupportedLanguagesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedRuntimes);

            // Act
            var result = await _exerciseService.GetSupportedRuntimes(CancellationToken.None);

            // Assert
            Assert.Equal(expectedRuntimes.Count, result.Count);
            Assert.Equal(expectedRuntimes, result);

            _pistonApiClientMock.Verify(
                x => x.GetSupportedLanguagesAsync(It.IsAny<CancellationToken>()),
                Times.Once
            );
        }
    }
}