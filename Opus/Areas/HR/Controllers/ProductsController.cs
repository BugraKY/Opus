using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using System.Linq;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class ProductsController : Controller
    {
        private readonly IUnitOfWork _uow;
        public ProductsController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("hr-products")]
        public IActionResult Index()
        {
            /*
            IList<Products> _productList=new List<Products>();
            var _products = _uow.Products.GetAll(includeProperties: "ProductCategory");
            foreach (var item in _products)
            {
                item.ProductSize = _uow.ProductSize.GetAll(i => i.ProductId == item.Id);
                _productList.Add(item);
            }
            return View(_productList);
            */
           // var _products = _uow.Products.GetAll(includeProperties: "ProductCategory");
            //return View(_products);

            //return View(_uow.Products.GetAll(includeProperties: "ProductCategory"));
            return View();
        }
        public IActionResult Test()
        {

            return View();
        }


        #region API
        [HttpGet("api/product/search/{search}")]
        public async Task<IEnumerable<Products>> SearchResult(string search)
        {
            IList<Products> _productList = new List<Products>();
            await Task.Run(() =>
            {

                var sizes = _uow.ProductSize.GetAll();
                /*
                var _products = _uow.Products.
                    GetAll(includeProperties: "ProductCategory").
                    Where(s => s.Name.ToLower().
                    Contains(search.ToLower())).
                    OrderBy(n => n.Name).
                    Join(_uow.ProductSize.GetAll(),
                    _product => _product.Id,
                    _prodSizes => _prodSizes.ProductId,
                    (prod, sizes) => new { Products = prod, ProductSize = sizes }).ToList();
                */

                //search = "Expert Sırt Çantası";//TEST
                var _products = _uow.Products.
                 GetAll(includeProperties: "ProductCategory").
                 Where(s => s.Name.ToLower().
                 Contains(search.ToLower())).
                 OrderBy(n => n.Name);

                
                foreach (var item in _products)
                {
                    item.ProductSize = _uow.ProductSize.GetAll(i => i.ProductId == item.Id);
                    _productList.Add(item);
                }

                //return _products;

            });
            return _productList;
 

        }
        [HttpGet("api/product/getAll")]
        public IEnumerable<Products> GetAll()
        {
            IList<Products> _productList = new List<Products>();
            var _products = _uow.Products.GetAll().OrderBy(n => n.Name);
            foreach (var item in _products)
            {
                item.ProductSize = _uow.ProductSize.GetAll(i => i.ProductId == item.Id);
                _productList.Add(item);
            }
            return _productList;
        }
        [HttpGet("api/product/getOnlyProd")]
        public IEnumerable<Products> GetOnlyProd()
        {
            IList<Products> _productList = new List<Products>();
            var _products = _uow.Products.GetAll().OrderBy(n => n.Name);
            return _products;
        }
        [HttpPost("api/product/add-prod")]
        public Products AddProd(Products prod)
        {/*
            var _product = new Products()
            {
                Name = prod,
            };*/
            var _category = _uow.ProductCategory.GetFirstOrDefault(i => i.Id == prod.ProductCategoryId);
            var _product = new Products()
            {
                Name = prod.Name,
                ProductCategoryId=prod.ProductCategoryId,
                ProductCategory=_category,
                //UnitId=prod.UnitId,
            };
            _uow.Products.Add(prod);
            _uow.Save();
            return _product;
        }
        [HttpGet("api/product/getCategory")]
        public IEnumerable<ProductCategory> GetCategory()
        {
            return _uow.ProductCategory.GetAll();
        }
        [HttpPost("api/product/add-size")]
        public ProductSize AddSize(ProductSize prodSize)
        {
            _uow.ProductSize.Add(prodSize);
            _uow.Save();
            return prodSize;
        }
        [HttpGet("api/product/remove/{id}")]
        public Products RemoveProd(long id)
        {
            var _product = _uow.Products.GetFirstOrDefault(i=>i.Id == id);
            _uow.Products.Remove(_product);
            _uow.Save();
            return null;
        }
        #endregion API
    }
}
