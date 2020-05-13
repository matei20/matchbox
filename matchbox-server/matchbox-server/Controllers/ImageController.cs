using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.IO;
using MatchboxServer.Utilities;

namespace MatchboxServer.Controllers
{
    [Produces("application/json")]
    public class ImageController : Microsoft.AspNetCore.Mvc.Controller
    {
        //upload-image
        [Route("api/upload-image")]
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormCollection form)
        {
            string storePath = "F:/Licenta/matchbox/matchbox-server/Uploads/";
            if (form.Files == null || form.Files[0].Length == 0)
                return RedirectToAction("Index");
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            string filename = id.ToString() + ".jpg";
            
            var path = Path.Combine(storePath, filename);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await form.Files[0].CopyToAsync(stream);

            }

            return Ok(new { succes = "true" });

        }

        //download-image
        [Route("api/download-image/{filename}")]
        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> DownloadImage(string filename)
        {
            string storePath = "F:/Licenta/matchbox/matchbox-server/Uploads/";

            var path = Path.Combine(storePath, filename);
            if (!System.IO.File.Exists(path))
            {
                path = Path.Combine(storePath, "default.jpg");
            }
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            string extension = Path.GetExtension(path).ToLowerInvariant();
            string content_type = "image/jpeg";
            switch (extension) {
                case ".jpg":
                case ".jpeg":
                    content_type = "image/jpeg";
                    break;

                case ".png":
                    content_type = "image/png";
                    break;
            }

                memory.Position = 0;
            return File(memory, content_type, Path.GetFileName(path));
        }

        //delete-image
        [Route("api/delete-image")]
        [HttpDelete]
        public async Task<IActionResult> DeleteImage()
        {
            string storePath = "F:/Licenta/matchbox/matchbox-server/Uploads/";
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            var filename = id.ToString() + ".jpg";

            var path = Path.Combine(storePath, filename);

            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
                return Ok(new { succes = "true" });
            }
            else
                return NotFound(new { message = "File not found" });
        }

    }
}