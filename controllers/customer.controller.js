const { errorHandler } = require("../helpers/error_handler");
const CustomerValidation = require("../validations/Customer");
const Customer = require("../schema/Customer");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require("config");
const sendEmail = require("../service/mail.service");
const { generateTokens } = require("../service/jwt_service");

const create = async (req, res) => {
  try {
    const { error, value } = CustomerValidation.validate(req.body);
    if (error) errorHandler(error, res);

    const password = bcrypt.hashSync(
      value.password,
      config.get("bcrypt_round")
    );
    const verification = uuid.v4();

    const customer = await Customer.create({
      ...value,
      password,
      verification,
    });

    const customerResponse = await Customer.findById(customer._id).select(
      "-password -verification"
    );

    await sendEmail.sendMailActivationCode(customer.email, verification);

    res.status(201).send({ message: "done", customer: customerResponse });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const customers = await Customer.find()
      .select("-password")
      .select("-refreshToken")
      .select("-verification");
    res.status(200).send({ message: "done", customers });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select("-password")
      .select("-refreshToken")
      .select("-verification");
    res.status(200).send({ message: "done", customer });
  } catch (error) {
    errorHandler(error, res);
  }
};

const update = async (req, res) => {
  try {
    if (
      !bcrypt.compareSync(
        req.body.old_password,
        (await Customer.findById(req.customer.id)).password
      )
    ) {
      return res.status(400).send({ error: "Parol noto'g'ri" });
    }
    delete req.body.old_password;
    const { error, value } = CustomerValidation.validate(req.body);
    if (error) errorHandler(error, res);

    const verification = uuid.v4();
    const hashed = bcrypt.hashSync(value.password, config.get("bcrypt_round"));

    const customer = await Customer.findByIdAndUpdate(req.customer.id, {
      ...value,
      is_active: false,
      verification,
      password: hashed,
    })
      .select("-password")
      .select("-verification")
      .select("-refreshToken");
    if (!customer) return res.status(404).send({ message: "Mijoz topilmadi" });

    sendEmail.sendMailActivationCode(value.email, verification);

    res.status(200).send({ message: "done", customer });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.customer.id);
    if (!customer) return res.status(404).send({ message: "Mijoz topilmadi" });

    res.status(200).send({ message: "done", customer });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verify = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      verification: req.params.verification,
    });
    if (!customer) return res.status(404).send({ message: "Mijoz topilmadi" });

    await Customer.findByIdAndUpdate(customer._id, { is_active: true });
    res.status(200).send({ message: "Akkaunt aktivlashtirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const resendVerification = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer) return res.status(404).send({ message: "Mijoz topilmadi" });

    if (customer.is_active)
      return res.status(404).send({ message: "Akkaunt aktiv" });

    const minutes = Math.floor((Date.now() - customer.mail_sent_at) / 60000);
    const waitMinutes = 15 - minutes;

    if (customer.mail_sent_at && minutes < 15) {
      return res.status(404).send({
        message: `Keyingi xabarni ${waitMinutes} minutdan keyin yubora olasiz`,
      });
    }

    const verification = uuid.v4();
    await Customer.findByIdAndUpdate(customer._id, { verification });

    await sendEmail(customer.email, verification);
    res.status(200).send({ message: "Xabar yuborildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer)
      return res.status(404).send({ message: "Email yoki parol noto'g'ri" });

    const password = bcrypt.compareSync(req.body.password, customer.password);
    if (!password)
      return res.status(404).send({ message: "Email yoki parol noto'g'ri" });

    const { tokens } = generateTokens({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      surname: customer.surname,
    });

    await Customer.findByIdAndUpdate(customer._id, {
      refreshToken: tokens.refreshToken,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });

    res.status(200).send({ message: "done", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(404).send({ message: "Token topilmadi" });

    const customer = await Customer.findOneAndUpdate(
      { refreshToken },
      { refreshToken: "" }
    );
    if (!customer)
      return res
        .status(404)
        .send({ message: "Bunday tokenli mijoz topilmadi" });

    res.clearCookie("refreshToken");
    res.status(200).send({ message: "done", refreshToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(404).send({ message: "Token topilmadi" });


    const customer = await Customer.findOne({ refreshToken });
    if (!customer)
      return res
        .status(404)
        .send({ message: "Bunday tokenli mijoz topilmadi" });

    const { tokens } = generateTokens({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      surname: customer.surname,
    });

    await Customer.findByIdAndUpdate(customer._id, {
      refreshToken: tokens.refreshToken,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    res.status(200).send({ message: "done", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteCustomer,
  verify,
  login,
  logout,
  refreshToken,
  resendVerification,
};
