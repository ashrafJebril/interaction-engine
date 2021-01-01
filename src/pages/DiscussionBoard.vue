
<template>
  <div class="w-full h-full">
    <div class="flex w-full p-4">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/" label="Home" icon="home" />
        <q-breadcrumbs-el label="Discussion Board" icon="school" />
      </q-breadcrumbs>
    </div>
    {{comments}}
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created(){
    this.getComments();
  },
  methods:{
    ...mapActions(['getComments'])
  },
  computed:{
    ...mapGetters(['comments'])
  }
};
</script>

<style>
</style>
