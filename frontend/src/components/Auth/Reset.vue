<script lang="ts">
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../stores/authStore";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
    props: [],
    computed: { ...mapStores(authStore) },
    data() {
        return {
            data: jwtDecode(this.$route.params.id)
        }
    },
    methods: {
        onReset() {
            this.authStoreStore.actionMainAuthStore("ACTION_RESET", this.$route.params.id);
        }
    },
    mounted() {
        console.log(this.data)
        if (this.data.userActive && !this.data.token_confirm_account) {
            console.log("red")
            window.location.replace("/")
        }
    }
});
</script>

<template>
    <div style="fontSize:2em; text-transform: uppercase;">
        Restablecer contraseña
    </div>
    <div v-if="authStoreStore.DAPI_RESPONSE.response.msg" :style="{
        backgroundColor: 'black',
        color: authStoreStore.DAPI_RESPONSE.response.status === 404 ? 'rgb(224, 40, 40)' : 'green', padding: '3%', fontSize: '2em'
    }">
        {{ authStoreStore.DAPI_RESPONSE.response.msg }}
    </div>
    <div class="content_form" style="margin:0;">
        <form class="px-8 pt-6 pb-8 mb-4">

            <div class="mb-6">
                <label class="LABEL_INPUT_AUTH" for="password">
                    Contraseña
                </label>
                <input class="INPUT_AUTH" id="password" type="password" placeholder="******************"
                    v-model="authStoreStore.form_data.password">
            </div>
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="confirm_password">
                    Confirmar contraseña
                </label>
                <input class="INPUT_AUTH" id="confirm_password" type="password" placeholder="******************"
                    v-model="authStoreStore.form_data.confirm_password">
            </div>
            <div style="text-align: center;">
                <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded" @click="onReset">
                    Reestablecer
                </button>
                <div>
                    <RouterLink :to="{ name: 'auth-login' }" style="color:#005CD2; margin-top: 3%;"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Ya la recuerdo
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>