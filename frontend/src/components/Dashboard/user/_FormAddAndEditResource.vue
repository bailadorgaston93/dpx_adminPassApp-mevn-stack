<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { adminResourceStore } from "../../../stores/adminResourceStore";
import { modalStore } from "../../../stores/modalStore";
import { userResourceStore } from "../../../stores/userResource";
export default defineComponent({
    props: ["isModalOpen", "onCloseModal", "objectToEdit"],
    components: { Inputs, Buttons },
    computed: { ...mapStores(adminResourceStore), ...mapStores(modalStore), ...mapStores(userResourceStore) },
    data() {
        return {
            selectValue: "", objectToCatch: {}, isShowPass: false, isOpenModalGeneratePass: false, typeInput: "",
            isLoadingInputs: true, password_generate: ""
        }
    },
    mounted() {
        this.modalStoreStore.isRefreshRecord = false;
        if (Object.keys(this.objectToEdit).length === 0) {
            this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);

        } else {
            this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
            setTimeout(() => {
                this.selectValue = this.objectToEdit.id_resource_admin._id;
            }, 500);
        }
    },
    updated() {
        for (let i in this.objectToEdit.inputs_data) {
            if (i === "exp" || i === "iat") {
                delete this.objectToEdit.inputs_data[i]
            }
        }
        this.objectToCatch = this.objectToEdit.inputs_data

    },
    watch: {
        isLoadingInputs() {
            if (!this.isLoadingInputs) {
                setTimeout(() => {

                    this.$refs.inputs_custom?.forEach((element: any, i: any) => {
                        if (this.$refs.inputs_custom[i].$el.name === "mesdeexpiracion") {
                            this.$refs.inputs_custom[i].$el.maxLength = "2";
                        } else if (this.$refs.inputs_custom[i].$el.name === "aniodeexpiracion") {
                            this.$refs.inputs_custom[i].$el.maxLength = "4"
                        } else if (this.$refs.inputs_custom[i].$el.name === "nrodetarjeta") {
                            this.$refs.inputs_custom[i].$el.maxLength = "14"
                        } else if (this.$refs.inputs_custom[i].$el.name === "codigodeseguridad") {
                            this.$refs.inputs_custom[i].$el.maxLength = "4"
                        } else {
                            this.$refs.inputs_custom[i].$el.maxLength = "30"
                        }

                        if (Object.keys(this.objectToEdit).length === 0) {
                            this.$refs.inputs_custom[i].$el.value = "";
                        } else {
                            for (let i in this.objectToEdit.inputs_data) {
                                if (element?.$el?.name === i) {
                                    element.$el.value = this.objectToEdit.inputs_data[i];
                                }
                            }
                        }
                    });
                },)
            }
        },
        selectValue() {
            this.isLoadingInputs = true;
            if (this.selectValue) {
                this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_RESOURCE_BY_ID", this.selectValue);
                setTimeout(() => {
                    this.isLoadingInputs = false;
                    this.objectToCatch = {};
                    this.modalStoreStore.isRefreshRecord = true;
                }, 1000);

            }
        },
        typeInput() {
            if (this.typeInput) {
                this.objectToCatch = {
                    ...this.objectToCatch,
                };
            }
        }
    },
    methods: {
        onSelectAndSearch(event: any) {
            this.selectValue = event.target.value;
        },
        catchInputValues(e: any, index: number) {

            if (e.target.type === "textarea" || e.target.type === "text" || e.target.type === "password" ||
                e.target.type === "date" || e.target.type === "email" || e.target.type === "time" || e.target.type === "tel" ||
                e.target.type === "number" || e.target.type === "url") {

                if (e.target.name === "mesdeexpiracion" || e.target.name === "aniodeexpiracion" ||
                    e.target.name === "nrodetarjeta" || e.target.name === "codigodeseguridad") {
                    if (!/^([0-9])*$/.test(e.target.value)) {
                        e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                    }
                }

                this.objectToCatch = {
                    ...this.objectToCatch,
                    [e.target.name]: e.target.value
                };
            }
        },
        onShowPass(field: any, index: number) {
            if (field[index].name_input === this.$refs.inputs_custom[index].$params.attrs.name) {
                this.$refs.btn_show_pass.forEach((e: any) => {
                    if (e.$params.attrs.id === field[index].name_input) {
                        this.isShowPass = !this.isShowPass;
                        this.$refs.inputs_custom[index].$el.type = this.isShowPass ? "text" : "password";
                        e.$el.children[0].className = this.isShowPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
                    }
                });
            }
        },

        onShowModalGeneratePassword(field: any, index: number) {

            if (field[index].name_input === this.$refs.inputs_custom[index].$params.attrs.name) {
                this.$refs.btn_open_modal_generate_pass.forEach((e: any, i: number) => {

                    if (e.$params.attrs.id === field[index].name_input) {

                        const STR_LONG = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!”#$%&‘()ÑÁÉÍÓÚáéíóúñ*+,-./^ ´_`{|}~[\]:;=?";

                        let password = "";
                        for (let x = 0; x < 30; x++) {
                            let random = Math.floor(Math.random() * STR_LONG.length);
                            password += STR_LONG.charAt(random);
                        }
                        this.$refs.inputs_custom[index].$el.value = password;
                    }
                });
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
                    class=" relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="card_modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div style="letter-spacing: 1px; margin-bottom:5%; font-weight: bold; font-size: 1.7em;">
                                {{ Object.keys(objectToEdit).length > 0 ? "Editar recurso" : "Agregar recurso" }}
                                <br />
                                <small>{{ Object.keys(objectToEdit).length > 0 ?
                                    objectToEdit.id_resource_admin.name_resource : "" }}</small>
                            </div>
                        </div>
                        <form class="pt-3 pb-3 mb-4">
                            <div v-if="Object.keys(objectToEdit).length === 0"
                                style="text-align: center; margin-bottom: 5%;">
                                <select class="INPUT_DASH_SELECT" style="width: 100%;"
                                    @change="(event) => onSelectAndSearch(event)">
                                    <option value="">Seleccionar un campo</option>
                                    <option v-for="i in adminResourceStoreStore.DAPI_RESPONSE.response.data" :key="i._id"
                                        :value="i._id">
                                        {{ i.name_resource }}
                                    </option>
                                </select>
                            </div>

                            <div style="width: 100%; margin: 0 auto;"
                                v-if="selectValue && adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data">
                                <div style="text-align: center;" v-if="isLoadingInputs">
                                    <span class="loader"></span>
                                </div>
                                <div v-else>
                                    <div v-for="(i, k) in  adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.fields ">
                                        <div style="margin-bottom: 5%;">
                                            <label class="LABEL_INPUT_AUTH" :for="i.name_input + '_' + k">
                                                {{ i.label_input }}
                                            </label>
                                            <div>
                                                <div class="input_content_data">
                                                    <div v-if="i.type_input === 'password'">
                                                        <InputGroup>
                                                            <InputText class="input_data" ref="inputs_custom"
                                                                :type="i.type_input" :placeholder="'Ingresar dato '"
                                                                :name="i.name_input.toLowerCase()"
                                                                :id="i.name_input + '_' + k"
                                                                v-on:keyup="(event) => catchInputValues(event, k)"
                                                                :autocomplete="i.name_input + '_' + k" />
                                                            <InputGroupAddon class="btn_show_pass_input_data"
                                                                :id="i.name_input" ref="btn_show_pass"
                                                                @click="onShowPass(adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.fields, k)">
                                                                <i :class="'fa-solid fa-eye'"></i>
                                                            </InputGroupAddon>

                                                            <InputGroupAddon
                                                                v-if="i.name_input !== 'nrodetarjeta' && i.name_input !== 'codigodeseguridad'"
                                                                class="btn_generate_pass_input_data" :id="i.name_input"
                                                                ref="btn_open_modal_generate_pass"
                                                                @click="onShowModalGeneratePassword(adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.fields, k)">
                                                                <i class="fa-solid fa-shuffle"></i>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </div>
                                                    <div v-else-if="i.type_input !== 'password'">
                                                        <InputGroup>
                                                            <InputText class="input_data" :type="i.type_input"
                                                                ref="inputs_custom" :placeholder="'Ingresar dato '"
                                                                :name="i.name_input.toLowerCase()"
                                                                :id="i.name_input + '_' + k"
                                                                v-on:keyup="(event) => catchInputValues(event, k)"
                                                                :autocomplete="i.name_input + '_' + k" />
                                                        </InputGroup>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <div v-if="selectValue" style="margin-left: 3%;">
                            <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded"
                                @click="userResourceStoreStore.actionMainUserResourceStore(Object.keys(objectToEdit).length > 0 ?
                                    'ACTION_EDIT_RESOURCE' : 'ACTION_CREATE_NEW_RESOURCE', Object.keys(objectToEdit).length > 0 ? { id_resource_selected: objectToEdit._id, data: objectToCatch, name_resource: adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.name_resource } : { id_resource_selected: Object.keys(objectToEdit).length > 0 ? objectToEdit._id : selectValue, data: objectToCatch, name_resource: adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.name_resource }, onCloseModal)">
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