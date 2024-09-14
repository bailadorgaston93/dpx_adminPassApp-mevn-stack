import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import { defineStore } from 'pinia'
import { connectApiAuth } from './API/apiAuth'
import { decodeUserNow } from '@/Helpers/decodeUser';
import { useRoute, useRouter } from 'vue-router';

export const authStore = defineStore('authStore', () => {

    const $route = useRoute();
    const $toast = useToast();
    const $router = useRouter();

    const form_data = ref({ email: "", password: "", confirm_password: "", name: "", lastname: "", birth: "" });

    const DAPI_RESPONSE = ref({ isLoading: true, response: {} });


    const actionMainAuthStore = (ACTION: string, idParam: any, userIsActive: boolean = false) => {

        const TOKEN: string = decodeUserNow();
        const IS_AUTH: boolean = TOKEN ? true : false;
        let param: string = "";
        let data_form: any = {};
        let method: string = "";

        switch (ACTION) {
            case "ACTION_LOGIN":
                method = "POST";
                param = `auth/login`;
                data_form.email = form_data.value.email;
                data_form.password = form_data.value.password;
                break;

            case "ACTION_REGISTER":
                method = "POST";
                param = `auth/register`;
                data_form.name = form_data.value.name;
                data_form.lastname = form_data.value.lastname;
                data_form.email = form_data.value.email;
                data_form.password = form_data.value.password;
                data_form.confirm_password = form_data.value.confirm_password;
                data_form.birth = form_data.value.birth;
                break;

            case "ACTION_RECOVERY":
                method = "POST";
                param = `auth/recovery`;
                data_form.email = form_data.value.email;
                break;

            case "ACTION_RESET":
                method = "POST";
                param = `auth/reset-password/${idParam}`;
                data_form = form_data.value;
                for (let i in data_form) {
                    if (i !== "password" && i !== "confirm_password") {
                        delete data_form[i];
                    }
                }
                break;

            case "GET_TOKEN_CONFIRM":
                method = "GET";
                param = `auth/confirm-account/${$route.params.id}`;
                break;

        }

        const BODY = { param, idParam, method, data_form };
        const EXTRA = { $router, $route, $toast };
        const CLEAN = { form_data };
        const RESPONSE = { DAPI_RESPONSE };

        connectApiAuth(IS_AUTH, BODY, EXTRA, CLEAN, RESPONSE);

    }

    return { form_data, actionMainAuthStore, DAPI_RESPONSE }
})
