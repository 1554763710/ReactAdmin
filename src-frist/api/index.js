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

//获取品类数据
export const reqCategory = (parentId)=> ajax(path+"/manage/category/list",{parentId});

//添加品类数据
export const reqAddCategory = (data)=> ajax(path+"/manage/category/add",data,"POST");

//更新品类名称
export const reqUpdateCategory = (data)=> ajax(path+"/manage/category/update",data,"POST");

//获取商品列表
export const reqGetProducts = (pageNum, pageSize)=> ajax(path+"/manage/product/list",{pageNum, pageSize});

//添加商品
export const reqAddProduct = (product)=> ajax(path+"/manage/product/add",product,"POST");

//修改商品
export const reqUpdateProduct = (product)=> ajax(path+"/manage/product/update",product,"POST");

//删除上传图片
export const reqDelImg = (name, id)=> ajax(path+"/manage/img/delete",{name, id},"POST");

//删除上传图片
export const reqSearchProducts = (data)=> ajax(path+"/manage/product/search",data);

//根据id获取分类
export const reqGetIdCategory= (categoryId)=> ajax(path+"/manage/category/info",{categoryId});

//上下架商品
export const reqUpdateStatus = (productId, status)=> ajax(path+"/manage/product/updateStatus",{productId, status},"POST");