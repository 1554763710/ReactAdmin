// ajax二次封装:主要是减少参数

import jsonp from "jsonp";

import ajax from "./ajax";

const path = process.env.NODE_ENV === "development"? "http://localhost:3000" : "http://localhost:5000";

//用户登录请求
export const reqLogin = (data)=> ajax(path+"/login", data, "POST");

//获取天气
export const reqWeather = (city)=> {
  return new Promise((resolve, reject) => {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      (err,data)=>{
        if(!err){
          const { dayPictureUrl, weather} = data.results[0].weather_data[0];
          resolve({ weatherImg: dayPictureUrl, weather})
        }else{
          reject("网路出现错误,刷新重试");
        }
      })
  })
  
}
