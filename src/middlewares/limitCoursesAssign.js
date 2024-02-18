export const limitCoursesAssign = (req, res, next) => {
  let { courses } = req.user;

  if (courses.length >= 3) {
    return res
      .status(400)
      .json({
        message: 'You can not assign more than 3 courses. Talk to your direct',
      });
  }

  next();
};
