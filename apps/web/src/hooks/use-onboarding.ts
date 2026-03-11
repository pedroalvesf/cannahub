import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface OnboardingSummary {
  sessionId: string
  status: string
  currentStep: number
  condition?: string
  accountType?: string
  experience?: string
  preferredForm?: string
  hasPrescription?: boolean
  needsDoctor?: boolean
  assistedAccess?: boolean
  growingInterest?: boolean
  summary?: string
}

interface SubmitStepResponse {
  sessionId: string
  status: string
  currentStep: number
  extractedFields?: Record<string, unknown>
}

export function useOnboardingSummary() {
  return useQuery<OnboardingSummary>({
    queryKey: ['onboarding'],
    queryFn: async () => {
      const { data } = await api.get('/onboarding/summary')
      return data
    },
    retry: false,
  })
}

export function useStartOnboarding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/onboarding/start')
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  })
}

export function useSubmitStep() {
  const queryClient = useQueryClient()
  return useMutation<SubmitStepResponse, Error, { stepNumber: number; input?: string; selectedOption?: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.patch('/onboarding/step', payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  })
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/onboarding/complete')
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  })
}

export function useExtractFromText() {
  return useMutation<{ fields: Record<string, unknown> }, Error, string>({
    mutationFn: async (input) => {
      const { data } = await api.post('/onboarding/extract', { input })
      return data
    },
  })
}

export function useEscalate() {
  return useMutation({
    mutationFn: async (reason: string) => {
      const { data } = await api.post('/onboarding/escalate', { reason })
      return data
    },
  })
}
