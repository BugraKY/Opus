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
    public class StaffResignationRepository : Repository<StaffResignation>, IStaffResignationRepository
    {
        private readonly ApplicationDbContext _db;

        public StaffResignationRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(StaffResignation staffResignation)
        {
            _db.Update(staffResignation);
        }
    }
}