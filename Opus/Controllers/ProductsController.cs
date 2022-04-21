using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;

namespace Opus.Controllers
{
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
            IList<Products> _productList=new List<Products>();
            var _products = _uow.Products.GetAll(includeProperties: "ProductCategory");
            foreach (var item in _products)
            {
                item.ProductSize = _uow.ProductSize.GetAll(i => i.ProductId == item.Id);
                _productList.Add(item);
            }
            return View(_productList);
        }
        public IActionResult Test()
        {

            return View();
        }
        #region API
        [HttpGet("api/product/search/{search}")]
        public IEnumerable<Products> SearchResult(string search)
        {
            IList<Products> _productList = new List<Products>();
            var sizes = _uow.ProductSize.GetAll();
            /*
            var _products = _uow.Products.
                GetAll(includeProperties: "ProductCategory").
                Where(s => s.Name.ToLower().
                Contains(search.ToLower())).
                OrderBy(n => n.Name).
                Join(_uow.ProductSize,
                p => p.Id,
                e => e.
                );
         
            
            foreach (var item in _products)
            {
                item.ProductSize = _uow.ProductSize.GetAll(i => i.ProductId == item.Id);
                _productList.Add(item);
            }
            */
            return _productList;
        }
        [HttpGet("api/product/getAll")]
        public IEnumerable<Products> GetAll()
        {
            return _uow.Products.GetAll().OrderBy(n=>n.Name);
        }
        #endregion API
    }
}
