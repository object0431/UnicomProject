import Cookies from 'js-cookie'

const TokenKey = 'Complaints-Token'
const tmpTokenKey = 'TMP-Complaints-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTmpToken() {
  return Cookies.get(tmpTokenKey)
}

export function setTmpToken(token) {
  return Cookies.set(tmpTokenKey, token)
}

export function removeTmpToken() {
  return Cookies.remove(tmpTokenKey)
}
