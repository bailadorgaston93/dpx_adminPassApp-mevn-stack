import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import { defineStore } from 'pinia'
import { connectApiUser } from './API/apiUser'
import { decodeUserNow } from '@/Helpers/decodeUser';
import { useRoute, useRouter } from 'vue-router';

export const userStore = defineStore('userStore', () => {

    const $route = useRoute();
    const $toast = useToast();
    const $router = useRouter();

    const form_data = ref({ email: "", password: "", confirm_password: "" });

    const userIsActiveByAdmin = ref(false);

    const DAPI_RESPONSE = ref({ isLoading: true, response: {} });
    const DAPI_RESPONSE_ID = ref({ isLoading: true, response: {} });

    const actionMainUserStore = (ACTION: string, idParam: any, userIsActive: boolean = false) => {

        const TOKEN: string = decodeUserNow();
        const IS_AUTH: boolean = TOKEN ? true : false;
        let param: string = "";
        let data_form: any = {};
        let method: string = "";

        switch (ACTION) {
            case "ACTION_GET_USERS":
                method = "GET";
                param = "user/users"
                break;

            case "ACTION_UPDATE_STATUS_USER":
                method = "PUT";
                param = `user/desactivate-user/${idParam}`;
                data_form.userIsActiveByAdmin = !userIsActive;
                break;

            case "ACTION_UPDATE_PROFILE_USER":
                method = "PUT";
                param = `user/edit-profile/${TOKEN._id}`;
                data_form.email = form_data.value.email;
                data_form.password = form_data.value.password;
                data_form.confirm_password = form_data.value.confirm_password;
                break;
        }

        const BODY = { param, idParam, method, data_form };
        const EXTRA = { $router, $route, $toast };
        const CLEAN = { form_data, userIsActiveByAdmin };
        const RESPONSE = { DAPI_RESPONSE, DAPI_RESPONSE_ID };

        connectApiUser(IS_AUTH, BODY, EXTRA, CLEAN, RESPONSE);

    }

    return { userIsActiveByAdmin, DAPI_RESPONSE, form_data, actionMainUserStore }
})
