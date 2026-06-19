/* eslint-disable */
describe('CesiZEN - Vérification de la page d\'accueil', () => {
  
  it('Doit charger correctement le Backoffice de Staging', () => {
    cy.visit('https://cesizen-baptiste.switzerlandnorth.cloudapp.azure.com/staging')

    cy.contains(/connexion|se connecter|email/i).should('be.visible')
  })

  it('Doit afficher correctement les éléments du formulaire', () => {
    cy.visit('https://cesizen-baptiste.switzerlandnorth.cloudapp.azure.com/staging')
    
    cy.get('input[type="email"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})