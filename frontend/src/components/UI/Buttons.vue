<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ["type_btn", "btn_align", "classApply", "btn_text", "isIcon", "isEvent"],
    components: {},
});
</script>

<template>
    <!-- 
        Ejemplo de uso:   
         <Buttons :type_btn="'button'" :btn_align="'center'" :classApply="'BTN_SUCCESS_1'" :btn_text="'Iniciar sesión'" :isIcon="false"
    :isEvent="false"  />
     -->
    <div :style="{ textAlign: btn_align, marginTop: '3%', marginBottom: '3%' }">

        <button v-if="!isEvent" :class="[classApply, 'py-2 px-4 rounded']" :type="type_btn">
            <i v-if="isIcon" :class="[btn_text]"></i>
            {{ !isIcon ? btn_text : "" }}
        </button>
        <button v-else :class="[classApply, 'py-2 px-4 rounded']" :type="type_btn">
            <i v-if="isIcon" :class="[btn_text]"></i>
            {{ !isIcon ? btn_text : "" }}
        </button>

    </div>
</template>