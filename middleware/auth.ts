export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (process.client && auth.accessToken.value === null) {
    auth.loadFromStorage()
  }

  const isLogin = to.path === '/login'
  const hasToken = !!auth.accessToken.value

  if (!hasToken && !isLogin) {
    return navigateTo('/login')
  }

  if (hasToken && isLogin) {
    return navigateTo('/users')
  }
})