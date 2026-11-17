import jwt from 'jsonwebtoken';
export const accessToken = user => jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'});
export const refreshToken = user => jwt.sign({id:user._id,tokenVersion:user.tokenVersion},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'});
export const setRefreshCookie=(res,token)=>res.cookie('refreshToken',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:7*24*60*60*1000});