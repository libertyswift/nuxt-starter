// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Компоненты shadcn-vue генерируются CLI — правим только через `shadcn-vue add`
  {
    ignores: ['app/components/ui/**']
  }
)
