const ErrorHandler = require("../utils/ErrorFeature")
const UndefinedRoute = (req , res , next) => {
    return  next(new ErrorHandler("route not defined" , 404));
}


module.exports = UndefinedRoute;