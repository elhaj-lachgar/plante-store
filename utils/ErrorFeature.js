
class ErrorHandling extends Error {  
    constructor(error_message, error_statusCode) {
  
      super(error_message);
      
      this.statusCode = error_statusCode;
      this.status = `${error_statusCode}`.startsWith("4") ? "faild" : "error";
      this.isOperated = true;
  
    }
  }
  
  
  module.exports = ErrorHandling