export function validateStringLongEnough(inputName: string, inputValue: string, minLength: number) {
  if (!(minLength > 0)) {
    throw new Error('minLength should be a positive number')
  }
  if (inputValue.length < minLength) {
    return inputName + ' should be at least ' + minLength + ' characters long'
  }
  return ''
}
