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
    public class TrainingRepository : Repository<Training>, ITrainingRepository
    {
        private readonly ApplicationDbContext _db;

        public TrainingRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Training training)
        {
            _db.Update(training);
        }
    }
}