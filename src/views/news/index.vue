<template>
  <div>
    <ConditionForm :type='type'></ConditionForm>
  </div>
</template>
  
<script>
import ConditionForm from '@/components/Condition/ConditionForm.vue'
  export default {
    components: {
      ConditionForm
    },
    data() {
      return {
        type: 2
      }
    }
  }
</script>