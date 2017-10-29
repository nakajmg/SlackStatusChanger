function APIError({ok, error, needed, provided}) {
  this.name = error
  this.message = ''
  switch(error) {
    case 'missing_scope':
      this.message = `Add scopes: ${needed}`
      break
    case 'invalid_auth':
      this.message = 'This token is invalid'
      break
    case 'token_revoked':
      this.message = 'This token is revoked'
      break
    case 'not_authed':
      this.message = 'Please input your token'
      break
  }
}

APIError.prototype = Error.prototype
APIError.prototype.constructor = APIError

module.exports =  APIError
