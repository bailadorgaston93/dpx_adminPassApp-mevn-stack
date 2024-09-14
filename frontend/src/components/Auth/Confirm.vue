<script lang="ts">
import { authStore } from "../../stores/authStore";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
    props: [],
    computed: { ...mapStores(authStore) },
    mounted() { this.authStoreStore.actionMainAuthStore("GET_TOKEN_CONFIRM", null); }
});

</script>

<template>
    <div v-if="authStoreStore.DAPI_RESPONSE.isLoading">
        CARGANDO
    </div>
    <div v-else-if="authStoreStore.DAPI_RESPONSE.response.status === 404" style="text-align:center; font-size: 3em;">
        {{ authStoreStore.DAPI_RESPONSE.response.msg }}
    </div>
    <div v-else style="text-align: center;">
        <div v-if="authStoreStore.DAPI_RESPONSE.response.status === 201" style="text-align:center; font-size: 3em;">
            <div>
                {{ authStoreStore.DAPI_RESPONSE.response.msg }}
            </div>
        </div>
    </div>
    <div v-if="!authStoreStore.DAPI_RESPONSE.isLoading" style="text-align: center;">
        <RouterLink :to="{ path: '/' }" style="color:#005CD2; margin-top: 3%;"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            ACCEDER
        </RouterLink>
    </div>
</template>