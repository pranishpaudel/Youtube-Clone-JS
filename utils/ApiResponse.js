class ApiResponse{
    constructor(statusCode,data,message= "Sccess"){
        this.statusCode= statusCode
        this.data= data
        this.message= message
        this.success= this.statusCode < 400
    }
}
//add some codes
export {ApiResponse};
