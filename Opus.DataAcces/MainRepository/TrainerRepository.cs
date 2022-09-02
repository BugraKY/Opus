using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class TrainerRepository : Repository<Trainer>, ITrainerRepository
    {
        private readonly ApplicationDbContext _db;

        public TrainerRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Trainer trainer)
        {
            _db.Update(trainer);
        }
    }
}