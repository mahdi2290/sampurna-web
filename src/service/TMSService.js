import axios from "axios";
import { handleResponse } from './../helpers/HandleHelpers';

export async function getOrder() {
  const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/order";

  axios({
    method:"GET",
    url:baseUrl, 
    data: {},
    headers: {
      'Content-Type': 'application/json',   
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjY4NDI0NzIsImlhdCI6MTY2NTAyODA3Miwic3ViIjp7ImlkIjoxLCJkYl9uYW1lIjoiYWxhbXNhbXB1cm5hbWFrbXVyIn19.pDdlusOC0JPTGK_i_zSHYgxkpVOJjOWqrh7vek8kz9Y",
    },
    params: {
      start_date: "2022-10-01", 
      end_date: "2022-10-06"
    }
  })
  .then(res => res)
  .catch(err => console.log("error", err));
}

export async function getToken() {
  const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/auth/token/create";

  const form = new FormData();
            
  form.append("domain_name", "alamsampurnamakmur")
  form.append("username", "administrator@tms.co.id")
  form.append("password", "administrator")

  try {
      const response = await axios({
        method:"POST",
        url:baseUrl, 
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); 
      
      return handleResponse(response);
  } catch (error) {
      console.error("Not able to fetch data", error);
  }
}