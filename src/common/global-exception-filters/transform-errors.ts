import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

export const translateErrors = (validationErrors: ValidationError[]) => {
  const errors: string[] = [];
  for (const error of validationErrors) {
    if (error.constraints) {
      const constraintMessages = Object.values(error.constraints);
      errors.push(...constraintMessages);
    }

    if (error.children) {
      for (const i of error.children) {
        for (const childrenError of i.children) {
          const constraintMessages = Object.values(childrenError.constraints);
          errors.push(...constraintMessages);
        }
      }
    }
  }
  const [firstMessage, ...restMessage] = errors;
  return new UnprocessableEntityException({
    message: firstMessage,
    errors: restMessage,
  });
};
