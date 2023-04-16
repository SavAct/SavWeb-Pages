# SavAct Shop

Online shop that needs no central authority.
It relys on the SavAct fraud protection mechanism. For the communication between sellers and customers PGP encryption is implemented.

## Security

To prevent harmfull users from uploading too big images and therefore overwhelm visitors bandwidth, there is a custom component called `<pro-img>`. It accepts only images that are smaller than a predefined amount of bytes. Default is 512\*512 bytes. But some image hosts do not allow to load images via script, therefore this hosts can not be used.
