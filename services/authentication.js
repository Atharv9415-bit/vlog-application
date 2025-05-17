const jwt=require("jsonwebtoken");
const secret="atharvMadarHai";
function createTokenForUser(user){
    const payLoad={
        _id:user._id,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    }
    const token=jwt.sign(payLoad,secret);
    return token;
}
function validateToken(token){
    const payLoad=jwt.verify(token,secret);
    return payLoad;
}
module.exports={createTokenForUser,validateToken,};