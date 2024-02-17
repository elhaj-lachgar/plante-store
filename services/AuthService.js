const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/ErrorFeature");
const ErrorHandling = require("../utils/ErrorFeature");
const GetFeature = require("../utils/GetFeatures");
const cloudinary = require("cloudinary").v2;
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

exports.SignUpService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;
  req.body.confirmPassword = undefined;
  const { password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
  req.body.password = hashedPassword;

  const user = await prisma.user.create({
    data: req.body,
    select: {
      email: true,
      name: true,
      profile: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      id: true,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.SUCRET_KEY_JWT, {
    expiresIn: process.env.EXIPRED_JWT,
  });

  return res.status(201).json({ data: user, token });
});

exports.AuthService = expressAsyncHandler(async (req, res, next) => {
  if (!req.headers.authorization)
    return next(new ErrorHandler("unauthorized", 403));

  const token = req.headers.authorization.split(" ")[1];

  const IsValid = jwt.verify(token, process.env.SUCRET_KEY_JWT);

  if (!IsValid.userId) return next(new ErrorHandler("unauthorized", 403));

  const user = await prisma.user.findUnique({
    where: { id: IsValid.userId },
    include: {
      Card: {
        select: {
          id: true,
          coupon: {
            select: {
              id: true,
              code: true,
              percentage: true,
            },
          },
        },
      },
    },
  });

  if (!user) return next(new ErrorHandler("user not found", 404));

  if (user.changePasswordAt) {
    const dure = Math.floor(user.changePasswordAt / 1000);
    if (dure > IsValid.iat)
      return next(new ErrorHandler("please login again", 400));
  }

  req.user = user;
  return next();
});

exports.SignInService = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    include: {
      Card: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!user) return next(new ErrorHandler("User not found", 404));
  const IsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!IsValid)
    return next(new ErrorHandler("email or password incorrect", 404));
  const UserInfo = user;
  UserInfo.changePasswordAt = undefined;
  UserInfo.password = undefined;

  const token = jwt.sign({ userId: user.id }, process.env.SUCRET_KEY_JWT, {
    expiresIn: process.env.EXIPRED_JWT,
  });

  return res.status(201).json({ data: UserInfo, token });
});

exports.AllowdTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    const isValid = roles.includes(req.user.role);
    if (!isValid) return next(new ErrorHandling("Invalid role", 403));
    return next();
  });

exports.ChangePasswordService = expressAsyncHandler(async (req, res, next) => {
  const isValid = bcrypt.compareSync(
    req.body.currentPassword,
    req.user.password
  );

  if (!isValid) return next(new ErrorHandling("Invalid password", 403));
  const hashedPassword = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT)
  );
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { changePasswordAt: new Date(Date.now()), password: hashedPassword },
  });

  return res
    .status(200)
    .json({ message: "success change password , plesae login again" });
});

exports.UpdateProfileService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;
  req.body.password = undefined;
  if (req.body.profile && req.user?.profile) {
    const image = [
      req.user.profile.split("/")[7],
      req.user.profile.split("/")[8],
    ]
      .join("/")
      .split(".")[0];
    await cloudinary.api
      .delete_resources([image], {
        type: "upload",
        resource_type: "image",
      })
      .then((res) => {
        console.log(res.toString());
      });
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
    select: {
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      role: true,
    },
  });

  if (!user) return next(new ErrorHandling("user not found", 404));
  return res.status(200).json({ data: user });
});

exports.AdminLoginService = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    include: {
      Card: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!user) return next(new ErrorHandler("User not found", 404));
  const IsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!IsValid)
    return next(new ErrorHandler("email or password incorrect", 404));
  if (user.role != "ADMIN")
    return next(new ErrorHandler("not valid role", 404));
  const UserInfo = user;
  UserInfo.changePasswordAt = undefined;
  UserInfo.password = undefined;

  const token = jwt.sign({ userId: user.id }, process.env.SUCRET_KEY_JWT, {
    expiresIn: process.env.EXIPRED_JWT,
  });

  return res.status(201).json({ data: UserInfo, token });
});

exports.GetUsersService = expressAsyncHandler(async (req, res, next) => {
  const feature = new GetFeature();

  const { data, pagination } = await feature.findMany(
    "user",
    req.query,
    "private"
  );

  return res.status(200).json({ data, pagination });
});

exports.UpdateUserRoleService = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      role: req.body.role,
    },
  });

  return res.status(201).json({ success: true, data: user });
});
