<template>
  <div class="dashboard-container">
    <GoodsList></GoodsList>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GoodsList from "@/components/GoodsList/GoodsList";


export default {
  name: "list",
  data(){
    return {
     
    }
  },
  components: {
    GoodsList
  },
  computed: {
    ...mapGetters(["name"]),
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
