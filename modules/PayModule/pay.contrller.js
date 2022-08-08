const User = require("./pay.model");
const { StatusCodes } = require("http-status-codes");

exports.allUsers = async (_req, res) => {
  try {
    const data = await User.findAll({})
    res.status(StatusCodes.OK).json({ message: 'success', data })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'error', error })
  }
}


exports.addUser = async (req, res) => {
  const body = req.body;
  try {
    const data = await User.create(body);
    res.status(StatusCodes.OK).json({ message: "added success", data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "error", error });
  }
};


