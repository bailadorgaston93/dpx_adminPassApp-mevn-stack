<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { adminResourceStore } from "../../../stores/adminResourceStore";

export default defineComponent({
    props: ["isModalOpen", "onCloseModal", "objectToEdit"],
    components: { Inputs, Buttons },
    computed: { ...mapStores(adminResourceStore) },
    data() { return { isUpdated: false } },
    mounted() {
        if (Object.keys(this.objectToEdit).length === 0) {
            this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
            this.adminResourceStoreStore.form_data.name_type_encrypt = "JWT";
            this.adminResourceStoreStore.form_data.name_resource = "";
            this.adminResourceStoreStore.mini_form_data_resource = { _id: "", label_input: "", type_input: "text" };
            this.adminResourceStoreStore.isMiniFormDataEdit = false;
            this.adminResourceStoreStore.arrMiniDataResource = [];

        } else {
            this.adminResourceStoreStore.form_data.name_type_encrypt = this.objectToEdit.name_type_encrypt;
            this.adminResourceStoreStore.form_data.name_resource = this.objectToEdit.name_resource;
            this.adminResourceStoreStore.arrMiniDataResource = this.objectToEdit.fields;
        }
    },
    watch: {
        isModalOpen() {
            if (this.$route.path === "/admin-resources" || this.$route.path === "/select-encrypt") {
                this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
            }
        },
        objectToEdit() {
            if (Object.keys(this.objectToEdit).length === 0) {
                this.adminResourceStoreStore.form_data = { name_type_encrypt: "JWT", name_resource: "" };
                this.adminResourceStoreStore.mini_form_data_resource = { _id: "", label_input: "", type_input: "text" };
                this.adminResourceStoreStore.isMiniFormDataEdit = false;
                this.adminResourceStoreStore.arrMiniDataResource = [];

            } else {
                this.adminResourceStoreStore.form_data.name_resource = this.objectToEdit.name_resource;
                this.adminResourceStoreStore.form_data.name_type_encrypt = this.objectToEdit.name_type_encrypt;
                this.adminResourceStoreStore.arrMiniDataResource = this.objectToEdit.fields;
                this.adminResourceStoreStore.isMiniFormDataEdit = false;
            }
        }
    }
});
</script>

<template>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" v-if="isModalOpen">
        <div class="content_modal_app fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="card_modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div style="letter-spacing: 1px; margin-bottom:5%; font-weight: bold; font-size: 1.7em;">
                                {{ Object.keys(objectToEdit).length > 0 ? "Editar recurso" : "Agregar recurso" }}
                            </div>
                        </div>
                        <form class="pt-3 pb-3 mb-4">
                            <div style="text-align: center; margin-bottom: 5%;">
                                <select class="INPUT_DASH_SELECT " style="width: 100%;"
                                    v-model="adminResourceStoreStore.form_data.name_type_encrypt"
                                    name="Tipo de encriptación">
                                    <option>JWT</option>
                                    <option>BASE 64</option>
                                </select>
                            </div>

                            <div style="margin-bottom: 5%;">
                                <label class="LABEL_INPUT_AUTH" for="Nombre del recurso">
                                    Nombre del recurso
                                </label>
                                <input class="INPUT_AUTH" type="text" placeholder="Ingresar nombre del recurso"
                                    name="Nombre del recurso" id="Nombre del recurso" minlength="5" maxlength="30"
                                    v-model="adminResourceStoreStore.form_data.name_resource" />
                            </div>
                            <div v-if="Object.keys(objectToEdit).length === 0" class="content_inputs_add_resource">
                                <div style="margin-bottom: 5%;">
                                    <label class="LABEL_INPUT_AUTH" for="Nombre del campo">
                                        Nombre del campo
                                    </label>
                                    <input class="INPUT_AUTH" type="text" placeholder="Ingresar nombre del campo"
                                        name="Nombre del campo" id="Nombre del campo" minlength="15" maxlength="30"
                                        v-model="adminResourceStoreStore.mini_form_data_resource.label_input" />
                                </div>
                                <div style="margin-bottom: 5%;">
                                    <label class="LABEL_INPUT_AUTH" for="Tipo del campo">
                                        Tipo del campo
                                    </label>
                                    <select class="INPUT_DASH_SELECT " style="width: 100%;" id="Tipo del campo"
                                        v-model="adminResourceStoreStore.mini_form_data_resource.type_input"
                                        name="Tipo del campo">
                                        <option v-for="i in ['text', 'password', 'email', 'time', 'date',
                                            'tel', 'number', 'url']" :key="i">
                                            {{ i }}
                                        </option>
                                    </select>
                                </div>

                                <div style="text-align:right">
                                    <button class="BTN_SUCCESS_1 py-2 px-4 rounded" type="button"
                                        @click="adminResourceStoreStore.onAddData">
                                        <i
                                            :class="[adminResourceStoreStore.isMiniFormDataEdit ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-folder-plus']"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="content_data_loaded"
                                v-if="Object.keys(objectToEdit).length === 0 && adminResourceStoreStore.arrMiniDataResource.length > 0">
                                <div class="item_data_loaded"
                                    v-for="(r, k) in  adminResourceStoreStore.arrMiniDataResource  " :key="r.label_input">
                                    <div class="btn_actions" v-if="(Object.keys(this.objectToEdit).length > 0) && k > 0">
                                        <button type="button" class=" btn_edit_mini"
                                            @click="adminResourceStoreStore.onEditData(r)"
                                            :style="{ color: adminResourceStoreStore.isMiniFormDataEdit ? 'white' : '', pointerEvents: adminResourceStoreStore.isMiniFormDataEdit ? 'none' : '' }">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button type="button" class="btn_delete_mini"
                                            @click="adminResourceStoreStore.onDeleteData(r)"
                                            :style="{ filter: adminResourceStoreStore.isMiniFormDataEdit ? 'grayscale(2)' : '', pointerEvents: adminResourceStoreStore.isMiniFormDataEdit ? 'none' : '' }">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    <div class="btn_actions" v-if="(Object.keys(this.objectToEdit).length === 0)">
                                        <button type="button" class=" btn_edit_mini"
                                            @click="adminResourceStoreStore.onEditData(r)"
                                            :style="{ color: adminResourceStoreStore.isMiniFormDataEdit ? 'white' : '', pointerEvents: adminResourceStoreStore.isMiniFormDataEdit ? 'none' : '' }">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button type="button" class="btn_delete_mini"
                                            @click="adminResourceStoreStore.onDeleteData(r)"
                                            :style="{ filter: adminResourceStoreStore.isMiniFormDataEdit ? 'grayscale(2)' : '', pointerEvents: adminResourceStoreStore.isMiniFormDataEdit ? 'none' : '' }">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    <small
                                        v-if="(Object.keys(this.objectToEdit).length > 0) && (r.label_input === 'Nombre' || r.label_input === 'nombre') && k === 0"
                                        style="color:gray">Creado
                                        automáticamente</small>
                                    <p style="font-size: .8em;"><b>{{ r.label_input }}</b> </p>
                                    <p style="font-size: .8em;"><b>{{ r.type_input }}</b></p>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <div style="margin-left: 3%;">
                            <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded"
                                @click="adminResourceStoreStore.actionMainAdminResourceStore(Object.keys(objectToEdit).length > 0 ? 'ACTION_EDIT_RESOURCE' : 'ACTION_CREATE_NEW_RESOURCE', Object.keys(objectToEdit).length > 0 ? objectToEdit._id : null, onCloseModal)">
                                {{ Object.keys(objectToEdit).length > 0 ? 'Editar' : 'Agregar' }}
                            </button>
                        </div>
                        <div style="text-align: center;">
                            <button type="button" class="btn_cancel_resource_amin py-2 px-4 rounded" @click="onCloseModal">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>