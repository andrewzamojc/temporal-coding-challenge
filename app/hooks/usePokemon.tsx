import useSwrInfinite from 'swr/infinite'
import { useEffect, useMemo } from 'react'
import type { Pokemon } from '~/types'

type PokemonResponse = {
  nextPage: string | null;
  pokemon: Pokemon[];
}

type UsePokemonReturn = {
  pokemon?: Pokemon[],
  isLoading: boolean,
  error: Error | null,
}

const API_URL:string = 'https://meowing-bristle-alamosaurus.glitch.me/api'

// Set a max so we don't go crazy
// could do infinite scroll instead
const MAX_PAGES:number = 5

const getUrl = ({ 
  searchText, 
  page = undefined, 
  shouldUseChaosMode = false, 
}: {
  searchText: string,
  page?: string,
  shouldUseChaosMode?: boolean
}): string => {
  const path = searchText 
    ? `${API_URL}/pokemon/search/${searchText}`
    : `${API_URL}/pokemon`
  
  const url = new URL(path)
  
  if (page) {
    url.searchParams.append('page', decodeURIComponent(page))
  }

  if (shouldUseChaosMode) {
    url.searchParams.append('chaos', 'true')
  }

  return url.toString()
}

const fetcher = async (url: string) => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`${response.status}`)
    }

    return await response.json()
}

export default function usePokemon(searchText: string, shouldUseChaosMode: boolean = false): UsePokemonReturn {
  const { data, error, isLoading, setSize } = useSwrInfinite<PokemonResponse>(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPage) {
        return null
      }

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return getUrl({ searchText, shouldUseChaosMode })
    
      // add the cursor to the API endpoint
      return getUrl({ searchText, page: previousPageData.nextPage, shouldUseChaosMode })
    },
    fetcher,
  )

  useEffect(() => { setSize(1) }, [searchText, setSize])

  // load all pages
  useEffect(() => {
    setSize((prevSize) => Math.min(prevSize + 1, MAX_PAGES))
  }, [data, setSize]);

  // swr inifite returns an array of pages, we need to flatten it
  const flattenedData: Pokemon[] = useMemo(() => data ? data.flatMap((page) => page.pokemon) : [], [data])

  return {
    pokemon: flattenedData,
    isLoading,
    error,
  }
}

