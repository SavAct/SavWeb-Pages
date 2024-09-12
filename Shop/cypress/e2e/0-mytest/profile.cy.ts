describe('main menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#test@savweb:file/index/!index.html')
  })
  it('passes update profile', async () => {
    cy.iframe().within(() => {
      // find element called aside
      cy.get('#immortal-shop').find('button').contains('menu').click().click()
      cy.get('#immortal-shop').find('aside').should('be.visible')
      cy.get('#immortal-shop').find('aside').contains('Profile').click()

      // Load account
      cy.get('#immortal-shop').find('button').contains('keyboard_arrow_down').click()
      cy.get('#immortal-shop').find('input[type="text"]').first().type('user.two')
      cy.get('#immortal-shop').find('span').contains('send').click()
      cy.get('#immortal-shop').get('div.q-notification.q-notification--standard.bg-positive').should('be.visible')

      // Create new key pair
      cy.get('#immortal-shop').find('span').contains('Create new key').click() 
      cy.get('div[role="dialog"]').should('be.visible').find('span').contains('Generate new key').click() 
      cy.get('div[role="dialog"]').find('div.q-checkbox').should('be.visible').click()
      cy.get('div[role="dialog"]').find('span').contains('content_copy').click()
      cy.get('div[role="dialog"]').find('span').contains('Use this key').click()
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').should('be.visible')
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').next().invoke('text').should('not.be.empty')
    });
  })
})