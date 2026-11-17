import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import {asyncHandler} from '../utils/asyncHandler.js';
export const users=asyncHandler(async(req,res)=>{const list=await User.find().select('name email role createdAt').sort({createdAt:-1});res.json(list);});
export const stats=asyncHandler(async(req,res)=>{const [userCount,transactionCount,totals]=await Promise.all([User.countDocuments(),Transaction.countDocuments(),Transaction.aggregate([{$group:{_id:'$type',amount:{$sum:'$amount'}}}])]);res.json({userCount,transactionCount,totals});});