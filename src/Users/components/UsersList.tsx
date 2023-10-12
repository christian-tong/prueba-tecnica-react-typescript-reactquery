import { SortBy, type User } from '../../types.d'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (email: string) => void
  changeSorting: (sort: SortBy) => void
}

function UsersList ({ users, showColors, deleteUser, changeSorting }: Props) {
  return (
    <table className='table-fixed w-full'>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='cursor-pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre</th>
          <th className='cursor-pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Apellido</th>
          <th className='cursor-pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const backgroudColor = 'odd:bg-gray-700 even:bg-gray-800'
          const color = showColors ? backgroudColor : 'opacity-100'
          return (
            <tr key={user.email} className={`text-center ${color} `}>
              <td className="flex justify-center">
                <img src={user.picture.thumbnail} alt="" />
              </td>
              <td >{user.name.first}</td>
              <td >{user.name.last}</td>
              <td >{user.location.country}</td>
              <td >
                <button onClick={() => { deleteUser(user.email) } }>Borrar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default UsersList
