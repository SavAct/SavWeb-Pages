describe('trade', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes buy item by url', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
    })
    // Change savweb browser url  
    cy.wait(200).get('input[type="text"]').should('be.visible').clear().invoke('val', '#test@savweb:file/index/!index.html/buy?id=0&category=792915009393917952&to=ww&pcs=').type('1').type('{enter}')
    
    cy.iframe().within(() => {  
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      // Open account card
      cy.get('main.q-page div.q-item.q-item--clickable').first().click()
      // Select network
      cy.get('main.q-page div.q-item.q-item--clickable').next().find('div').contains('arrow_drop_down').click().type('l{enter}').wait(200)
      // Enter account name
      cy.get('main.q-page div.q-item.q-item--clickable').next().find('input[type="text"]').first().type('user.zero{enter}')
      // Enter public key
      cy.get('main.q-page textarea[aria-label="Public PGP Key"]').clear().invoke('val', publicKey_buyer).type('{enter}{backspace}')
      // Enter address
      cy.get('main.q-page div.q-item.q-item--clickable').eq(2).click()
      cy.get('main.q-page input[type="text"]').eq(1).type('Sav')
      cy.get('main.q-page input[type="text"]').eq(3).type('Act')
      cy.get('main.q-page input[type="text"]').eq(4).type('Sun street 12')
      cy.get('main.q-page input[type="text"]').eq(6).type('Crater')
      cy.get('main.q-page input[type="text"]').eq(7).type('Front side')
      cy.get('main.q-page input[type="text"]').eq(8).type('12345')
      cy.get('main.q-page input[type="text"]').eq(9).type('With onions, please')
      cy.get('main.q-page div').contains('Country').parent().parent().parent().find('i.q-icon.q-select__dropdown-icon').click().type('{downArrow}{downArrow}{enter}')
      // Continue
      cy.get('main.q-page button').contains('Continue').click()
    })
  })
})

// Example keys for testing

const privateKey_UserTwo = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZuQYDRYJKwYBBAHaRw8BAQdA4iBNK5ndVMDmDcwxL/c87WgavtskjtrJ
tXt1+IDyXanNAMKMBBAWCgA+BYJm5BgNBAsJBwgJkERYA3HlmcygAxUICgQW
AAIBAhkBApsDAh4BFiEEg7EfkzvZsctn09MoRFgDceWZzKAAAIKuAP9oKcTW
SYQQrPOAv+LewUu+IyNZhY8E3lEJ95lvYjW+XgEAnXqi3rJyXQy4Z/RB6jE0
Me9zHuB+ZJ5pPUxHKFCmeAzOOARm5BgNEgorBgEEAZdVAQUBAQdAceAOTYKH
CbK9VLUGLRJzqU8bJGHoz5gQB2NCnI3+lTEDAQgHwngEGBYKACoFgmbkGA0J
kERYA3HlmcygApsMFiEEg7EfkzvZsctn09MoRFgDceWZzKAAAFdvAQDOiO5a
KEtfpbBRVFUZlzZmHir4cskG2yl1c2DL3CODiAEA9tnFZnNqETw4QkLyeRG+
ZqISBdAxWFTLfcJIGmaYkAg=
=mQPm
-----END PGP PUBLIC KEY BLOCK-----
`;

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