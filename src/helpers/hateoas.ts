export type Links = {
  self?: boolean
  register?: boolean
  login?: boolean
  logout?: boolean
  refresh?: boolean
  getItems?: boolean
  getItem?: boolean
  addItem?: boolean
  changeItem?: boolean
  deleteItem?: boolean
  postWebhook?: boolean
  getAuction?: boolean
  postAuction?: boolean
  getAuctionID?: boolean
  deleteAuctionID?: boolean
  postauctionIDBid?: boolean
}

export type Self = {
  url: string
  method: string
}



export function createSelf(url: string, method: string) {

  if (url.substring(url.length-1) === '/') {
    url = url.substring(0, url.length-1)
  }

  const self: Self =  {
    url,
    method
  } 
  return self
}



function setUpLinks(self: string) {
  const links = [ 
  {
    name: 'register',
    method: 'POST',
    link: `${self}/register`,
    description: 'Register a new user.',
    bodyTemplate: {
      firstName: 'string',
      lastName: 'string',
      username: 'string',
      password: 'string'
    }
  },
  {
    name: 'login',
    method: 'POST',
    link: `${self}/login`,
    description: 'Login in a excisting user.',
    bodyTemplate: {
      username: 'string',
      password: 'string'
    }
  },
  {
    name: 'logout',
    method: 'DELETE',
    authentication: 'Bearer <Token>',
    link: `${self}/logout`,
    description: 'Logout user.'
  },
  {
    name: 'refresh',
    method: 'GET',
    authentication: 'Bearer <Token>',
    link: `${self}/refresh`,
    description: 'Get a new accesstoken from refreshtoken'
  },
  {
    name: 'getItems',
    method: 'GET',
    authentication: 'Bearer <Token>',
    link: `${self}/items`,
    description: 'Get all items for authenticated user.'
  },
  {
    name: 'getItem',
    method: 'GET',
    authentication: 'Bearer <Token>',
    link: `${self}/items/:id`,
    description: 'Get specified item for authenticated user.'
  },
  {
    name: 'addItem',
    method: 'POST',
    authentication: 'Bearer <Token>',
    link: `${self}/items`,
    description: 'Create a new item.',
    bodyTemplate: {
      name: 'string',
      images: 'Array<"img-src">',
      description: 'string'
    }
  },
  {
    name: 'changeItem',
    method: 'PUT',
    authentication: 'Bearer <Token>',
    link: `${self}/items/:id`,
    description: 'Change a existing item.',
    bodyTemplate: {
      name: 'string',
      images: 'Array<"img-src">',
      description: 'string'
    }
  },
  {
    name: 'deleteItem',
    method: 'DELETE',
    authentication: 'Bearer <Token>',
    link: `${self}/items/:id`,
    description: 'Delete a existing item.',
    bodyTemplate: {
      name: 'string',
      images: 'Array<"img-src">',
      description: 'string'
    }
  },
  {
    name: 'webhook',
    method: 'POST',
    authentication: 'Bearer <Token>',
    link: `${self}/webhook/`,
    description: 'Subscribe to a webhook. \nSupported events: new successful login for user.',
    bodyTemplate: {
      url: 'string',
      events: {
        'event': 'boolean'
      },
      secret: 'string'
    }
  }
  

]
return links
}


export function getAssociatedLinks (self: Self, linkSelection: Links) {
  const links: Array<{[key: string]: any}> = setUpLinks(self.url)
  .filter(link => Object.keys(linkSelection).includes(link.name) && (linkSelection as any)[link.name])
  links.map((link, index) => {
    if (link.link === self.url && link.method === self.method) {
      links[index] = {...link, self: true}
    } 
  })
  return links
}
