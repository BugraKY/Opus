using Microsoft.EntityFrameworkCore;
using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class Repository<T> : IRepository<T> where T : class
    {

        private readonly ApplicationDbContext _db;
        private readonly AccountingDbContext _acDb;
        private readonly ReferenceVerifDbContext _RVdb;
        internal DbSet<T> dbSet;
        //internal Task<DbSet<T>> dbSetTask;

        public Repository(ApplicationDbContext db)
        {
            _db = db;
            dbSet = _db.Set<T>();
        }
        public Repository(AccountingDbContext acDb)
        {
            _acDb=acDb;
            dbSet = _acDb.Set<T>();

        }
        public Repository(ReferenceVerifDbContext RVdb)
        {
            _RVdb=RVdb;
            dbSet = _RVdb.Set<T>();
        }
        public void Add(T entity)
        {
            dbSet.Add(entity);
        }
        /*
        public async void AddAsync(Task<entity>)
        {
            //dbSet.AddAsync(entity);
            await Task.Run(() => dbSet.AddAsync(entity));
        }*/
        public void AddRange(IEnumerable<T> entities)
        {
            dbSet.AddRange(entities);
        }
        /*
        public async void Task<AddRangeAsync>(IAsyncEnumerable<T> entities)
        {
            //dbSet.AddRangeAsync((T)entities);
            await dbSet.AddRangeAsync((T)entities);
        }*/
        public T Get(int id)
        {
            return dbSet.Find(id);
        }

        public IEnumerable<T> GetAll(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = null)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                //query = query.Where(filter);
                query = query.Where(filter).AsNoTracking();
            }

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    //query = query.Include(item);
                    query = query.Include(item).AsNoTracking();
                }
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            return query.ToList();
        }
        /*
        public async Task<IAsyncEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = null)
        {
            //await Task.Run(() => query = query.Where(filter).AsNoTracking());

            Task<IQueryable<T>> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter).AsNoTracking();

                //query = query.Where(filter);
                //query = query.Where(filter).AsNoTracking();// for no tracking on db
            }

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    //query = query.Include(item);
                    query = query.Include(item).AsNoTracking();
                }
            }
            if (orderBy != null)
            {
                return await Task.Run(() => (IAsyncEnumerable<T>)orderBy(query).ToList());

                //return (IAsyncEnumerable<T>)orderBy(query).ToList();
            }
            //return (IAsyncEnumerable<T>)query.ToList();
            return await Task.Run(() => (IAsyncEnumerable<T>)query.ToList());


        }
        */
        public T GetFirstOrDefault(Expression<Func<T, bool>> filter = null, string includeProperties = null)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                //query = query.Where(filter);
                query = query.Where(filter).AsNoTracking();
            }

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    //query = query.Include(item);
                    query = query.Include(item).AsNoTracking();
                }
            }

            return query.FirstOrDefault();
        }
        /*
        public async Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> filter = null, string includeProperties = null)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                //query = query.Where(filter);
                //query = query.Where(filter).AsNoTracking();
                await Task.Run(() => query = query.Where(filter).AsNoTracking());
            }

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    //query = query.Include(item);
                    //query = query.Include(item).AsNoTracking();
                    await Task.Run(() => query = query.Where(filter).AsNoTracking());
                }
            }

            //return query.FirstOrDefault();
            return await Task.Run(() => query.FirstOrDefault());
        }
        */
        public void Remove(int id)
        {
            T entitiy = dbSet.Find(id);
            Remove(entitiy);
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entity)
        {
            dbSet.RemoveRange(entity);
        }
    }
}
