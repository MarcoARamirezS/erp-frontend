<template>
  <dialog class="modal" :class="{ 'modal-open': modelValue }">
    <div class="modal-box max-w-2xl rounded-2xl p-0">
      <div class="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-200 px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">
            {{ mode === 'create' ? 'Nuevo usuario' : 'Editar usuario' }}
          </h3>
          <p class="text-sm opacity-70">
            {{ mode === 'create' ? 'Captura los datos del nuevo usuario.' : 'Actualiza la información del usuario.' }}
          </p>
        </div>

        <button class="btn btn-circle btn-ghost btn-sm" @click="close">
          ❌
        </button>
      </div>

      <div class="space-y-5 px-6 py-6">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input v-model="form.name" class="input input-bordered w-full" placeholder="Nombre completo">
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="form.email"
              class="input input-bordered w-full"
              placeholder="correo@empresa.com"
              :disabled="mode === 'edit'"
            >
          </div>
        </div>

        <div v-if="mode === 'create'" class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input v-model="form.password" type="password" class="input input-bordered w-full" placeholder="********">
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Roles (demo por texto)</span>
          </label>
          <input
            v-model="rolesText"
            class="input input-bordered w-full"
            placeholder="admin, compras, ventas"
          >
          <label class="label">
            <span class="label-text-alt opacity-70">
              Separados por coma
            </span>
          </label>
        </div>
      </div>

      <div class="sticky bottom-0 flex justify-end gap-2 border-t border-base-300 bg-base-200 px-6 py-4">
        <button class="btn btn-outline" @click="close" :disabled="saving">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="submit" :disabled="saving">
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>
          {{ mode === 'create' ? 'Crear usuario' : 'Guardar cambios' }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
type UserForm = {
  id?: string
  name: string
  email: string
  password?: string
  roleIds: string[]
  active?: boolean
}

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  model: UserForm | null
  saving: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: UserForm): void
}>()

const form = ref<UserForm>({
  name: '',
  email: '',
  password: '',
  roleIds: []
})

const rolesText = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = {
        id: props.model?.id,
        name: props.model?.name || '',
        email: props.model?.email || '',
        password: '',
        roleIds: props.model?.roleIds || [],
        active: props.model?.active
      }

      rolesText.value = (props.model?.roleIds || []).join(', ')
    }
  },
  { immediate: true }
)

function close() {
  emit('update:modelValue', false)
}

function submit() {
  const roleIds = rolesText.value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  emit('submit', {
    ...form.value,
    roleIds
  })
}
</script>