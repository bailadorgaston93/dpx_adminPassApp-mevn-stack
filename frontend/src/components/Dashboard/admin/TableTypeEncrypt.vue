<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import { modalStore } from "../../../stores/modalStore";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { adminResourceStore } from "../../../stores/adminResourceStore";

export default defineComponent({
    props: [],
    components: { Inputs, Buttons },
    computed: { ...mapStores(adminResourceStore), ...mapStores(modalStore) },
    data() {
        return { selectValue: "", selectTypeEncrypt: "", dataID: {} }
    },
    mounted() {
        this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
    },
    watch: {
        selectValue() {
            if (this.selectValue) {
                this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_GET_RESOURCE_BY_ID", this.selectValue);
                this.modalStoreStore.isRefreshRecord = true;
                this.selectTypeEncrypt = "";
            }
        },
        selectTypeEncrypt() {
            if (this.selectTypeEncrypt) {
                this.adminResourceStoreStore.actionMainAdminResourceStore("ACTION_EDIT_TYPE_ENCRYPT", { id: this.selectValue, value: this.selectTypeEncrypt });
                this.modalStoreStore.isRefreshRecord = true;
            }
        },
    },
    methods: {
        onSelectAndSearch(event: any) {
            this.selectValue = event.target.value;
        },
        onSelectAndUpdateEncrypt(event: any) {
            this.selectTypeEncrypt = event.target.value;
        }
    }
});
</script>

<template>
    <div class="table_list_data_resource">
        <div v-if="adminResourceStoreStore.DAPI_RESPONSE.isLoading">
            Cargando..
        </div>
        <div v-if="adminResourceStoreStore.DAPI_RESPONSE.response.data === 0">
            NO HAY DATOS
        </div>
        <div v-if="!adminResourceStoreStore.DAPI_RESPONSE.isLoading && adminResourceStoreStore.DAPI_RESPONSE.response.data.length > 0"
            style="text-align: center; margin-bottom: 5%;">
            <select class="INPUT_DASH_SELECT" @change="(event) => onSelectAndSearch(event)">
                <option value="">Seleccionar un recurso</option>
                <option v-for="i in adminResourceStoreStore.DAPI_RESPONSE.response.data" :key="i._id" :value="i._id">
                    {{ i.name_resource }}
                </option>
            </select>
        </div>
        <div style="width: 70%; margin: 0 auto;"
            v-if="selectValue && adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data">
            <div style="text-align: center; margin-bottom: 5%;">
                <select class="INPUT_DASH_SELECT_no_width" @change="(event) => onSelectAndUpdateEncrypt(event)">
                    <option :selected="adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.name_type_encrypt === 'JWT'"
                        value="JWT">JWT</option>
                    <option
                        :selected="adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.name_type_encrypt === 'BASE 64'"
                        value="BASE 64">BASE 64</option>
                </select>
            </div>
            <table>
                <tr>
                    <th style="text-align:center">Campo</th>
                    <th style="text-align:center">Tipo</th>
                </tr>
                <tr v-for="(i, k) in adminResourceStoreStore.DAPI_RESPONSE_ID.response?.data.fields">
                    <td>{{ i.label_input }}
                        {{ (i.label_input === 'Nombre del recurso' || i.label_input === 'Nombre del recurso') && k === 0 ? "(campo por defecto)" : ""
                        }}
                    </td>
                    <td style="text-align:center">
                        {{ i.type_input }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>