using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IRepository<T> where T : class
    {
        T Get(int id);

        IEnumerable<T> GetAll(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = null);
        /*
        Task<IAsyncEnumerable<T>> GetAllAsync(
            Expression<Func<T,bool>>filter =null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy =null,
            string includeProperties = null);
        */
        T GetFirstOrDefault(Expression<Func<T, bool>> filter = null,
            string includeProperties = null);
        /*
        Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> filter = null,
            string includeProperties = null);
        */

        void Add(T entity);
        //void AddAsync(entity);
        void AddRange(IEnumerable<T> entities);
        //void Task<AddRangeAsync>(Task<IAsyncEnumerable<T>> entities);
        void Remove(int id);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entity);
    }
}
