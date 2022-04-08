﻿using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IFamilyRelationshipRepository : IRepository<FamilyRelationship>
    {
        void Update(FamilyRelationship familyRelationship);
    }
}