// @format
import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.string().required(),
  ingredients: yup
    .array()
    .of(yup.string().matches(/app:ingredients:[a-z0-9]+/i)),
});
