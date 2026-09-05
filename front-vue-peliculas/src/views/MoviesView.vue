<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="movies-placeholder">
    <p class="eyebrow">Sesión activa</p>
    <h1>Películas</h1>
    <p>El listado y el CRUD se conectarán aquí cuando esté lista la API.</p>
    <button type="button" @click="logout">Cerrar sesión</button>
  </main>
</template>
