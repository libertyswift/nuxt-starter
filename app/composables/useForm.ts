import { useForm as useVeeForm } from 'vee-validate'
import type { FormOptions, GenericObject } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodSchema } from 'zod'

/**
 * useForm поверх vee-validate с zod-схемой.
 *
 * После выхода vee-validate 5 обёртка toTypedSchema уйдёт:
 * zod-схему можно будет передавать напрямую через Standard Schema.
 */
export const useForm = <T extends GenericObject>(
  schema: ZodSchema<T>,
  options?: Omit<FormOptions<T>, 'validationSchema'>
) => {
  return useVeeForm<T>({
    ...options,
    validationSchema: toTypedSchema(schema)
  })
}
