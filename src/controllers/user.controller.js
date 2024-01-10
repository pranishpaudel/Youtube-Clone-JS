import {asyncHandler} from '/Users/air/Desktop/Youtube Clone JS/utils/asyncHandler.js';




export const registerUser= asyncHandler(async (req,res) =>{
res.status(200).json({
    message: 'ok'
})
})