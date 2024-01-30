const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");

exports.CreateAddressService = expressAsyncHandler(async (req, res, next) => {
  const address= await prisma.address.create({
    data: { userId: req.user.id,...req.body },
  });
  return res.status(201).json({ data: address });
});

exports.UpdateAddressService = expressAsyncHandler(async (req, res, next) => {
  const address = await prisma.address.update({
    data: req.body,
    where: { id: req.params.id, userId: req.user.id },
  });
  return res.status(201).json({ data: address });
});

exports.DeleteAddressService = expressAsyncHandler( async ( req , res , next) =>{
    const address = await prisma.address.delete({where:{userId : req.user.id , id:req.params.id}});
    return res.status(201).json({ success: true, message:"success delete address" });
});


exports.GetUserAddressService = expressAsyncHandler ( async ( req , res , next )=> {
    const addresses = await prisma.address.findMany({where:{userId : req.user.id}});
    return res.status(200).json({data: addresses});
})

