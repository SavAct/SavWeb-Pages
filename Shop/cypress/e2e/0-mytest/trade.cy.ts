describe('trade', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes buy item by url', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('main.q-page input[aria-label="Category"]').should('be.visible').wait(1000).click()
      cy.get('div').contains('Jewelry').should('be.visible').click()
      cy.get('i.q-icon').contains('search').click()
      cy.get('main.q-page div.q-card').first().click()
      cy.get('main.q-page div.q-chip__content').contains('World Wide').click()
      cy.get('main.q-page div').contains('Accept payments of').next().click()
      cy.get('main.q-page div').contains('Buy').click()
    })
    // Change savweb browser url  
    // cy.wait(200).get('input[type="text"]').should('be.visible').clear().invoke('val', '#test@savweb:file/index/!index.html/buy?id=0&category=792915009393917952&to=ww&pcs=').type('1').type('{enter}')
    
    cy.iframe().within(() => {  
      // .contains('Buy')
      cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
      // Open account card
      cy.get('main.q-page div.q-item.q-item--clickable').first().click()
      // Select network
      // cy.get('main.q-page div.q-item.q-item--clickable').next().find('div').contains('arrow_drop_down').click().type('l{enter}').wait(200)
      // Enter account name
      cy.get('main.q-page div.q-item.q-item--clickable').next().find('input[type="text"]').first().type('savact{enter}').wait(2000)
      // Enter address
      cy.get('main.q-page div.q-item.q-item--clickable').eq(1).click()
      cy.get('main.q-page input[type="text"]').eq(1).type('Sav')
      cy.get('main.q-page input[type="text"]').eq(3).type('Act')
      cy.get('main.q-page input[type="text"]').eq(4).type('Sun street 12')
      cy.get('main.q-page input[type="text"]').eq(6).type('Crater')
      cy.get('main.q-page input[type="text"]').eq(7).type('Front side')
      cy.get('main.q-page input[type="text"]').eq(8).type('12345')
      cy.get('main.q-page input[type="text"]').eq(9).type('With onions, please')
      cy.get('main.q-page div').contains('Country').parent().parent().parent().find('i.q-icon.q-select__dropdown-icon').click()
      cy.get('div').contains('United').should('be.visible').click()

      // Continue
      cy.get('main.q-page button').contains('Continue').click()

      // Contact step
      cy.get('main.q-page textarea[aria-label]').invoke('val').as('encBuyData').then((text) => {
        expect(text).to.not.be.empty;
      });
      cy.get('main.q-page i.q-icon.q-select__dropdown-icon').first().click().type('{downArrow}{downArrow}{enter}')
      // Continue
      cy.get('main.q-page span').contains('Got a response').click()

      // Seller confirmed
      cy.get('main.q-page div.q-checkbox__inner').click()
      // Send payment
      cy.get('main.q-page span').contains('Send Payment').click()
    })

    // Create eosio key
    cy.get('main.q-page div.q-checkbox').first().next().find('button').should('be.visible').click()
    cy.get('.q-dialog div.q-checkbox').first().should('be.visible').click()
    cy.get('.q-dialog i.q-icon').contains('rotate_left').should('be.visible').click()
    cy.get('.q-dialog .q-card__actions button').first().should('be.visible').click()

    // Set to already paid
    cy.get('main.q-page button.q-btn--dense span.q-btn__content').contains('rans').should('be.visible').last().click()

    cy.iframe().within(() => {  
      cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
      cy.get('div.q-notification__message').contains('Looks fine. Now continue to inform the seller.').should('exist').should('be.visible')
      cy.get('span').contains('Continue').should('be.visible').click()
      cy.get('span').contains('Informing is done').should('exist').should('be.visible').click()
    })
  })

  // it('passes buy item by url with pgp key', () => {  
  //   // Wait for loading page
  //   cy.iframe().within(() => {  
  //     cy.get('div#q-app').should('be.visible').parent().should('be.visible')
  //     cy.get('main.q-page input[aria-label="Category"]').should('be.visible').wait(500).click().type('{downArrow}{downArrow}{enter}')
  //     cy.get('main.q-page div.q-card').first().click()
  //     cy.get('main.q-page div.q-chip__content').contains('World Wide').click()
  //     cy.get('main.q-page div').contains('Accept payments of').next().click()
  //     cy.get('main.q-page div').contains('Buy').click()
  //   })
  //   // Change savweb browser url  
  //   // cy.wait(200).get('input[type="text"]').should('be.visible').clear().invoke('val', '#test@savweb:file/index/!index.html/buy?id=0&category=792915009393917952&to=ww&pcs=').type('1').type('{enter}')
    
  //   cy.iframe().within(() => {  
  //     // .contains('Buy')
  //     cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
  //     // Open account card
  //     cy.get('main.q-page div.q-item.q-item--clickable').first().click()
  //     // Select network
  //     // cy.get('main.q-page div.q-item.q-item--clickable').next().find('div').contains('arrow_drop_down').click().type('l{enter}').wait(200)
  //     // Enter account name
  //     cy.get('main.q-page div.q-item.q-item--clickable').next().find('input[type="text"]').first().type('savact{enter}').wait(2000)
  //     // Enter public key
  //     cy.get('main.q-page textarea[aria-label="Public PGP Key"]').clear().invoke('val', publicKey_buyer).type('{enter}')
  //     // Enter address
  //     cy.get('main.q-page div.q-item.q-item--clickable').eq(2).click()
  //     cy.get('main.q-page input[type="text"]').eq(1).type('Sav')
  //     cy.get('main.q-page input[type="text"]').eq(3).type('Act')
  //     cy.get('main.q-page input[type="text"]').eq(4).type('Sun street 12')
  //     cy.get('main.q-page input[type="text"]').eq(6).type('Crater')
  //     cy.get('main.q-page input[type="text"]').eq(7).type('Front side')
  //     cy.get('main.q-page input[type="text"]').eq(8).type('12345')
  //     cy.get('main.q-page input[type="text"]').eq(9).type('With onions, please')
  //     cy.get('main.q-page div').contains('Country').parent().parent().parent().find('i.q-icon.q-select__dropdown-icon').click().type('{downArrow}{downArrow}{enter}')
  //     // Continue
  //     cy.get('main.q-page button').contains('Continue').click()

  //     // Contact step
  //     cy.get('main.q-page textarea[aria-label="Encrypted data"]').invoke('val').as('encBuyData').then((text) => {
  //       expect(text).to.not.be.empty;
  //     });
  //     cy.get('main.q-page i.q-icon.q-select__dropdown-icon').first().click().type('{downArrow}{downArrow}{enter}')
  //     // Continue
  //     cy.get('main.q-page span').contains('Got a response').click()

  //     // Go to message
  //     cy.get('i.q-icon').contains('drafts').click()
  //     cy.get('main.q-page textarea[aria-label="Customer message"]').clear().invoke('val', initialBuyMessage).type('{enter}')
  //     cy.get('main.q-page button.q-btn.q-btn--standard').click()
  //     cy.get('div[role="dialog"]').should('be.visible').find('input[type="password"]').clear()
  //     cy.get('div[role="dialog"]').find('textarea[aria-label="Private PGP Key"]').clear().invoke('val', privateKey_UserTwo).type('{enter}')
  //     cy.get('div[role="dialog"]').find('span').contains('Use this key').click()

  //   })
  // })
})

// Example keys for testing

const privateKey_UserTwo = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEZuRcghYJKwYBBAHaRw8BAQdAbag0y5jbyY/MsAg7RL7w0Lrb2GsoLNe4
nEwCKwi4naIAAP9Uf0djoKJg9j3Oy1QzoSJetbrEjelteH+6N1u2kvyaLBH1
zQDCjAQQFgoAPgWCZuRcggQLCQcICZDjEvyDhXozygMVCAoEFgACAQIZAQKb
AwIeARYhBFujRWJkAbnvnGiJCuMS/IOFejPKAAAJiAD/X2u5eQmpubei1lUf
A/M04omTbs74fvgED6XT4IAHVWABAPJFWOkyVf1/B52xyBmoo3C/axMyyUTU
nV30QeIywbIOx10EZuRcghIKKwYBBAGXVQEFAQEHQFEHyPjE3pf4KZzQ3I9q
BtIVV2DAQhN8WgGqPeZwarMOAwEIBwAA/0H34mdg/WvKsUFPdtC4zVR/CdQL
r9rtFqdLq+TzG+xgE0DCeAQYFgoAKgWCZuRcggmQ4xL8g4V6M8oCmwwWIQRb
o0ViZAG575xoiQrjEvyDhXozygAA5zQBAIQ2YEQY5YLwX6ARRUryiZZfLeA9
6DtKIO6xUfpvuXkAAP4uEWy+l655YJkDL6ICMRhwgqTuOW7R5pakaJnljPfo
AA==
=OShx
-----END PGP PRIVATE KEY BLOCK-----
`;

const publicKey_UserTwo = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZuRcghYJKwYBBAHaRw8BAQdAbag0y5jbyY/MsAg7RL7w0Lrb2GsoLNe4
nEwCKwi4naLNAMKMBBAWCgA+BYJm5FyCBAsJBwgJkOMS/IOFejPKAxUICgQW
AAIBAhkBApsDAh4BFiEEW6NFYmQBue+caIkK4xL8g4V6M8oAAAmIAP9fa7l5
Cam5t6LWVR8D8zTiiZNuzvh++AQPpdPggAdVYAEA8kVY6TJV/X8HnbHIGaij
cL9rEzLJRNSdXfRB4jLBsg7OOARm5FyCEgorBgEEAZdVAQUBAQdAUQfI+MTe
l/gpnNDcj2oG0hVXYMBCE3xaAao95nBqsw4DAQgHwngEGBYKACoFgmbkXIIJ
kOMS/IOFejPKApsMFiEEW6NFYmQBue+caIkK4xL8g4V6M8oAAOc0AQCENmBE
GOWC8F+gEUVK8omWXy3gPeg7SiDusVH6b7l5AAD+LhFsvpeueWCZAy+iAjEY
cIKk7jlu0eaWpGiZ5Yz36AA=
=/FM8
-----END PGP PUBLIC KEY BLOCK-----
`

const privateKey_buyer = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEZuQs9hYJKwYBBAHaRw8BAQdAXHSCx99jYB+NiVwd/34p6juZHZCV7SKm
4Fi7sMLUdUAAAP4ukyUtEo8S8o7d8tpMnZawfmriZQgj3ZAR/RdfUfjhgBER
zQDCjAQQFgoAPgWCZuQs9gQLCQcICZBEHjhhOBBBqgMVCAoEFgACAQIZAQKb
AwIeARYhBNGKIPAWN/JSh3Eg/kQeOGE4EEGqAACMuwEA+qHdPeuVDHmnEb86
i9fslVgH+12XB9GOEoDaIGic6N8BAP6Ht8Tp4OmKd3PL/Vel3ZjvsNeXtPy8
hfgJJw7tIvgAx10EZuQs9hIKKwYBBAGXVQEFAQEHQJpjv5A46DjcdS9Oj/9M
Bx5Zb7JszSYAFJFHkRO6I8gIAwEIBwAA/16gDKFpy0bI5SkzHgxnZFo0GhDS
abvbyOzqRP8EbK1oEBHCeAQYFgoAKgWCZuQs9gmQRB44YTgQQaoCmwwWIQTR
iiDwFjfyUodxIP5EHjhhOBBBqgAAur8A/3wiRjBGYrc+r+hPTaKSoV1GczN8
Iu/qo9/TVS/JWXB2AP0VWFr9jpLpzq9h1kkPiY1vKISbEbetmFUBzK3RBtOV
BQ==
=aah9
-----END PGP PRIVATE KEY BLOCK-----
`

const publicKey_buyer = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZuQs9hYJKwYBBAHaRw8BAQdAXHSCx99jYB+NiVwd/34p6juZHZCV7SKm
4Fi7sMLUdUDNAMKMBBAWCgA+BYJm5Cz2BAsJBwgJkEQeOGE4EEGqAxUICgQW
AAIBAhkBApsDAh4BFiEE0Yog8BY38lKHcSD+RB44YTgQQaoAAIy7AQD6od09
65UMeacRvzqL1+yVWAf7XZcH0Y4SgNogaJzo3wEA/oe3xOng6Yp3c8v9V6Xd
mO+w15e0/LyF+AknDu0i+ADOOARm5Cz2EgorBgEEAZdVAQUBAQdAmmO/kDjo
ONx1L06P/0wHHllvsmzNJgAUkUeRE7ojyAgDAQgHwngEGBYKACoFgmbkLPYJ
kEQeOGE4EEGqApsMFiEE0Yog8BY38lKHcSD+RB44YTgQQaoAALq/AP98IkYw
RmK3Pq/oT02ikqFdRnMzfCLv6qPf01UvyVlwdgD9FVha/Y6S6c6vYdZJD4mN
byiEmxG3rZhVAcyt0QbTlQU=
=4bpu
-----END PGP PUBLIC KEY BLOCK-----
`

const initialBuyMessage = "-----BEGIN PGP MESSAGE-----\n\nwV4Dj2yg8mHlgU8SAQdAxByHNYnOcudCnXtETuVXRfEiDA9Kf/ih4VgSR1CY\n7hgwucat6GG4rGry4z/UQgmbFOCMFbRO+4MYgs2HbwV6G9tqW/I7j2ideH7k\nZXwD63iBwV4D3rRBjh+aAmMSAQdA7NYqcVHhsXY0KFho1k8frHfm0f+VzlyU\n2IW5kINBzj8wA4I5d/V/PqdHCEeQC+oD8iEaHk4RTOsr1tmBWu4BlTRToD2w\nUmyZoE/9a/8SBb+J0sO7AQkIBdJ2h+J+tMFSqu5uqYJwqpDVBK+PE5T+1FT2\nPZbuM3RJYiIcO953QAPSmQYjinNh9UxIUNfb8hq0i12Ajmjg4rpWp2iSirA7\nkVYUpv3viDN6AXgS/D4HS6FwIMhX+/rTew7QXG+tbnf4A+M1jlqqJBuu/XKJ\nNHjAxL2gvTfKMIRvJt5AANOTJqmOIOQR1c1FgveuxYddmXu4bq/o5P8Lw2YQ\nZPNxKozi3GZ0pgrHBCfPSQDEiv6fy1/kR2cbtPCE3Ss4RQ3RhLSR8v2h8xcz\ngN+l9SCsHt0xU9ZJEufV8h75U3tfiMohRsrvWcbgMfM0qgSUVvENv2+IY6j3\ndn8Vz/U2s3kdbHdOnzPt7VCMPPhAsIXVaVCnSRMxWoJS2MeHBi90K1l/oAuX\nd6hCrUZvX0dMsdbaNUyEu3lA/I5aWXj5ez1Cht4a5cIaWYqKBakAVXWT26Yb\nrCuDzZKotC7k91KlGMHATiL7/E+eS/UPaxtHjHqrmzZFZRrNo5WLFul2SIid\nSAgxPewfxy26moJEoNp8Y5MxkusqfB98OQd4NCIzpYjebq9CogkLRgl/WD/C\nlFQY61LhjB6vrcxuqhaApmuf3NU4UiY1Cxdi4alj9ADOvio9QfJ193Owlk4I\n6te10CTRlK3C0veYjgnnzGMl7X4QcHLrIlQFxMACDuncBppFSpYsfQJ56ip+\nbPflCzXFcV+hKs4QmxBGfw4g2f0jO5IyAABYTEj3AY49zSNh4sIeGA5zHUyH\nYdA8DXbkfZgQfcG7pJI0K5yQb8z800VnujOvKBWR7aOBi8Wm7jq1prr2Ga6O\n8Xz42zqA7bP/t+TEylLdGViDlw0NXy47jWxwiNOi9MwklK1BmmlG+Poxd9L0\n1rH4FtLq6AjmI1V7LG651mojggwVElc3moH82RJiJ+8xkkULA1uNnFxv/plT\nkXlfKSil/BOKodudkeyePtTecerX3xxXS0t9eCDwbDDq7jJrktY6d/3mM42d\nre8nJMUArg7LNMZ8MPBVd6VyRIHzVHYlm0Rrlv8ZDMU8I3mrUmivipclNZVG\nkXdCBSzYc6UmTN7S4+cN4632P1j+7sPxjT5d7DzND1B3GDRN4b6wedGlWu/u\nu1fDm7BDPtVljKjOkFideO/HcRQ7juH4DVIOrXteb2uPBjihD4M3OWgW9LXo\n+dJb6UvshCXazhBD4yMUMofd4qyutFgZEZXH7upAqC5uHjvRn5rR0e07Oslt\n3SgpWQz5qv+piBwmB4ekfWF/0RoNPtNldrWISf/BxCY9wVDRsW4RzYGzOUlw\neqKKxbZDoXi5rCVV3YQH9Rxq5KzdpWs/ob24d8yGO6YsV/6HLAmqJe9VL6zs\nSiEr63kuzoSqyQ8clwp2CNTZH4dl+9mO6aJDH7U1PuyEBBopqG6PvnIyY30E\nzkZlTgEykAwvdLmKywqtGfaoI3OwJ6qCQUZmvslhYnyHmKGrns3QW89KjmUE\nfqUbma73m5KrePFuS/NhzVR83d18xNH5xxe7jtnlgwjPdsOMwg==\n=gUlS\n-----END PGP MESSAGE-----\n";