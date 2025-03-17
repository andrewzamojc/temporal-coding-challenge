import useSwr from 'swr'
import { useEffect, useMemo } from 'react'

export type UsePokemonReturn = {
  pokemonDetails: Record<string, string>
  isLoading: boolean,
  error: Error | null,
}

const API_URL:string = 'https://meowing-bristle-alamosaurus.glitch.me/api'

const getUrl = (id: string): string => {
  return `${API_URL}/pokemon/${id}`
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

export default function usePokemonDetails(id: string): UsePokemonReturn {
  const { data, error, isLoading } = useSwr<{}>(
    getUrl(id),
    fetcher,
  )

  return {
    pokemonDetails: data ?? {},
    isLoading,
    error,
  }
}

