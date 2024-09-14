import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router';
import { adminResourceStore } from './adminResourceStore';
import { userResourceStore } from './userResource';

export const modalStore = defineStore('modalStore', () => {
    const userStore = userResourceStore()
    const useAdmin = adminResourceStore()

    const isModalOpen = ref(false);
    const isRefreshRecord = ref(false);
    const objectToEdit = ref({});

    const $route = useRoute();
    const $router = useRouter();

    const onOpenModal = () => {
        isModalOpen.value = true;
        isRefreshRecord.value = false;
        objectToEdit.value= {};
        objectToEdit.value= {};
    }

    const onCloseModal = () => {    

        isModalOpen.value = false;
        isRefreshRecord.value = true;
        objectToEdit.value= {};

        if($route.path === "/admin-resource"){
            useAdmin.actionMainAdminResourceStore("ACTION_GET_ADMIN_RESOURCES", null);
        } else if($route.path === "/entries"){
            userStore.actionMainUserResourceStore("ACTION_GET_USER_RESOURCES", null)
        }

    }

    const onEditData = (data: any) => {
        isModalOpen.value = true;
        objectToEdit.value = data;
    }

    return {
        isModalOpen,
        isRefreshRecord,
        objectToEdit,
        onOpenModal,
        onCloseModal,
        onEditData
    }
})
