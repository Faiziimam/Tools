const express = require('express');
const multer = require('multer');
const path = require('path');
const { csvToJsonHandler, jsonToCsvHandler } = require('../controllers/convertController');
const { csvFileFilter, jsonFileFilter } = require('../middlewares/fileFilter');
const router = express.Router();

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 10 * 1024 * 1024; 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //tmp directory 
    cb(null, '/tmp'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadCsv = multer({
  storage: storage,
  fileFilter: csvFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

const uploadJson = multer({
  storage: storage,
  fileFilter: jsonFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// Routes
/**
 * @route POST /api/csv-to-json
 * @desc Convert CSV file to JSON
 */
router.post('/csv-to-json', uploadCsv.single('file'), csvToJsonHandler);

/**
 * @route POST /api/json-to-csv
 * @desc Convert JSON file to CSV
 */
router.post('/json-to-csv', uploadJson.single('file'), jsonToCsvHandler);

module.exports = router;
