<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            Usuarios
          </h1>
          <p class="text-sm opacity-70">
            Administra usuarios del sistema ERP.
          </p>
        </div>
      </div>
    </div>

    <UsersTable
      :items="items"
      :loading="loading"
      :next-cursor="nextCursor"
      :error="error"
      @reload="reload"
      @load-more="loadMore"
      @create="openCreate"
      @edit="openEdit"
      @toggle-active="toggleActive"
    />

    <UserDialog
      v-model="dialogOpen"
      :mode="dialogMode"
      :model="selectedUser"
      :saving="saving"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import UsersTable from '~/components/users/UsersTable.vue'
import UserDialog from '~/components/users/UserDialog.vue'

definePageMeta({
  middleware: ['auth']
})

type User = {
  id: string
  name: string
  email: string
  active: boolean
  roleIds?: string[]
}

type UserForm = {
  id?: string
  name: string
  email: string
  password?: string
  roleIds: string[]
  active?: boolean
}

const { $api } = useNuxtApp()

const items = ref<User[]>([])
const nextCursor = ref<string | null>(null)
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const dialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedUser = ref<UserForm | null>(null)

async function reload() {
  error.value = null
  loading.value = true

  try {
    const res: any = await $api('/users?limit=20')
    items.value = res.items || []
    nextCursor.value = res.nextCursor || null
  } catch (e: any) {
    error.value = e?.data?.message || 'Error cargando usuarios'
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!nextCursor.value) return

  error.value = null
  loading.value = true

  try {
    const res: any = await $api(`/users?limit=20&cursor=${encodeURIComponent(nextCursor.value)}`)
    items.value = [...items.value, ...(res.items || [])]
    nextCursor.value = res.nextCursor || null
  } catch (e: any) {
    error.value = e?.data?.message || 'Error cargando más usuarios'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  dialogMode.value = 'create'
  selectedUser.value = {
    name: '',
    email: '',
    password: '',
    roleIds: []
  }
  dialogOpen.value = true
}

function openEdit(user: User) {
  dialogMode.value = 'edit'
  selectedUser.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    roleIds: user.roleIds || [],
    active: user.active
  }
  dialogOpen.value = true
}

async function handleSubmit(payload: UserForm) {
  saving.value = true

  try {
    if (dialogMode.value === 'create') {
      await $api('/users', {
        method: 'POST',
        body: {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          roleIds: payload.roleIds || []
        }
      })
    } else {
      await $api(`/users/${payload.id}`, {
        method: 'PATCH',
        body: {
          name: payload.name,
          roleIds: payload.roleIds || []
        }
      })
    }

    dialogOpen.value = false
    selectedUser.value = null
    await reload()
  } catch (e: any) {
    error.value = e?.data?.message || 'No se pudo guardar el usuario'
  } finally {
    saving.value = false
  }
}

async function toggleActive(user: User) {
  try {
    await $api(`/users/${user.id}/active`, {
      method: 'PATCH',
      body: { active: !user.active }
    })

    items.value = items.value.map(item =>
      item.id === user.id ? { ...item, active: !item.active } : item
    )
  } catch (e: any) {
    error.value = e?.data?.message || 'No se pudo cambiar el estado'
  }
}

onMounted(() => {
  reload()
})
</script>