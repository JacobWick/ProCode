namespace ProCode.UnitTests
{
    using Domain.Entities;
    using global::Application.Interfaces;
    using global::Application.Lessons.CommandHandlers;
    using global::Application.Lessons.Commands;
    using Moq;
    using System.Linq.Expressions;
    using Xunit;

    namespace Application.Tests.Lessons.CommandHandlers
    {
        public class CompleteLessonCommandHandlerTests
        {
            private readonly Mock<IRepository<Progress>> _progressRepoMock;
            private readonly Mock<IUserContextService> _userContextServiceMock;
            private readonly CompleteLessonCommandHandler _handler;

            public CompleteLessonCommandHandlerTests()
            {
                _progressRepoMock = new Mock<IRepository<Progress>>();
                _userContextServiceMock = new Mock<IUserContextService>();
                _handler = new CompleteLessonCommandHandler(
                    _progressRepoMock.Object,
                    _userContextServiceMock.Object
                );
            }

            [Fact]
            public async Task Handle_UserNotLoggedIn_ThrowsException()
            {
                // Arrange
                _userContextServiceMock.Setup(x => x.UserId).Returns(Guid.Empty);
                var command = new CompleteLessonCommand { LessonId = Guid.NewGuid() };

                // Act & Assert
                await Assert.ThrowsAsync<Exception>(() =>
                    _handler.Handle(command, CancellationToken.None));
            }

            [Fact]
            public async Task Handle_ProgressAlreadyExists_ReturnsFalse()
            {
                // Arrange
                var userId = Guid.NewGuid();
                var lessonId = Guid.NewGuid();

                _userContextServiceMock.Setup(x => x.UserId).Returns(userId);

                var existingProgress = new List<Progress>
            {
                new Progress { UserId = userId, LessonId = lessonId }
            };

                _progressRepoMock.Setup(x => x.GetAsync(
                    It.IsAny<Expression<Func<Progress, bool>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync(existingProgress);

                var command = new CompleteLessonCommand { LessonId = lessonId };

                // Act
                var result = await _handler.Handle(command, CancellationToken.None);

                // Assert
                Assert.False(result);
                _progressRepoMock.Verify(x => x.CreateAsync(
                    It.IsAny<Progress>(),
                    It.IsAny<CancellationToken>()),
                    Times.Never);
            }

            [Fact]
            public async Task Handle_NewProgress_CreatesProgressAndReturnsTrue()
            {
                // Arrange
                var userId = Guid.NewGuid();
                var lessonId = Guid.NewGuid();

                _userContextServiceMock.Setup(x => x.UserId).Returns(userId);

                _progressRepoMock.Setup(x => x.GetAsync(
                    It.IsAny<Expression<Func<Progress, bool>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync(new List<Progress>());

                var command = new CompleteLessonCommand { LessonId = lessonId };

                // Act
                var result = await _handler.Handle(command, CancellationToken.None);

                // Assert
                Assert.True(result);
                _progressRepoMock.Verify(x => x.CreateAsync(
                    It.Is<Progress>(p =>
                        p.UserId == userId &&
                        p.LessonId == lessonId &&
                        p.CompletedAt == DateOnly.FromDateTime(DateTime.Now)
                    ),
                    It.IsAny<CancellationToken>()
                ), Times.Once);
            }
        }
    }
}
