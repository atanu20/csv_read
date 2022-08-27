const employeeTable = require('../models/user');
const fileTable = require('../models/file');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // console.log(req.body);
      const user = await employeeTable.findOne({ email });
      if (user)
        return res.json({ success: false, msg: 'This email already exists.' });

      if (password.length < 6)
        return res.json({
          success: false,
          msg: 'Password must be at least 6 characters.',
        });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new employeeTable({
        name,
        email,
        password: passwordHash,
      });

      await newUser.save();

      res.json({
        success: true,
        msg: 'Account has been created!',
        newUser,
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await employeeTable.findOne({ email });
      if (!user)
        return res.json({ success: false, msg: 'This email does not exist.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({ success: false, msg: 'Password is incorrect.' });

      const access_token = createAccessToken({ id: user._id });

      res.json({
        success: true,
        access_token,
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await employeeTable
        .findById(req.user.id)
        .select('-password');

      res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, msg: err.message });
    }
  },
  postfile: async (req, res) => {
    try {
      const newmsg = new fileTable(req.body);
      await newmsg.save();
      res.json({
        success: true,
        msg: 'File Uploaded Successfully',
        newmsg,
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAllUpload: async (req, res) => {
    try {
      const usermsg = await fileTable
        .find({
          userId: req.user.id,
        })
        .sort({ createdAt: -1 });
      res.json({ success: true, msg: usermsg });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getDatabyId: async (req, res) => {
    try {
      const fileid = req.params.fileid;
      // console.log(fileid);
      const file = await fileTable.findById(fileid);

      res.json({ success: true, msgs: file });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = userCtrl;

// const result = await jobTable.find({

//   $or: [{
//       employer_company_category: { '$in': ['Agri-tech', 'Artificial Intelligence'] }
//   }, {
//       $or: [{
//           tech_skills: { '$in': ['React', 'Node JS'] },
//       }, {
//           non_tech_skills: { '$in': ['Php', 'Next JS'] },
//       }]
//   }],

//   $or: [{
//       job_type: { '$in': ['Office', 'Remote'] }
//   }, {
//       job_location: { '$in': ['Bangalore', 'Kolkata'] }
//   }],

//   $or: [{
//       experience: { '$in': ['Entry Level/ Fresher'] }
//   }, {
//       no_employees: { '$in': ['101-500 Employees', '21-100 Employees'] }
//   }],

//   $and: [{
//       salary: { $gte: 7 }
//   }, {
//       salary: { $lte: 27 }
//   }]

// })
