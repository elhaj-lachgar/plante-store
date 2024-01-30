const colors = require("colors");

const UnhandlerError = ( server , err )=>{
    console.log(colors.red("Unhandled rejection" , err?.message,{stack:err?.stack}));
    server.close(()=>{
        console.log(colors.red("Server closed"));
        process.exit(0);
    })
}

module.exports = UnhandlerError