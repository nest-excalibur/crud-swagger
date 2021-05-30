# Crud Swagger

For Document the API-REST paths on swagger, you need to make use of `CrudDoc` decorator or `CrudApi` decorator.


## Installation

```shell
npm i @nest-excalibur/common-api --save-dev
npm i @nest-excalibur/crud-swagger
```


Example:
For every CRUD method you should make a configuration. The follwing example shows a configuration object:

In another file (if you want), make the configuration as a constant.

```typescript
import {CrudApiConfig} from '@nest-excalibur/crud-swagger/lib';


export const PRODUCT_SWAGGER_CONFIG: CrudApiConfig = {
    createOne: { // MethodName
        apiBody: {
            type: ProductCrearDto
        },
        headers: [
            {
                name: 'X-MyHeader',
                description: 'Custom header',
            },
        ],
        responses: [
            {
                type: ProductCreateDto,
                status: HttpStatus.CREATED,
                description: 'Created Product'
            },
            {
                status: HttpStatus.BAD_REQUEST,
                description: 'Data not valid',
            }
        ]
    },
    updateOne: {
        apiBody: {
            type: ProductUpdateDto,
        },
        responses: [
            {
                type: ProductCreateDto,
                status: HttpStatus.OK,
                description: 'Updated product'
            }
        ]
    },
    findAll: {
        headers: [
            {
                name: 'X-MyHeader',
                description: 'Custom header',
            },
        ],
        responses: [
            {
                type: ProductFindResponse,
                status: HttpStatus.OK,
                description: 'Fetched Products'
            }
        ]
    }
}
```

```typescript
import {CrudDoc} from '@nest-excalibur/crud-swagger/lib';


@CrudDoc(
     PRODUCT_SWAGGER_CONFIG,
)
@Controller('product')
export class ProductController extends CrudController<PostEntity>(options){
    
}
```

