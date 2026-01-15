namespace ProCode.UnitTests
{
    using Domain.Entities;
    using global::Application.Courses.CommandHandlers;
    using global::Application.Courses.Commands;
    using global::Application.Interfaces;
    using Moq;
    using System.Linq.Expressions;
    using Xunit;

    namespace Application.Tests.Courses.CommandHandlers
    {
        public class EnrollInCourseCommandHandlerTests
        {
            private readonly Mock<IRepository<Course>> _courseRepoMock;
            private readonly Mock<IRepository<User>> _userRepoMock;
            private readonly Mock<IUserContextService> _userContextMock;
            private readonly EnrollInCourseCommandHandler _handler;

            public EnrollInCourseCommandHandlerTests()
            {
                _courseRepoMock = new Mock<IRepository<Course>>();
                _userRepoMock = new Mock<IRepository<User>>();
                _userContextMock = new Mock<IUserContextService>();
                _handler = new EnrollInCourseCommandHandler(
                    _courseRepoMock.Object,
                    _userRepoMock.Object,
                    _userContextMock.Object
                );
            }

            [Fact]
            public async Task Handle_UserNotLoggedIn_ThrowsException()
            {
                // Arrange
                _userContextMock.Setup(x => x.UserId).Returns(Guid.Empty);
                var command = new EnrollInCourseCommand { CourseId = Guid.NewGuid() };

                // Act & Assert
                await Assert.ThrowsAsync<Exception>(() =>
                    _handler.Handle(command, CancellationToken.None));
            }

            [Fact]
            public async Task Handle_UserNotFound_ReturnsFalse()
            {
                // Arrange
                var userId = Guid.NewGuid();
                _userContextMock.Setup(x => x.UserId).Returns(userId);

                _userRepoMock.Setup(x => x.GetByIdAsync(
                    userId,
                    It.IsAny<Expression<Func<User, User>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync((User)null);

                var command = new EnrollInCourseCommand { CourseId = Guid.NewGuid() };

                // Act
                var result = await _handler.Handle(command, CancellationToken.None);

                // Assert
                Assert.False(result);
            }

            [Fact]
            public async Task Handle_CourseNotFound_ReturnsFalse()
            {
                // Arrange
                var userId = Guid.NewGuid();
                var courseId = Guid.NewGuid();

                _userContextMock.Setup(x => x.UserId).Returns(userId);

                var user = new User
                {
                    Id = userId,
                    CoursesEnrolledIn = new List<UserCourse>()
                };

                _userRepoMock.Setup(x => x.GetByIdAsync(
                    userId,
                    It.IsAny<Expression<Func<User, User>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync(user);

                _courseRepoMock.Setup(x => x.GetByIdAsync(
                    courseId,
                    It.IsAny<Expression<Func<Course, Course>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync((Course)null);

                var command = new EnrollInCourseCommand { CourseId = courseId };

                // Act
                var result = await _handler.Handle(command, CancellationToken.None);

                // Assert
                Assert.False(result);
            }

            [Fact]
            public async Task Handle_UserAlreadyEnrolled_ReturnsFalse()
            {
                // Arrange
                var userId = Guid.NewGuid();
                var courseId = Guid.NewGuid();

                _userContextMock.Setup(x => x.UserId).Returns(userId);

                var user = new User
                {
                    Id = userId,
                    CoursesEnrolledIn = new List<UserCourse>
                {
                    new UserCourse { UserId = userId, CourseId = courseId }
                }
                };

                var course = new Course
                {
                    Id = courseId,
                    UsersEnrolled = new List<UserCourse>()
                };

                _userRepoMock.Setup(x => x.GetByIdAsync(
                    userId,
                    It.IsAny<Expression<Func<User, User>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync(user);

                _courseRepoMock.Setup(x => x.GetByIdAsync(
                    courseId,
                    It.IsAny<Expression<Func<Course, Course>>>(),
                    It.IsAny<CancellationToken>()
                )).ReturnsAsync(course);

                var command = new EnrollInCourseCommand { CourseId = courseId };

                // Act
                var result = await _handler.Handle(command, CancellationToken.None);

                // Assert
                Assert.False(result);
                _courseRepoMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
            }
        }
    }
}
