<template>
  <v-app>
    <default-bar />

    <default-view />
    <v-btn prepend-icon="mdi-vuetify" variant="plain">
      Button
    </v-btn>
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>
