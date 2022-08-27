const cloudinary = require('cloudinary');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// cloudinary.config({
//     cloud_name: 'pigeon',
//     api_key: '495646937389657',
//     api_secret: 'S1K0AgjafNxSuPJderDMLRl1YGk'
//   });

const uploadCtrl = {
  uploadfile: (req, res) => {
    try {
      const file = req.files.file;
      // console.log(file);
      let filename = req.body.filename;
      filename = filename.split(' ').join('_');
      // console.log(__dirname);
      let extName = path.extname(file.name);
      let uploadDir = path.join(
        __dirname,
        '../upload',
        'upload_' + filename + extName
      );
      file.mv(uploadDir, async (err) => {
        if (err) {
          console.log(err);
        } else {
          cloudinary.v2.uploader.upload(
            uploadDir,
            { resource_type: 'auto' },
            async (err, result) => {
              if (err) throw err;

              let wb = xlsx.readFile(uploadDir, { cellDates: true });
              const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
              const data = xlsx.utils.sheet_to_json(ws);
              // console.log(data);
              // console.log(data.length);

              removeTmp(uploadDir);

              res.json({
                success: true,
                url: { ...result, data_len: data.length },
              });
            }
          );
        }
      });
      // cloudinary.v2.uploader.upload(
      //   file.tempFilePath,
      //   { resource_type: 'auto' },
      //   async (err, result) => {
      //     if (err) throw err;

      //     removeTmp(file.tempFilePath);

      //     res.json({ success: true, url: result });
      //   }
      // );
      // res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, msg: 'hii' });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
