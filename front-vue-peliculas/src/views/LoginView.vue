<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function submitLogin() {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Escribe tu usuario y contraseña.'
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login(username.value.trim(), password.value)
    await router.push('/movies')
  } catch (error) {
    const responseError = error as AxiosError<{ message?: string }>
    errorMessage.value = responseError.response?.data?.message ?? 'No fue posible iniciar sesión.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-shell">
    <section class="login-panel" aria-labelledby="login-title">
      <div class="brand-mark" aria-hidden="true">M</div>
      <p class="eyebrow">Cineclub personal</p>
      <h1 id="login-title">Bienvenido de nuevo</h1>
      <p class="login-intro">Entra para administrar tu catálogo de películas.</p>

      <form class="login-form" @submit.prevent="submitLogin" novalidate>
        <label for="username">Usuario</label>
        <input
          id="username"
          v-model="username"
          name="username"
          type="text"
          autocomplete="username"
          placeholder="Escribe tu usuario"
          required
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          placeholder="Escribe tu contraseña"
          required
        />

        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="login-note">Tu sesión se mantiene protegida mediante un token JWT.</p>
    </section>

    <aside class="login-art" aria-label="Colección de películas">
      <div class="art-copy">
        <p class="eyebrow">Tu próxima función</p>
        <p class="art-title">Historias que merecen otra reproducción.</p>
      </div>
      <div class="film-strip" aria-hidden="true">
        <span>01</span><span>02</span><span>03</span>
      </div>
    </aside>
  </main>
</template>
