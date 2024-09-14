import { ref } from 'vue'
import shortid from "shortid";
import { useToast } from 'vue-toast-notification';
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router';
import { decodeUserNow } from '@/Helpers/decodeUser';
import { connectApiAdminResource } from "./API/apiAdminResource";

export const adminResourceStore = defineStore('adminResourceStore', () => {

    const $route = useRoute();
    const $toast = useToast();
    const $router = useRouter();

    const form_data = ref({ name_type_encrypt: "JWT", name_resource: "" });
    const mini_form_data_resource = ref({ _id: "", label_input: "", type_input: "text" });
    const isMiniFormDataEdit = ref(false);
    const arrMiniDataResource = ref([]);

    const DAPI_RESPONSE = ref({ isLoading: true, response: {} });
    const DAPI_RESPONSE_ID = ref({ isLoading: true, response: {} });

    const onAddData = () => {
        if (mini_form_data_resource.value.label_input.trim() === "") {
            $toast.error("Necesitas darle un nombre al campo", {
                position: 'top-right'
            });
            return;
        }

        if (mini_form_data_resource.value.label_input.length >= 15) {
            $toast.error("El nombre del campo es muy largo, tenés permitido hasta un total de 15 caracteres", {
                position: 'top-right'
            });
            return;
        }

        if (isMiniFormDataEdit.value) {
            arrMiniDataResource.value = arrMiniDataResource.value.map((e: any) => e._id == mini_form_data_resource.value._id ? mini_form_data_resource.value : e);
            isMiniFormDataEdit.value = false;
            $toast.success("Se aplicó la modificación del campo", {
                position: 'top-right'
            });
            mini_form_data_resource.value = { _id: "", label_input: "", type_input: "text" };
        } else {
            arrMiniDataResource.value.push({ _id: shortid.generate(), label_input: mini_form_data_resource.value.label_input, type_input: mini_form_data_resource.value.type_input });
            mini_form_data_resource.value = { _id: "", label_input: "", type_input: "text" };
            $toast.success("Se aplicó la agregación de un nuevo campo", {
                position: 'top-right'
            });
        }
    }

    const onEditData = (data: any) => {
        mini_form_data_resource.value = {
            _id: data._id,
            label_input: data.label_input,
            type_input: data.type_input,
        }
        isMiniFormDataEdit.value = true;
    }

    const onDeleteData = (data: any) => {
        $toast.error("El campo ha sido eliminado", {
            position: 'top-right'
        });
        mini_form_data_resource.value = { _id: "", label_input: "", type_input: "text" };
        arrMiniDataResource.value = arrMiniDataResource.value.filter((e: any) => e._id !== data._id);
    }

    const actionMainAdminResourceStore = (ACTION: string, idParam: any, onCloseModal: any = null) => {
        const TOKEN: string = decodeUserNow();
        const IS_AUTH: boolean = TOKEN ? true : false;
        let param: string = "";
        let data_form: any = {};
        let method: string = "";

        switch (ACTION) {
            case "ACTION_GET_ADMIN_RESOURCES":
                method = "GET";
                param = "admin/get-resources"
                break;

            case "ACTION_GET_RESOURCE_BY_ID":
                method = "GET";
                param = `admin/get-resource/${idParam}`;
                break;

            case "ACTION_CREATE_NEW_RESOURCE":

                if (form_data.value.name_resource.trim() === "") {
                    $toast.error("Necesitas darle un nombre a tu recurso", {
                        position: 'top-right'
                    });
                    return;
                }

                if (form_data.value.name_resource.length < 5) {
                    $toast.error("El nombre del recurso es muy corto, tenés permitido hasta un total de 30 caracteres", {
                        position: 'top-right'
                    });
                    return;
                }

                method = "POST";
                param = "admin/create-resource"
                data_form.id_user_ref = TOKEN._id;
                data_form.name_resource = form_data.value.name_resource;
                data_form.name_type_encrypt = form_data.value.name_type_encrypt;
                data_form.fields = arrMiniDataResource.value;
                console.log(data_form)

                break;

            case "ACTION_EDIT_RESOURCE":
                method = "PUT";
                param = `admin/edit-resource/${idParam}`;
                data_form.id_user_ref = TOKEN._id;
                data_form.name_resource = form_data.value.name_resource;
                data_form.name_type_encrypt = form_data.value.name_type_encrypt;
                data_form.fields = arrMiniDataResource.value;
                break;


            case "ACTION_EDIT_TYPE_ENCRYPT":
                method = "PUT";
                param = `admin/edit-type-encrypt-resource/${idParam.id}`;
                data_form.id_user_ref = TOKEN._id;
                data_form.name_type_encrypt = idParam.value;
                break;

            case "ACTION_DELETE_RESOURCE_BY_ID":
                method = "DELETE";
                param = `admin/delete-resource/${idParam}`;
                data_form.id_user_ref = TOKEN._id;
                break;
        }

        const BODY = { param, idParam, method, data_form };
        const EXTRA = { $router, $route, $toast, onCloseModal };
        const CLEAN = { form_data, mini_form_data_resource, isMiniFormDataEdit, arrMiniDataResource };
        const RESPONSE = { DAPI_RESPONSE, DAPI_RESPONSE_ID };

        connectApiAdminResource(IS_AUTH, BODY, EXTRA, CLEAN, RESPONSE);
    }
    return {
        form_data, mini_form_data_resource, isMiniFormDataEdit, arrMiniDataResource, DAPI_RESPONSE, DAPI_RESPONSE_ID,
        onAddData, onEditData, onDeleteData, actionMainAdminResourceStore
    }
})
