<script lang="ts">
import { defineComponent } from 'vue';
import LabelInputs from './LabelInputs.vue';
export default defineComponent({
    props: ["mBottom", "classLabel", "label_name", "label_for_to_id", "classInput", "type_input",
        "placeholder", "maxLength", "minLength", "isTextArea", "input_name"],
    components: { LabelInputs },
    mounted() {
        const id_input_autocomplete_off: any = document.getElementById(this.label_for_to_id)
        id_input_autocomplete_off.type = this.type_input;
        id_input_autocomplete_off.removeAttribute('autocomplete');
    },
    data(){
        return {
        }
    }
});
</script>

<template>
    <!-- 
        Ejemplo de uso:   
        <Inputs :mBottom="4" :classLabel="['LABEL_INPUT_AUTH']" :label_name="'Nombre'" :label_for_to_id="'nombre'"
        :classInput="['INPUT_AUTH']" :type_input="'text'" :placeholder="'Ingresar nombre'" :minLength="10" :maxLength="30" :isTextArea="false" />
     -->

    <div :style="{ marginBottom: mBottom + '%' }">

        <LabelInputs :class="classLabel" :label_name="label_name" :for="label_for_to_id" />
        <input v-if="!isTextArea" :class="classInput" :type="type_input" :placeholder="placeholder" :id="label_for_to_id"
            :name="input_name" :maxlength="maxLength" :minlength="minLength"
            :autocomplete="label_for_to_id" />
        <textarea v-else :class="classInput" :placeholder="placeholder" :id="label_for_to_id" :name="input_name"></textarea>
    </div>
</template>