<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import MsgNoData from "../../UI/MsgNoData.vue";
import { mapStores } from 'pinia';
import { modalStore } from "@/stores/modalStore";
import { defineComponent } from 'vue';
import { adminResourceStore } from "../../../stores/adminResourceStore";

export default defineComponent({
    props: [],
    components: { Inputs, Buttons, MsgNoData },
    computed: { ...mapStores(adminResourceStore), ...mapStores(modalStore) },
    mounted() {
        this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
    },
    data() {
        return { isUpdated: false }
    },
    watch: {
        isUpdated() {
            this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
            this.isUpdated = false;
        },
    },
    methods: {
        onDeleteResource(data: any, i: number) {
            this.$confirm.require({
                message: `Querés eliminar el registro '${data.name_resource}'`,
                header: 'Confirmar eliminación',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                acceptLabel: "SI",
                rejectLabel: "NO",
                accept: () => {
                    this.isUpdated = true;
                    if (data.name_resource === "Tipo de contraseña" || data.name_resource === "Tipo de tarjeta" || data.name_resource === "Nota") {
                    } else {
                        this.adminResourceStoreStore.DAPI_RESPONSE.response.data.splice(i, 1);
                    }
                    this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_DELETE_RESOURCE_BY_ID", data._id);
                    this.isUpdated = false;
                },
            });
        }
    }
});
</script>

<template>
    <div class="table_list_data_resource">
        <div style="text-align: center;" v-if="adminResourceStoreStore.DAPI_RESPONSE.isLoading">
            <span class="loader"></span>
        </div>
        <div v-else>
            <MsgNoData
                v-if="!adminResourceStoreStore.DAPI_RESPONSE.isLoading && adminResourceStoreStore.DAPI_RESPONSE.response.data.length === 0" />
                <table
                v-if="!adminResourceStoreStore.DAPI_RESPONSE.isLoading && adminResourceStoreStore.DAPI_RESPONSE.response.data.length > 0">
                <tr>
                    <th style="text-align:center">Recurso</th>
                    <th style="text-align:center">Encriptado</th>
                    <th style="text-align:center">Acción</th>
                </tr>
                <tr v-for="(i, k) in   adminResourceStoreStore.DAPI_RESPONSE.response.data  " :key="i._id">
                    <td>{{ i.name_resource }}</td>
                    <td style="text-align:center">
                        {{ i.name_type_encrypt }}
                    </td>
                    <td :style="{
                        filter: i.name_resource === 'Tipo de contraseña' || i.name_resource === 'Tipo de tarjeta'
                            || i.name_resource === 'Nota' ? 'grayscale(1)' : 'grayscale(0)', textAlign: 'center', display: 'flex',
                        justifyContent: 'center', pointerEvents: i.name_resource === 'Tipo de contraseña' || i.name_resource === 'Tipo de tarjeta'
                            || i.name_resource === 'Nota' ? 'none' : ''
                    }">
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