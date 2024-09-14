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
        onRegister() {
            this.authStoreStore.actionMainAuthStore("ACTION_REGISTER", null);
        }
    }
});
</script>

<template>
    <div style="fontSize:2em; text-transform: uppercase;">
        Crear cuenta
    </div>
    <div class="content_form" style="margin:0;">
        <form class="px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="name">
                    Nombre
                </label>
                <input class="INPUT_AUTH" id="name" type="text" placeholder="Nombre" maxlength="20" minlength="4"
                    v-model="authStoreStore.form_data.name">
            </div>
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="lastname">
                    Apellido
                </label>
                <input class="INPUT_AUTH" id="lastname" type="text" placeholder="Apellido" maxlength="20" minlength="4"
                    v-model="authStoreStore.form_data.lastname">
            </div>
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="email">
                    E-mail
                </label>
                <input class="INPUT_AUTH" id="email" type="email" placeholder="E-mail" maxlength="100" minlength="10"
                    v-model="authStoreStore.form_data.email">
            </div>
            <div class="mb-4">
                <label class="LABEL_INPUT_AUTH" for="date_birth">
                    Fecha de nacimiento
                </label>
                <input class="INPUT_AUTH" id="date_birth" type="date" min='1900-01-01' max='9999-12-31'
                    v-model="authStoreStore.form_data.birth">
            </div>
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
                <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded" @click="onRegister">
                    Registrarse
                </button>
                <div>
                    <RouterLink :to="{ path: '/' }" style="color:#005CD2; margin-top: 3%;"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Ya tienes una cuenta?
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>