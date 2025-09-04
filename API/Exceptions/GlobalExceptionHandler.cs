using Domain.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace API.Exceptions;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, 
            "Exception occurred: {Message}", 
            exception.Message);
        
        var problemDetails = new ProblemDetails
        {
            Status = exception switch
            {
                ValidationException => StatusCodes.Status400BadRequest,
                DuplicatedEmailException => StatusCodes.Status409Conflict,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                ForbiddenException => StatusCodes.Status403Forbidden,
                DomainException => StatusCodes.Status400BadRequest,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                _ => StatusCodes.Status500InternalServerError
            },
            Title = exception switch
            {
                ValidationException => "Validation Exception",
                DuplicatedEmailException => "Duplicated Email",
                UnauthorizedException => "Unauthorized",
                ForbiddenException => "Forbidden",
                DomainException => "Domain rule violated",
                KeyNotFoundException => "Not found",
                _ => "Unexpected error occured"
            },
            Detail = exception.Message,
            Instance = httpContext.Request.Path,
        };
        httpContext.Response.StatusCode = problemDetails.Status.Value;
        httpContext.Response.ContentType = "application/json";
        
        await httpContext.Response.WriteAsJsonAsync(problemDetails,  cancellationToken);

        return true;
    }
}