

<img src="https://img.shields.io/npm/dt/@nest-excalibur/common-api"></img>
<img src="https://img.shields.io/npm/v/@nest-excalibur/common-api"></img>
<img src="https://img.shields.io/npm/l/@nest-excalibur/common-api"></img>
<img src="https://img.shields.io/github/stars/nest-excalibur/common-api"></img>
<img src="https://img.shields.io/github/issues/nest-excalibur/common-api"></img>

# common-api

@nest-excalibur/common-api is a set of functions and classes for `Nest.js` .


## Index

1. [Installation](#install)

2. [REST-API](#rest-api)

3. [Decorators](#decorators)

   3.1 [Guards](#guards)

   3.2 [Interceptors](#interceptors)

   3.3 [Headers](#headers)

   3.4 [CrudApi](#crudapi)




## Install:

```shell script
npm i @nest-excalibur/common-api
``` 

## REST API

One of the strongest features of this library is to implement an API-REST quickly. To do this, you must
first consider implementing the following classes:

* Entity
* Service
* DTO
* Controller




#### Create entity class with extends from `AbstractEntity`

If you want the entity has an auntoincremental id column, createdAt, updatedAt columns.

```typescript
import {AbstractEntity} from '@nest-excalibur/common-api/lib';

@Entity('product')
export class ProductEntity extends AbstractEntity {
  
}
```



#### Create a service class which extends from `AbstractService`

```typescript
import {AbstractService} from '@nest-excalibur/common-api/lib';

@Injectable()
export class ProductService extends AbstractService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
  ) {
    super(_productRepository);
  }
}
```


#### Create a DTO class for update and create:

It is optional to extend from `BaseDTO` , This class allows to validate that the fields: `id` , `createdAt` and `updatedAt` should not be empty

```typescript
import {BaseDTO} from '@nest-excalibur/common-api/lib';

export class ProductCreateDto extends BaseDTO{
  @IsAlpha()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
```

### Puting it all together


```typescript
import {CrudController, CrudOptions} from '@nest-excalibur/common-api/lib';

const options: CrudOptions = {
    dtoConfig: {
        createDtoType: ProductCreateDto,
        updateDtoType: ProductUpdateDto,
    },
}


@Controller('product')
export class ProductController extends CrudController<ProductEntity>(options) {
    constructor(private readonly _productService: ProductService) {
        super(
            _productService,
        );
    }
}
```


### API-REST ENPOINTS:

For  a `controllerPrefix` given on the `Controller` decorator. The following
set of routes will be generated.

| HTTP METHOD | PATH  | Controller and Service method |
| --------- | ------ | ----------------------------- |
|  POST  | `<controllerPrefix>` | createOne              |
|  POST  | `<controllerPrefix>` /create-many  | createMany              |
|  PUT | `/<controllerPrefix>/<id:number>` |  updateOne |
|  GET | `/<controllerPrefix>/<id:number>` | findOne  | 
| GET  | `/<controllerPrefix>?query=<find-query>` | findAll |
| DELETE | `/<controllerPrefix>/<id:number>` | deleteOne |


###  Find  Query

#### SQL Data Bases

For SQL DB you can make a search criteria, that complies
with the following scheme:

``` text
   {
    "where": {
         // Entity attributes and relations
    },
    "skip": 0, // Pagination
    "take": 10 // Pagination
  }  
```

For example:
The `product entity` has a relation `many to one` with `category entity` , so lets make
the following search:
Products that have a price `greater than or equal` to `10` or `less than` 2 and that the name of the product category
can be `snacks` , `drinks` or that the same name of the category includes `"sna"` .

`Find-Query` :

``` json
   {
    "where": {
        "price": [
          {
            "$gte": 10.00
          },
          {
            "$lt": 2.00 
          } 
        ],
        "category": {
          "$join": "inner",
          "name": [
            {
               "$like": "%25sna%25"
            },
            {
                "$in": ["snacks", "drinks"]
            }            
          ] 
        }
    }
  }  
```

> On `like` operator with the wildcar `%` , you should use `%25` instead of `%`
> cause some problems with browsers and `http clients`
> as `Postman` .

#### Examples

> Browser or client side

```text
http://localhost:3000/product?query={"where":{"name":{"$like":"%25choco%25"},"category":{}}}
```

Results:

```json
{
    "nextQuery": null,
    "data": [
        {
            "price": "18",
            "id": 22,
            "createdAt": "2020-07-23T23:51:56.898Z",
            "updatedAt": "2020-07-23T23:51:56.898Z",
            "name": "chocobreak",
            "description": "Voluptate irure eu dolor sit et id nisi dolore ex aliquip.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        },
        {
            "price": "16",
            "id": 21,
            "createdAt": "2020-07-23T23:51:56.897Z",
            "updatedAt": "2020-07-23T23:51:56.897Z",
            "name": "great chocolate",
            "description": "Commodo sit duis id consectetur minim nisi nostrud ex sit ad aute cillum eiusmod.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        },
        {
            "price": "2",
            "id": 17,
            "createdAt": "2020-07-23T23:51:56.891Z",
            "updatedAt": "2020-07-23T23:51:56.891Z",
            "name": "happy chocolate",
            "description": "Duis magna exercitation aute pariatur voluptate velit magna ut.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        }
    ],
    "total": 3
}
```

> If you are working on backend side you could use the widlcard `%` without problems.
> Also you could use any [wildcard](https://www.w3schools.com/sql/sql_wildcards.asp) on `like` operator according your
> data base.

```typescript
const query = {
    where: {
        id: { $like: '%chocho%' },
        category: {
            name: 'candy',
        },
        supermaket: { // inner join with `supermarket` entity.
            id: 25,
            address: '',
            city: {  // inner join with `city` entity.
                name: {$like: 'c[^u]'},
                state: {  // inner join with `state` entity.
                   id: {$in: [4, 5, 6, 7]},
                },   
            },
        },         
    },
    skip: 0,
    take: 30,  // Pagination  
}
const searchResponse: [ProductEntity[], number] = await this.productService.findAll(query);
const filterProducts = searchResponse[0];
const totalFecthed = searchResponse[1]; // All filtered records in the Data Base
```

> For scape characters on `like` operator: use `\\`

``` text
percentCode: {"$like": "%25\\%25%25"}} // Client side
percentCode: {"$like": "%\\%%"}} // Backend side
```

### Or operator

You can make a query with `OR` operator using the keyword `"$or"` as `"true"`
For example: Get products with a price of `7` or name includes `"choco"`

```json
   {
    "where": {
        "price": {"$eq": 7, "$or": true},
        "name": {"$like": "%25choco%25", "$or":  true}
    }
  }  
```

##### Putting it all together


`GET /product?query={"where":{.......}}`

##### Find Query Object

###### Operators

| Operator |   keyword  |  Example |
|  ------  |  -----  | --- |
| Like  | `$like` | "$like": "%sns%"    |
| iLike  | `$ilike` (PostgreSQL) | "$ilike": "%sns%"    |
| `> ` | `$gt` | "$gt": 20 |
| `>=` | `$gte` |  "$gte": 20 |
| `<` | `$lt` |  "$lt": 20 |
| `<=` | `$lte` |  "$lte": 20 |
| `=` | `$eq` |  "$eq": 20 |
| `!=` | `$ne` |   "$ne": 20 |
| Between | `$btw` | "$btw": [A, B]  |
| In | `$in` | "$in": [A, B, ...] |
| Not In | `$nin` | "$nin": [A, B, ...]"
| Not Between | `$nbtw` |  "$nbtw": [A, B, ...]"

> if your are using MongoDB, you must use the query operators for mongo, check the [documentation](https://docs.mongodb.com/manual/reference/operator/query/)

##### Join Relations

The join relations could be many levels as you want, you need to write the
`ManyToOne` , `OneToMany` , `OneToOne` , relationship name in your `Find Query Object` like the previous example.


If the join is of the `inner` type it is not necessary to put the keyword `"$join": "inner"` , only if you want to use a join of the type "left" ( `" $join ":" left"` )

##### Pagination

The pagination by default is `skip: 0` and `take: 10` .

##### Order By

The order by criteria by default with respect the entity `id` is `DESC` :


```text
   {
    "where": {
         
    },
    "orderBy": {
        // Order by criteria
    }
  }  
```


##### Select columns

In order to get records with an specific set of columns, you could make use of `$sel` operator:

For example: Get products with a bigger than `7` and only retrieves the name of the filtered products.

```json
   {
    "where": {
        "$sel": ["name"],
        "price": {"$gt": 7}
    }
  }  
```

Also, you could use the `$sel` operator on queries with joins.


> All columns that are retrieved will always include the id column


For example: the following query retrieves products with name and its supermarket with only name and address.

```typescript
const query = {
    where: {
        $sel: ["name"],
        category: {
            name: 'candy',
        },
        supermaket: { // Select address and name
            $sel: ["name", "address"], 
        },         
    },
    skip: 0,
    take: 30, 
}

```

#### Working with transactions

The `AbstractService` class has the following methods in order to perform transactions:

* findAllWithTransaction

* findOneWithTransaction

* createOneWithTransaction

* createManyWithTransaction

* updateOneWithTransaction

* deleteOneWithTransaction

* deleteManyByIdsWithTransaction

Example:

```typescript
import {EntityManager, getManager, Repository} from 'typeorm';
import {
    AbstractService, 
    TransactionResponse, 
    FindFullQuerym
} from '@nest-excalibur/common-api/lib'; 
import {getManager} from 'typeorm';

@Injectable()
export class ProductService extends AbstractService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
  ) {
    super(_productRepository);
  }
    
  async deleteByCategory(categoryId: number): Promise<ProductEntity[]> {
          return await getManager()
              .transaction(
                  'SERIALIZABLE',
                  async (entityManager: EntityManager) => {

                      // Define the find condition  
                      const finQuery: FindFullQuery = {
                          where: {
                              category: {
                                  id: categoryId,
                              }
                          }
                      };
                      const findResponse = await this.findAllWithTransaction(entityManager, finQuery);
                     
                      // Update the entityManager for the next operation
                      entityManager = findResponse.entityManager;
                      const [productsToDelete, totalFetched] = findResponse.response;
  
                      // Get only the ids
                      const ids = productsToDelete.map(product => product.id);
                      
                      // Get only the deleted rows  
                      const {response} = await this
                          .deleteManyByIdsWithTransaction(entityManager, ids);
  
                      return response;
                  }
              );
      }
    
}
```

### MongoDb (TypeOrm)

#### Entity (Optional)

If you want the entity has an ObjectId, updatedAt columns, you need to extends from `AbstractMongoEntity`

```typescript
import {AbstractMongoEntity} from '@nest-excalibur/common-api/lib';

@Entity('post')
export class PostEntity extends AbstractMongoEntity{
    
}
```



#### DTO

It is optional to extend from `BaseMongoDTO` . This class allows to validate that the fields: `id` , `createdAt` and `updatedAt` should not be empty

``` typescript
import {BaseMongoDTO} from '@nest-excalibur/common-api/lib';

export class Post extends BaseMongoDTO{

}
```

#### Service

The service class must extends from `AbstractMongoService`

```typescript
import {AbstractMongoService} from '@nest-excalibur/common-api/lib';

@Injectable()
export class PostService extends AbstractMongoService<PostEntity> {
  constructor(
    @InjectRepository(PostEntity, 'mongo_conn')
    private postRepository: MongoRepository<PostEntity>,
  ) {
    super(
      localizacionRepository,
      { // MongoIndexConfigInterface
        fieldOrSpec: { localization: '2dsphere' },
        options: {
          min: -180,
          max: 180,
        },
      },
    );
  }
}
```

#### Controller

```typescript
import {CrudController, CrudOptions} from '@nest-excalibur/common-api/lib';

const options: CrudOptions = {
    useMongo: true,
    dtoConfig: {
        createDtoType: PostCreateDto,
        updateDtoType: PostCreateDto,
    },
}

@Controller('post')
export class PostController extends CrudController<PostEntity>(options) {
    constructor(private readonly _postService: PostService) {
        super(
            _postService,
        );
    }
}
```

## Decorators



### GUARDS
For Guards for every `Crud Method` you need to make use of `CrudGuards` or `CrudApi` decorator.

Example:
```typescript
import {CrudGuards} from '@nest-excalibur/common-api/lib';


@CrudGuards(
     {
         findAll: [ProductoFindAllGuard,]
         updateOne: [ProductUpdaeOneGuard],
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController extends CrudController<PostEntity>(options) {
    
}
```

### Interceptors

For Interceptors for every `Crud Method` you need to make use of `CrudInterceptors` or `CrudApi` decorator.

Example:
```typescript
import {CrudInterceptors} from '@nest-excalibur/common-api/lib';


@CrudInterceptors(
     {
         findAll: [ProductFindallInterceptor,]
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController extends CrudController<PostEntity>(options) {
    
}
```

### Headers

For Headers on `Crud Methods` you need to make use of `CrudHeaders` or `CrudApi` decorator.

Example:
```typescript
import {CrudHeaders} from '@nest-excalibur/common-api/lib';

@CrudHeaders(
     {
         findAll: {
              name: 'Custom Header',
              value: ''
         },
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController extends CrudController<PostEntity>(options) {
    
}
```

### CrudApi
The `CrudApi` is a general decorator to put the configuration of swagger, guards, interceptors and headers for every
Crud Method.

Example:


```typescript
import {CrudApi} from '@nest-excalibur/common-api/lib';

@CrudApi(
    {
        findAll: {
            guards: [ProductFindAllGuard,],
            interceptors: [ProductFindallInterceptor],
            header: {
                name: 'Custom Header',
                value: ''
            },
        },
        createOne: {
            documentation: PRODUCT_SWAGGER_CONFIG.createOne,
        },
        updateOne: {
            documentation: PRODUCT_SWAGGER_CONFIG.updateOne,
        }
    },
)
@Controller('product')
export class ProductController extends CrudController<PostEntity>(options) {
    
}
```
