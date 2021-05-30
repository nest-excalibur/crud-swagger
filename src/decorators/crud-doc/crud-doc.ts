import { CrudApiDocConfig } from './interfaces';
import { SwaggerHelper } from './swagger-helpers/swagger.helper';
import { API_METHODS_NAMES_OBJECT } from './constants';
import { SwaggerMakers } from './makers/swagger.makers';

// Implementacion del decorador CrudDoc
// Este decorador sirve para generar la documentacion de la API para los metodos -> Crud

export const makeCrudDoc = (
    options: CrudApiDocConfig,
    target: any,
) => {
    const createOneOptions = options.createOne;
    const updateOneOptions = options.updateOne;
    const findAllOptions = options.findAll;
    const deleteOneOptions = options.deleteOne;
    const findOneByIdOptions = options.findOneById;
    const createManyOptions = options.createMany;
    if (createManyOptions) {
        SwaggerHelper.buildApiBody(createManyOptions, API_METHODS_NAMES_OBJECT.createMany, target);
        SwaggerMakers.setHeadersResponses(createManyOptions, API_METHODS_NAMES_OBJECT.createMany, target);
    }
    if (createOneOptions) {
        SwaggerHelper.buildApiBody(createOneOptions, API_METHODS_NAMES_OBJECT.createOne, target);
        SwaggerMakers.setHeadersResponses(createOneOptions, API_METHODS_NAMES_OBJECT.createOne, target);
    }
    if (updateOneOptions) {
        SwaggerHelper.buildApiBody(updateOneOptions, API_METHODS_NAMES_OBJECT.updateOne, target);
        SwaggerHelper.buidlApiParameters(updateOneOptions, API_METHODS_NAMES_OBJECT.updateOne, target);
        SwaggerMakers.setHeadersResponses(updateOneOptions, API_METHODS_NAMES_OBJECT.updateOne, target);
    }
    if (findAllOptions) {
        if (findAllOptions.apiQuery) {
            SwaggerHelper.buildApiQuery(findAllOptions, API_METHODS_NAMES_OBJECT.findAll, target);
        }
        SwaggerMakers.setHeadersResponses(findAllOptions, API_METHODS_NAMES_OBJECT.findAll, target);
    }
    if (deleteOneOptions) {

        SwaggerHelper.buidlApiParameters(deleteOneOptions, API_METHODS_NAMES_OBJECT.deleteOne, target);
        SwaggerMakers.setHeadersResponses(deleteOneOptions, API_METHODS_NAMES_OBJECT.deleteOne, target);
    }
    if (findOneByIdOptions) {
        SwaggerHelper.buidlApiParameters(findOneByIdOptions, API_METHODS_NAMES_OBJECT.findOneById, target);
        SwaggerMakers.setHeadersResponses(findOneByIdOptions, API_METHODS_NAMES_OBJECT.findOneById, target);
    }
    return target;
}





export function CrudDoc(
    options: CrudApiDocConfig,
): ClassDecorator {
    return (target: any) => {
        return makeCrudDoc(options, target);
    };
}
