import type { Route } from './+types/home';
import { useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import usePokemon from '~/hooks/usePokemon';
import { Link, useSearchParams } from 'react-router'
import Layout from '~/components/Layout'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home({ }: Route.ComponentProps) {
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 300)
  const [searchParams] = useSearchParams()

  const shouldUseChaosMode = searchParams.get('chaos') === 'true'
  const { pokemon, isLoading, error } = usePokemon(debouncedSearchText, shouldUseChaosMode)

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value ?? '')
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Pokemon Search App</h1>

        <form name="search" onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <label htmlFor="pokemon-search-input">
            Search by name
          </label>
        
          <input id="pokemon-search-input" type="text" value={searchText} onChange={handleSearchTextChange} />
        </form>

        <div role="alert">
          {isLoading ? (
            <p>Loading...</p>
          ) : error && error.message === '404' ? (
            <p>No results.</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) :  pokemon && pokemon.length > 0 ? (
            <p>{pokemon.length} found.</p>
          ) : null}
        </div>

        <div> 
          {!isLoading && !error && pokemon && pokemon.length > 0 ? (
            <ul>
              {pokemon.map((aPokemon) => (
                aPokemon != null && (
                  <li key={aPokemon.name}>
                    <Link to={`/pokemon/${aPokemon.id}`}> 
                      {aPokemon.name}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Layout>
  )
}
