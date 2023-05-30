const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


exports.createUser = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  const { nama, umur, pekerjaan,phone, email, password, confirm_password } = req.body;
    
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
      pekerjaan,
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
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
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
    const user = await User.findOne({ where: { email } });

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // const payload = {
    //   id: user.id,
    //   name: user.nama,
    //   image: user.image,
    //   email: user.email,
    //   phone: user.phone
    // }
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
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
      attributes: { exclude: ['password'] }, // Exclude the password field from the response
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
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
