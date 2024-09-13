describe('profile', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#test@savweb:file/index/!index.html')
  })
  it('passes update profile', () => {    
    cy.iframe().within(() => {
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')

      // find element called aside
      cy.get('#immortal-shop').find('button').contains('menu').click().click()
      cy.get('#immortal-shop').find('aside').should('be.visible')
      cy.get('#immortal-shop').find('aside').contains('Profile').click()

      // Load account
      cy.get('#immortal-shop').find('button').contains('keyboard_arrow_down').click()
      cy.get('#immortal-shop').find('textarea[aria-label="Public PGP Key"]').should((t) => {
        expect(t.val()).be.empty;
      });
      cy.get('#immortal-shop').find('input[type="text"]').first().type('user.two')
      cy.get('#immortal-shop').find('span').contains('send').click()
      cy.get('#immortal-shop').get('div.q-notification.q-notification--standard.bg-positive').should('be.visible')

      // Check loaded key and store it for later use
      cy.get('#immortal-shop').find('textarea[aria-label="Public PGP Key"]').invoke('val').as('pupKey').then((text) => {
        expect(text).to.not.be.empty;
      });
      // cy.get('@pupKey').then((pupKey) => {
      //   cy.log(typeof pupKey === 'string' ? pupKey : 'empty ' + typeof pupKey);        
      // });
    });

    // Check if key is valid
    cy.get('div[role="dialog"]').should('exist').should('be.visible').find('div').contains('Sign transaction on chain lamington').should('be.visible')
    cy.get('div[role="dialog"]').find('span').contains('OK').click()
    cy.get('div.q-notification.q-notification--standard.bg-negative').should('be.visible')
    cy.get('div.q-notification.q-notification--standard.bg-negative').contains('No user is logged in').should('be.visible')

    cy.iframe().within(() => {
      // Create new key pair
      cy.get('#immortal-shop').find('span').contains('Create new key').click() 
      cy.get('div[role="dialog"]').should('be.visible').find('span').contains('Generate new key').click() 
      cy.get('div[role="dialog"]').find('div.q-checkbox').should('be.visible').click()
      cy.get('div[role="dialog"]').find('span').contains('content_copy').click()
      cy.get('div[role="dialog"]').find('span').contains('Use this key').click()
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').should('be.visible')
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').next().invoke('text').should('not.be.empty')
      cy.get('#immortal-shop').find('span').contains('Upload user data').click()
    });
    cy.get('div[role="dialog"]').should('be.visible').find('div').contains('Sign transaction on chain lamington').should('be.visible')
    cy.get('div[role="dialog"]').find('span').contains('OK').click()
    cy.get('div.q-notification.q-notification--standard.bg-negative').should('be.visible')
    cy.get('div.q-notification.q-notification--standard.bg-negative').contains('No user is logged in').should('be.visible')
  })
})