using System.Linq.Expressions;
using Domain.Interfaces;

namespace Application.Interfaces;

public interface IRepository<E> where E : class, IEntity
{
    Expression<Func<E, E>> GetSelector(Expression<Func<E, E>>? selector = null);
    Task<E?> GetByIdAsync(Guid id,
        Expression<Func<E, E>>? selector = null,
        Expression<Func<E, object>>[]? includes = null,
        CancellationToken cancellationToken = default);
    Task<ICollection<E>> GetAsync(Expression<Func<E, bool>> predicate, 
        CancellationToken cancellationToken = default);
    Task<ICollection<E>> GetAllAsync(
        Expression<Func<E, E>>? selector = null,
        Expression<Func<E, object>>[]? includes = null,
        CancellationToken cancellationToken = default);
    Task CreateAsync(E entity,
        CancellationToken cancellation = default);
    Task UpdateAsync(E entity,
        CancellationToken cancellation = default);
    Task DeleteAsync(E entity,
        CancellationToken cancellation = default);

    Task<ICollection<E>> GetAsync(
            Expression<Func<E, bool>> predicate,
            CancellationToken cancellationToken = default,
            params Expression<Func<E, object>>[] includes);

}