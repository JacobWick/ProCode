using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services
{
    public class PersonalizationService : IPersonalizationService
    {
        public RoadmapDto GenerateRoadmap(User user, IEnumerable<Course> courses)
        {
            var userTags = user.TagsIntrestedIn.Select(t => t.Name).ToList();

            var scoredCourses = courses
                .Select(c => new
                {
                    Course = c,
                    Score = CalculateScore(user, c, userTags)
                })
                .Where(x => x.Score > 2)
                .OrderByDescending(x => x.Score)
                .ThenBy(x => x.Course.DifficultyLevel)
                .Take(3)
                .Select(x => x.Course)
                .ToList();

            return new RoadmapDto
            {
                UserId = user.Id,
                RecommendedCourses = CourseMapper.MapListToDto(scoredCourses)
            };
        }

        private int CalculateScore(User user, Course course, List<string> userTags)
        {
            int score = 0;

            var matchingTags = course.Tags.Select(t => t.Name).Intersect(userTags).Count();
            score += matchingTags * 2;

            var userLevelScore = GetUserSkillLevel(user); // 0.0 - 3.0
            var courseLevel = (int)course.DifficultyLevel;

            int userApproxLevel = userLevelScore switch
            {
                < 1.2f => 0,          // Beginner
                < 2.4f => 1,          // Intermediate
                _ => 2                // Advanced
            };

            if (courseLevel == userApproxLevel)
                score += 3;
            else if (courseLevel == userApproxLevel + 1)
                score += 1;
            else if (courseLevel < userApproxLevel)
                score += 1;
            else
                score += 0; // kurs za trudny

            return score;
        }

        private float GetUserSkillLevel(User user)
        {
            var progress = user.Progresses
                .Where(p => user.Id == p.UserId).ToList();

            var beginnerLessonsCount = progress.Where(p => p.Lesson.Course.DifficultyLevel == DifficultyLevel.Beginner).Count();
            var intermediateLessonsCount = progress.Where(p => p.Lesson.Course.DifficultyLevel == DifficultyLevel.Intermediate).Count();
            var advancedLessonsCount = progress.Where(p => p.Lesson.Course.DifficultyLevel == DifficultyLevel.Advanced).Count();

            var score = Math.Min(beginnerLessonsCount * 0.05f, 0.7f) +
                        Math.Min(intermediateLessonsCount * 0.1f, 1.0f) +
                        Math.Min(advancedLessonsCount * 0.15f, 1.3f);

            return score ;
        }
    }
}
