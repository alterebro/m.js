# m.js

- **Minimalistic 1kb library to prototype Single Page Applications as fast as lightning**
- Demo and docs :  **[https://alterebro.github.io/m.js/](https://alterebro.github.io/m.js/#/)**

**m.js** (m as in mini, micro, minimal...) is a 1Kb, zero dependencies, minimalistic library to create single page applications and simple web prototypes as fast as lightning.

The small **m.js** library has got three utilities : a request handler to create AJAX calls, a simple hash router and a micro template system. Its simplicity and small size makes **m.js** a perfect starting point to create a web prototype or SPA very quickly.

### Quick Example:

#### — HTML

```html
<a href="#/">home</a>
<a href="#/about">about</a>
<a href="#/user/michael">user:michael</a>
```

#### — JSON ( sample.json )

```javascript
{
  "home" : "this is home",
  "about" : "about data",
  "user" : "user string"
}
```

#### — JavaScript

```javascript
m.req('sample.json', function(data) {
  var tpl = m.tpl('<%= val %>');
  var router = m.run({
    '/': function() {
      console.log( tpl({val: data.home}) );
    },
    '/about': function() {
      console.log( tpl({val: data.about}) );
    },
    '/user/:user': function(user) {
      console.log( tpl({val: data.user + ', user: ' +user}) );
    }
  });
  router.start();
});
```

---

## Template

Underscore-like micro template system [http://underscorejs.org/#template](http://underscorejs.org/#template)

```javascript
// Pre-rendering template
var tpl = m.tpl('<%= val %>');
console.log( tpl({val: 'test'}) );

// or passing directly the data:
var tpl = m.tpl('<%= val %>', {val: 'test'});
console.log( tpl );
```

## Router

Hash router using router rules like backbone [http://backbonejs.org/#Router-routes](http://backbonejs.org/#Router-routes)

```javascript
var router = m.run({
  '/': function() {
    console.log('index / home route');
  },
  '/users/:user': function(id) {
    console.log('users route, user is ' + id)
  },
  '/file/*path': function(path) {
    console.log('file route, file path is ' + path)
  }
});

router.start()
```

## Request

```javascript
m.req('data.json', function(data) {
  console.log( data );
});
```

---
