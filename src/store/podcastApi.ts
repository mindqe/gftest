// import {
//   buildCreateApi,
//   coreModule,
//   reactHooksModule,
//   createApi,
//   fetchBaseQuery
// } from '@reduxjs/toolkit/query/react'

// import { useSSR } from 'use-ssr'

// interface TPokemonData {
//   name: string
//   sprite: string
// }

// let createApiFunction = createApi
// const {isServer} = useSSR();
// /*
// For data prefetching during SSR we need to use a modified createApi function.
// You can remove this modification if you do not need this api to be used on the server.
// */
// if (isServer) {
//   createApiFunction = buildCreateApi(
//     coreModule(),
//     // eslint-disable-next-line camelcase
//     reactHooksModule({ unstable__sideEffectsInRender: true })
//   )
// }

// export const podcastApi = createApiFunction({
//   reducerPath: 'podcastApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
//   endpoints: (builder) => ({
//     getPokemonSpriteById: builder.query<TPokemonData, number>({
//       query: (id) => `pokemon/${id}`,
//       transformResponse: (response: any) => ({
//         name: response.species.name,
//         sprite: response.sprites.other.dream_world.front_default
//       })
//     })
//   })
// })