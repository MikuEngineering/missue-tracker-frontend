function getMinLengthValidator (length: number) {
  return (input: string) => input.length >= length
}

function getMaxLengthValidator (length: number) {
  return (input: string) => input.length <= length
}

function onlyNumbersAndAlphabets (input: string) {
  return /^[0-9a-zA-Z]*$/.test(input)
}

function validateUsername (input: string) {
  const failures: ValidationFailure[] = []
  const min = getMinLengthValidator(8)
  const max = getMaxLengthValidator(30)
  if (!min(input)) {
    failures.push({
      field: 'username',
      message: 'The length of username should be greater than or equal to 8.'
    })
  }
  if (!max(input)) {
    failures.push({
      field: 'username',
      message: 'The length of username should be less than or equal to 30.'
    })
  }
  if (!onlyNumbersAndAlphabets(input)) {
    failures.push({
      field: 'username',
      message: 'Username should only contain numbers and alphabets'
    })
  }
  return failures
}

function validatePassword (input: string) {
  const failures: ValidationFailure[] = []
  const min = getMinLengthValidator(8)
  if (!min(input)) {
    failures.push({
      field: 'password',
      message: 'The length of password should be greater than or equal to 8.'
    })
  }
  return failures
}

function validatePasswordConfirm (password: string, input: string) {
  const failures: ValidationFailure[] = []
  if (password !== input) {
    failures.push({
      field: 'passwordConfirm',
      message: 'The confirmation password is not eqaul to password.'
    })
  }
  return failures
}

export interface ValidationFailure {
  field: string,
  message: string
}

export function validateLoginForm (params: { username: string, password: string }) {
  const { username, password } = params
  const failures: ValidationFailure[] = [
    ...validateUsername(username),
    ...validatePassword(password)
  ]
  return failures
}

export function validateRegisterForm (params: { username: string, password: string, passwordConfirm: string }) {
  const { username, password, passwordConfirm } = params
  const failures: ValidationFailure[] = [
    ...validateUsername(username),
    ...validatePassword(password),
    ...validatePasswordConfirm(password, passwordConfirm)
  ]
  return failures
}
