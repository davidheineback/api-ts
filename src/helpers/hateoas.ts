export type Links = {
  self?: boolean,
  register?: boolean,
  login?: boolean,
  logout?: boolean
}

export type Self = {
  url: string
  method: string
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
    link: `${self}/logout`,
    description: 'Logout user.',
    bodyTemplate: {
      refresh_token: 'string',
    }
  },
  {
    name: 'logout-all',
    method: 'DELETE',
    link: `${self}/logout-all`,
    description: 'Logout all users active sessions.',
    bodyTemplate: {
      username: 'string',
      refresh_token: 'string',
    }
  }
]
return links
}


export function getAssociatedLinks (self: Self, linkSelection: Links) {
  return setUpLinks(self.url).filter(link => Object.keys(linkSelection).includes(link.name) && (linkSelection as any)[link.name])
}
