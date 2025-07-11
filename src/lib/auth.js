import jwt from 'jsonwebtoken'

export async function getUserDetail(){
    let access_token = localStorage.getItem('access_token')
    console.log(access_token)

    let user = jwt.decode(access_token)
    return user
}
