### Documentation:

**entry: https://ts-api-du222aa.herokuapp.com/api**

| URI                   | name   | method | description | Authentication |
| --------------------- | ------ | ------ |  ----------- | --------------- |
| {entry} | Entry point  | GET   | Entry point get main routes in response.| N/A |
| {entry}/auth | Entry to Authentication | GET   | Describes the available Authentication routes.| N/A |
| {entry}/auth/register | register  | POST   | Register a new user.| N/A |
| {entry}/auth/login    | login  | POST   | Login in a excisting user. | N/A            |
| {entry}/auth/logout   | logout | DELETE | Logout in a excisting user. | Bearer <Token> |
| {entry}/auth/refresh  | refresh    | GET    | Get a new accesstoken from refreshtoken.| Bearer <Token> |
| {entry}/items/        | get all items | GET    | Get all items for authenticated user.| Bearer <Token> |
| {entry}/items/:id     | get specific item  | GET    | Get all items for authenticated user. | Bearer <Token> |
| {entry}/items/        | create item | POST   | Create a new item.| Bearer <Token> |
| {entry}/items/:id     | change item | PUT    | Change a existing item. | Bearer <Token> |
| {entry}/items/:id     | delete item | DELETE | Delete a existing item.| Bearer <Token> |
| {entry}/webhook       | create webhook subscribtion | POST   | Subscribe to a webhook. Supported events: new successful login for user. | Bearer <Token>  |
