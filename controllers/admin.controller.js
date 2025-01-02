const Admin = require("../schema/Admin");
const AdminValidation = require("../validations/Admin");
const bcrypt = require("bcrypt");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");
const { generateTokens } = require("../service/jwt_service");

const getAll = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password -refreshToken");
    res.status(200).send({ message: "Done", admins });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });
    res.status(200).send({ message: "Done", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = AdminValidation.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const existingAdmin = await Admin.findOne({ login: value.login });
    if (existingAdmin) {
      return res.status(400).send({ message: "Login allaqachon mavjud" });
    }

    const hashedPassword = bcrypt.hashSync(
      value.password,
      config.get("bcrypt_round")
    );

    const admin = await Admin.create({
      ...value,
      password: hashedPassword,
    });

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;

    res.status(201).send({ message: "Done", admin: adminResponse });
  } catch (error) {
    errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ login: req.body.login });
    if (!admin) {
      return res.status(404).send({ message: "Login yoki parol noto'g'ri" });
    }

    const validPassword = bcrypt.compareSync(req.body.password, admin.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Login yoki parol noto'g'ri" });
    }

    const { tokens } = generateTokens({
      id: admin._id,
      login: admin.login,
      role: admin.role,
    });

    await Admin.findByIdAndUpdate(admin._id, {
      refreshToken: tokens.refreshToken,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });

    res.status(200).send({ message: "Done", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(404).send({ message: "Token topilmadi" });
    }

    const admin = await Admin.findOneAndUpdate(
      { refreshToken },
      { refreshToken: "" }
    );
    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.clearCookie("refreshToken");
    res.status(200).send({ message: "Done" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { error, value } = AdminValidation.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    if (value.password) {
      value.password = bcrypt.hashSync(
        value.password,
        config.get("bcrypt_round")
      );
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, value, {
      new: true,
    }).select("-password -refreshToken");

    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });

    res.status(200).send({ message: "Done", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id).select(
      "-password -refreshToken"
    );
    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });

    res.status(200).send({ message: "Done", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  login,
  logout,
  updateById,
  deleteById,
};
