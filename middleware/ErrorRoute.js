const ErrorMiddlwareHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === 'dev')
    sendErrorForDev( res ,err )
   
    else if (process.env.NODE_ENV === 'pro')
    sendErrorForPro(res ,err)
  };
  // eslint-disable-next-line arrow-body-style
  const sendErrorForDev = ( res , err )=>{
    
  
    return   res.status(err.statusCode)
                .json({
                  message: err.message,
                  status: err.status,
                  stack: err.stack,
                  error: err,
                })
  
  } 
  
  
  const handleTokenError = ( number ) => { return number === 1 ? 'token is not valid , please login again ' : 'token is expired , please login again'};
  
  const sendErrorForPro = ( res , err ) =>{
    if (  err.name == 'JsonWebTokenError') err.message = handleTokenError (1);
    else if (  err.name  == 'TokenExpiredError') err.message = handleTokenError(0);
      return   res.status(err.statusCode)
                .json({
                    message: err.message,
                    status: err.status,
                  })
  
  }

  module.exports =  ErrorMiddlwareHandler