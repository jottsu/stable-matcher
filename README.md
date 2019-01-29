# stable-matcher
A Library to realize stable matching by running Deferred Acceptance Algorithm.

## Installation

```
$ npm install --save stable-matcher
```

## Usage
### One-to-one mode

```javascript
const Matcher = require('stable-matcher').Matcher;

const proposers = [
  {
    "id": 1,
    "preference": [4, 5, 7]
  },
  {
    "id": 2,
    "preference": [5, 6, 4]
  },
  {
    "id": 3,
    "preference": [4, 7]
  }
];

const accepters = [
  {
    "id": 4,
    "preference": [3, 2, 1]
  },
  {
    "id": 5,
    "preference": [3, 1, 2]
  },
  {
    "id": 6,
    "preference": [3, 1]
  },
  {
    "id": 7,
    "preference": [1, 2]
  }
];

const matcher = new Matcher(proposers, accepters, false);
const result = matcher.run();
console.log(result);
```

and you can see the result

```
[ { proposerId: 3, accepterId: 4 },
  { proposerId: 1, accepterId: 5 } ]
```

### One-to-many mode

```javascript
const Matcher = require('stable-matcher').Matcher;

const proposers = [
  {
    "id": 1,
    "preference": [8, 9]
  },
  {
    "id": 2,
    "preference": [9, 8]
  },
  {
    "id": 3,
    "preference": [8]
  },
  {
    "id": 4,
    "preference": [8]
  },
  {
    "id": 5,
    "preference": [8, 9]
  },
  {
    "id": 6,
    "preference": [9, 8]
  },
  {
    "id": 7,
    "preference": []
  }
];

const accepters = [
  {
    "id": 8,
    "preference": [3, 2, 6, 4, 5],
    "capacity": 2
  },
  {
    "id": 9,
    "preference": [3, 1, 6, 5, 7, 4],
    "capacity": 2
  }
];

const matcher = new Matcher(proposers, accepters, true);
const result = matcher.run();
console.log(result);
```

and you can see the result

```
[ { proposerIdList: [ 3, 2 ], accepterId: 8 },
  { proposerIdList: [ 1, 6 ], accepterId: 9 } ]
```

## License
stable-matcher is released under the [MIT license](https://github.com/jottsu/stable-matcher/blob/master/LICENSE).
