<script lang="ts">
import Buttons from '../UI/Buttons.vue';
import { authStore } from "../../stores/authStore";
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
    props: [],
    components: { Buttons },
    computed: { ...mapStores(authStore) },
    methods: {
        onLogin() {
            this.authStoreStore.actionMainAuthStore("ACTION_LOGIN", null);
        }
    }
});
</script>

<template>

    <div style="fontSize:2em; text-transform: uppercase;">
        Acceso
    </div>
    <div class="content_form" style="margin:0 auto; margin-top: 15%; width: 80%;">
        <form class="px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="email">
                    E-mail
                </label>
                <input class="INPUT_AUTH" id="email" type="email" placeholder="E-mail" maxlength="100" minlength="10"
                    v-model="authStoreStore.form_data.email">
            </div>
            <div class="mb-6">
                <label class="LABEL_INPUT_AUTH" for="password">
                    Contraseña
                </label>
                <input class="INPUT_AUTH" id="password" type="password" placeholder="******************" maxlength="24"
                    minlength="8" v-model="authStoreStore.form_data.password">
            </div>
            <div style="text-align: center;">

                <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded"  @click="onLogin">
                    Acceder
                </button>
                <div>
                    <RouterLink :to="{ name: 'auth-recovery' }" style="color:#005CD2; margin-top: 3%;"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Recuperar contraseña
                    </RouterLink>
                    |
                    <RouterLink :to="{ name: 'auth-register' }" style="color:#005CD2; margin-top: 3%;"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        No tienes una cuenta?
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>