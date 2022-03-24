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
    public class FamilyMembersRepository : Repository<FamilyMembers>, IFamilyMembersRepository
    {
        private readonly ApplicationDbContext _db;

        public FamilyMembersRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(FamilyMembers familyMembers)
        {
            _db.Update(familyMembers);
        }
    }
}
