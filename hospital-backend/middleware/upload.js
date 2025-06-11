const multer = require("multer");
const path = require("path");

// General storage for PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// Profile storage for images
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const profileFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for profile pictures!"), false);
  }
};

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

// Health plan storage for both images and PDFs
const healthPlanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'coverImage') {
      cb(null, "uploads/health-plans/images/");
    } else if (file.fieldname === 'planFile') {
      cb(null, "uploads/health-plans/files/");
    } else {
      cb(null, "uploads/health-plans/");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const healthPlanFileFilter = (req, file, cb) => {
  // Only validate actual file uploads
  if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Cover image must be an image file!"), false);
    }
  } else if (file.fieldname === 'planFile') {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Plan file must be a PDF!"), false);
    }
  } else {
    // Skip unexpected fields without error
    cb(null, false);
  }
};

const healthPlanUpload = multer({
  storage: healthPlanStorage,
  fileFilter: healthPlanFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Bulletin storage for images
const bulletinStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/bulletins/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const bulletinFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for bulletin icons!"), false);
  }
};

const bulletinUpload = multer({
  storage: bulletinStorage,
  fileFilter: bulletinFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const TPAAffiliationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/TPAAffiliations/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const TPAAffiliationFileFilter = (req, file, cb) => {
  if(file.fieldname === 'Logo')
  {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    }else {
      cb(new Error("Only image files are allowed for TPAAffiliations!"), false);
    }
  }else{
    cb(new Error("Only image files are allowed for TPAAffiliations!"), false);
  }
};

const TPAAffiliationsUpload = multer({
  storage: TPAAffiliationStorage,
  fileFilter: TPAAffiliationFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
module.exports.upload = upload;
module.exports.profileUpload = profileUpload;
module.exports.healthPlanUpload = healthPlanUpload;
module.exports.bulletinUpload = bulletinUpload;
module.exports.TPAAffiliationsUpload = TPAAffiliationsUpload;