﻿using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class ReferencesRepository : Repository<References>, IReferencesRepository
    {
        private readonly ApplicationDbContext _db;

        public ReferencesRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(References references)
        {
            _db.Update(references);
        }
    }
}