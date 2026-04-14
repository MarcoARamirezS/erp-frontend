<template>
  <div class="animate-fadeIn rounded-2xl border border-base-300 bg-base-100 p-4 shadow-lg">
    <div class="mb-4 flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-base-100 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold">
          Listado de Usuarios
        </h2>
        <p class="text-sm opacity-70">
          Consulta, edita y cambia el estado de los usuarios 😎
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm" @click="$emit('reload')">
          Recargar
        </button>
        <button class="btn btn-primary btn-sm" @click="$emit('create')">
          Nuevo
        </button>
      </div>
    </div>
    <div class="hidden md:block">
      <div class="overflow-x-auto rounded-2xl border border-base-300">
        <table class="table">
          <thead class="bg-base-200 text-xs uppercase">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="py-10 text-center">
                <span class="loading loading-spinner loading-md"></span>
              </td>
            </tr>
            <tr v-else-if="!items.length">
              <td colspan="5" class="py-10 text-center opacity-60">
                Sin usuarios registrados
              </td>
            </tr>
            <tr v-for="user in items" :key="user.id" class="hover">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    +
                  </div>
                  <div>
                    <div class="font-medium">
                      {{ user.name }}
                    </div>
                    <div class="font-mono text-xs opacity-60">
                      {{ user.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="font-mono text-sm">
                {{ user.email }}
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span v-for="role in user.roleIds || []" :key="role" class="badge badge-outline badge-sm">
                    {{ role }}
                  </span>
                  <span v-if="!user.roleIds.length" class="text-xs opacity-60">
                    Sin Roles
                  </span>
                </div>
              </td>
              <td>
                <span class="badge" :class="user.active ? 'badge-success' : 'badge-error'">
                  {{ user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="flex justify-end gap-2">
                  <div class="tooltip" data-tip="Editar usuario">
                    <button class="btn btn-circle btn-ghost btn-sm" @click="$emit('edit', user)">
                      📝
                    </button>
                  </div>

                  <div class="tooltip" :data-tip="user.active ? 'Desactivar usuario' : 'Activar usuario'">
                    <button class="btn btn-circle btn-ghost btn-sm" @click="$emit('toggle-active', user)">
                      ✔
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="space-y-3 md:hidden">
      <div
        v-for="user in items"
        :key="user.id"
        class="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm"
      >
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <div class="font-semibold">
              {{ user.name }}
            </div>
            <div class="font-mono text-xs opacity-60">
              {{ user.email }}
            </div>
          </div>

          <span class="badge" :class="user.active ? 'badge-success' : 'badge-error'">
            {{ user.active ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <div class="mb-3">
          <div class="text-xs font-medium uppercase opacity-60">
            ID
          </div>
          <div class="font-mono text-xs">
            {{ user.id }}
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-medium uppercase opacity-60">
            Roles
          </div>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="role in user.roleIds || []"
              :key="role"
              class="badge badge-outline badge-sm"
            >
              {{ role }}
            </span>

            <span v-if="!user.roleIds?.length" class="text-xs opacity-50">
              Sin roles
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button class="btn btn-circle btn-ghost btn-sm" @click="$emit('edit', user)">
            📝
          </button>

          <button class="btn btn-circle btn-ghost btn-sm" @click="$emit('toggle-active', user)">
            ✔
          </button>
        </div>
      </div>

      <div v-if="loading" class="py-6 text-center">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <div v-if="!loading && !items.length" class="py-6 text-center opacity-60">
        Sin usuarios registrados
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm opacity-70">
        Items: {{ items.length }} · nextCursor: {{ nextCursor || 'null' }}
      </div>

      <div class="join">
        <button class="btn btn-sm join-item" @click="$emit('reload')" :disabled="loading">
          Reset
        </button>
        <button class="btn btn-sm btn-primary join-item" @click="$emit('load-more')" :disabled="loading || !nextCursor">
          Cargar más
        </button>
      </div>
    </div>

    <p v-if="error" class="pt-3 text-sm text-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
type User = {
  id: string
  name: string
  email: string
  active: boolean
  roleIds?: string[]
}
defineProps<{
  items: User[]
  loading: boolean
  nextCursor: string | null
  error: string | null
}>()
defineEmits<{
  (e: 'reload'): void
  (e: 'load-more'): void
  (e: 'create'): void
  (e: 'edit', user: User): void
  (e: 'toggle-active', user: User): void
}>()
</script>