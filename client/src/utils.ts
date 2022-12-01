
type Token = {
    accessToken: string
}

type UserData = {
    id: string,
    email: string,
    username: string,
    photo: string
}

export function getUser(): UserData | null{
    const token: Token = JSON.parse(localStorage.getItem('userData') || "null")
    if (!token) return null
    const jwt = (token.accessToken)
    const parsedToken: UserData = JSON.parse(atob(jwt.split('.')[1]))
    return parsedToken
}