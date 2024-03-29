import slugify from "slugify"

export function validateStringLongEnough(inputName: string, inputValue: string, minLength: number) {
  if (!(minLength > 0)) {
    throw new Error('minLength should be a positive number')
  }
  if (inputValue.length < minLength) {
    return inputName + ' should be at least ' + minLength + ' characters long'
  }
  return ''
}

export function validateStringNotDuplicate(inputValue: string, previousInputs: string[]) {
  if (previousInputs.indexOf(inputValue) === -1) {
    return ''
  }
  return inputValue + ' is already in use'
}

export function validateStringSlugified(inputName: string, inputValue: string) {
  const slugifiedInput = slugify(inputValue, { lower: true, strict: true })
  if (slugifiedInput === inputValue) {
    return ''
  }
  return inputName + ' contains illegal characters'
}
