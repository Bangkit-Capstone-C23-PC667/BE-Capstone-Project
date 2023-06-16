const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});
const bucketName = 'bangkit-capstone-c23-pc667-user-bucket';
const bucket = storage.bucket(bucketName);

const Kuesioner = require('../models/kuesionerModel');
const Answer = require('../models/answerModel');

exports.createUser = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  const { nama, umur, gender,phone, email, password, confirm_password } = req.body;
    
  // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if the password and confirm_password fields are not null
    if (!confirm_password) {
      return res.status(400).json({ message: 'Confirm password is required' });
    }
    
  // Check if the password and confirm_password match
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  try {
    // Generate a salt and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user in the database
    const user = await User.create({
      nama,
      umur,
      gender,
      phone,
      email,
      password: hashedPassword, // Store the hashed password
      confirm_password: hashedPassword,
    });
    const payload = {
      id: user.id,
      name: user.nama,
      image: user.image,
      email: user.email,
      phone: user.phone
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '1h', // Token expiration time
    });
    res.status(201).send({
      status: "success",
      message: "Registrasi berhasil",
      data: {
        token: token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add other controller methods as needed
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    const response = {
      status: "success",
      message: "berhasil menampilkan semua data user",
      data: users,
    }    
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error in user controller' });
  }
};

exports.login = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email:email } });
    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '1h', // Token expiration time
    });
    res.status(200).send({
      status: "success",
      message: "login berhasil",
      data: {
        token
      }
    });  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Access the user ID from the JWT payload

    // Retrieve the user profile from the database based on the user ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'confirm_password'] }, // Exclude the password field from the response
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const response = {
      status: "success",
      message: "login berhasil menampilkan data profile user",
      data: user
      
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama, umur, pekerjaan } = req.body;
    const userId = req.user.userId; // Extract the user ID from the authenticated request

    // Find the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    if (nama) {
      user.nama = nama;
    }
    if (umur) {
      user.umur = umur;
    }
    if (pekerjaan) {
      user.pekerjaan = pekerjaan;
    }

    // Save the updated user
    await user.save();

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Find the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  try {
    // Clear the JWT token
    res.clearCookie('jwt');

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//still broken
// exports.updateProfilePicture = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const fileBuffer = req.file.buffer;
//     const fileName = `${Date.now()}-${req.file.originalname}`;

//     const file = bucket.file(fileName);

//     const stream = file.createWriteStream({
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//     });

//     stream.on('error', (error) => {
//       console.error('Error uploading file to Cloud Storage:', error);
//       res.status(500).json({ message: 'Failed to upload profile picture' });
//     });

//     stream.on('finish', () => {
//       User.update({ image: fileName }, { where: { id: userId } })
//         .then(() => {
//           res.json({ message: 'Profile picture updated successfully' });
//         })
//         .catch((error) => {
//           console.error('Error updating profile picture in database:', error);
//           res.status(500).json({ message: 'Failed to update profile picture' });
//         });
//     });

//     stream.end(fileBuffer);
//   } catch (error) {
//     console.error('Error updating profile picture:', error);
//     res.status(500).json({ message: 'Failed to update profile picture' });
//   }
// };

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const folderName = 'user/profile-picture';


    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `${folderName}/${fileName}`;


    const file = storage.bucket(bucketName).file(filePath);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (error) => {
      console.error('Error uploading file to Cloud Storage:', error);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    });

    stream.on('finish', () => {
      User.update({ image: fileName }, { where: { user_id: userId } })
        .then(() => {
          res.json({ message: 'Profile picture updated successfully' });
        })
        .catch((error) => {
          console.error('Error updating profile picture in database:', error);
          res.status(500).json({ message: 'Failed to update profile picture' });
        });
    });

    stream.end(fileBuffer);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};


exports.showKuesionerHistory = async (req, res) => {
  const userId = req.user.userId; // Mengakses informasi user yang sedang login

  try {
    // Cari user berdasarkan user ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cari semua jawaban kuesioner yang telah dijawab oleh user
    const answers = await Answer.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Kuesioner,
          attributes: ['kuesioner_id', 'judul'],
        },
      ],
    });

    // Membuat objek response yang berisi history kuesioner
    const kuesionerHistory = answers.map(answer => {
      return {
        kuesionerId: answer.Kuesioner.kuesioner_id,
        kuesionerTitle: answer.Kuesioner.judul,
        answer: answer.answer,
        createdAt: answer.createdAt,
      };
    });
    const response = {
      status: "success",
      message: "berhasil menampilkan history",
      data: kuesionerHistory
      
    }
    res.json(response);
  } catch (error) {
    console.error('Error fetching kuesioner history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.showUserOwnKuesioner = async (req, res) => {
  try {
  const userId = req.user.userId;

  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  const kuesioner = await Kuesioner.findAll({ where: { user_Id: userId } });

  if (kuesioner.length === 0) {
    return res.status(404).json({ message: 'User has no kuesioner' });
  }
  
  const response = {
    status: "success",
    message: "berhasil menampilkan kuesioner miliki user",
    data: kuesioner
  }
  res.json(response);
  } catch (error) {
      console.error('Error fetching kuesioner:', error);
      res.status(500).json({ message: 'Failed to fetch kuesioner' });
  }
};
