// ajax二次封装:主要是减少参数

import ajax from "./ajax";

const path = process.env.NODE_ENV === "development"? "http://localhost:3000" : "http://localhost:5000";

//用户登录请求
export const reqLogin = (data)=> ajax(path+"/login", data, "POST");


