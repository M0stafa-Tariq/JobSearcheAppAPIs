import multer, { diskStorage } from "multer";

export const fileValidation = {
  pdf: ["application/pdf"],
};

export function uploadFileCould({ filter }) {
  const storage = diskStorage({}); //save file in system "temp"

  const fileFilter = (req, file, cb) => {
    if (!filter.includes(file.mimetype)) {
      return cb(new Error("invalid format!"), false);
      //false >>> dont save file
    }
    return cb(null, true);
    //null >> no errors
    //true >> save file
  };

  const multerUpload = multer({ fileFilter, storage });

  return multerUpload;
}
