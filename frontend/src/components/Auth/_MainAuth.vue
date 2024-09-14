<script lang="ts">
import Buttons from "../UI/Buttons.vue";
import SlotApp from "../UI/SlotApp.vue";
import MenuDash from "../UI/MenuDash.vue";
import { mapStores } from 'pinia';
import { authStore } from "../../stores/authStore";
import { RouterView } from 'vue-router';
import { decodeUserNow } from "@/Helpers/decodeUser";
import { defineComponent } from 'vue';
import ListUserResources from "../Dashboard/user/ListUserResources.vue";

export default defineComponent({
    props: [],
    components: { SlotApp, MenuDash, ListUserResources, Buttons },
    computed: { ...mapStores(authStore) },
    data() {
        return {
            TEMP_ISADMIN: true,
            DECODE_USER: decodeUserNow()
        }
    }
});
</script>

<template>
    <div class="flex flex-row ">
        <SlotApp v-slot:LAYOUT_APP_CONTENT>
            <div class="basis-2/5 LAYOUT_APP_SIDE_LEFT_PUBLIC">
                <SlotApp v-slot:LAYOUT_APP_SIDE_LEFT>
                    <div class="dash_content_main"></div>
                </SlotApp>
            </div>

            <div class="basis-3/5 LAYOUT_APP_SIDE_RIGHT_PUBLIC">
                <SlotApp v-slot:LAYOUT_APP_SIDE_RIGHT>
                    <div class="dash_content_main">
                        <div class="section">
                            <RouterView />
                        </div>
                    </div>
                </SlotApp>
            </div>
        </SlotApp>
    </div>
</template>