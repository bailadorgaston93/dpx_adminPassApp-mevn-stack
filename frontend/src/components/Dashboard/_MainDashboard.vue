<script lang="ts">
import Buttons from "../UI/Buttons.vue";
import SlotApp from "../UI/SlotApp.vue";
import MenuDash from "../UI/MenuDash.vue";
import { mapStores } from 'pinia';
import { RouterView } from 'vue-router';
import { modalStore } from "../../stores/modalStore";
import { decodeUserNow } from "@/Helpers/decodeUser";
import ListUserResources from "../Dashboard/user/ListUserResources.vue";
import { defineComponent } from 'vue';
import FormAddAndEditResourceAdmin from "../Dashboard/admin/_FormAddAndEditResource.vue";
import FormAddAndEditResourceUser from "../Dashboard/user/_FormAddAndEditResource.vue";

export default defineComponent({
    props: [],
    components: { SlotApp, MenuDash, ListUserResources, Buttons, FormAddAndEditResourceUser, FormAddAndEditResourceAdmin },
    computed: { ...mapStores(modalStore) },
    data() {
        return { DECODE_USER: decodeUserNow() }
    },
    methods: {
        onLogout() {
            localStorage.removeItem("TOKEN_AUTH");
            this.$router.replace("/");
        }
    }
});
</script>

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="app_header_content">
        <div class="welcome">
            <div class="dash_title_welcome">
                <span style="text-transform: uppercase;">{{ DECODE_USER.isAdmin ? "Administrador" :
                    "Bienvenido " +
                    DECODE_USER.name }}</span>
            </div>
        </div>
        <div class="logout">
            <div style="text-align: right; padding-top: 1%; padding-bottom: 1%;">
                <button type="button" class="BTN_SUCCESS_1 py-2 px-4 rounded" @click="onLogout">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
    <div class="flex flex-row app_main_content">
        <SlotApp v-slot:LAYOUT_APP_CONTENT>
            <div class="basis-2/5 LAYOUT_APP_SIDE_LEFT_ADMIN">
                <!-- <div class="dash_title_welcome">
                    <span style="text-transform: uppercase;">{{ DECODE_USER.isAdmin ? "Administrador" :
                        "Hola " +
                        DECODE_USER.name }}</span>
                </div> -->
                <SlotApp v-slot:LAYOUT_APP_SIDE_LEFT>
                    <div class="dash_content_main">
                        <MenuDash :isAdmin="DECODE_USER.isAdmin" />
                        <div v-if="$route.path === '/admin-resources' || $route.path === '/select-encrypt' ||
                            $route.path === '/entries'">

                            <div style="text-align: right;">
                                <button type="button" class="BTN_SUCCESS_2 py-2 px-4 rounded"
                                    @click="modalStoreStore.onOpenModal">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </SlotApp>
            </div>
            <div class="basis-3/5 LAYOUT_APP_SIDE_RIGHT">
                <!-- <div style="text-align: right; margin-bottom: 5%;">
                    <button type="button" class="BTN_DANGER_1 py-2 px-4 rounded" @click="onLogout">
                        Cerrar sesión
                    </button>
                </div> -->

                <SlotApp v-slot:LAYOUT_APP_SIDE_RIGHT>
                    <div class="dash_content_main">
                        <div class="section">
                            <RouterView />
                        </div>
                    </div>
                </SlotApp>
                <FormAddAndEditResourceAdmin
                    v-if="modalStoreStore.isModalOpen && $route.path === '/admin-resources' || $route.path === '/select-encrypt'"
                    :isModalOpen="modalStoreStore.isModalOpen" :onCloseModal="modalStoreStore.onCloseModal"
                    :objectToEdit="modalStoreStore.objectToEdit" />

                <FormAddAndEditResourceUser v-if="modalStoreStore.isModalOpen && $route.path === '/entries'"
                    :isModalOpen="modalStoreStore.isModalOpen" :onCloseModal="modalStoreStore.onCloseModal"
                    :objectToEdit="modalStoreStore.objectToEdit" />
            </div>
        </SlotApp>
    </div>

    <div  style="text-align:center; padding:1%; background-color: rgb(213, 213, 213);">
            Derechos reservados EPN Quito – Ecuador
    </div>
</template>