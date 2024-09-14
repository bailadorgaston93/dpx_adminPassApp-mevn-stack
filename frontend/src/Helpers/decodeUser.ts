import {jwtDecode} from "jwt-decode";


export const decodeUserNow= ():any=>{
    const TOKEN_AUTH= localStorage.getItem("TOKEN_AUTH");
    return TOKEN_AUTH ? jwtDecode(localStorage.getItem("TOKEN_AUTH") || "") : "";
}
