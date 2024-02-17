import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = async (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
