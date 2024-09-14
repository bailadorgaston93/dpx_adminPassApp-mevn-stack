import axios from "axios";

export const connectApiUser = async (IS_AUTH: any, BODY: any, EXTRA: any, CLEAN: any, RESPONSE: any) => {

    const URI = `http://localhost:7000/${BODY.param}`;
    const HEADER = !IS_AUTH ? {} : { usuario_autorizacion: `${localStorage.getItem("TOKEN_AUTH")}` };

    await axios({
        method: BODY.method,
        url: URI,
        data: BODY.data_form,
        headers: HEADER
    }).then((res: any) => {

        if (BODY.method === "PUT") {
            if (BODY.param.includes("user/desactivate-user/")) {
                EXTRA.$toast.success(res.data.msg, {
                    position: 'top-right'
                });
            }
            if (BODY.param.includes('user/edit-profile/')) {
                CLEAN.form_data.value = { email: "", password: "", confirm_password: "" };
                EXTRA.$toast.success(res.data.msg, {
                    position: 'top-right'
                });
            }
        }

        if (BODY.method === "GET") {
            RESPONSE.DAPI_RESPONSE.value.isLoading = false;
            RESPONSE.DAPI_RESPONSE.value.response = {
                status: res.status,
                msg: res.data.msg,
                data: res.data.data
            };
        }


    }).catch((error) => {

        if (typeof error.response.data.errors === "object") {
            let msg = "";
            error.response.data.errors.forEach((e: any) => {
                msg += "- " + e + "\n";
            })
            EXTRA.$toast.error(msg, {
                position: 'top-right'
            });
        }

        if (typeof error.response.data.msg === "string") {

            if(error.response.data.isExpired){
                setTimeout(() => {
                    window.location.replace("/")
                }, 2000);
            }
            
            if(BODY.param !== "user/users"){
                EXTRA.$toast.error(error.response.data.msg, {
                    position: 'top-right'
                });
            }
        }

        if (BODY.method === "GET") {
            if (BODY.param === "user/users") {
                RESPONSE.DAPI_RESPONSE.value.isLoading = false;
                RESPONSE.DAPI_RESPONSE.value.response = error.response.data;
            }
        }
    });
}




































// export const connectApiAdminResource = async (IS_AUTH: boolean, param: string, method: string, data_form: any,
//     toast: any, $router: any, DAPI_RESPONSE: any, DAPI_RESPONSE_ID: any, onCloseModal: any = null, ...cleanInputs: any) => {

//     const URI = `http://localhost:7000/${param}`;
//     const HEADER = !IS_AUTH ? {} : { usuario_autorizacion: `${localStorage.getItem("TOKEN_AUTH")}` };

//     await axios({
//         method: method,
//         url: URI,
//         data: data_form,
//         headers: HEADER
//     }).then((res: any) => {
//         if (method === "POST") {

//             if (param === "admin/create-resource") {

//                 // const form_data = ref({ name_type_encrypt: "RFC-7519", name_resource: "" });


//                 // onCloseModal();
//             }
//             // $router.push({ path: "admin-resources" });
//             // console.log($router)
//         }
//         // if (param.includes("user/desactivate-user/")) {
//         //     toast.success(res.data.msg, {
//         //         position: 'top-right'
//         //     });
//         // }

//         if (method === "GET") {
//             if (param.includes("admin/get-resource/")) {
//                 DAPI_RESPONSE_ID.value.isLoading = false;
//                 DAPI_RESPONSE_ID.value.response = {
//                     msg: res.data.msg,
//                     data: res.data.data
//                 };
//             } else {
//                 DAPI_RESPONSE.value.isLoading = false;
//                 DAPI_RESPONSE.value.response = {
//                     msg: res.data.msg,
//                     data: res.data.data
//                 };
//             }
//         }

//     }).catch((error: any) => {

//         console.log(error)
//         DAPI_RESPONSE.value.isLoading = false;
//         DAPI_RESPONSE.value.response = {
//             msg: error.response.data.msg,
//             data: error.response.data.data
//         };

//         if (error.response.data?.isExpired) {
//             toast.error(error.response.data?.msg + " " + "REDIRECCIONANDO", {
//                 position: 'top-right'
//             });
//             localStorage.removeItem("TOKEN_AUTH");
//             $router.push({ path: '/', replace: true })
//             // setTimeout(() => {
//             // }, 1000);
//         } else {
//             console.log(error.response.data)
//             toast.error(error.response.data?.msg, {
//                 position: 'top-right'
//             });


//         }
//     });

// }





// import axios from "axios";

// export const connectAPI = async (IS_AUTH: boolean, param: any, method: string, data_form: any, toast: any, DATA_RESPONSE_API: any, FORM_RESET: any, $router: any = null) => {

//     const URI = `http://localhost:7000/${param}`;
//     const HEADER = !IS_AUTH ? {} : { usuario_autorizacion: `${localStorage.getItem("TOKEN_AUTH")}` };

//     console.log(param)

//     if (typeof param !== "string") {

//         let endpoints = [
//             `http://localhost:7000/${param[0]}`,
//             `http://localhost:7000/${param[1]}`
//         ];

//         axios.all(endpoints.map((endpoint) => axios.get(endpoint, { headers: HEADER }))).then(
//             (data) => {
//                 DATA_RESPONSE_API.value.isLoading = false;
//                 DATA_RESPONSE_API.value.response = data;
//             },
//         );

//     } else {
//         await axios({
//             method: method,
//             url: URI,
//             data: data_form,
//             headers: HEADER
//         }).then((res: any) => {
//             // mostramos el toast (menos para lo que es AUTH) pero hacemos otras lógica
//             if (method === "POST" || method === "PUT" || method === "DELETE") {

//                 if (param === "auth/login") {
//                     localStorage.setItem("TOKEN_AUTH", res.data.data.token_auth);
//                     window.location.replace("/dashboard")
//                 }
//                 if (param === "auth/register") {
//                     alert("Se te ha enviado un correo para que confirmes tu cuenta. Ahora serás redireccionado");
//                     window.location.replace("/auth")
//                 }
//                 if (param.includes("user/desactivate-user/")) {
//                     toast.success(res.data.msg, {
//                         position: 'top-right'
//                     });
//                 }
//                 if (param === "admin/create-resource" || param.includes("admin/edit-resource/") ||
//                     param.includes("admin/edit-type-encrypt-resource/")
//                     || param.includes("admin/delete-resource/") || param.includes("user/edit-profile/")) {
//                     toast.success(res.data.msg, {
//                         position: 'top-right'
//                     });

//                     if (param.includes("user/edit-profile/")) {
//                         FORM_RESET.email = "";
//                         FORM_RESET.password = "";
//                         FORM_RESET.confirm_password = "";
//                     }
//                 }

//                 if (param === "user/create-resource" || param.includes("user/edit-resource/") || param.includes("user/delete-resource/")) {
//                     $router.push({ path: '/', replace: true })
//                     toast.success(res.data.msg, {
//                         position: 'top-right'
//                     });
//                 }
//             }

//             // DATA_RESPONSE_API <-- LO USAMOS ACÁ :D PARA ALMACENAR LA RESPUESTA.
//             if (method === "GET") {
//                 DATA_RESPONSE_API.value.isLoading = false;
//                 DATA_RESPONSE_API.value.response = {
//                     status: res.status,
//                     msg: res.data.msg,
//                     data: res.data.data
//                 };

//             }

//         }).catch((error: any) => {

//             if (error.response.data.isExpired) {
//                 alert(error.response.data.msg);
//                 window.location.replace("/auth");
//                 localStorage.removeItem("TOKEN_AUTH");
//             }
//             // mostramos el toast (menos para lo que es AUTH)
//             if (method === "POST" || method === "PUT" || method === "DELETE") {
//                 console.log(param)
//                 if (param === "auth/login" || param === "auth/recovery" || param === "auth/register") {
//                     toast.error(error.response.data.msg, {
//                         position: 'top'
//                     });
//                 }

//                 if(param.includes("user/create-resource")){
//                     toast.error(error.response.data.mg.join("|"), {
//                         position: 'top'
//                     });
//                 }

//                 if (param.includes("admin/edit-type-encrypt-resource/")) {
//                     toast.error(error.response.data.msg, {
//                         position: 'top'
//                     });
//                 }

//                 if (param.includes("user/edit-profile/")) {
//                     toast.error(error.response.data.errors.join("|"), {
//                         position: 'top'
//                     });
//                 }
//             }

//             // DATA_RESPONSE_API <-- LO USAMOS ACÁ :D PARA ALMACENAR LA RESPUESTA EN CASO DE ERROR.
//             if (method === "GET") {
//                 DATA_RESPONSE_API.value.isLoading = false;
//                 DATA_RESPONSE_API.value.response = {
//                     msg: error.response.data.msg,
//                     data: error.response.data
//                 };
//             }
//         });
//     }

// }