<script lang="ts">
import { RouterLink } from 'vue-router';
import { defineComponent } from 'vue';
import { MENU_ADMIN, MENU_USER } from "../../assets/data-static/main-nav";

export default defineComponent({
    props: ["isAdmin"],
    data() {
        return {
            nav_admin: MENU_ADMIN,
            nav_user: MENU_USER
        }
    }
});
</script>

<template>
    <div class="dash_menu_content">
        <ul v-if="isAdmin">
            <RouterLink v-for="na in nav_admin" :to="{ name: na.url}">
                <li>{{ na.name }}</li>
            </RouterLink>
        </ul>
        <ul v-else>
            <RouterLink v-for="na in nav_user" :to="na.url">
                <li>{{ na.name }}</li>
            </RouterLink>
        </ul>
    </div>
</template>
