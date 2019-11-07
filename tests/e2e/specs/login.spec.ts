import { dt } from '../dt'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should show a login dialog when it wasn\'t login.', () => {
    cy.get(dt.loginDialog).should('be.visible')
  })

  it('Should login when inputtin the correct email and password.', () => {
    const email = 'test@gmail.com'
    const password = '123qwe'

    cy.get(dt.loginDialog).within(() => {
      cy.get('input[autocomplete=username]').type(email)
      cy.get('input[autocomplete=current-password]').type(password)
      cy.get(dt.loginSubmit).should('not.disabled').click()
    })
  })
})
