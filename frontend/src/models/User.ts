export class User {
  id: string
  email: string
  validity: Date

  constructor(id: string, email: string, validity: number) {
    this.id = id
    this.email = email
    this.validity = new Date(validity * 1000)
  }
}
