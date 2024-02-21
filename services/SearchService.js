const prisma  = require('../utils/PrismaClient');
const expressAsyncHandler = require("express-async-handler");

exports.GetSearchResult = expressAsyncHandler(async (req, res) => {
  const result = await prisma.searchName.findMany({
    where: { value: { startsWith: req.params.value } },
  });
  return res.status(200).json({result});
});
