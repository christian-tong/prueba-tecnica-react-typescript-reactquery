import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SortBy, type APIResults, type User } from './types.d'
import UserList from './Users/components/UsersList'

function App () {
  const [Users, setUsers] = useState<User[]>([])
  const [ShowColors, setShowColors] = useState(false)
  const [Sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [FilterCountry, setFilterCountry] = useState<string | null>(null)

  const OriginalUsers = useRef<User[]>([]) // useRef -> para guardar un valor que queremos que se comparta entre renderizados, pero que al cambiar no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!ShowColors)
  }

  const togglSortByCountry = () => {
    const newSortingValue = Sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = Users.filter((user) => {
      return user.email !== email
    })
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(OriginalUsers.current)
  }

  const inputFilterCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(event.target.value)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async (result) => await result.json())
      .then((result: APIResults) => {
        setUsers(result.results)
        OriginalUsers.current = result.results
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    return FilterCountry != null && FilterCountry.length > 0
      ? Users.filter((user) => {
        return user.location.country
          .toLowerCase()
          .includes(FilterCountry.toLowerCase())
      })
      : Users
  }, [Users, FilterCountry])

  const sortedUsers = useMemo(() => {
    if (Sorting === SortBy.NAME) {
      Users.toSorted((a, b) => {
        return a.name.first.localeCompare(b.name.first)
      })
    }
    if (Sorting === SortBy.LAST) {
      Users.toSorted((a, b) => {
        return a.name.last.localeCompare(b.name.last)
      })
    }
    if (Sorting === SortBy.COUNTRY) {
      Users.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    }
    return Users
  }, [filteredUsers, Sorting])

  return (
    <section className="flex flex-col justify-center items-center gap-6 p-8">
      <h1 className="text-3xl font-bold underline">Prueba Técnica</h1>
      <header className="flex gap-6">
        <button
          onClick={toggleColors}
          className="bg-slate-700 border-blue-900 border-2">
          Coloreal Filas
        </button>
        <button
          onClick={togglSortByCountry}
          className="bg-slate-700 border-blue-900 border-2">
          {Sorting === SortBy.COUNTRY ? 'No ordenar por País' : 'Ordenar por País'}
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-700 border-blue-900 border-2">
          Resetear Estado
        </button>
        <input
          type="text"
          placeholder="Filtrar por país"
          onChange={inputFilterCountry}
          className="bg-slate-700 border-blue-900 border-2 px-4 rounded-xl"
        />
      </header>
      <main>
        <UserList
          users={sortedUsers}
          showColors={ShowColors}
          deleteUser={handleDelete}
          changeSorting = {handleChangeSort}
        />
      </main>
    </section>
  )
}

export default App
