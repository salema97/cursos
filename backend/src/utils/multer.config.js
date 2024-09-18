const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const dirPatchProduct = path.join(__dirname, "../../uploads/products/images");

if (!fs.existsSync(dirPatchProduct)) {
  fs.mkdirSync(dirPatchProduct, { recursive: true });
}

const storageProduct = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, dirPatchProduct);
  },
  filename: function (_, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex"),
      fileExtension = path.extname(file.originalname);
    cb(null, customFileName + fileExtension);
  },
});

const uploadProductImage = multer({
  storage: storageProduct,
  limits: { fileSize: 5000000 },
  fileFilter: function (_, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
    cb(null, true);
  },
});

module.exports = uploadProductImage;
