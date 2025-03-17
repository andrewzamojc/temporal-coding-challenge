import usePokemonDetails from '~/hooks/usePokemonDetails'
import { Link } from 'react-router'
import type { Route } from './+types/details'
import Layout from '~/components/Layout'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Pokemon Details' },
    { name: 'description', content: 'Details about a specific pokemon' },
  ];
}

export default function Details({
  params
}: Route.ComponentProps) {
  const { pokemonDetails, isLoading, error } = usePokemonDetails(params.id ?? '')

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <Link to="/">Back to Home</Link>

        {isLoading ? (
          'Loading...'
          ) : error ? (
          `Error: ${error.message}`
        ) : pokemonDetails ? (
          <>
            <h1 className="text-xl">Pokemon Details: {pokemonDetails.name}</h1>

            <pre>
              {JSON.stringify(pokemonDetails, null, 2)}
            </pre>
          </>
        ) : null}
      </div>
    </Layout>
  )
}
