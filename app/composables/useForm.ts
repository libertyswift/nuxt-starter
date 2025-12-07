import { useForm as useVeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodSchema } from 'zod'

export const useForm = <T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialValues?: Partial<T>
) => {
  const form = useVeeForm({
    validationSchema: toTypedSchema(schema),
    initialValues: initialValues as any
  })

  return form
}