class ApiError extends Error{
    constructor(
        statusCode,
message= "Something went Wrong",
errors= [],
stack= ''

    ){
super(message)
this.statusCode= statusCode;
this.data= null
this.message= message
this.success= false
this.errors= errors
    }
}
//aded
const donbe= "Yes"

export {ApiError};