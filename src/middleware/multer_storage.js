import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExension = file.originalname.split(".")[1];
    const filenameWithExtension = `${file.fieldname}-${uniqueSuffix}.${fileExension}`;
    cb(null, filenameWithExtension);
  },
});

export const upload = multer({ storage });
