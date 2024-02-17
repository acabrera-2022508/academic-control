export const isTeacher = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.role !== 'TEACHER') {
      return res
        .status(401)
        .json({ message: 'Unauthorized - You are not a Teacher' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
