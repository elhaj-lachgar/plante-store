const expressAsyncHandler = require("express-async-handler");
const prisma = require('../utils/PrismaClient');
const ErrorHandler = require('../utils/ErrorFeature');

exports.CreateCouponService = expressAsyncHandler( async (req, res , next) => {
    const coupon = await prisma.coupon.create({data:req.body});
    return res.status(200).json({success:true , coupon})
});


exports.DeleteCouponService = expressAsyncHandler ( async ( req , res , next ) => {
    const coupon = await prisma.coupon.delete({where:{id:req.params.id}});
    return res.status(201).json({success:true , message:"Delete coupon successfully"});
});



exports.GetCouponService = expressAsyncHandler ( async ( req , res , next  ) => {

    const coupon  = await prisma.coupon.findMany({where:{code:req.params.code}});
    if(!coupon) return next( new ErrorHandler("Couldn't find coupon" , 404));
    return res.status(200).json({coupon})
})


exports.GetCouponsService  = expressAsyncHandler( async ( req , res , next ) => {
    const coupons = await prisma.coupon.findMany({});
    return res.status(200).json({coupons});
})