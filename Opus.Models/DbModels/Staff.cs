﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Staff
    {
        [Key]
        public long Id { get; set; }
        public string Guid { get; set; }
        public string RegistrationNumber { get; set; }//Sicil No
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdentityNumber { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime DateOfEntry { get; set; }
        public DateTime DateOfQuit { get; set; }
        public int MaritalStatusId { get; set; } 
        public string MobileNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string PhoneNumberSec { get; set; }
        public string StreetAddress { get; set; }
        public string MotherName { get; set; }
        public string FatherName { get; set; }
        public string BirthPlace { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int NumberOfChildren { get; set; }
        //public string BloodType { get; set; }
        public int BloodTypeId { get; set; }
        public float TestD2_TNE { get; set; }
        public float TestD2_E { get; set; }
        public float CurrentSalary { get; set; }
        public string IBAN { get; set; }
        public int CountryId { get; set; }
        public bool WhiteCollarWorker { get; set; }
        public bool BlackList { get; set; }
        public int EducationalStatus { get; set; }
        public string ImageFile { get; set; }
        public string Degree { get; set; }
        public string ClothingSizes { get; set; }
        public bool IsUser { get; set; }
        public string ApplicationUserId { get; set; }
        [ForeignKey("ApplicationUserId")]
        public ApplicationUser ApplicationUser { get; set; }
        public string AppUser { get; set; }
        public string AppPassword { get; set; }
        public int Auth { get; set; }
        [NotMapped]
        public string StampNumber { get; set; }
    }
}
