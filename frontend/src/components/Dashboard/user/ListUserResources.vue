<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import MsgNoData from "../../UI/MsgNoData.vue";
import { mapStores } from 'pinia';
import { modalStore } from "@/stores/modalStore";
import { defineComponent } from 'vue';
import { userResourceStore } from "../../../stores/userResource";

export default defineComponent({
    props: [],
    components: { Inputs, Buttons, MsgNoData },
    computed: { ...mapStores(userResourceStore), ...mapStores(modalStore) },
    mounted() {
        this.userResourceStoreStore.actionMainUserResourceStore("ACTION_GET_USER_RESOURCES", null);
    },
    data() {
        return { isUpdated: false }
    },
    watch: {
        isUpdated() {
            this.userResourceStoreStore.actionMainUserResourceStore("ACTION_GET_USER_RESOURCES", null);
            this.isUpdated = false;
        }
    },
    methods: {
        onDeleteResource(data: any, i: number) {
            this.$confirm.require({
                message: `Querés eliminar el registro '${data.inputs_data.nombre_del_recurso}' ?`,
                header: 'Confirmar eliminación',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                acceptLabel: "SI",
                rejectLabel: "NO",
                accept: () => {
                    this.isUpdated = true;
                    this.userResourceStoreStore.DAPI_RESPONSE.response.data.splice(i, 1);
                    this.userResourceStoreStore.actionMainUserResourceStore("ACTION_DELETE_RESOURCE_BY_ID", data._id);
                    this.isUpdated = false;
                },
            });
        }
    }
});
</script>

<template>    
    <div class="table_list_data_resource">
        <div style="text-align: center;" v-if="userResourceStoreStore.DAPI_RESPONSE.isLoading">
            <span class="loader"></span>
        </div>
        <div v-else>
            <MsgNoData
                v-if="userResourceStoreStore.DAPI_RESPONSE.response.data.length === 0" />
            <table
                v-if="userResourceStoreStore.DAPI_RESPONSE.response.data.length > 0">
                <tr>
                    <th style="text-align:center">Recurso</th>
                    <th style="text-align:center">Encriptado</th>
                    <th style="text-align:center">Acción</th>
                </tr>
                
                <tr v-for="(i, k) in   userResourceStoreStore.DAPI_RESPONSE.response.data" :key="i._id">
                    <td>{{ i.inputs_data.nombre_del_recurso }}</td>
                    <td style="text-align:center">
                        {{ i.id_resource_admin?.name_type_encrypt }}
                    </td>
                    <td :style="{ textAlign: 'center', display: 'flex', justifyContent: 'center' }">
                        <div style="margin-right: 5%;">
                            <Buttons @click="onDeleteResource(i, k)" style="color: #2e1010;" :type_btn="'button'"
                                :btn_align="'center'" :classApply="true ? 'BTN_DANGER_1' : 'BTN_DANGER_2'"
                                :btn_text="'fa-regular fa-trash-can'" :isIcon="true" />
                        </div>
                        <div>
                            <Buttons @click="modalStoreStore.onEditData(i)" style="color: #63400c;" :type_btn="'button'"
                                :btn_align="'center'" :classApply="true ? 'BTN_WARNING_1' : 'BTN_DANGER_2'"
                                :btn_text="'fa-solid fa-pen-to-square'" :isIcon="true" />
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>