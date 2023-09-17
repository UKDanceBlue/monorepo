import { ApiError, Constructor, GraphQLResource } from "@ukdanceblue/common";
import { InvariantError } from "../lib/CustomErrors.js";
import { IntermediateClass } from "../lib/modelTypes.js";
import { AttributeNames, Model, ModelStatic } from "@sequelize/core";

export async function modelServiceGetByUuidHelper<M extends Model, I extends IntermediateClass<GraphQLResource.Resource, I>>(resourceName: string, uuidName: AttributeNames<M>, uuid: string, MClass: ModelStatic<M>, IClass: new (model: M) => I): Promise<ReturnType<I["toResource"]> | null> {
  const result = await MClass.findOne({
    where: {
      [uuidName]: uuid,
    },
  });
  if (!result) {
    return null;
  }
  const intermediate = new IClass(result);
  return intermediate.toResource() as ReturnType<I["toResource"]>;
}

export async function modelServiceSetHelper<M extends Model, I extends IntermediateClass<GraphQLResource.Resource, I>>(resourceName: string, uuid: string, affectedRows: number, results: M[], IClass: new (model: M) => I): Promise<ReturnType<I["toResource"]> | ApiError<boolean>> {
  if (affectedRows === 0) {
    return {
      errorMessage: `${resourceName} does not exist`,
      errorDetails: `${resourceName} with uuid ${uuid} does not exist`,
    };
  } else if (affectedRows > 1) {
    throw new InvariantError(`More than one ${resourceName} with uuid ${uuid} exists`);
  } else if (results[0]) {
    return new IClass(results[0]).toResource() as ReturnType<I["toResource"]>;
  } else {
    throw new InvariantError(`No value returned from update`);
  }
}

export async function modelServiceDeleteHelper<M extends Model>(resourceName: string, uuidName: AttributeNames<M>, uuid: string, MClass: ModelStatic<M>): Promise<ApiError<boolean> | boolean> {
  const affectedRows = await MClass.destroy({
    where: {
      [uuidName]: uuid,
    },
  });
  if (affectedRows === 0) {
    return {
      errorMessage: `${resourceName} does not exist`,
      errorDetails: `${resourceName} with uuid ${uuid} does not exist`,
    };
  } else if (affectedRows > 1) {
    throw new InvariantError(`More than one ${resourceName} with uuid ${uuid} exists`);
  } else {
    return true;
  }
}
