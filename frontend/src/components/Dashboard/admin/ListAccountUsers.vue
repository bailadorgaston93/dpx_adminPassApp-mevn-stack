
<script lang="ts">
import Inputs from "../../UI/Inputs.vue";
import Buttons from "../../UI/Buttons.vue";
import MsgNoData from "../../UI/MsgNoData.vue";
import { mapStores } from 'pinia';
import { userStore } from "../../../stores/userStore";
import { defineComponent } from 'vue';

export default defineComponent({
    props: [],
    components: { Inputs, Buttons, MsgNoData },
    computed: { ...mapStores(userStore) },
    data() {
        return {
            isUpdated: false
        }
    },
    mounted() {
        this.userStoreStore.actionMainUserStore("ACTION_GET_USERS", null);
    },
    watch: {
        isUpdated() {
            this.userStoreStore.actionMainUserStore("ACTION_GET_USERS", null);
            this.isUpdated = false;
        }
    },
    methods: {
        onChangeStatusUser(data: any = {}) {
            this.userStoreStore.actionMainUserStore("ACTION_UPDATE_STATUS_USER", data._id, data.userIsActiveByAdmin);
            this.isUpdated = true;
        }
    }
});
</script>

<template>
    <div class="table_list_data_resource">
        <div style="text-align: center;" v-if="userStoreStore.DAPI_RESPONSE.isLoading">
            <span class="loader"></span>
        </div>
        <div v-else>
            <MsgNoData
                v-if="userStoreStore.DAPI_RESPONSE.response.data.length === 0" />
            <table v-if="userStoreStore.DAPI_RESPONSE.response.data.length > 0">
                <tr>
                    <th style="text-align:center">Nombre y Apellido</th>
                    <th style="text-align:center">Estado</th>
                    <th style="text-align:center">Acción</th>
                </tr>
                <tr v-for="i in userStoreStore.DAPI_RESPONSE.response.data" :key="i._id">
                    <td>{{ i.name + " " + i.lastname }}</td>
                    <td style="text-align:center">
                        {{ i.userIsActiveByAdmin ? "Activo" : "Inactivo" }}
                    </td>
                    <td style="text-align:center">
                        <Buttons @click="onChangeStatusUser(i)" :type_btn="'button'" :btn_align="'center'"
                            :classApply="i.userIsActiveByAdmin ? 'BTN_SUCCESS_3' : 'BTN_DANGER_2'"
                            :btn_text="i.userIsActiveByAdmin ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'"
                            :isIcon="true" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>