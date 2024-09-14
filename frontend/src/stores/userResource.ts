import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router';
import { decodeUserNow } from '@/Helpers/decodeUser';
import { connectApiUserResource } from "./API/apiUserResource";

export const userResourceStore = defineStore('userResourceStore', () => {

    const $route = useRoute();
    const $toast = useToast();
    const $router = useRouter();

    const DAPI_RESPONSE = ref({ isLoading: true, response: {} });

    const actionMainUserResourceStore = (ACTION: string, idParam: any, onCloseModal: any = null) => {
        const TOKEN: string = decodeUserNow();
        const IS_AUTH: boolean = TOKEN ? true : false;
        let param: string = "";
        let data_form: any = {};
        let method: string = "";

        switch (ACTION) {
            case "ACTION_GET_USER_RESOURCES":
                method = "GET";
                param = "user/get-resources"
                break;

            case "ACTION_GET_RESOURCE_BY_ID":
                method = "GET";
                param = `user/get-resource/${idParam}`;
                break;

            case "ACTION_CREATE_NEW_RESOURCE":
                method = "POST";
                param = "user/create-resource"
                data_form.id_user_ref = TOKEN._id;
                data_form.id_resource_admin = idParam.id_resource_selected;
                data_form.name_resource_admin = idParam.name_resource;
                data_form.inputs_data = idParam.data;

                if (data_form.inputs_data.nombre_del_recurso === undefined || data_form.inputs_data.nombre_del_recurso.trim() === "") {
                    $toast.error("El campo Nombre de recurso es obligatorio. Si el campo está completo y el problema persiste recargue la página e intentelo nuevamente", {
                        position: 'top-right'
                    });
                    return;
                }

                if (idParam.data.mesdeexpiracion !== undefined || idParam.data.aniodeexpiracion !== undefined ||
                    idParam.data.nrodetarjeta !== undefined || idParam.data.codigodeseguridad !== undefined) {
                    if (!/^([0-9])*$/.test(idParam.data.mesdeexpiracion) ||
                        !/^([0-9])*$/.test(idParam.data.aniodeexpiracion) || !/^([0-9])*$/.test(idParam.data.nrodetarjeta)
                        || !/^([0-9])*$/.test(idParam.data.codigodeseguridad)) {
                        $toast.error("Se ha detectado un carácter en uno de los inputs (Mes de expiración | Año de expiración | Código de seguridad)", {
                            position: 'top-right'
                        });
                        return;
                    }
                }

                break;

            case "ACTION_EDIT_RESOURCE":
                method = "PUT";
                param = `user/edit-resource/${idParam.id_resource_selected}`;
                data_form.id_user_ref = TOKEN._id;
                data_form.id_resource_admin = idParam.id_resource_selected;
                data_form.name_resource_admin = idParam.name_resource;
                data_form.inputs_data = idParam.data;

                if (data_form.inputs_data.nombre_del_recurso === undefined || data_form.inputs_data.nombre_del_recurso.trim() === "") {
                    $toast.error("El campo Nombre de recurso es obligatorio. Si el campo está completo y el problema persiste recargue la página e intentelo nuevamente", {
                        position: 'top-right'
                    });
                    return;
                }
                break;

            case "ACTION_EDIT_TYPE_ENCRYPT":
                method = "PUT";
                param = `admin/edit-type-encrypt-resource/${idParam.id}`;
                data_form.name_type_encrypt = idParam.value;
                break;

            case "ACTION_DELETE_RESOURCE_BY_ID":
                method = "DELETE";
                param = `user/delete-resource/${idParam}`;
                data_form.id_user_ref = TOKEN._id;
                break;
        }

        const BODY = { param, idParam, method, data_form };
        const EXTRA = { $router, $route, $toast, onCloseModal };
        const RESPONSE = { DAPI_RESPONSE };

        connectApiUserResource(IS_AUTH, BODY, EXTRA, null, RESPONSE);
    }
    return { DAPI_RESPONSE, actionMainUserResourceStore }
})
