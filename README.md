## **Read Data**

Lookup data by key

- **URL**

  `/api/v1/data/:key`

- **Method:**

  `GET`

- **URL Params**

  `key`: The key used to put the value. This should be prefixed by some grouping that makes sense. Usually the origin and data type, e.g. `com.de314::USERS::abc123`

- **Sample Call:**

  ```
  curl http://localhost:3000/api/v1/data/com.de314::USERS::abc123`
  ```

## **Search with Key Prefix**

Lookup data using a key prefix, e.g. domain, or type.

- **URL**

  `/api/v1/data/search`

- **Method:**

  `GET`

- **Query Params**

  **Required:**

  `prefix=[string]`

  **Optional:**

  `cursor=[string]`, `limit=[integer: 25]`, `reverse=[boolean: false]`

- **Sample Call:**

  ```
  curl http://localhost:3000/api/v1/data/search?prefix=com.de314&limit=10`
  ```

## **Search by Key Range**

Lookup data using a key range, i.e. start and stop key.

- **URL**

  `/api/v1/data/search`

- **Method:**

  `GET`

- **Query Params**

  **Required:**

  `start=[string]`, `stop=[string]`

  **Optional:**

  `limit=[integer: 25]`, `reverse=[boolean: false]`

- **Sample Call:**

  ```
  curl http://localhost:3000/api/v1/data/search?start=A&stop=z&limit=10`
  ```

## **Write Data**

Saves data by key value.

- **URL**

  `/api/v1/data/:key`

- **Method:**

  `POST`

- **Headers**

  **Required:**

  `Content-Type=[text/plain | application/json]`

- **Data Params**

  Any value is accepted as long as it can be parsed by the specified `Content-Type` header.

- **Sample Call:**

  ```
  curl http://localhost:3000/api/v1/data/com.domain::DATA_TYPE::asdf123` -H 'Content-Type: application/json' -d '{ "testing": true }'
  ```

## **Delete by Key Prefix**

Delete data using a key prefix, e.g. domain, or type.

- **URL**

  `/api/v1/data/:prefix`

- **Method:**

  `DELETE`

- **URL Params**

  **Required:**

  `prefix=[string]`

- **Sample Call:**

  ```
  curl -XDELETE http://localhost:3000/api/v1/data/com.de314`
  ```
