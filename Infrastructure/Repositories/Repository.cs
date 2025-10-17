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

        public async Task<ICollection<E>> GetAllAsync(
            Expression<Func<E, E>>? selector = null, 
            Expression<Func<E, object>>[]? includes = null,  
            CancellationToken cancellationToken = default)
        {
            IQueryable<E> query = context.Set<E>();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }
            if (selector != null)
                query = query.Select(selector);
            return await query.ToListAsync(cancellationToken);
        }

        public async Task<E?> GetByIdAsync (
            Guid id, 
            Expression<Func<E, E>>? selector = null, 
            Expression<Func<E, object>>[]? includes = null, 
            CancellationToken cancellationToken = default)
        {
            IQueryable<E> query = context.Set<E>().Where(e => e.Id == id);
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            if (selector != null)
            {
                query = query.Select(selector);
            }
            return await query.FirstOrDefaultAsync(cancellationToken);
        }

        public Expression<Func<E, E>> GetSelector(Expression<Func<E, E>>? selector = null)
        {
                return selector ?? (e => e);
        }

        public async Task UpdateAsync(E entity, CancellationToken cancellation = default)
        {
            context.Set<E>().Update(entity);
            await context.SaveChangesAsync(cancellation);
        }
    }
