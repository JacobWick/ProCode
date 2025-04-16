using System.Linq.Expressions;
using Application.Interfaces;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

    public class Repository<E>(PostgresDbContext context) : IRepository<E> where E : class, IEntity, new()
    {
        public async Task CreateAsync(E entity, CancellationToken cancellation = default)
        {
            await context.Set<E>().AddAsync(entity, cancellation);
            await context.SaveChangesAsync(cancellation);
        }
        public async Task DeleteAsync(E entity, CancellationToken cancellation = default)
        {
            context.Set<E>().Remove(entity);
            await context.SaveChangesAsync(cancellation);
        }
        public async Task<ICollection<E>> GetAsync(Expression<Func<E, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await context.Set<E>()
                .Where(predicate)
                .ToListAsync(cancellationToken);
        }

        public async Task<ICollection<E>> GetAllAsync(Expression<Func<E, E>>? selector = null, CancellationToken cancellationToken = default)
        {
            return await context.Set<E>()
                .Select(GetSelector(selector))
                .ToListAsync(cancellationToken);
        }

        public async Task<E?> GetByIdAsync(Guid id, Expression<Func<E, E>>? selector = null, CancellationToken cancellationToken = default)
        {
            return await context.Set<E>()
                .Where(e => e.Id == id)
                .Select(GetSelector(selector))
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Expression<Func<E, E>> GetSelector(Expression<Func<E, E>>? selector = null)
        {
            if (selector == null)
                selector = c => new E() { Id = c.Id };

            return selector;
        }

        public async Task UpdateAsync(E entity, CancellationToken cancellation = default)
        {
            context.Set<E>().Update(entity);
            await context.SaveChangesAsync(cancellation);
        }
    }
