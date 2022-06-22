﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Opus.DataAcces.Data;

#nullable disable

namespace Opus.DataAcces.Migrations.AccountingDb
{
    [DbContext(typeof(AccountingDbContext))]
    [Migration("20220622082351_InitialMigration12")]
    partial class InitialMigration12
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Bank", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Bank");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Category", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<Guid?>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Category");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Company", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("DefinitionCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImageFile")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Sorting")
                        .HasColumnType("int");

                    b.Property<string>("StreetAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaxAuthority")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaxNo")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.CompanyDepartmants", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("DepartmantId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("DepartmantId");

                    b.ToTable("CompanyDepartments");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Contact", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("DepartmantId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("IdentificationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("MobileNumber")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DepartmantId");

                    b.HasIndex("IdentificationId");

                    b.ToTable("Contact");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.ContactDefinitions", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ContactId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("IdentificationId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("ContactId");

                    b.HasIndex("IdentificationId");

                    b.ToTable("ContactDefinitions");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Departmant", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Departmant");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.ExchangeRate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ExchangeRate");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Identification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<Guid>("BankId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CommercialTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("IBAN")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("IdNumber")
                        .HasColumnType("bigint");

                    b.Property<Guid>("IdentificationTypeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("IdentityCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PaymentTerm")
                        .HasColumnType("int");

                    b.Property<string>("StreetAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaxAuthority")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaxNo")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("BankId");

                    b.HasIndex("CompanyId");

                    b.HasIndex("IdentificationTypeId");

                    b.ToTable("Identification");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.IdentificationType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Identity")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("IdentificationType");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.PaymentMeth", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PaymentMeth");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.PurchaseInvoice", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("Discount")
                        .HasColumnType("real");

                    b.Property<DateTime>("DocDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("DocNo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ExchangeRateId")
                        .HasColumnType("int");

                    b.Property<Guid>("IdentificationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("OutofVat")
                        .HasColumnType("real");

                    b.Property<int>("PaymentMethId")
                        .HasColumnType("int");

                    b.Property<DateTime>("PaymentTerm")
                        .HasColumnType("datetime2");

                    b.Property<float>("TotalAmount")
                        .HasColumnType("real");

                    b.Property<float>("Vat")
                        .HasColumnType("real");

                    b.Property<float>("Vat_1")
                        .HasColumnType("real");

                    b.Property<float>("Vat_18")
                        .HasColumnType("real");

                    b.Property<float>("Vat_8")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("ExchangeRateId");

                    b.HasIndex("IdentificationId");

                    b.HasIndex("PaymentMethId");

                    b.ToTable("PurchaseInvoice");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.PurchaseInvoiceDetails", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<float>("Discount")
                        .HasColumnType("real");

                    b.Property<int>("Piece")
                        .HasColumnType("int");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<Guid>("PurchaseInvoiceId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("TagDefinitionsId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("Total")
                        .HasColumnType("real");

                    b.Property<float>("Vat")
                        .HasColumnType("real");

                    b.Property<float>("Vat_Rate")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.HasIndex("PurchaseInvoiceId");

                    b.HasIndex("TagDefinitionsId");

                    b.ToTable("PurchaseInvoiceDetails");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Staff", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<Guid>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("DepartmantId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MobileNum")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("DepartmantId");

                    b.ToTable("Staff");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.SubCategory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<Guid>("CategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("SubCategory");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Tag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("Tag");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.TagDefinitions", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("SubCategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("TagId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("SubCategoryId");

                    b.HasIndex("TagId");

                    b.ToTable("TagDefinitions");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Category", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");

                    b.Navigation("Company");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.CompanyDepartmants", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Departmant", "Departmant")
                        .WithMany()
                        .HasForeignKey("DepartmantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");

                    b.Navigation("Departmant");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Contact", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Departmant", "Departmant")
                        .WithMany()
                        .HasForeignKey("DepartmantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Identification", "Identification")
                        .WithMany()
                        .HasForeignKey("IdentificationId");

                    b.Navigation("Departmant");

                    b.Navigation("Identification");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.ContactDefinitions", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Contact", "Contact")
                        .WithMany()
                        .HasForeignKey("ContactId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Identification", "Identification")
                        .WithMany()
                        .HasForeignKey("IdentificationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Contact");

                    b.Navigation("Identification");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Identification", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Bank", "Bank")
                        .WithMany()
                        .HasForeignKey("BankId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.IdentificationType", "IdentificationType")
                        .WithMany()
                        .HasForeignKey("IdentificationTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bank");

                    b.Navigation("Company");

                    b.Navigation("IdentificationType");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.PurchaseInvoice", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");

                    b.HasOne("Opus.Models.DbModels.Accounting.ExchangeRate", "ExchangeRate")
                        .WithMany()
                        .HasForeignKey("ExchangeRateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Identification", "Identification")
                        .WithMany()
                        .HasForeignKey("IdentificationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.PaymentMeth", "PaymentMeth")
                        .WithMany()
                        .HasForeignKey("PaymentMethId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");

                    b.Navigation("ExchangeRate");

                    b.Navigation("Identification");

                    b.Navigation("PaymentMeth");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.PurchaseInvoiceDetails", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.PurchaseInvoice", "PurchaseInvoice")
                        .WithMany()
                        .HasForeignKey("PurchaseInvoiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.TagDefinitions", "TagDefinitions")
                        .WithMany()
                        .HasForeignKey("TagDefinitionsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PurchaseInvoice");

                    b.Navigation("TagDefinitions");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Staff", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Opus.Models.DbModels.Accounting.Departmant", "Departmant")
                        .WithMany()
                        .HasForeignKey("DepartmantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");

                    b.Navigation("Departmant");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.SubCategory", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.Tag", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("Opus.Models.DbModels.Accounting.TagDefinitions", b =>
                {
                    b.HasOne("Opus.Models.DbModels.Accounting.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("Opus.Models.DbModels.Accounting.SubCategory", "SubCategory")
                        .WithMany()
                        .HasForeignKey("SubCategoryId");

                    b.HasOne("Opus.Models.DbModels.Accounting.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId");

                    b.Navigation("Category");

                    b.Navigation("SubCategory");

                    b.Navigation("Tag");
                });
#pragma warning restore 612, 618
        }
    }
}
