<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-smoke dark:bg-gray-800 text-black pb-2">
      <div class="h-1 w-full bg-gradient-to-r from-blue-500 via-green-200 to-yellow-400 mb-1"></div>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <img src="../assets/img/logo.png" class="w-12" alt srcset />
        </q-toolbar-title>

        <q-btn @click="logoutUSER" round flat icon="exit_to_app" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <div class="h-1 w-full bg-gradient-to-r from-yellow-400 via-green-200 to-blue-500 mb-1"></div>
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "DashBoard",
    caption: "Abwaab Dash Board",
    icon: "dashboard",
    link: "/Dashboard",
  },
  {
    title: "Comments Managment",
    caption: "Abwaab Comments Managment",
    icon: "school",
    link: "/Comments-Managments",
  },
  {
    title: "User Managment",
    caption: "controll users on Interaction Controlle panel",
    icon: "group",
    link: "/user-Managments",
  },
];
import { LocalStorage } from "quasar";
export default {
  name: "MainLayout",
  components: { EssentialLink },
  created() {
    if (LocalStorage.getItem("tokens")) {
      setTimeout(() => {
        this.$store.dispatch("refreshToken");
      }, 840000);
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
  methods: {
    logoutUSER() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
