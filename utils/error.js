export const errorHandler =(statuscode, massege)=>{
const error = new Error()
error.statuscode = statuscode
error.message =massege
return error
}