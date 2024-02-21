const expressAsyncHandler = require("express-async-handler");
const ErrorHandling = require("../utils/ErrorFeature");
const prisma = require("../utils/PrismaClient");


exports.CreateReviewService = expressAsyncHandler(async (req, res, next) => {
  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      planteId: req.body.plante.id,
      rating: req.body.rating,
      content: req.body.content,
    },
  });

  const new_rating = Math.fround(
    (req.body.plante.rating * req.body.plante.Count_Rate + req.body.rating) /
      (req.body.plante.Count_Rate + 1)
  );
  const plante = await prisma.plante.update({
    where: { id: req.body.plante.id },
    data: { Count_Rate: req.body.plante.Count_Rate + 1, rating: new_rating },
  });

  return res.status(200).json({ data: review, success: true });
});

exports.UpdateReviewService = expressAsyncHandler(async (req, res, next) => {
  if (req.body?.rating) {
    const review = await prisma.review.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        plante: {
          select: {
            Count_Rate: true,
            rating: true,
          },
        },
      },
    });
    if (!review) return next(new ErrorHandling("review not found", 404));

    const newRating =
      review.plante.Count_Rate != 1
        ? (req.body.rating - review.rating) / review.plante.Count_Rate
        : req.body.rating - review.plante.rating;

    try {
      const plante = await prisma.plante.update({
        where: {
          id: review.planteId,
        },
        data: {
          rating: { increment: newRating },
        },
      });

      const updateReview = await prisma.review.update({
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
        data: {
          rating: req.body.rating,
          content: req.body.content,
        },
      });
      return res.status(200).json({ success: true, data: updateReview });
    } catch (error) {
      return next(new ErrorHandling(error.message || error, 400));
    }
  } else {
    const review = await prisma.review.update({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        content: req.body.content,
      },
    });
    return res.status(200).json({ success: true, data: review });
  }
});

exports.DeleteReviewService = expressAsyncHandler(async (req, res, next) => {
  const review = await prisma.review.delete({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      plante: {
        select: {
          Count_Rate: true,
          rating: true,
        },
      },
    },
  });

  const new_rating =
    review.plante.Count_Rate != 1
      ? Math.round(
          (review.plante.Count_Rate * review.plante.rating - review.rating) /
            (review.plante.Count_Rate - 1)
        )
      : 0;

  const plante = await prisma.plante.update({
    where: { id: review.planteId },
    data: {
      rating: new_rating,
      Count_Rate: { decrement: 1 },
    },
  });

  if (!review) return next(new ErrorHandling("review not found"), 404);
  return res.status(200).json({ success: true, data: review });
});
