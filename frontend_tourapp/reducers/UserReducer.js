export const initialUserState = {
  id: null,
}

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, id: action.payload.id }
    case 'LOGOUT':
      return null
  }
  return state
}

export default UserReducer
